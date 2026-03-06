export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-body">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-heading font-display">404</h1>
        <p className="mt-4 text-lg text-body">Page not found</p>
        <a href="/" className="mt-6 inline-block text-accent-purple hover:underline">
          Go home
        </a>
      </div>
    </div>
  );
}
