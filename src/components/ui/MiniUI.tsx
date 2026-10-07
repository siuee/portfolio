/**
 * Grayscale, illustrative mini-interfaces for each project.
 * They hint at what the product does; they are not screenshots and show no real data.
 */

function Bar({ w, h = 8, tone = "soft" }: { w: string; h?: number; tone?: "soft" | "ink" | "mute" }) {
  const bg = tone === "ink" ? "var(--ink)" : tone === "mute" ? "var(--faint)" : "var(--soft)";
  return <span className="mui-bar" style={{ width: w, height: h, background: bg }} />;
}

function Fifa() {
  return (
    <div className="mui-stack">
      <div className="mui-card mui-match">
        <p className="mui-k">Match preview</p>
        <div className="mui-vs">
          {["P1", "P2"].map((p, i) => (
            <div key={p} className="mui-player">
              <span className="mui-avatar">{p}</span>
              <div className="mui-form" aria-hidden="true">
                {[1, 0, 1, 1, 0].map((f, j) => (
                  <i key={j} style={{ background: (f ^ i) === 1 ? "var(--ink)" : "var(--soft)" }} />
                ))}
              </div>
            </div>
          ))}
          <span className="mui-vs-t">VS</span>
        </div>
        <div className="mui-odds">
          <Bar w="58%" h={6} tone="ink" />
          <Bar w="42%" h={6} tone="mute" />
        </div>
      </div>
      <div className="mui-card">
        <p className="mui-k">Fixtures · 2v2</p>
        {[0, 1, 2].map((r) => (
          <div key={r} className="mui-row">
            <Bar w="34%" />
            <span className="mui-score">– : –</span>
            <Bar w="34%" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Encryption() {
  return (
    <div className="mui-stack">
      <div className="mui-card">
        <p className="mui-k">Encrypt file</p>
        <div className="mui-file">
          <span className="mui-doc" aria-hidden="true" />
          <div style={{ flex: 1 }}>
            <Bar w="70%" />
            <Bar w="40%" h={6} tone="mute" />
          </div>
          <span className="mui-pill">AES-256</span>
        </div>
        <div className="mui-progress">
          <span />
        </div>
      </div>
      <div className="mui-card">
        <p className="mui-k">RSA key exchange</p>
        <div className="mui-keys">
          <span className="mui-key">pub</span>
          <span className="mui-dash" />
          <span className="mui-key is-ink">priv</span>
        </div>
      </div>
      <div className="mui-card mui-hash">
        <p className="mui-k">SHA-256</p>
        <code>••••••••••••••••••••••</code>
        <span className="mui-check">✓</span>
      </div>
    </div>
  );
}

function SecureAuth() {
  return (
    <div className="mui-stack">
      <div className="mui-card">
        <p className="mui-k">Sign in</p>
        <span className="mui-input" />
        <span className="mui-input" />
        <span className="mui-btn">Continue</span>
      </div>
      <div className="mui-card">
        <p className="mui-k">JWT</p>
        <div className="mui-jwt">
          <span>header</span>.<span>payload</span>.<span className="is-ink">signature</span>
        </div>
      </div>
      <div className="mui-card mui-split">
        <div>
          <p className="mui-k">Session · Redis</p>
          <Bar w="80%" />
        </div>
        <div>
          <p className="mui-k">Rate limit</p>
          <div className="mui-meter">
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} style={{ background: i < 6 ? "var(--ink)" : "var(--soft)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NepalImports() {
  const bars = [92, 74, 63, 51, 40, 31, 22];
  return (
    <div className="mui-stack">
      <div className="mui-card">
        <p className="mui-k">Imports by category</p>
        <div className="mui-chart" aria-hidden="true">
          {bars.map((h, i) => (
            <span key={i} style={{ height: `${h}%`, background: i === 0 ? "var(--ink)" : "var(--soft)" }} />
          ))}
        </div>
      </div>
      <div className="mui-card mui-split">
        <div>
          <p className="mui-k">Cultivation guidance</p>
          <Bar w="90%" />
          <Bar w="64%" />
        </div>
        <div>
          <p className="mui-k">Where to grow</p>
          <div className="mui-map" aria-hidden="true">
            <i style={{ left: "22%", top: "40%" }} />
            <i style={{ left: "52%", top: "58%" }} />
            <i style={{ left: "74%", top: "34%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenClaw() {
  const steps = ["Plan", "Use tool", "Decide", "Next step", "Done"];
  return (
    <div className="mui-stack">
      <div className="mui-card">
        <p className="mui-k">Agent run</p>
        <ol className="mui-steps">
          {steps.map((s, i) => (
            <li key={s} className={i < 3 ? "is-done" : i === 3 ? "is-now" : ""}>
              <i aria-hidden="true" />
              {s}
              <Bar w={`${30 + ((i * 17) % 40)}%`} h={6} />
            </li>
          ))}
        </ol>
      </div>
      <div className="mui-card mui-prompt">
        <span>&gt;</span>
        <Bar w="62%" />
        <i className="mui-caret" aria-hidden="true" />
      </div>
    </div>
  );
}

const MAP: Record<string, () => React.JSX.Element> = {
  fifa: Fifa,
  encryption: Encryption,
  "secure-auth": SecureAuth,
  "nepal-imports": NepalImports,
  openclaw: OpenClaw,
};

export default function MiniUI({ id }: { id: string }) {
  const UI = MAP[id];
  return (
    <figure className="mui" aria-label="Illustrative UI, not a screenshot">
      <figcaption className="mui-label">Illustrative UI</figcaption>
      {UI ? <UI /> : null}
      <style href="mini-ui" precedence="default">{`
        .mui{position:relative;height:100%;margin:0;padding:44px 18px 18px;border-radius:20px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden}
        .mui-label{position:absolute;top:14px;left:18px;font-family:var(--font-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
        .mui-stack{display:flex;flex-direction:column;gap:10px}
        .mui-card{padding:12px 14px;border-radius:14px;background:#fff;box-shadow:var(--hair);display:flex;flex-direction:column;gap:7px}
        .mui-k{font-family:var(--font-mono);font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
        .mui-bar{display:block;border-radius:99px}
        .mui-row{display:flex;align-items:center;justify-content:space-between;gap:8px}
        .mui-score{font-family:var(--font-mono);font-size:10px;color:var(--mute)}
        .mui-vs{position:relative;display:flex;justify-content:space-between}
        .mui-vs-t{position:absolute;left:50%;top:12px;transform:translateX(-50%);font-weight:800;font-size:18px;letter-spacing:-.04em}
        .mui-player{display:flex;flex-direction:column;align-items:center;gap:6px}
        .mui-avatar{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:var(--soft);font-family:var(--font-mono);font-size:11px}
        .mui-form{display:flex;gap:3px}.mui-form i{width:7px;height:7px;border-radius:2px}
        .mui-odds{display:flex;gap:4px}
        .mui-file{display:flex;align-items:center;gap:10px}
        .mui-file .mui-bar+.mui-bar{margin-top:5px}
        .mui-doc{width:26px;height:32px;border-radius:5px;box-shadow:inset 0 0 0 1.5px var(--ink)}
        .mui-pill{padding:4px 8px;border-radius:99px;background:var(--ink);color:#fff;font-family:var(--font-mono);font-size:9.5px}
        .mui-progress{height:6px;border-radius:99px;background:var(--soft);overflow:hidden}
        .mui-progress span{display:block;height:100%;width:68%;background:var(--ink);border-radius:inherit}
        .mui-keys{display:flex;align-items:center;gap:8px}
        .mui-key{padding:5px 10px;border-radius:8px;box-shadow:inset 0 0 0 1px var(--line);font-family:var(--font-mono);font-size:10px}
        .mui-key.is-ink{background:var(--ink);color:#fff}
        .mui-dash{flex:1;border-top:1.5px dashed var(--faint)}
        .mui-hash{flex-direction:row;align-items:center;gap:10px}
        .mui-hash code{flex:1;font-family:var(--font-mono);font-size:10px;color:var(--mute);overflow:hidden;white-space:nowrap}
        .mui-check{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--ink);color:#fff;font-size:11px}
        .mui-input{display:block;height:26px;border-radius:8px;box-shadow:inset 0 0 0 1px var(--line)}
        .mui-btn{display:grid;place-items:center;height:28px;border-radius:99px;background:var(--ink);color:#fff;font-size:11px}
        .mui-jwt{font-family:var(--font-mono);font-size:10.5px;color:var(--mute);overflow-wrap:anywhere}
        .mui-jwt span{padding:2px 5px;border-radius:5px;background:var(--soft);color:var(--ink-2)}
        .mui-jwt span.is-ink{background:var(--ink);color:#fff}
        .mui-split{flex-direction:row;gap:14px}.mui-split>div{flex:1;display:flex;flex-direction:column;gap:7px}
        .mui-meter{display:flex;gap:3px}.mui-meter i{flex:1;height:14px;border-radius:3px}
        .mui-chart{display:flex;align-items:flex-end;gap:6px;height:110px}
        .mui-chart span{flex:1;border-radius:5px 5px 2px 2px}
        .mui-map{position:relative;height:44px;border-radius:8px;background:var(--paper)}
        .mui-map i{position:absolute;width:8px;height:8px;margin:-4px;border-radius:50%;background:var(--ink);box-shadow:0 0 0 4px rgba(13,13,13,.08)}
        .mui-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
        .mui-steps li{display:grid;grid-template-columns:14px 70px 1fr;align-items:center;gap:8px;font-size:11.5px;color:var(--mute)}
        .mui-steps li i{width:10px;height:10px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--faint)}
        .mui-steps li.is-done{color:var(--ink-2)}.mui-steps li.is-done i{background:var(--ink);box-shadow:none}
        .mui-steps li.is-now{color:var(--ink)}.mui-steps li.is-now i{box-shadow:inset 0 0 0 2px var(--ink)}
        .mui-prompt{flex-direction:row;align-items:center;gap:10px;font-family:var(--font-mono);font-size:12px}
        .mui-caret{width:7px;height:14px;background:var(--ink);animation:caret 1s steps(1) infinite}
        @keyframes caret{50%{opacity:0}}
      `}</style>
    </figure>
  );
}
