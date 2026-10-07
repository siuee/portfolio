/**
 * Single source of truth for every piece of text on the site.
 * All content is taken from the resume (public/resume.pdf, typeset from
 * Koirala_Sudip_resume.docx), including its embedded hyperlinks.
 */

export type NavItem = { id: string; label: string };

export type Skill = {
  id: string;
  symbol: string;
  name: string;
  /** shorter label for the tile when the full name is long */
  short?: string;
  family: Family;
  /** the resume heading this skill appears under (Skills section) */
  listedUnder?: string;
  logo: string;
};

export type Family = "Languages" | "Web" | "Data" | "Security" | "AI & Automation" | "Infrastructure";

export type SkillGroup = { family: Family; skills: Skill[] };

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  /** skill ids, verbatim from the resume "Tech:" line */
  tech: string[];
  github?: string;
  live?: string;
};

export type Experience = {
  id: string;
  kind: "work";
  start: string;
  end: string;
  year: string;
  title: string;
  place: string;
  location: string;
  detail: string;
  highlights: string[];
  tech: string[];
};

export type Education = {
  id: string;
  kind: "education";
  year: string;
  title: string;
  place: string;
  location: string;
  detail: string;
};

export type Certification = { title: string; issuer: string; href?: string };
export type Achievement = { label: string; value: number; suffix?: string; caption: string; detail: string; logo: string };

export const PROFILE = {
  name: "Sudip Koirala",
  firstName: "Sudip",
  initials: "SK",
  role: "Full Stack Engineer",
  roles: ["Full Stack Engineer", "AI Developer", "Security Developer"],
  email: "sudipkoiralak20@gmail.com",
  phone: "(207) 561-0358",
  phoneHref: "tel:+12075610358",
  location: "Irving, TX",
  resumeSummary:
    "Cybersecurity-trained full-stack software engineer with hands-on experience building secure, scalable systems end-to-end from architecture through deployment. Proven ability to work independently: implementing AES/RSA encryption systems, building file encryption tools, developing autonomous AI agents with OpenClaw, and shipping full-stack applications with Node.js, Next.js, SQL Server, MySQL, and Redis. Strong foundation in networking, cryptography, and secure system design, currently applied to AI infrastructure, training data quality, and agentic systems. Seeking to bring this combination of security depth and full-stack engineering to a high-scale product team.",
  /** second line for About, from the freelance role */
  aboutLine:
    "Independently designed, built, and shipped software projects end-to-end - from architecture through deployment spanning full-stack web applications, security tooling, and AI systems.",
  /** paraphrase of the summary's own wording, not a new claim */
  quote: "Security depth and full-stack engineering, built end-to-end — from architecture through deployment.",
  /** profile root of the repository links in the resume */
  github: "https://github.com/siuee",
  linkedin: "https://linkedin.com/in/sudip-k-941454123",
  linkedinLabel: "linkedin.com/in/sudip-k-941454123",
  resume: "/resume.pdf",
  graduation: "2026",
  since: "2018",
  dept: "Cybersecurity",
} as const;

export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const S = (
  id: string,
  symbol: string,
  name: string,
  family: Family,
  logo: string,
  extra: Partial<Pick<Skill, "short" | "listedUnder">> = {},
): Skill => ({ id, symbol, name, family, logo, ...extra });

