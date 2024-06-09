import { LoginForm } from '@/app/ui/LoginForm';
import Image from 'next/image';
import Link from 'next/link';

export default function Page(): JSX.Element {
  return (
    <main>
      <div className="flex items-center justify-center h-screen">
        <div className="absolute top-2 left-0 mt-4 ml-4">
          <Link href="/" className="flex items-center">
            <Image src="/favicon.ico" alt="Accueil" width="32" height="32" />
            <h2 className="ml-2 font-bold">Athlonix</h2>
          </Link>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
