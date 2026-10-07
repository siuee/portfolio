type Props = {
  id: string;
  index: string;
  label: string;
  /** heading lines; `accent` is appended to the last one in Instrument Serif italic */
  lines: string[];
  accent: string;
  className?: string;
};

export default function SectionHeading({ id, index, label, lines, accent, className = "" }: Props) {
  return (
    <div className={className}>
      <p className="tag rv">
        <b>{index}</b>
        <span aria-hidden="true">—</span>
        {label}
      </p>
      <h2 id={id} className="h-sec mt-5">
        {lines.map((line, i) => (
          <span key={i} className="rv-mask" style={{ "--i": i } as React.CSSProperties}>
            <span>
              {line}
              {i === lines.length - 1 && (
                <>
                  {" "}
                  <em className="accent">{accent}</em>
                </>
              )}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}
