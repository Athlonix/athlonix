import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import Link from 'next/link';
import type { SVGProps } from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h5 className="text-xl font-semibold">Newsletter</h5>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="Votre email" className="border p-2 flex-grow" />
              <Button className="bg-blue-600 text-white px-4 py-2">S'abonner</Button>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-xl font-semibold">Nous suivre</h5>
            <div className="flex space-x-6">
              <FacebookIcon className="text-blue-600 w-8 h-8" />
              <TwitterIcon className="text-blue-400 w-8 h-8" />
              <InstagramIcon className="text-pink-600 w-8 h-8" />
              <Link href="https://github.com/Athlonix/athlonix" prefetch={false}>
                <GithubIcon className="text-gray-600 w-8 h-8 hover:text-gray-900" />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-xl font-semibold">Catégories</h5>
            <ul className="space-y-2 text-lg">
              <li className="hover:underline">
                <Link href="/sports" prefetch={false}>
                  Sports
                </Link>
              </li>
              <li className="hover:underline">
                <Link href="#" prefetch={false}>
                  Cours
                </Link>
              </li>
              <li className="hover:underline">
                <Link href="#" prefetch={false}>
                  Evénements
                </Link>
              </li>
              <li className="hover:underline">
                <Link href="/tournaments" prefetch={false}>
                  Tournois
                </Link>
              </li>
              <li className="hover:underline">
                <Link href="/blog" prefetch={false}>
                  Actualités
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-xl font-semibold">Support</h5>
            <ul className="space-y-2 text-lg">
              <li className="hover:underline">
                <Link href="/about#faq" prefetch={false}>
                  FAQ
                </Link>
              </li>
              <li>Contactez le support</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link href="/usage" className="text-gray-600 hover:text-gray-900 hover:underline" prefetch={false}>
              Données personnelles
            </Link>
            <Link href="/usage" className="text-gray-600 hover:text-gray-900 hover:underline" prefetch={false}>
              Conditions d'utilisation
            </Link>
            <Link href="/usage" className="text-gray-600 hover:text-gray-900 hover:underline" prefetch={false}>
              Mentions légales
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 hover:underline" prefetch={false}>
              A propos de nous
            </Link>
          </div>
          <div className="text-gray-600 text-center md:text-right">
            {`Copyright © Athlonix ${new Date().getFullYear()} - Tous droits réservés`}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FacebookIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      <title>Facebook</title>
    </svg>
  );
}

function GithubIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
      <title>Github</title>
    </svg>
  );
}

function InstagramIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      <title>Instagram</title>
    </svg>
  );
}

function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      <title>Twitter</title>
    </svg>
  );
}
