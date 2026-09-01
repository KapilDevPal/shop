import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Heart, Rocket, ArrowRight, Check, X, Loader2, RefreshCw } from "lucide-react";

/* ----------------------------------------------------------------------
   INDIAN SPACE HUB STORE — live catalog pulling real merchandise + interest
   data from the Rails API at indianspacehub.com, per the integration guide.
   Visitors browse products, optionally pick a size, and submit an interest
   vote (name, email, phone). Each product shows real progress toward the
   admin-configured minimum interest goal — no cart, no checkout.
   ---------------------------------------------------------------------- */

const API_BASE_URL = "https://indianspacehub.com/api/v1";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.kapildevpal.indiaspacehub";

const tokens = {
  paper: "#F6F4EF",
  paperSoft: "#EFEBE2",
  card: "#FFFFFF",
  ink: "#201E1B",
  inkMuted: "#6E6A62",
  inkFaint: "#A6A198",
  line: "#E4DFD3",
  accent: "#A97A2E",
  accentSoft: "#F5EBD9",
  success: "#3F7A4F",
  error: "#B24A3C",
};

/* --------------------------------- data hook --------------------------------- */
function useMerchandise(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/space/store_products?is_merchandise=true`;
      if (category && category !== "All") url += `&category=${encodeURIComponent(category)}`;
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
    const res = await fetch(`${API_BASE_URL}/space/product_interests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || "Couldn't submit your interest.");

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

/* --------------------------------- Nav --------------------------------- */
function Nav({ categories, active, onChange }) {
  return (
    <header className="sticky top-0 z-40" style={{ background: "rgba(246,244,239,0.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${tokens.line}` }}>
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Rocket size={16} style={{ color: tokens.accent, transform: "rotate(45deg)" }} strokeWidth={1.8} />
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18, color: tokens.ink, letterSpacing: "-0.01em" }}>
            Indian Space Hub Store
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-1 overflow-x-auto text-[13px]">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onChange(c)}
              className="px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors duration-200"
              style={
                active === c
                  ? { background: tokens.ink, color: tokens.paper }
                  : { background: "transparent", color: tokens.inkMuted }
              }
            >
              {c}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* --------------------------------- Hero --------------------------------- */
function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-8 pt-16 pb-14 md:pt-24 md:pb-20">
      <div className="max-w-xl">
        <div className="flex items-center gap-2 text-[12px] mb-6" style={{ color: tokens.inkFaint }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: tokens.accent, animation: "ish-live-pulse 2s ease-in-out infinite" }} />
          Live now — taking interest
        </div>
        <h1
          className="text-[2.1rem] leading-[1.15] sm:text-4xl md:text-[2.75rem] mb-5"
          style={{ fontFamily: "'Fraunces', serif", color: tokens.ink, fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          Wear India's Space Story.
        </h1>
        <p className="text-[15px] md:text-[16px] mb-8" style={{ color: tokens.inkMuted, lineHeight: 1.7, maxWidth: "30rem" }}>
          Toys, apparel and collectibles inspired by India's journey into space. Nothing ships
          until a product crosses its interest goal — mark yours below and we'll email you the
          moment it unlocks.
        </p>
        <a
          href="#collection"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13.5px] transition-transform duration-200 hover:-translate-y-0.5"
          style={{ background: tokens.ink, color: tokens.paper, fontWeight: 500 }}
        >
          Browse the collection <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}

/* --------------------------------- Category tabs (mobile) --------------------------------- */
function CategoryTabsMobile({ categories, active, onChange }) {
  return (
    <div className="sm:hidden max-w-6xl mx-auto px-6 flex flex-wrap gap-2 mb-8">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className="px-3.5 py-1.5 rounded-full text-[13px] transition-colors duration-200"
          style={
            active === c
              ? { background: tokens.ink, color: tokens.paper }
              : { background: tokens.card, color: tokens.inkMuted, border: `1px solid ${tokens.line}` }
          }
        >
          {c}
        </button>
      ))}
    </div>
  );
}

