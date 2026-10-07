/**
 * Single source of truth for every piece of text on the site.
 * All content is taken from the resume (public/resume.pdf), including hyperlinks.
 */

export type NavItem = { id: string; label: string };

export type Skill = {
  id: string;
  symbol: string;
  name: string;
  short?: string;
  family: Family;
  listedUnder?: string;
  logo: string;
  /** where I've used it, in my own words; shown before the uses derived from projects/roles/labs */
  usedIn?: string[];
};

export type Family =
  | "Languages"
  | "Web"
  | "Data"
  | "Security"
  | "Security Operations"
  | "AI & Automation"
  | "Infrastructure";

export type SkillGroup = { family: Family; skills: Skill[] };

export type HomelabTech = { id: string; name: string; logo: string };

export type Homelab = {
  id: string;
  index: string;
  title: string;
  highlights: string[];
  tech: HomelabTech[];
};

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
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
    "Cybersecurity-trained full-stack software engineer with hands-on experience building secure, scalable systems end-to-end from architecture through deployment. Proven ability to work independently: implementing AES/RSA encryption systems, building file encryption tools, developing autonomous AI agents with OpenClaw, and shipping full-stack applications with Node.js, Next.js, SQL Server, MySQL, and Redis. Runs a personal security homelab covering SIEM/SOC telemetry (Wazuh, ELK, Splunk), Active Directory attack-and-defend scenarios, and malware analysis with YARA detection engineering. Strong foundation in networking, cryptography, and secure system design, currently applied to AI infrastructure, training data quality, and agentic systems. Seeking to bring this combination of security depth and full-stack engineering to a high-scale product team.",
  aboutLine:
    "Independently designed, built, and shipped software projects end-to-end - from architecture through deployment spanning full-stack web applications, security tooling, and AI systems.",
  quote:
    "SIEM/SOC telemetry, Active Directory attack-and-defend, and YARA detection engineering — alongside full-stack systems built end-to-end.",
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
  { id: "homelab", label: "Homelab" },
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
  extra: Partial<Pick<Skill, "short" | "listedUnder" | "usedIn">> = {},
): Skill => ({ id, symbol, name, family, logo, ...extra });

