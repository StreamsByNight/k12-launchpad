const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

// These are non-sensitive OAuth client values (visible in every redirect URL anyway)
const CANVAS_DOMAIN = Deno.env.get("CANVAS_DOMAIN") || "stridek12academy.com";
const CANVAS_CLIENT_ID = Deno.env.get("CANVAS_CLIENT_ID") || "10000000000031";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const redirectUri = url.searchParams.get("redirect_uri") || "";

  const params = new URLSearchParams({
    client_id: CANVAS_CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: [
      "url:GET|/api/v1/users/:user_id",
      "url:GET|/api/v1/courses",
      "url:GET|/api/v1/users/:user_id/upcoming_events",
      "url:GET|/api/v1/users/:user_id/todo",
      "url:GET|/api/v1/announcements",
    ].join(" "),
  });

  const authUrl = `https://${CANVAS_DOMAIN}/login/oauth2/auth?${params.toString()}`;

  return new Response(
    JSON.stringify({ configured: true, auth_url: authUrl, canvas_domain: CANVAS_DOMAIN }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