/* --------------------------------- Product card --------------------------------- */
function ProductCard({ product, onOpenInterest }) {
  const [selectedSize, setSelectedSize] = useState(product.available_sizes?.[0] || null);
  const required = product.min_interest_required || 0;
  const count = product.interests_count || 0;
  const pct = required > 0 ? Math.min(100, Math.round((count / required) * 100)) : 0;
  const goalReached = !!product.is_threshold_reached;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-shadow duration-300"
      style={{ background: tokens.card, border: `1px solid ${goalReached ? tokens.accent : tokens.line}` }}
    >
      <div className="relative" style={{ height: 190, background: tokens.paperSoft }}>
        {product.thumbnail_url || product.images?.[0] ? (
          <img
            src={product.thumbnail_url || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Rocket size={32} style={{ color: tokens.inkFaint, transform: "rotate(45deg)" }} />
          </div>
        )}
        {product.is_new && (
          <span
            className="absolute top-3 left-3 text-[10.5px] px-2.5 py-1 rounded-full"
            style={{ background: product.color_accent || tokens.accent, color: "#fff", fontWeight: 600 }}
          >
            New drop
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] tracking-wide" style={{ color: tokens.inkFaint }}>
            {product.eyebrow || product.category || "Merchandise"}
          </span>
          <span className="text-[13px]" style={{ color: tokens.inkMuted }}>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
        </div>
        <h3 className="text-[14.5px] mb-1.5" style={{ color: tokens.ink, fontWeight: 500 }}>
          {product.name}
        </h3>
        {product.description && (
          <p className="text-[12.5px] mb-4 line-clamp-2" style={{ color: tokens.inkMuted, lineHeight: 1.55 }}>
            {product.description}
          </p>
        )}

        {required > 0 && (
          <div className="mb-4 mt-auto">
            <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: tokens.paperSoft }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(pct, count > 0 ? 3 : 0)}%`, background: goalReached ? tokens.success : tokens.accent }}
              />
            </div>
            <span className="text-[11.5px]" style={{ color: goalReached ? tokens.success : tokens.inkFaint }}>
              {goalReached ? "Goal reached — we're making this!" : `${count} of ${required} interested`}
            </span>
          </div>
        )}

        {product.available_sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.available_sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className="px-2.5 py-1 rounded-md text-[11.5px] transition-colors duration-200"
                style={
                  selectedSize === s
                    ? { background: tokens.ink, color: tokens.paper }
                    : { background: tokens.paperSoft, color: tokens.inkMuted, border: `1px solid ${tokens.line}` }
                }
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => onOpenInterest(product, selectedSize)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12.5px] transition-colors duration-200 w-full justify-center"
          style={{ background: "transparent", color: tokens.ink, border: `1px solid ${tokens.line}` }}
        >
          <Heart size={13} /> I'm interested
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- Interest modal --------------------------------- */
function InterestModal({ product, selectedSize, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        space_store_product_id: product.id,
        product_slug: product.slug,
        selected_size: selectedSize || undefined,
        quantity: 1,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(32,30,27,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full rounded-2xl p-7 relative"
        style={{ background: tokens.card, maxWidth: "26rem", border: `1px solid ${tokens.line}` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ color: tokens.inkMuted }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <Check size={22} style={{ color: tokens.accent, margin: "0 auto 14px" }} />
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: tokens.ink, marginBottom: 8 }}>
              Interest recorded
            </h3>
            <p className="text-[13.5px]" style={{ color: tokens.inkMuted, lineHeight: 1.6 }}>
              We'll email <strong style={{ color: tokens.ink }}>{form.email}</strong> the moment{" "}
              <strong style={{ color: tokens.ink }}>{product.name}</strong> unlocks
              {selectedSize ? ` in size ${selectedSize}` : ""}.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-full text-[13px]"
              style={{ background: tokens.ink, color: tokens.paper, fontWeight: 500 }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: tokens.ink, marginBottom: 6 }}>
              Register your interest
            </h3>
            <p className="text-[13px] mb-5" style={{ color: tokens.inkMuted, lineHeight: 1.6 }}>
              For <strong style={{ color: tokens.ink }}>{product.name}</strong>
              {selectedSize ? ` · size ${selectedSize}` : ""}. We'll only reach out about this drop.
            </p>

            {error && (
              <p className="text-[12.5px] mb-4 px-3 py-2 rounded-lg" style={{ background: "#F7E9E6", color: tokens.error }}>
                {error}
              </p>
            )}

            <div className="grid gap-3 mb-5">
              <input
                type="text"
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg text-[13.5px] outline-none"
                style={{ background: tokens.paperSoft, border: `1px solid ${tokens.line}`, color: tokens.ink }}
              />
              <input
                type="email"
                required
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg text-[13.5px] outline-none"
                style={{ background: tokens.paperSoft, border: `1px solid ${tokens.line}`, color: tokens.ink }}
              />
              <input
                type="tel"
                placeholder="Phone / WhatsApp (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg text-[13.5px] outline-none"
                style={{ background: tokens.paperSoft, border: `1px solid ${tokens.line}`, color: tokens.ink }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[13.5px]"
              style={{ background: tokens.ink, color: tokens.paper, fontWeight: 500, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Submitting…
                </>
              ) : (
                "Submit interest"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- states: loading / error / empty --------------------------------- */
function GridSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${tokens.line}` }}>
          <div style={{ height: 190, background: tokens.paperSoft }} />
          <div className="p-5 space-y-2.5">
            <div className="h-2.5 rounded" style={{ width: "40%", background: tokens.paperSoft }} />
            <div className="h-3.5 rounded" style={{ width: "70%", background: tokens.paperSoft }} />
            <div className="h-2.5 rounded" style={{ width: "90%", background: tokens.paperSoft }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 text-center py-16">
      <p className="text-[14px] mb-4" style={{ color: tokens.inkMuted }}>
        {message || "Couldn't load the collection right now."}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px]"
        style={{ border: `1px solid ${tokens.line}`, color: tokens.ink }}
      >
        <RefreshCw size={13} /> Try again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 text-center py-16">
      <p className="text-[14px]" style={{ color: tokens.inkMuted }}>
        No products in this category yet — check back soon.
      </p>
    </div>
  );
}