const LANG_DEV = "Languages & Development";
const SEC = "Security";
const SEC_OPS = "Security Operations & Detection";
const AI = "AI & Automation";
const INFRA = "Infrastructure & Tools";

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    skills: [
      S("python", "Py", "Python", "Languages", "python", { listedUnder: LANG_DEV }),
      S("sql", "Sq", "SQL", "Languages", "sql", {
        listedUnder: LANG_DEV,
        usedIn: ["Websites", "Elasticsearch", "Applications"],
      }),
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
      S("rest", "Ra", "REST APIs", "Web", "rest", { listedUnder: LANG_DEV, usedIn: ["Postman", "Websites"] }),
      S("fullstack", "Fs", "Full-Stack Development", "Web", "fullstack", {
        short: "Full-Stack",
        listedUnder: LANG_DEV,
        usedIn: [
          "FIFA Tournament Manager",
          "Nepal Import Analytics",
          "Full Stack Web App with Secure Auth",
          "Client web apps and a beauty salon business website (freelance)",
        ],
      }),
      S("jwt", "Jw", "JWT", "Web", "jwt"),
      S("vercel", "Vc", "Vercel", "Web", "vercel", {
        usedIn: ["This portfolio website", "FIFA Tournament Manager", "Nepal Import Analytics", "Most of my other websites"],
      }),
    ],
  },
  {
    family: "Data",
    skills: [
      S("mysql", "My", "MySQL", "Data", "mysql"),
      S("sqlserver", "Ss", "SQL Server", "Data", "sqlserver"),
      S("redis", "Rd", "Redis", "Data", "redis", { listedUnder: INFRA, usedIn: ["Nepal Import Analytics"] }),
      S("firebase", "Fb", "Firebase", "Data", "firebase"),
    ],
  },
  {
    family: "Security",
    skills: [
      S("cryptography", "Cr", "Cryptography", "Security", "cryptography", {
        listedUnder: SEC,
        usedIn: ["AES encryption tool", "Digital certificates", "Building encryption and decryption tools"],
      }),
      S("aes", "Ae", "AES", "Security", "aes", { listedUnder: SEC }),
      S("rsa", "Rs", "RSA", "Security", "rsa"),
      S("pycryptodome", "Pc", "PyCryptodome", "Security", "pycryptodome"),
      S("pentest", "Pt", "Penetration Testing", "Security", "pentest", {
        short: "Pen Testing",
        listedUnder: SEC,
        usedIn: ["Home lab", "Testing my own websites"],
      }),
      S("ad-security", "Ad", "Active Directory Security", "Security", "activedirectory", {
        short: "AD Security",
        listedUnder: SEC,
        usedIn: ["Home lab"],
      }),
      S("networking", "Nw", "Networking (TCP/IP, DNS, firewalls, VPNs)", "Security", "networking", {
        short: "Networking",
        usedIn: ["Home lab", "College lab"],
      }),
    ],
  },
  {
    family: "Security Operations",
    skills: [
      S("siem", "Si", "SIEM (Wazuh, Splunk, ELK Stack)", "Security Operations", "siem", {
        short: "SIEM",
        listedUnder: SEC_OPS,
        usedIn: ["Home lab", "College projects", "College lab"],
      }),
      S("soc-triage", "So", "SOC Monitoring & Alert Triage", "Security Operations", "soc", {
        short: "SOC Triage",
        listedUnder: SEC_OPS,
        usedIn: ["Home lab", "College projects", "College lab"],
      }),
      S("log-analysis", "Lo", "Log Analysis", "Security Operations", "logs", {
        listedUnder: SEC_OPS,
        usedIn: ["Network analysis", "Malware analysis", "System analysis"],
      }),
      S("mitre", "Mi", "MITRE ATT&CK", "Security Operations", "mitre", { listedUnder: SEC_OPS }),
      S("malware-analysis", "Ma", "Malware Analysis", "Security Operations", "malware", {
        short: "Malware",
        listedUnder: SEC_OPS,
        usedIn: ["College projects", "Independent projects", "Virus samples from GitHub, including HuskyHacks samples"],
      }),
      S("yara", "Ya", "YARA", "Security Operations", "yara", { listedUnder: SEC_OPS }),
    ],
  },
  {
    family: "AI & Automation",
    skills: [
      S("agentic", "Ag", "Agentic AI Development", "AI & Automation", "agentic", {
        short: "Agentic AI",
        listedUnder: AI,
        usedIn: ["Self-help projects", "Built a log analyzer", "Built a self-hosted, persistent coding assistant (Hermes Agent)"],
      }),
      S("prompt", "Pe", "Prompt Engineering", "AI & Automation", "prompt", {
        short: "Prompting",
        listedUnder: AI,
        usedIn: ["Almost daily"],
      }),
      S("llm", "Ll", "Large Language Models (LLM)", "AI & Automation", "llm", { short: "LLMs", listedUnder: AI }),
      S("openclaw", "Oc", "OpenClaw", "AI & Automation", "openclaw", { listedUnder: AI }),
    ],
  },
  {
    family: "Infrastructure",
    skills: [
      S("linux", "Lx", "Linux", "Infrastructure", "linux", { listedUnder: INFRA, usedIn: ["Home labs, almost every day"] }),
      S("redhat", "Rh", "Red Hat Linux", "Infrastructure", "redhat", {
        short: "Red Hat",
        listedUnder: INFRA,
        usedIn: ["Home lab"],
      }),
      S("git", "Gt", "Git", "Infrastructure", "git", { listedUnder: LANG_DEV, usedIn: ["Managing my code"] }),
      S("iac", "Ic", "Infrastructure as Code (IaC)", "Infrastructure", "iac", {
        short: "IaC",
        listedUnder: INFRA,
        usedIn: ["Terraform", "Ansible", "Docker"],
      }),
      S("virtualization", "Vm", "Virtualization", "Infrastructure", "virtualization", {
        listedUnder: INFRA,
        usedIn: ["Docker", "VMware Workstation", "Oracle VirtualBox", "Proxmox"],
      }),
      S("remote", "Rc", "Remote Collaboration", "Infrastructure", "remote", {
        short: "Remote Collab",
        listedUnder: INFRA,
        usedIn: ["College labs", "Home labs"],
      }),
    ],
  },
];

/** Tools named on homelab Tech: lines (for chips/logos), not listed in the Skills section grid. */
export const HOMELAB_EXTRA_SKILLS: Skill[] = [
  S("wazuh", "Wa", "Wazuh", "Security Operations", "wazuh"),
  S("elasticsearch", "Es", "Elasticsearch", "Security Operations", "elasticsearch"),
  S("logstash", "Ls", "Logstash", "Security Operations", "logstash"),
  S("kibana", "Ki", "Kibana", "Security Operations", "kibana"),
  S("splunk", "Sp", "Splunk", "Security Operations", "splunk"),
  S("sysmon", "Sy", "Sysmon", "Security Operations", "sysmon"),
  S("goad", "Go", "GOAD", "Security", "goad"),
  S("activedirectory", "Ad", "Active Directory", "Security", "activedirectory"),
  S("windowsserver", "Ws", "Windows Server", "Security", "windowsserver"),
  S("kerberos", "Ke", "Kerberos", "Security", "kerberos"),
  S("bloodhound", "Bh", "BloodHound", "Security", "bloodhound"),
  S("impacket", "Im", "Impacket", "Security", "impacket"),
  S("pe-analysis", "Pe", "PE Analysis", "Security Operations", "pefile"),
  S("flare-vm", "Fv", "FLARE-VM", "Security Operations", "flare"),
  S("remnux", "Rx", "REMnux", "Security Operations", "remnux"),
];

