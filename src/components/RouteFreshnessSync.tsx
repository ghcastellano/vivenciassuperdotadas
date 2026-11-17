"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { consumeRouteDirty } from "@/lib/route-freshness";

export function RouteFreshnessSync() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (consumeRouteDirty(pathname)) {
      router.refresh();
    }
  }, [pathname, router]);

  return null;
}
