export default function LegalPageLayout({ title, updatedDate, children }) {
  return (
    <div className="legal-page">
      <h1 className="page-heading mb-1">{title}</h1>
      <p className="text-muted small mb-4">Last updated: {updatedDate}</p>
      <div className="legal-content">{children}</div>
    </div>
  );
}