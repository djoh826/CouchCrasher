"use client";

import { useEffect, useRef, useState } from "react";
import { PropertySearchParams } from "@/lib/search/propertySearchTypes";
import { apiFetch } from "@/lib/api";
import { PropertySearchResult } from "@/lib/search/searchProperties";

export function usePropertySearch(params: PropertySearchParams, delay = 300) {
  const [data, setData] = useState<PropertySearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query.append(key, String(value));
          }
        });

        const results = await apiFetch<PropertySearchResult[]>(
          `/api/properties/search?${query.toString()}`,
        );

        setData(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [JSON.stringify(params), delay]);

  return { data, loading };
}
