export function Loader() {
  return (
    <div className="relative h-20 w-20" aria-label="Loading...">
      <div className="absolute inset-0 rounded-full border-2 border-primary/30"></div>
      <div className="absolute inset-2 rounded-full border-2 border-accent/30"></div>
      <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-t-primary"></div>
      <div className="absolute inset-2 animate-spin-reverse rounded-full border-b-2 border-b-accent"></div>
    </div>
  );
}
