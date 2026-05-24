import { BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudentGrades, type CanvasCourse, type CanvasCourseGrades } from "@/hooks/useCanvas";

interface Props {
  courses: CanvasCourse[];
  isLoading: boolean;
}

const COURSE_COLORS = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-emerald-500 to-emerald-700",
  "from-rose-500 to-rose-700",
  "from-amber-500 to-amber-700",
  "from-teal-500 to-teal-700",
  "from-indigo-500 to-indigo-700",
  "from-pink-500 to-pink-700",
];

function getCourseColor(index: number) {
  return COURSE_COLORS[index % COURSE_COLORS.length];
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function getTeacherName(course: CanvasCourse) {
  return course.teachers?.[0]?.display_name ?? null;
}

function gradeColor(grade?: string | null, score?: number | null) {
  const ref = grade ?? "";
  if (ref.startsWith("A")) return "text-emerald-500";
  if (ref.startsWith("B")) return "text-blue-500";
  if (ref.startsWith("C")) return "text-amber-500";
  if (ref.startsWith("D")) return "text-orange-500";
  if (ref.startsWith("F")) return "text-red-500";
  if (score != null) {
    if (score >= 90) return "text-emerald-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-amber-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  }
  return "text-muted-foreground";
}

function GradeBadge({ grades }: { grades: CanvasCourseGrades | null }) {
  if (!grades) return null;
  const label =
    grades.current_grade ??
    (grades.current_score != null ? `${Math.round(grades.current_score)}%` : null);
  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold tabular-nums ${gradeColor(
        grades.current_grade,
        grades.current_score ?? undefined
      )} bg-current/10`}
    >
      {label}
    </span>
  );
}

export default function CoursesSection({ courses, isLoading }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Your Courses
            {courses.length > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground font-normal">({courses.length})</span>
            )}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
                <Skeleton className="h-20 w-full" />
                <div className="p-3 space-y-1.5">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-7 w-full rounded-md mt-2" />
                </div>
              </div>
            ))
          : courses.slice(0, 8).map((course, i) => {
              const teacher = getTeacherName(course);
              const gradient = getCourseColor(i);
              const grades = getStudentGrades(course);

              return (
                <div
                  key={course.id}
                  className="bg-card rounded-lg border border-border shadow-card overflow-hidden hover:shadow-hover transition-all group"
                >
                  {/* Course banner */}
                  {course.image_download_url ? (
                    <div className="relative">
                      <img
                        src={course.image_download_url}
                        alt={course.name}
                        className="h-20 w-full object-cover"
                      />
                      {grades && (
                        <div className="absolute top-2 right-2">
                          <GradeBadge grades={grades} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`h-20 w-full bg-gradient-to-br ${gradient} flex items-center justify-between px-3`}>
                      <span className="text-2xl font-bold text-white/90 select-none">
                        {getInitials(course.name)}
                      </span>
                      {grades && (
                        <span className="text-white font-bold text-lg leading-none bg-white/20 px-1.5 py-0.5 rounded">
                          {grades.current_grade ??
                            (grades.current_score != null
                              ? `${Math.round(grades.current_score)}%`
                              : null)}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-1.5 mb-0.5">
                      <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors flex-1">
                        {course.name}
                      </p>
                      {course.image_download_url && <GradeBadge grades={grades} />}
                    </div>
                    {teacher && (
                      <p className="text-xs text-muted-foreground truncate">{teacher}</p>
                    )}
                    {grades?.current_score != null && (
                      <div className="mt-1.5">
                        <div className="flex items-center justify-between text-xs mb-0.5">
                          <span className="text-muted-foreground">Progress</span>
                          <span className={`font-medium ${gradeColor(grades.current_grade, grades.current_score)}`}>
                            {Math.round(grades.current_score)}%
                          </span>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              grades.current_score >= 90
                                ? "bg-emerald-500"
                                : grades.current_score >= 80
                                ? "bg-blue-500"
                                : grades.current_score >= 70
                                ? "bg-amber-500"
                                : grades.current_score >= 60
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(100, grades.current_score)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full mt-2.5 h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() =>
                        window.open(`https://stridek12academy.com/courses/${course.id}`, "_blank")
                      }
                    >
                      Open Course
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}

        {!isLoading && courses.length === 0 && (
          <div className="col-span-full bg-card rounded-lg border border-border shadow-card p-8 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
            <p className="text-sm text-muted-foreground">No active courses found</p>
          </div>
        )}
      </div>
    </div>
  );
}
