import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 md:px-6">
      <div className="absolute top-2 left-0 mt-4 ml-4">
        <Link href="/" className="flex items-center">
          <img src="/favicon.ico" alt="Accueil" width="32" height="32" />
          <h2 className="ml-2 font-bold">Athlonix</h2>
        </Link>
      </div>
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-8xl font-bold text-gray-900 dark:text-gray-50">404</h1>
        <h2 className="text-2xl font-semibold">Page introuvable</h2>
        <p className="text-gray-500 dark:text-gray-400">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          prefetch={false}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
