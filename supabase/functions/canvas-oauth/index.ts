import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CANVAS_DOMAIN = Deno.env.get("CANVAS_DOMAIN") || "stridek12academy.com";
const CANVAS_CLIENT_ID = Deno.env.get("CANVAS_CLIENT_ID") || "10000000000031";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, redirect_uri } = await req.json();

    // Client secret must stay as a secret — never hardcoded
    const clientSecret = Deno.env.get("CANVAS_CLIENT_SECRET");
    if (!clientSecret) {
      return new Response(
        JSON.stringify({ error: "CANVAS_CLIENT_SECRET is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenRes = await fetch(`https://${CANVAS_DOMAIN}/login/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: CANVAS_CLIENT_ID,
        client_secret: clientSecret,
        redirect_uri,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return new Response(
        JSON.stringify({ error: `Canvas token exchange failed: ${err}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenData = await tokenRes.json();
    const { access_token, refresh_token, expires_in, user } = tokenData;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const expiresAt = expires_in
      ? new Date(Date.now() + expires_in * 1000).toISOString()
      : null;

    const { data: session, error } = await supabase
      .from("canvas_sessions")
      .upsert(
        {
          canvas_user_id: String(user?.id ?? "unknown"),
          canvas_user_name: user?.display_name ?? user?.name ?? null,
          canvas_user_email: user?.primary_email ?? null,
          access_token,
          refresh_token: refresh_token ?? null,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "canvas_user_id" }
      )
      .select("id")
      .single();

    if (error) {
      console.error("DB upsert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to store session" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ session_id: session.id, user }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
