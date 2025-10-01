"use client";

import Link from "next/link";
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { onAuthChange } from '@/lib/firebase/client';
import WatchlistButton from '@/components/WatchlistButton';

export default function WatchlistPage() {
  const [user, setUser] = useState<{ id: string; name?: string | null; email?: string | null } | null>(null);
  const [items, setItems] = useState<Array<{ symbol: string; company: string; addedAt?: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      const mapped = u ? { id: u.id, name: u.name, email: u.email } : null;
      setUser(mapped);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/watchlist?userId=${encodeURIComponent(user.id)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
  setItems((data.items || []).map((i: { symbol: string; company: string; addedAt?: string }) => ({ symbol: i.symbol, company: i.company, addedAt: i.addedAt })));
      } catch (err) {
        console.error('Failed to load watchlist', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user]);

  const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
    if (isAdded) {
      // optimistic add
      setItems((s) => [{ symbol, company: symbol }, ...s]);
    } else {
      setItems((s) => s.filter((i) => i.symbol !== symbol));
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-gray-100">Your Watchlist</h1>
      <p className="mt-4 text-gray-400">This is where your saved stocks will appear.</p>

      <div className="mt-6 p-6 bg-gray-900 rounded-lg">
        {!user ? (
          <>
            <p className="text-gray-300">You need to be signed in to see your watchlist.</p>
            <div className="mt-4 flex gap-3">
              <Link href="/sign-in">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="yellow-btn">Create account</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-300">Signed in as <strong>{user.name ?? user.email}</strong>.</p>
            {loading ? (
              <p className="mt-3 text-gray-400">Loading your watchlist...</p>
            ) : items.length === 0 ? (
              <>
                <p className="mt-3 text-gray-400">Your watchlist is currently empty. Use the search or stock pages to add items to your watchlist.</p>
                <div className="mt-4">
                  <Link href="/search">
                    <Button className="yellow-btn">Find stocks</Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-4">
                <table className="min-w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-2">Symbol</th>
                      <th className="py-2">Company</th>
                      <th className="py-2">Added</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr key={it.symbol} className="border-t border-gray-800">
                        <td className="py-2"><Link href={`/stocks/${it.symbol.toUpperCase()}`}>{it.symbol}</Link></td>
                        <td className="py-2">{it.company}</td>
                        <td className="py-2">{it.addedAt ? new Date(it.addedAt).toLocaleString() : '-'}</td>
                        <td className="py-2">
                          <WatchlistButton symbol={it.symbol} company={it.company} isInWatchlist={true} onWatchlistChange={handleWatchlistChange} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