/* --------------------------------- App --------------------------------- */
export default function IndianSpaceHubStoreLive() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { products, loading, error, refetch, submitInterest } = useMerchandise(activeCategory);
  const [modalState, setModalState] = useState(null); // { product, size }

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [products]);

  return (
    <div style={{ background: tokens.paper, minHeight: "100%", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        @keyframes ish-live-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        a { text-decoration: none; }
        input:focus { border-color: ${tokens.accent} !important; }
      `}</style>

      <Nav categories={categories} active={activeCategory} onChange={setActiveCategory} />
      <Hero />

      <section id="collection" className="pb-24 md:pb-32">
        <CategoryTabsMobile categories={categories} active={activeCategory} onChange={setActiveCategory} />

        {loading && <GridSkeleton />}
        {!loading && error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && products.length === 0 && <EmptyState />}
        {!loading && !error && products.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 md:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenInterest={(product, size) => setModalState({ product, size })}
              />
            ))}
          </div>
        )}
      </section>

      <footer style={{ borderTop: `1px solid ${tokens.line}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Rocket size={14} style={{ color: tokens.accent, transform: "rotate(45deg)" }} strokeWidth={1.8} />
              <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: tokens.ink }}>
                Indian Space Hub Store
              </span>
            </div>
            <div className="flex items-center gap-6 text-[13px]" style={{ color: tokens.inkMuted }}>
              <a href="#" style={{ color: tokens.inkMuted }}>About</a>
              <a href="#" style={{ color: tokens.inkMuted }}>Privacy</a>
              <a href="#" style={{ color: tokens.inkMuted }}>Contact</a>
            </div>
            <span className="text-[12px]" style={{ color: tokens.inkFaint }}>
              © {new Date().getFullYear()} Indian Space Hub Store
            </span>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-7"
            style={{ borderTop: `1px solid ${tokens.line}` }}
          >
            <p className="text-[13px]" style={{ color: tokens.inkMuted }}>
              Also home to the Indian Space Hub app — ISRO missions, launches and space news.
            </p>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Get Indian Space Hub on Google Play">
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                style={{ height: 54, display: "block" }}
              />
            </a>
          </div>
        </div>
      </footer>

      {modalState && (
        <InterestModal
          product={modalState.product}
          selectedSize={modalState.size}
          onClose={() => setModalState(null)}
          onSubmit={submitInterest}
        />
      )}
    </div>
  );
}
