"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // For now do a local optimistic subscribe (no backend). In future we can POST to an API.
    setSubscribed(true);
  };

  return (
    <footer className="relative mt-16 text-gray-200">
      {/* decorative gradient and abstract SVG shape for uniqueness */}
      <div className="absolute inset-x-0 -top-20 pointer-events-none overflow-hidden">
        <svg className="w-full h-40 opacity-30" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#0ea5a4" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <path fill="url(#g1)" d="M0,64L48,85.3C96,107,192,149,288,165.3C384,181,480,171,576,160C672,149,768,139,864,160C960,181,1056,235,1152,240C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>

      <div className="bg-gradient-to-r from-neutral-900 via-slate-900 to-neutral-800 pt-28 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-36 h-9">
                  <Image src="/assets/images/logo.png" alt="Signalist" fill style={{ objectFit: 'contain' }} />
                </div>
              </div>
              <p className="text-gray-400 max-w-sm">Signalist helps traders and investors track market movements, set personalized alerts, and explore deep company insights — all in one elegant dashboard.</p>

              <div className="flex items-center gap-3">
                <a href="mailto:info@signalist.app" className="text-sm text-gray-200 hover:text-white">info@signalist.app</a>
                <span className="text-gray-600">•</span>
                <a href="/download" className="text-sm text-gray-200 hover:text-white">Download</a>
              </div>
            </div>

            <div className="flex justify-between md:justify-center">
              <div>
                <h4 className="text-sm font-semibold text-gray-300">Product</h4>
                <ul className="mt-3 space-y-2 text-gray-400">
                  <li><Link href="/" className="hover:text-white">Home</Link></li>
                  <li><Link href="/search" className="hover:text-white">Find Stocks</Link></li>
                  <li><Link href="/watchlist" className="hover:text-white">Watchlist</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-300">Company</h4>
                <ul className="mt-3 space-y-2 text-gray-400">
                  <li><a href="/about" className="hover:text-white">About</a></li>
                  <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
                  <li><a href="/blog" className="hover:text-white">Blog</a></li>
                </ul>
              </div>
            </div>

            <div className="md:pl-6">
              <h4 className="text-sm font-semibold text-gray-300">Stay updated</h4>
              <p className="mt-2 text-gray-400 text-sm">Get weekly market briefs and product news.</p>

              <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm placeholder-gray-400"
                  placeholder="Your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                />
                <button className="px-4 py-2 bg-amber-500 text-black font-semibold rounded text-sm hover:opacity-95" type="submit">{subscribed ? 'Subscribed' : 'Subscribe'}</button>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <a href="https://twitter.com" aria-label="Twitter" className="p-2 rounded bg-gray-800 hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" viewBox="0 0 24 24" fill="currentColor"><path d="M19.633 7.997c.013.176.013.353.013.529 0 5.396-4.108 11.62-11.62 11.62A11.56 11.56 0 012 18.837a8.404 8.404 0 006.18-1.722 4.083 4.083 0 01-3.806-2.831c.616.094 1.22.012 1.77-.153a4.078 4.078 0 01-3.267-4.001v-.051c.551.308 1.186.499 1.86.523a4.073 4.073 0 01-1.814-3.395c0-.75.203-1.45.553-2.053a11.574 11.574 0 008.409 4.262 4.603 4.603 0 01-.101-.931 4.073 4.073 0 017.056-2.78 8.11 8.11 0 002.59-.988 4.093 4.093 0 01-1.792 2.249 8.175 8.175 0 002.345-.642 8.752 8.752 0 01-2.044 2.154z"/></svg>
                </a>
                <a href="https://github.com" aria-label="GitHub" className="p-2 rounded bg-gray-800 hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 00-3.793 23.397c.6.111.82-.26.82-.578v-2.16c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.758-1.333-1.758-1.089-.744.083-.729.083-.729 1.205.085 1.84 1.24 1.84 1.24 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.76-1.605-2.666-.303-5.467-1.333-5.467-5.932 0-1.31.468-2.38 1.235-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.007-.323 3.3 1.23a11.49 11.49 0 016 0c2.29-1.553 3.294-1.23 3.294-1.23.655 1.653.244 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.922.43.37.823 1.102.823 2.222v3.293c0 .32.216.694.825.576A12 12 0 0012 .5z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
            © {year} Signalist — Built with care. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
