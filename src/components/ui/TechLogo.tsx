import type { ReactNode } from "react";

type Brand = { src: string; color: string };

/** Official devicon "original" SVGs and one simple-icons path, copied into /public/logos. */
const BRAND: Record<string, Brand> = {
  python: { src: "/logos/devicon/python-original.svg", color: "#3776AB" },
  javascript: { src: "/logos/devicon/javascript-original.svg", color: "#F7DF1E" },
  java: { src: "/logos/devicon/java-original.svg", color: "#ED8B00" },
  php: { src: "/logos/devicon/php-original.svg", color: "#777BB4" },
  html5: { src: "/logos/devicon/html5-original.svg", color: "#E34F26" },
  nodejs: { src: "/logos/devicon/nodejs-original.svg", color: "#5FA04E" },
  nextjs: { src: "/logos/devicon/nextjs-original.svg", color: "#000000" },
  jwt: { src: "/logos/simple-icons/jsonwebtokens.svg", color: "#000000" },
  vercel: { src: "/logos/devicon/vercel-original.svg", color: "#000000" },
  mysql: { src: "/logos/devicon/mysql-original.svg", color: "#4479A1" },
  sqlserver: { src: "/logos/devicon/microsoftsqlserver-original.svg", color: "#CC2927" },
  redis: { src: "/logos/devicon/redis-original.svg", color: "#FF4438" },
  firebase: { src: "/logos/devicon/firebase-original.svg", color: "#FFCA28" },
  linux: { src: "/logos/devicon/linux-original.svg", color: "#FCC624" },
  redhat: { src: "/logos/devicon/redhat-original.svg", color: "#EE0000" },
  git: { src: "/logos/devicon/git-original.svg", color: "#F05032" },
};

/** Thin line icons (48×48, 1.5 stroke) for concepts that have no brand mark. */
const CONCEPT: Record<string, ReactNode> = {
  sql: (
    <>
      <ellipse cx="24" cy="12" rx="14" ry="5" />
      <path d="M10 12v24c0 2.8 6.3 5 14 5s14-2.2 14-5V12" />
      <path d="M10 24c0 2.8 6.3 5 14 5s14-2.2 14-5" />
    </>
  ),
  rest: (
    <>
      <path d="M15 9c-4 0-5 2-5 5v5c0 3-2 5-4 5 2 0 4 2 4 5v5c0 3 1 5 5 5" />
      <path d="M33 9c4 0 5 2 5 5v5c0 3 2 5 4 5-2 0-4 2-4 5v5c0 3-1 5-5 5" />
      <path d="M18 24h12M26 20l4 4-4 4" />
    </>
  ),
  fullstack: (
    <>
      <path d="M24 8l16 8-16 8-16-8z" />
      <path d="M8 24l16 8 16-8" />
      <path d="M8 32l16 8 16-8" />
    </>
  ),
  cybersecurity: (
    <>
      <path d="M24 6l14 5v11c0 9-6 16-14 20-8-4-14-11-14-20V11z" />
      <path d="M18 24l4 4 8-8" />
    </>
  ),
  cryptography: (
    <>
      <circle cx="15" cy="24" r="7" />
      <path d="M22 24h20M35 24v6M41 24v5" />
    </>
  ),
  aes: (
    <>
      <rect x="10" y="21" width="28" height="20" rx="3" />
      <path d="M16 21v-6a8 8 0 0116 0v6" />
      <path d="M24 29v5" />
      <circle cx="24" cy="28" r="1.5" />
    </>
  ),
  rsa: (
    <>
      <circle cx="11" cy="30" r="5" />
      <circle cx="37" cy="30" r="5" />
      <path d="M16 30h16" strokeDasharray="2 3" />
      <rect x="18" y="10" width="12" height="9" rx="2" />
      <path d="M21 10V8a3 3 0 016 0v2" />
    </>
  ),
  pycryptodome: (
    <>
      <path d="M24 6l15 9v18l-15 9-15-9V15z" />
      <circle cx="24" cy="21" r="3.5" />
      <path d="M24 24.5V31" />
    </>
  ),
  pentest: (
    <>
      <circle cx="24" cy="24" r="14" />
      <circle cx="24" cy="24" r="5" />
      <path d="M24 4v9M24 35v9M4 24h9M35 24h9" />
    </>
  ),
  networking: (
    <>
      <circle cx="24" cy="10" r="4" />
      <circle cx="10" cy="36" r="4" />
      <circle cx="38" cy="36" r="4" />
      <path d="M22 13.5L12 32.5M26 13.5l10 19M14 36h20" />
    </>
  ),
  agentic: (
    <>
      <rect x="12" y="16" width="24" height="20" rx="5" />
      <path d="M24 16v-5M8 23v7M40 23v7M19 31h10" />
      <circle cx="24" cy="9" r="2" />
      <circle cx="19" cy="25" r="2" />
      <circle cx="29" cy="25" r="2" />
    </>
  ),
  prompt: (
    <>
      <rect x="6" y="10" width="36" height="28" rx="4" />
      <path d="M13 20l5 4-5 4M22 29h11" />
    </>
  ),
  llm: (
    <>
      <path d="M8 11h32v21H21l-8 7v-7H8z" />
      <path d="M24 15.5v12M18 21.5h12M20 17.5l8 8M28 17.5l-8 8" />
    </>
  ),
  openclaw: (
    <>
      <path d="M13 9c6 8 8 19 4 30" />
      <path d="M24 7c5 9 6 21 2 32" />
      <path d="M35 9c5 8 6 19 2 30" />
    </>
  ),
  iac: (
    <>
      <path d="M12 6h16l8 8v28H12z" />
      <path d="M28 6v8h8M19 25l-3 3 3 3M29 25l3 3-3 3M26 23l-4 11" />
    </>
  ),
  remote: (
    <>
      <circle cx="24" cy="24" r="16" />
      <ellipse cx="24" cy="24" rx="7" ry="16" />
      <path d="M8 24h32M10 16h28M10 32h28" />
    </>
  ),
};

export function isBrand(key: string): boolean {
  return key in BRAND;
}

export function brandColor(key: string): string | null {
  return BRAND[key]?.color ?? null;
}

type Props = { name: string; size?: number; className?: string };

/** Decorative: always pair with a visible text label. */
export default function TechLogo({ name, size = 24, className }: Props) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <img
        src={brand.src}
        width={size}
        height={size}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={size > 64 ? 1.1 : 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {CONCEPT[name] ?? <circle cx="24" cy="24" r="14" />}
    </svg>
  );
}
