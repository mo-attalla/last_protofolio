type SectionPlaceholderProps = {
  id: string;
  label: string;
};

export function SectionPlaceholder({ id, label }: SectionPlaceholderProps) {
  return (
    <section id={id} className="section-shell">
      <div className="cinematic-container">
        <p className="section-label">{label} Placeholder</p>
      </div>
    </section>
  );
}