const LANG_DEV = "Languages & Development";
const SEC = "Security";
const AI = "AI & Automation";
const INFRA = "Infrastructure & Tools";

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    skills: [
      S("python", "Py", "Python", "Languages", "python", { listedUnder: LANG_DEV }),
      S("sql", "Sq", "SQL", "Languages", "sql", { listedUnder: LANG_DEV }),
      S("javascript", "Js", "JavaScript", "Languages", "javascript"),
      S("java", "Ja", "Java", "Languages", "java"),
      S("php", "Ph", "PHP", "Languages", "php"),
      S("html", "Ht", "HTML", "Languages", "html5"),
    ],
  },
  {
    family: "Web",
    skills: [
      S("nodejs", "No", "Node.js", "Web", "nodejs", { listedUnder: LANG_DEV }),
      S("nextjs", "Nx", "Next.js", "Web", "nextjs"),
      S("rest", "Ra", "REST APIs", "Web", "rest", { listedUnder: LANG_DEV }),
      S("fullstack", "Fs", "Full-Stack Development", "Web", "fullstack", { short: "Full-Stack", listedUnder: LANG_DEV }),
      S("jwt", "Jw", "JWT", "Web", "jwt"),
      S("vercel", "Vc", "Vercel", "Web", "vercel"),
    ],
  },
  {
    family: "Data",
    skills: [
      S("mysql", "My", "MySQL", "Data", "mysql"),
      S("sqlserver", "Ss", "SQL Server", "Data", "sqlserver"),
      S("redis", "Rd", "Redis", "Data", "redis", { listedUnder: INFRA }),
      S("firebase", "Fb", "Firebase", "Data", "firebase"),
    ],
  },
  {
    family: "Security",
    skills: [
      S("cybersecurity", "Cy", "Cybersecurity", "Security", "cybersecurity", { listedUnder: SEC }),
      S("cryptography", "Cr", "Cryptography", "Security", "cryptography", { listedUnder: SEC }),
      S("aes", "Ae", "AES", "Security", "aes", { listedUnder: SEC }),
      S("rsa", "Rs", "RSA", "Security", "rsa"),
      S("pycryptodome", "Pc", "PyCryptodome", "Security", "pycryptodome"),
      S("pentest", "Pt", "Penetration Testing", "Security", "pentest", { short: "Pen Testing", listedUnder: SEC }),
      S("networking", "Nw", "Networking (TCP/IP, DNS, firewalls, VPNs)", "Security", "networking", { short: "Networking" }),
    ],
  },
  {
    family: "AI & Automation",
    skills: [
      S("agentic", "Ag", "Agentic AI Development", "AI & Automation", "agentic", { short: "Agentic AI", listedUnder: AI }),
      S("prompt", "Pe", "Prompt Engineering", "AI & Automation", "prompt", { short: "Prompting", listedUnder: AI }),
      S("llm", "Ll", "Large Language Models (LLM)", "AI & Automation", "llm", { short: "LLMs", listedUnder: AI }),
      S("openclaw", "Oc", "OpenClaw", "AI & Automation", "openclaw", { listedUnder: AI }),
    ],
  },
  {
    family: "Infrastructure",
    skills: [
      S("linux", "Lx", "Linux", "Infrastructure", "linux", { listedUnder: INFRA }),
      S("redhat", "Rh", "Red Hat Linux", "Infrastructure", "redhat", { short: "Red Hat", listedUnder: INFRA }),
      S("git", "Gt", "Git", "Infrastructure", "git", { listedUnder: LANG_DEV }),
      S("iac", "Ic", "Infrastructure as Code (IaC)", "Infrastructure", "iac", { short: "IaC", listedUnder: INFRA }),
      S("remote", "Rc", "Remote Collaboration", "Infrastructure", "remote", { short: "Remote Collab", listedUnder: INFRA }),
    ],
  },
];

export const SKILLS: Skill[] = SKILL_GROUPS.flatMap((g) => g.skills);
export const SKILL_BY_ID: Record<string, Skill> = Object.fromEntries(SKILLS.map((s) => [s.id, s]));

export const PROJECTS: Project[] = [
  {
    id: "fifa",
    index: "01",
    title: "FIFA Tournament Manager",
    kicker: "Full Stack Web Application",
    description:
      "Built a full-featured tournament management platform for FIFA players. Users create player cards with stats, organize 1v1 and 2v2 tournaments with auto-generated fixtures, and view broadcast-style match previews. Includes a live betting system with form-adjusted odds, automatic bet settlement, Ballon d'Or rankings, and per-player stat tracking.",
    features: [
      "Player cards with stats",
      "1v1 and 2v2 tournaments",
      "Auto-generated fixtures",
      "Broadcast-style match previews",
      "Live betting, form-adjusted odds",
      "Automatic bet settlement",
      "Ballon d'Or rankings",
      "Per-player stat tracking",
    ],
    tech: ["nodejs", "firebase"],
    github: "https://github.com/siuee/Tournament",
    live: "https://tournament-orcin.vercel.app",
  },
  {
    id: "encryption",
    index: "02",
    title: "File Encryption Tool",
    kicker: "Python-based file encryption",
    description:
      "A Python-based file encryption application using AES-256 and RSA key exchange. Supports secure key generation, file encryption/decryption, and integrity verification via SHA-256 hashing.",
    features: ["AES-256 encryption", "RSA key exchange", "Secure key generation", "File encryption/decryption", "SHA-256 integrity verification"],
    tech: ["python", "pycryptodome", "rsa", "aes"],
  },
  {
    id: "secure-auth",
    index: "03",
    title: "Full Stack Web App with Secure Auth",
    kicker: "Full stack application",
    description:
      "Built a full stack application with a Next.js frontend and Node.js backend, featuring JWT authentication, Redis session management, and MySQL data persistence, plus rate limiting and input sanitization.",
    features: ["Next.js frontend", "Node.js backend", "JWT authentication", "Redis session management", "MySQL data persistence", "Rate limiting & input sanitization"],
    tech: ["nextjs", "nodejs", "mysql", "redis", "jwt"],
  },
  {
    id: "nepal-imports",
    index: "04",
    title: "Nepal Import Analytics",
    kicker: "Data Visualization Platform",
    description:
      "Built a data-driven platform analyzing import expenditure across product categories in Nepal, with actionable agricultural insights (cultivation guidance, recommended growing locations) to reduce import dependency - combining economic data visualization with policy-relevant recommendations.",
    features: ["Import expenditure by category", "Economic data visualization", "Cultivation guidance", "Recommended growing locations", "Policy-relevant recommendations"],
    tech: ["nextjs", "vercel"],
    github: "https://github.com/siuee/nepalImports",
    live: "https://nepal-imports.vercel.app",
  },
  {
    id: "openclaw",
    index: "05",
    title: "OpenClaw AI Agent",
    kicker: "Workflow Automation",
    description:
      "Designed and deployed an AI agent using OpenClaw capable of multi-step task execution, tool use, and autonomous decision-making for workflow automation use cases.",
    features: ["Multi-step task execution", "Tool use", "Autonomous decision-making", "Workflow automation"],
    tech: ["openclaw", "python", "llm"],
  },
];

