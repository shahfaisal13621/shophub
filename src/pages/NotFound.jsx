import EmptyState from "../components/EmptyState.jsx";

export default function NotFound() {
  return (
    <EmptyState
      icon="compass"
      title="404 — We couldn't find this page."
      message="The page you're looking for doesn't exist or may have moved. Let's get you back on track."
      actionLabel="Back to home"
      actionTo="/"
    />
  );
}