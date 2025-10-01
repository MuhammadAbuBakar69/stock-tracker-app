"use client";

import { useEffect } from "react";

export default function HydrationDebugger() {
  useEffect(() => {
    try {
      const body = document.body;
      const attrs: Record<string, string> = {};
      for (const attr of Array.from(body.attributes)) {
        attrs[attr.name] = attr.value;
      }

      // Log attributes so you can see any extension-injected properties like
      // `cz-shortcut-listen` which are known to cause hydration mismatches.
      // This will appear in the browser console on mount.
      // If you see unexpected attributes here, try disabling browser extensions
      // or testing in an incognito window.
  console.info("HydrationDebugger: body attributes:", attrs);
    } catch (err) {
  console.warn("HydrationDebugger: failed to read body attributes", err);
    }
  }, []);

  return null;
}
