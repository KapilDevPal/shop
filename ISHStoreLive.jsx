import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Heart, Rocket, ArrowRight, Check, X, Loader2, RefreshCw, Search, Menu, Sparkles, ExternalLink } from "lucide-react";

/* ----------------------------------------------------------------------
   INDIAN SPACE HUB STORE — live catalog pulling real merchandise + interest
   data from the Rails API at indianspacehub.com, per the integration guide.
   Visitors browse products, optionally pick a size, and submit an interest
   vote (name, email, phone). Each product shows real progress toward the
   admin-configured minimum interest goal — no cart, no checkout.
   ---------------------------------------------------------------------- */

const API_BASE_URL = "https://indianspacehub.com/api";
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
function Nav({ categories, active, onChange, searchQuery, onSearchChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top Banner Announcement */}
      <div style={{ background: tokens.ink, color: tokens.paperSoft }} className="text-[11.5px] py-2 px-4 border-b border-stone-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium tracking-wide">
              Official Indian Space Hub Store · Live Pre-Registration Drops
            </span>
          </div>
          <a
            href="https://indianspacehub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 hover:text-amber-400 transition-colors text-[11px]"
          >
            Visit Main Hub <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* Main Glassmorphic Navbar */}
      <header
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          background: "rgba(246,244,239,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${tokens.line}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 h-18 py-3 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <a href="/" className="flex items-center gap-3 shrink-0 group">
            <div
              className="relative overflow-hidden rounded-xl border p-1 shadow-sm transition-transform duration-300 group-hover:scale-105"
              style={{ background: tokens.card, borderColor: tokens.line }}
            >
              <img src="/indian_space_hub_logo.png" alt="Indian Space Hub Logo" className="h-9 w-9 object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: tokens.ink, letterSpacing: "-0.02em" }}>
                  Indian Space Hub
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: tokens.accentSoft, color: tokens.accent, border: `1px solid ${tokens.accent}30` }}
                >
                  STORE
                </span>
              </div>
              <span className="text-[11px] hidden sm:block" style={{ color: tokens.inkMuted }}>
                Official ISRO Inspired Merchandise & Gear
              </span>
            </div>
          </a>

          {/* Desktop Category Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1 p-1 rounded-full border shadow-inner"
            style={{ background: tokens.paperSoft, borderColor: tokens.line }}
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => onChange(c)}
                className="px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200"
                style={
                  active === c
                    ? { background: tokens.ink, color: tokens.paper, boxShadow: "0 2px 8px rgba(32,30,27,0.15)" }
                    : { background: "transparent", color: tokens.inkMuted }
                }
              >
                {c}
              </button>
            ))}
          </nav>

          {/* Right Side Controls: Search & Mobile Menu */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 pointer-events-none" style={{ color: tokens.inkFaint }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 pr-7 py-1.5 rounded-full text-[12.5px] outline-none transition-all duration-200 w-36 sm:w-48 focus:w-56"
                style={{
                  background: tokens.card,
                  border: `1px solid ${tokens.line}`,
                  color: tokens.ink,
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 p-0.5 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl border flex items-center justify-center transition-colors"
              style={{ background: tokens.card, borderColor: tokens.line, color: tokens.ink }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden px-6 py-4 border-t space-y-3" style={{ background: tokens.card, borderColor: tokens.line }}>
            <span className="text-[11px] font-semibold uppercase tracking-wider block" style={{ color: tokens.inkFaint }}>
              Categories
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onChange(c);
                    setMobileOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors"
                  style={
                    active === c
                      ? { background: tokens.ink, color: tokens.paper }
                      : { background: tokens.paperSoft, color: tokens.inkMuted, border: `1px solid ${tokens.line}` }
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

/* --------------------------------- Hero --------------------------------- */
function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-8 pt-12 pb-12 md:pt-18 md:pb-16">
      <div className="max-w-2xl">
        <div
          className="inline-flex items-center gap-2 text-[12px] px-3.5 py-1.5 rounded-full mb-6 border"
          style={{ background: tokens.accentSoft, color: tokens.accent, borderColor: `${tokens.accent}30` }}
        >
          <Sparkles size={13} />
          <span className="font-semibold tracking-wide uppercase text-[10.5px]">Community Powered Store</span>
        </div>
        <h1
          className="text-[2.2rem] leading-[1.12] sm:text-4xl md:text-[2.85rem] mb-5"
          style={{ fontFamily: "'Fraunces', serif", color: tokens.ink, fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          Wear India's Space Story.
        </h1>
        <p className="text-[15px] md:text-[16.5px] mb-8" style={{ color: tokens.inkMuted, lineHeight: 1.7, maxWidth: "33rem" }}>
          Explore ISRO-inspired apparel, scale model launch vehicles, and stargazing gear. Products unlock for production and shipping as soon as community interest goals are reached.
        </p>
        <a
          href="#collection"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13.5px] font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
          style={{ background: tokens.ink, color: tokens.paper }}
        >
          Explore Collection <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}

/* --------------------------------- Category tabs (mobile) --------------------------------- */
function CategoryTabsMobile({ categories, active, onChange }) {
  return (
    <div className="lg:hidden max-w-6xl mx-auto px-6 flex flex-wrap gap-2 mb-8">
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
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg"
      style={{ background: tokens.card, border: `1px solid ${goalReached ? tokens.accent : tokens.line}` }}
    >
      <div className="relative" style={{ height: 210, background: tokens.paperSoft }}>
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
            className="absolute top-3 left-3 text-[10.5px] px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{ background: product.color_accent || tokens.accent, color: "#fff", fontWeight: 700 }}
          >
            New drop
          </span>
        )}
        <span
          className="absolute top-3 right-3 text-[10.5px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider shadow-sm"
          style={{ background: tokens.card, color: tokens.accent, border: `1px solid ${tokens.accent}40` }}
        >
          ⚡ +299 XP
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] tracking-wide font-semibold uppercase" style={{ color: tokens.inkFaint }}>
            {product.eyebrow || product.category || "Merchandise"}
          </span>
          <span className="text-[14px] font-bold" style={{ color: tokens.ink }}>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
        </div>
        <h3 className="text-[15px] mb-1.5" style={{ color: tokens.ink, fontWeight: 600 }}>
          {product.name}
        </h3>
        {product.description && (
          <p className="text-[12.5px] mb-4 line-clamp-2" style={{ color: tokens.inkMuted, lineHeight: 1.55 }}>
            {product.description}
          </p>
        )}

        {required > 0 && (
          <div className="mb-4 mt-auto p-3 rounded-xl border" style={{ background: tokens.paperSoft, borderColor: tokens.line }}>
            <div className="flex items-center justify-between text-[11.5px] font-semibold mb-1.5" style={{ color: tokens.ink }}>
              <span>Target Interest Goal</span>
              <span>{count} / {required} votes ({pct}%)</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background: "#E2DCD0" }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%`, background: goalReached ? tokens.success : tokens.accent }}
              />
            </div>
            <span className="text-[11px] block" style={{ color: goalReached ? tokens.success : tokens.inkMuted }}>
              {goalReached ? "🎉 Goal reached — production initiated!" : `Need ${required - count} more interest votes to unlock shipping.`}
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
                className="px-2.5 py-1 rounded-md text-[11.5px] font-medium transition-colors duration-200"
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium transition-all duration-200 w-full justify-center shadow-sm hover:shadow"
          style={{ background: tokens.ink, color: tokens.paper }}
        >
          <Heart size={14} className="fill-current text-rose-400" /> Express Interest
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
      className="fixed inset-0 z-50 flex items-center justify-center p-5 backdrop-blur-sm"
      style={{ background: "rgba(32,30,27,0.55)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full rounded-2xl p-7 relative shadow-2xl"
        style={{ background: tokens.card, maxWidth: "26rem", border: `1px solid ${tokens.line}` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-stone-100"
          style={{ color: tokens.inkMuted }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Check size={24} />
            </div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: tokens.ink, marginBottom: 8 }}>
              Interest Registered 🚀
            </h3>
            <p className="text-[13.5px]" style={{ color: tokens.inkMuted, lineHeight: 1.6 }}>
              Thank you! We'll email <strong style={{ color: tokens.ink }}>{form.email}</strong> as soon as{" "}
              <strong style={{ color: tokens.ink }}>{product.name}</strong> passes its interest goal
              {selectedSize ? ` for size ${selectedSize}` : ""}.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-full text-[13px] font-semibold"
              style={{ background: tokens.ink, color: tokens.paper }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: tokens.ink, marginBottom: 6 }}>
              Register Your Interest
            </h3>
            <p className="text-[13px] mb-5" style={{ color: tokens.inkMuted, lineHeight: 1.6 }}>
              Help unlock <strong style={{ color: tokens.ink }}>{product.name}</strong>
              {selectedSize ? ` (Size ${selectedSize})` : ""}. You'll be notified when pre-orders open.
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
                placeholder="Full name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-[13.5px] outline-none border"
                style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }}
              />
              <input
                type="email"
                required
                placeholder="Email address *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-[13.5px] outline-none border"
                style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }}
              />
              <input
                type="tel"
                placeholder="Phone / WhatsApp (optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-[13.5px] outline-none border"
                style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[13.5px] font-semibold"
              style={{ background: tokens.ink, color: tokens.paper, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Submitting…
                </>
              ) : (
                "Submit Interest Vote"
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
          <div style={{ height: 210, background: tokens.paperSoft }} />
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
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium"
        style={{ border: `1px solid ${tokens.line}`, color: tokens.ink }}
      >
        <RefreshCw size={13} /> Try again
      </button>
    </div>
  );
}

function EmptyState({ searchQuery }) {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 text-center py-16">
      <p className="text-[14px]" style={{ color: tokens.inkMuted }}>
        {searchQuery ? `No products matching "${searchQuery}".` : "No products in this category yet — check back soon."}
      </p>
    </div>
  );
}

/* --------------------------------- App --------------------------------- */
export default function IndianSpaceHubStoreLive() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { products, loading, error, refetch, submitInterest } = useMerchandise(activeCategory);
  const [modalState, setModalState] = useState(null); // { product, size }

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <div style={{ background: tokens.paper, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes ish-live-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        a { text-decoration: none; }
        input:focus { border-color: ${tokens.accent} !important; }
      `}</style>

      <Nav
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Hero />

      <section id="collection" className="pb-24 md:pb-32">
        <CategoryTabsMobile categories={categories} active={activeCategory} onChange={setActiveCategory} />

        {searchQuery && (
          <div className="max-w-6xl mx-auto px-6 md:px-8 mb-6 flex items-center justify-between text-[13px]" style={{ color: tokens.inkMuted }}>
            <span>Showing results for "<strong>{searchQuery}</strong>" ({filteredProducts.length} items)</span>
            <button onClick={() => setSearchQuery("")} className="underline text-stone-500 hover:text-stone-800">
              Clear search
            </button>
          </div>
        )}

        {loading && <GridSkeleton />}
        {!loading && error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && filteredProducts.length === 0 && <EmptyState searchQuery={searchQuery} />}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 md:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((p) => (
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
            <div className="flex items-center gap-2.5">
              <img src="/indian_space_hub_logo.png" alt="Indian Space Hub Logo" className="h-6 w-6 object-contain" />
              <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: tokens.ink }}>
                Indian Space Hub Store
              </span>
            </div>
            <div className="flex items-center gap-6 text-[13px]" style={{ color: tokens.inkMuted }}>
              <a href="https://indianspacehub.com" target="_blank" rel="noopener noreferrer" style={{ color: tokens.inkMuted }}>
                About Hub
              </a>
              <a href="/llms.txt" target="_blank" style={{ color: tokens.inkMuted }}>
                LLM Info
              </a>
              <a href="/sitemap.xml" target="_blank" style={{ color: tokens.inkMuted }}>
                Sitemap
              </a>
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
