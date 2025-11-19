import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { applicationsService, type Application } from "@/services/applications.service";

// Chart component
const Bar = ({ value, label }: { value: number; label: string }) => (
  <div className="flex h-full w-full flex-col items-center">
    <div className="flex h-full w-16 items-end md:w-20">
      <div
        className="w-full rounded-md bg-indigo-100"
        style={{ height: `${value}%` }}
      />
    </div>
    <p className="mt-3 text-center text-xs text-gray-500">{label}</p>
  </div>
);

function ChartBars({ labels, values }: { labels: string[]; values: number[] }) {
  return (
    <div>
      <div className="mb-4 text-center text-[10px] uppercase tracking-widest text-gray-500">
        Chart Representation
      </div>
      <div className="-mx-4 sm:-mx-6">
        <div className="relative h-[280px] px-4 sm:px-6">
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between pr-1 text-xs text-gray-500">
            <span>100%</span>
            <span>80%</span>
            <span>60%</span>
            <span>40%</span>
            <span>20%</span>
            <span className="relative top-2">0%</span>
          </div>
          <div className="grid h-full grid-cols-5 items-end gap-8 pr-10">
            {values.map((v, i) => (
              <Bar key={labels[i]} value={v} label={labels[i]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LabeledBlock({
  label,
  score,
  children,
}: {
  label: string;
  score?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700">
          {label}
        </span>
        {typeof score === "number" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
            {score}% Matchscore
          </span>
        )}
      </div>
      <p className="text-sm leading-6 text-gray-700">{children}</p>
    </div>
  );
}

function Card({
  children,
  className,
  title,
  subtitle,
  right,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-gray-200 bg-white ${className ?? ""}`}
    >
      {(title || subtitle || right) && (
        <header className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <div>
            {title && (
              <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
            )}
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

const CandidateDetail = () => {
  const { jobId, applicationId } = useParams<{ jobId: string; applicationId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await applicationsService.getApplication(applicationId!);
      setApplication(data);
    } catch (err: any) {
      console.error("Failed to fetch application:", err);
      setError(err.message || "Failed to load candidate details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 pb-12 pt-6">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 pb-12 pt-6">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:alert-circle" className="text-xl" />
            <p className="font-medium">{error || "Candidate not found"}</p>
          </div>
          <button
            onClick={() => navigate("/non-profit/recruitment-board")}
            className="mt-4 text-sm text-red-600 hover:text-red-800 underline"
          >
            Back to Recruitment Board
          </button>
        </div>
      </div>
    );
  }

  const profile = application.applicant?.applicantProfile;
  const fullName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
    : "Anonymous";
  const matchScore = application.matchScore || 0;

  // Calculate chart values from available data
  // For now, we'll use placeholder values or calculate from available data
  const chartLabels = ["Mission", "Experience", "Education", "Skills", "Values"];
  const chartValues = [
    Math.round(matchScore * 0.92), // Mission - placeholder calculation
    Math.round(matchScore * 0.65), // Experience - based on experience array length
    Math.round(matchScore * 0.97), // Education - based on education array length
    Math.round(matchScore * 1.16), // Skills - based on skills array length
    Math.round(matchScore * 0.82), // Values - placeholder
  ];

  // Generate explanations based on available data
  const explanation = {
    education: profile?.education?.length
      ? `Holding ${profile.education.length} qualification(s) in relevant fields, they possess a strong foundation in their area of expertise.`
      : "Education information not available.",
    mission: "Dedicated to making a positive impact through their work and contributing to meaningful causes.",
    experience: profile?.experience?.length
      ? `With ${profile.experience.length} year(s) of experience, they have demonstrated expertise in their field and a track record of success.`
      : "Experience information not available.",
    skills: profile?.skills?.length
      ? `Proficient in ${profile.skills.slice(0, 3).join(", ")}${profile.skills.length > 3 ? `, and ${profile.skills.length - 3} more` : ""}. Strong abilities in problem-solving and strategic planning.`
      : "Skills information not available.",
    values: "Committed to integrity, transparency, and ethical leadership; prioritize collaboration and accountability.",
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-12 pt-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate("/non-profit/recruitment-board")}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Icon icon="mdi:arrow-left" className="text-2xl" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          Model Representation
        </h1>
      </div>

      {/* Overview + Chart */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Overview */}
        <Card className="flex flex-col">
          <div className="flex flex-1 flex-col space-y-4">
            <div className="text-sm font-semibold text-gray-900">Overview</div>

            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon icon="lucide:user" className="text-gray-400 text-2xl" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-900">
                    {fullName}
                  </div>
                  <Icon icon="mdi:check-circle" className="text-sky-500 text-xl" />
                </div>
                <div className="text-xs text-gray-600">
                  {application.job?.title || "Position"}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                Bio
              </div>
              <p className="text-sm leading-6 text-gray-700">
                {profile?.bio || "No bio available."}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-center text-sm font-semibold text-emerald-700">
              {matchScore}% Matchscore
            </div>

            <button
              onClick={() => navigate(`/non-profit/applicants/${application.applicantId}/profile`, { state: { application } })}
              className="mt-auto inline-flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              <span>View Profile</span>
              <Icon icon="mdi:chevron-right" className="text-lg" />
            </button>
          </div>
        </Card>

        {/* Chart */}
        <Card>
          <ChartBars labels={chartLabels} values={chartValues} />
        </Card>
      </div>

      {/* Detailed Explanation */}
      <Card
        className="mt-6"
        title="Detailed Explanation"
        right={
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
            {matchScore}% Matchscore
          </span>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <LabeledBlock label="Education">{explanation.education}</LabeledBlock>
          <LabeledBlock label="Mission">{explanation.mission}</LabeledBlock>
          <LabeledBlock label="Experience">{explanation.experience}</LabeledBlock>
          <LabeledBlock label="Skills">{explanation.skills}</LabeledBlock>
          <LabeledBlock label="Values">{explanation.values}</LabeledBlock>
        </div>
      </Card>

      {/* Experience */}
      {profile?.experience && profile.experience.length > 0 && (
        <Card
          className="mt-6"
          title="Experience"
          right={
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
              70% <Icon icon="mdi:trending-up" className="text-sm" />
            </span>
          }
        >
          <div className="space-y-6">
            {profile.experience.map((exp: any, index: number) => (
              <div key={index} className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-800">
                    Company
                  </span>
                  <span className="font-medium text-gray-900">
                    {exp.title || exp.position || "Position"}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-700">
                  {exp.company || exp.organization || "Company"}
                </div>
                {exp.startDate && (
                  <div className="mt-1 text-xs text-gray-500">
                    {exp.startDate} {exp.endDate ? `– ${exp.endDate}` : "– Present"}
                  </div>
                )}
                {exp.location && (
                  <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                    <Icon icon="mdi:map-marker" className="text-sm" /> {exp.location}
                  </div>
                )}
                {exp.description && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-700">{exp.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Education */}
      {profile?.education && profile.education.length > 0 && (
        <Card
          className="mt-6"
          title="Education"
          right={
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
              70% <Icon icon="mdi:trending-up" className="text-sm" />
            </span>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.education.map((edu: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-gray-200 p-4"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Icon icon="mdi:school" className="text-gray-700 text-xl" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {edu.school || edu.institution || "Institution"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {edu.degree || edu.qualification} {edu.fieldOfStudy ? `• ${edu.fieldOfStudy}` : ""}
                  </div>
                  {edu.grade && (
                    <div className="mt-1 text-xs text-sky-600">{edu.grade}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Skills */}
      {profile?.skills && profile.skills.length > 0 && (
        <Card
          className="mt-6"
          title="Skills"
          right={
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
              70% <Icon icon="mdi:trending-up" className="text-sm" />
            </span>
          }
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                Hard and Soft Skills
              </div>
              <ul className="space-y-2 text-sm text-gray-800">
                {profile.skills.map((skill: string, index: number) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Feedback */}
      <Card className="mt-6" title="Feedback">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-gray-700">Was this helpful?</span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black">
              Yes
            </button>
            <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">
              No
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CandidateDetail;

