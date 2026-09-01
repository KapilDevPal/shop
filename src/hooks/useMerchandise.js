import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../tokens.js";

/**
 * Fetch all merchandise products (with optional category filter).
 */
export function useMerchandise(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE}/space/store_products?is_merchandise=true`;
      if (category && category !== "All")
        url += `&category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      setProducts(json.data || []);
    } catch (err) {
      setError(err.message || "Couldn't load the collection.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const submitInterest = useCallback(async (payload) => {
    const res = await fetch(`${API_BASE}/space/product_interests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || data.message || "Couldn't submit your interest.");

    if (data.product_stats) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === data.product_stats.id || p.slug === data.product_stats.slug
            ? {
                ...p,
                interests_count: data.product_stats.interests_count,
                min_interest_required: data.product_stats.min_interest_required,
                interest_progress: data.product_stats.interest_progress,
                is_threshold_reached: data.product_stats.is_threshold_reached,
              }
            : p
        )
      );
    }
    return data;
  }, []);

  return { products, loading, error, refetch: fetchProducts, submitInterest };
}

/**
 * Fetch a single product by slug.
 */
export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    const cleanSlug = decodeURIComponent(slug);
    const encodedSlugForApi = encodeURIComponent(cleanSlug).replace(/\./g, "%2E");

    fetch(`${API_BASE}/space/store_products/${encodedSlugForApi}`)
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        // Fallback: If single product endpoint returns 404, fetch all products and find match
        const listRes = await fetch(`${API_BASE}/space/store_products?is_merchandise=true&per_page=100`);
        if (!listRes.ok) throw new Error(`Product not found (${res.status})`);
        const listJson = await listRes.json();
        const products = listJson.data || [];
        const found = products.find(
          (p) =>
            p.slug === slug ||
            p.slug === cleanSlug ||
            decodeURIComponent(p.slug) === cleanSlug ||
            encodeURIComponent(p.slug) === encodeURIComponent(cleanSlug) ||
            p.slug.toLowerCase() === cleanSlug.toLowerCase()
        );
        if (found) {
          const relatedProducts = products.filter((p) => p.id !== found.id);
          return { data: found, related: relatedProducts };
        }
        throw new Error(`Product not found (${res.status})`);
      })
      .then((json) => {
        setProduct(json.data || json);
        setRelated(json.related || []);
      })
      .catch((err) => setError(err.message || "Product not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  const submitInterest = useCallback(async (payload) => {
    const res = await fetch(`${API_BASE}/space/product_interests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || data.message || "Couldn't submit your interest.");

    if (data.product_stats) {
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              interests_count: data.product_stats.interests_count,
              min_interest_required: data.product_stats.min_interest_required,
              interest_progress: data.product_stats.interest_progress,
              is_threshold_reached: data.product_stats.is_threshold_reached,
            }
          : prev
      );
    }
    return data;
  }, []);

  return { product, related, loading, error, submitInterest };
}
