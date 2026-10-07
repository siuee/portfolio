import { PROFILE } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="ft">
      <div className="wrap ft-in">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <a href="#top" className="ft-top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
        <p>Built with Next.js</p>
      </div>
      <style href="footer" precedence="default">{`
        .ft{border-top:1px solid var(--line)}
        .ft-in{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 24px;padding-block:28px;font-family:var(--font-mono);font-size:12px;color:var(--mute)}
        .ft-top{display:inline-flex;gap:8px;color:var(--ink)}
        .ft-top span{transition:transform .5s var(--ease)}
        .ft-top:hover span{transform:translateY(-3px)}
      `}</style>
    </footer>
  );
}