export const SKILLS: Skill[] = SKILL_GROUPS.flatMap((g) => g.skills);
export const SKILL_BY_ID: Record<string, Skill> = Object.fromEntries(
  [...SKILLS, ...HOMELAB_EXTRA_SKILLS].map((s) => [s.id, s]),
);

export const HOMELABS: Homelab[] = [
  {
    id: "siem-lab",
    index: "01",
    title: "SIEM & SOC Telemetry Lab (Wazuh / ELK / Splunk)",
    highlights: [
      "Built a virtualized SOC environment that centralizes endpoint and network telemetry from Windows and Linux hosts into Wazuh, the Elastic Stack (ELK), and Splunk, allowing side-by-side comparison of SIEM platforms.",
      "Deployed Wazuh agents and Sysmon for endpoint visibility and onboarded Windows Event Logs, Linux syslog/auth logs, and network logs through Logstash and Splunk forwarders.",
      "Wrote custom detection rules, correlation searches, and dashboards; validated alerting by simulating adversary activity and mapping detections to MITRE ATT&CK techniques.",
      "Practiced SOC analyst workflows: alert triage, log investigation, false-positive tuning, and documenting findings.",
    ],
    tech: ["wazuh", "elasticsearch", "logstash", "kibana", "splunk", "sysmon", "mitre"].map((id) => ({
      id,
      name: SKILL_BY_ID[id].name,
      logo: SKILL_BY_ID[id].logo,
    })),
  },
  {
    id: "goad-lab",
    index: "02",
    title: "Active Directory Attack-and-Defend Lab (GOAD)",
    highlights: [
      "Deployed GOAD (Game of Active Directory), a multi-domain, multi-forest vulnerable Windows environment, to practice both offensive and defensive Active Directory security.",
      "Executed common AD attack paths including enumeration, Kerberoasting, AS-REP roasting, password spraying, NTLM relay, ACL abuse, and lateral movement using BloodHound and Impacket.",
      "Forwarded domain controller and host logs into the SIEM lab to build and test detections for each technique, then applied hardening measures to close the identified attack paths.",
    ],
    tech: ["goad", "activedirectory", "windowsserver", "kerberos", "bloodhound", "impacket"].map((id) => ({
      id,
      name: SKILL_BY_ID[id].name,
      logo: SKILL_BY_ID[id].logo,
    })),
  },
  {
    id: "malware-lab",
    index: "03",
    title: "Malware Analysis & YARA Rule Generation",
    highlights: [
      "Built an isolated, snapshot-based analysis environment for safely handling malware samples with no access to production networks.",
      "Performed static analysis (file hashing, PE header and import inspection, string extraction) and dynamic analysis (process, file system, registry, and network behavior) to extract indicators of compromise.",
      "Generated and authored YARA rules from extracted strings, byte patterns, and file characteristics, then tested and tuned them against sample sets to improve detection and reduce false positives.",
    ],
    tech: ["yara", "python", "pe-analysis", "flare-vm", "remnux"].map((id) => ({
      id,
      name: SKILL_BY_ID[id].name,
      logo: SKILL_BY_ID[id].logo,
    })),
  },
];

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
    tech: ["python", "aes", "rsa", "cryptography", "nextjs", "nodejs", "sqlserver", "mysql", "redis", "openclaw", "llm", "networking", "remote"],
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

export const CERTIFICATIONS: Certification[] = [];
export const ACHIEVEMENTS: Achievement[] = [];

export function usesOf(skillId: string): { projects: string[]; roles: string[]; homelab: string[] } {
  return {
    projects: PROJECTS.filter((p) => p.tech.includes(skillId)).map((p) => p.title),
    roles: EXPERIENCE.filter((e) => e.tech.includes(skillId)).map((e) => `${e.title} · ${e.place.split(" - ")[0]}`),
    homelab: HOMELABS.filter((h) => h.tech.some((t) => t.id === skillId)).map((h) => h.title),
  };
}
