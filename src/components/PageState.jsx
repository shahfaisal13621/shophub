export default function PageState({ status, message, onRetry, retryLabel }) {
  return (
    <div className="text-center py-5 text-muted">
      <p className="mb-3">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline-primary" onClick={onRetry}>
          {retryLabel || (status === "error" ? "Retry" : "Reset filters")}
        </button>
      )}
    </div>
  );
}