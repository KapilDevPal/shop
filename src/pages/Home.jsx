import React, { useState, useMemo } from "react";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import Nav from "../components/Nav.jsx";
import { ProductCard, InterestModal } from "../components/ProductCard.jsx";
import { useMerchandise } from "../hooks/useMerchandise.js";
import { tokens, PLAY_STORE_URL } from "../tokens.js";

function GridSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${tokens.line}` }}>
          <div className="animate-pulse" style={{ height: 210, background: tokens.paperSoft }} />
          <div className="p-5 space-y-2.5">
            <div className="h-2.5 rounded animate-pulse" style={{ width: "40%", background: tokens.paperSoft }} />
            <div className="h-3.5 rounded animate-pulse" style={{ width: "70%", background: tokens.paperSoft }} />
            <div className="h-2.5 rounded animate-pulse" style={{ width: "90%", background: tokens.paperSoft }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { products, loading, error, refetch, submitInterest } = useMerchandise(activeCategory);
  const [modalState, setModalState] = useState(null);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
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
    <div style={{ background: tokens.paper, minHeight: "100vh" }}>
      <Nav
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pt-12 pb-12 md:pt-16 md:pb-14">
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
          <p className="text-[15px] md:text-[16px] mb-8" style={{ color: tokens.inkMuted, lineHeight: 1.7, maxWidth: "33rem" }}>
            ISRO-inspired apparel, scale model launch vehicles, and stargazing gear. Products unlock once community interest goals are reached.
          </p>
          <a href="#collection"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13.5px] font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            style={{ background: tokens.ink, color: tokens.paper }}>
            Explore Collection <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* Product grid */}
      <section id="collection" className="pb-24 md:pb-32">
        {/* Mobile category tabs */}
        <div className="lg:hidden max-w-6xl mx-auto px-6 flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className="px-3.5 py-1.5 rounded-full text-[13px] transition-colors duration-200"
              style={activeCategory === c
                ? { background: tokens.ink, color: tokens.paper }
                : { background: tokens.card, color: tokens.inkMuted, border: `1px solid ${tokens.line}` }}>
              {c}
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="max-w-6xl mx-auto px-6 md:px-8 mb-6 flex items-center justify-between text-[13px]" style={{ color: tokens.inkMuted }}>
            <span>Results for "<strong>{searchQuery}</strong>" ({filtered.length} items)</span>
            <button onClick={() => setSearchQuery("")} className="underline">Clear</button>
          </div>
        )}

        {loading && <GridSkeleton />}
        {!loading && error && (
          <div className="max-w-6xl mx-auto px-6 md:px-8 text-center py-16">
            <p className="text-[14px] mb-4" style={{ color: tokens.inkMuted }}>{error}</p>
            <button onClick={refetch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium"
              style={{ border: `1px solid ${tokens.line}`, color: tokens.ink }}>
              <RefreshCw size={13} /> Try again
            </button>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="max-w-6xl mx-auto px-6 md:px-8 text-center py-16">
            <p className="text-[14px]" style={{ color: tokens.inkMuted }}>
              {searchQuery ? `No products matching "${searchQuery}".` : "No products in this category yet — check back soon."}
            </p>
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 md:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onOpenInterest={(product, size) => setModalState({ product, size })} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${tokens.line}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src="/indian_space_hub_logo.png" alt="Indian Space Hub Logo" className="h-6 w-6 object-contain" />
              <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 15, color: tokens.ink }}>
                Indian Space Hub Store
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-[13px]" style={{ color: tokens.inkMuted }}>
              <a href="mailto:crew@indianspacehub.com" style={{ color: tokens.inkMuted }}>crew@indianspacehub.com</a>
              <a href="/#/refund-policy" style={{ color: tokens.inkMuted }}>Return Policy</a>
              <a href="/#/contact" style={{ color: tokens.inkMuted }}>Contact</a>
              <a href="/#/privacy" style={{ color: tokens.inkMuted }}>Privacy</a>
              <a href="/sitemap.xml" target="_blank" style={{ color: tokens.inkMuted }}>Sitemap</a>
            </div>
            <span className="text-[12px]" style={{ color: tokens.inkFaint }}>
              © {new Date().getFullYear()} Indian Space Hub
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-7" style={{ borderTop: `1px solid ${tokens.line}` }}>
            <p className="text-[13px]" style={{ color: tokens.inkMuted }}>
              Also home to the Indian Space Hub app — ISRO missions, launches and space news.
            </p>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" aria-label="Get Indian Space Hub on Google Play">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play" style={{ height: 54, display: "block" }} />
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
