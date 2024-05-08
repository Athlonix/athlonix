import { LoginForm } from '@/app/ui/LoginForm';

export default function Page(): JSX.Element {
  return (
    <main>
      <div className="flex items-center justify-center h-screen">
        <LoginForm />
      </div>
    </main>
  );
}