export const EXPERIENCE: Experience[] = [
  {
    id: "broadway",
    kind: "work",
    start: "Jan 2017",
    end: "Jun 2017",
    year: "2017",
    title: "Back-End Web Developer",
    place: "Broadway Infosys Nepal",
    location: "Kathmandu, Central Development Region, Nepal",
    detail: "Worked as a junior web developer using PHP, Java, MySQL, HTML, and JavaScript.",
    highlights: [
      "Provided ongoing maintenance, bug fixes, and patch sets for existing web and desktop applications.",
      "Gained hands-on experience across all phases of the software development lifecycle, applying strong knowledge of algorithms and data structures.",
    ],
    tech: ["php", "java", "mysql", "html", "javascript"],
  },
  {
    id: "freelance",
    kind: "work",
    start: "2018",
    end: "Present",
    year: "2018",
    title: "Freelance Software Engineer & Security Developer",
    place: "Self-Employed - Independent Projects",
    location: "Remote",
    detail:
      "Independently designed, built, and shipped software projects end-to-end - from architecture through deployment spanning full-stack web applications, security tooling, and AI systems.",
    highlights: [
      "Built file encryption tools using AES-256 and RSA public-key cryptography in Python, ensuring secure data storage and transmission.",
      "Designed and deployed full-stack web applications using Next.js and Node.js with SQL Server and MySQL backends, including authentication and session management.",
      "Implemented Redis caching layers to optimize application performance and reduce database load.",
      "Developed and deployed AI agents using OpenClaw, automating complex workflows and multi-step reasoning tasks.",
      "Applied networking fundamentals (TCP/IP, DNS, firewalls, VPNs) to design secure application architectures.",
      "Built Python-based automation scripts and AI pipelines integrating large language models for data processing tasks.",
      "Conducted security assessments and implemented encryption best practices across web and file-based systems.",
      'Collaborated directly with clients to design, develop, and publish a mobile app named "Clef" on the Google Play Store and a business website for a beauty salon.',
    ],
    tech: ["python", "aes", "rsa", "cryptography", "nextjs", "nodejs", "sqlserver", "mysql", "redis", "openclaw", "llm", "networking", "cybersecurity", "remote"],
  },
];

export const EDUCATION: Education[] = [
  {
    id: "bs-cyber",
    kind: "education",
    year: "2026",
    title: "B.S. in Cybersecurity",
    place: "Texas A&M University-Commerce",
    location: "Commerce, TX",
    detail: "Graduated 2026",
  },
];

/** The resume lists no certifications or achievements; their sections are omitted. */
export const CERTIFICATIONS: Certification[] = [];
export const ACHIEVEMENTS: Achievement[] = [];

/** Where a skill shows up in projects and roles, derived from the lists above. */
export function usesOf(skillId: string): { projects: string[]; roles: string[] } {
  return {
    projects: PROJECTS.filter((p) => p.tech.includes(skillId)).map((p) => p.title),
    roles: EXPERIENCE.filter((e) => e.tech.includes(skillId)).map((e) => `${e.title} · ${e.place.split(" - ")[0]}`),
  };
}
