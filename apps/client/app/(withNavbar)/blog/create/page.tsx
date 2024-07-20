'use client';

import BlogForm from '@/app/ui/components/BlogForm';

export default function Page(): JSX.Element {
  return (
    <>
      <main className="flex flex-col items-center gap-y-8 py-4">
        <div className="flex items-center justify-between w-full">
          <BlogForm />
        </div>
      </main>
    </>
  );
}
