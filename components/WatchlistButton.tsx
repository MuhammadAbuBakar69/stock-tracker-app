"use client";
import React, { useMemo, useState, useEffect } from "react";
import { onAuthChange } from '@/lib/firebase/client';

// Minimal WatchlistButton implementation to satisfy page requirements.
// This component focuses on UI contract only. It toggles local state and
// calls onWatchlistChange if provided. Styling hooks match globals.css.

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      const uid = u?.id ?? null;
      setUserId(uid);
      // If we have a user, check server whether this symbol is in their watchlist
      if (uid) {
        try {
          const res = await fetch(`/api/watchlist?userId=${encodeURIComponent(uid)}`);
          if (!res.ok) return;
          const data = await res.json();
          const found = (data.items || []).some((it: { symbol: string }) => String(it.symbol).toUpperCase() === String(symbol).toUpperCase());
          setAdded(found);
        } catch (err) {
          console.error('Failed to sync watchlist state', err);
        }
      } else {
        // no user -> keep local isInWatchlist prop
        setAdded(!!isInWatchlist);
      }
    });
    return () => unsub();
  }, [symbol, isInWatchlist]);

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const handleClick = async () => {
    const next = !added;
    // optimistic update
    setAdded(next);
    onWatchlistChange?.(symbol, next);

    // If no user, prompt to sign in (client-only). Keep optimistic state locally.
    if (!userId) {
      // Could show a toast or navigate to sign-in; for now just log.
      console.warn('Watchlist action attempted while not signed in');
      return;
    }

    try {
      if (next) {
        // add
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, symbol, company }),
        });
        if (!res.ok) throw new Error('Failed to add');
      } else {
        // remove
        const res = await fetch('/api/watchlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, symbol }),
        });
        if (!res.ok) throw new Error('Failed to remove');
      }
    } catch (err) {
      console.error('Watchlist API error', err);
      // revert optimistic update on error
      setAdded(!next);
      onWatchlistChange?.(symbol, !next);
    }
  };

  if (type === "icon") {
    return (
      <button
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={added ? "#FACC15" : "none"}
          stroke="#FACC15"
          strokeWidth="1.5"
          className="watchlist-star"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button className={`watchlist-btn ${added ? "watchlist-remove" : ""}`} onClick={handleClick}>
      {showTrashIcon && added ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
        </svg>
      ) : null}
      <span>{label}</span>
    </button>
  );
};

export default WatchlistButton;
