'use client';

import { AutoComplete, type Option } from '@repo/ui/components/ui/AutoComplete';
import { useState } from 'react';

const FRAMEWORKS = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
  {
    value: 'wordpress',
    label: 'WordPress',
  },
  {
    value: 'express.js',
    label: 'Express.js',
  },
  {
    value: 'nest.js',
    label: 'Nest.js',
  },
];

export function SearchBar() {
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setDisbled] = useState(false);
  const [value, setValue] = useState<Option>();

  return (
    <AutoComplete
      options={FRAMEWORKS}
      emptyMessage="No resulsts."
      placeholder="Find something"
      isLoading={isLoading}
      onValueChange={setValue}
      value={value}
      disabled={isDisabled}
    />
  );
}
