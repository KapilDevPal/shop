import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Check, Loader2, X, RefreshCw, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import Nav from "../components/Nav.jsx";
import ProductJsonLd from "../components/ProductJsonLd.jsx";
import { InterestModal } from "../components/ProductCard.jsx";
import { useProduct } from "../hooks/useMerchandise.js";
import { tokens, PLAY_STORE_URL } from "../tokens.js";

/** Dynamically update document <title> and meta description */
function useSeoMeta({ title, description, image, url }) {
  useEffect(() => {
    if (title) document.title = title;
    const setMeta = (name, content, prop = false) => {
      const sel = prop
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let el = document.querySelector(sel);
      if (!el) {
        el = document.createElement("meta");
        prop ? el.setAttribute("property", name) : el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, true);
      setMeta("twitter:description", description);
    }
    if (title) {
      setMeta("og:title", title, true);
      setMeta("twitter:title", title);
    }
    if (image) {
      setMeta("og:image", image, true);
      setMeta("twitter:image", image);
    }
    if (url) {
      setMeta("og:url", url, true);
      let canonical = document.querySelector("link[rel='canonical']");
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", url);
    }
  }, [title, description, image, url]);
}

/** Gallery carousel for multiple product images */
function Gallery({ images, name }) {
  const [idx, setIdx] = useState(0);
  const list = images?.length ? images : [];
  const prev = () => setIdx((i) => (i - 1 + list.length) % list.length);
  const next = () => setIdx((i) => (i + 1) % list.length);

  if (!list.length) {
    return (
      <div className="w-full rounded-2xl flex items-center justify-center text-6xl"
        style={{ height: 380, background: tokens.paperSoft }}>🚀</div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: tokens.paperSoft }}>
      <img src={list[idx]} alt={`${name} — image ${idx + 1}`}
        className="w-full object-cover" style={{ height: 380 }} />
      {list.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow"
            style={{ background: "rgba(255,255,255,0.85)" }}>
            <ChevronLeft size={18} style={{ color: tokens.ink }} />
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow"
            style={{ background: "rgba(255,255,255,0.85)" }}>
            <ChevronRight size={18} style={{ color: tokens.ink }} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {list.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === idx ? tokens.ink : tokens.inkFaint }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Related product mini-card */
function RelatedCard({ product }) {
  return (
    <Link to={`/product/${product.slug}`}
      className="flex gap-3 p-3 rounded-xl border transition-all hover:shadow-sm"
      style={{ background: tokens.card, borderColor: tokens.line }}>
      <div className="rounded-lg overflow-hidden shrink-0" style={{ width: 56, height: 56, background: tokens.paperSoft }}>
        {product.thumbnail_url || product.images?.[0] ? (
          <img src={product.thumbnail_url || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : <div className="w-full h-full flex items-center justify-center text-xl">🚀</div>}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold line-clamp-2" style={{ color: tokens.ink }}>{product.name}</p>
        <p className="text-[12px] font-bold mt-0.5" style={{ color: tokens.accent }}>
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>
      </div>
    </Link>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, related, loading, error, submitInterest } = useProduct(slug);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Set size default when product loads
  useEffect(() => {
    if (product?.available_sizes?.length) {
      setSelectedSize(product.available_sizes[0]);
    }
  }, [product]);

  const safeSlug = encodeURI(slug || "");
  const canonicalUrl = `https://shop.indianspacehub.com/#/product/${safeSlug}`;

  // Dynamic SEO
  useSeoMeta({
    title: product
      ? `${product.seo_title || product.name} | Indian Space Hub Store`
      : "Loading… | Indian Space Hub Store",
    description: product
      ? product.seo_description || product.description || `Buy ${product.name} at Indian Space Hub Store.`
      : "",
    image: product?.thumbnail_url || product?.images?.[0] || "",
    url: canonicalUrl,
  });

  const handleShare = async () => {
    const url = canonicalUrl;
    if (navigator.share) {
      await navigator.share({ title: product?.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const required = product?.min_interest_required || 0;
  const count = product?.interests_count || 0;
  const pct = required > 0 ? Math.min(100, Math.round((count / required) * 100)) : 0;
  const goalReached = !!product?.is_threshold_reached;

  return (
    <div style={{ background: tokens.paper, minHeight: "100vh" }}>
      <Nav />

      {/* Inject Google Shopping JSON-LD */}
      {product && <ProductJsonLd product={product} />}

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] mb-8" aria-label="Breadcrumb"
          style={{ color: tokens.inkMuted }}>
          <Link to="/" className="hover:text-stone-800 transition-colors" style={{ color: tokens.inkMuted }}>
            Store
          </Link>
          <span>/</span>
          {product && (
            <>
              <span style={{ color: tokens.inkMuted }}>{product.category || "Merchandise"}</span>
              <span>/</span>
              <span style={{ color: tokens.ink, fontWeight: 500 }} className="line-clamp-1">{product.name}</span>
            </>
          )}
        </nav>

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="rounded-2xl animate-pulse" style={{ height: 380, background: tokens.paperSoft }} />
            <div className="space-y-4 pt-4">
              {[40, 70, 90, 55, 30].map((w, i) => (
                <div key={i} className="h-4 rounded animate-pulse" style={{ width: `${w}%`, background: tokens.paperSoft }} />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-24">
            <p className="text-[15px] mb-6" style={{ color: tokens.inkMuted }}>{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium"
                style={{ border: `1px solid ${tokens.line}`, color: tokens.ink }}>
                <ArrowLeft size={14} /> Go Back
              </button>
              <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium"
                style={{ background: tokens.ink, color: tokens.paper }}>
                Browse All Products
              </Link>
            </div>
          </div>
        )}

        {/* Product Detail */}
        {!loading && product && (
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* LEFT: Gallery */}
            <div className="sticky top-24">
              <Gallery images={product.images || [product.thumbnail_url].filter(Boolean)} name={product.name} />

              {/* Thumbnails */}
              {(product.images?.length || 0) > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <img key={i} src={img} alt={`${product.name} view ${i + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border shrink-0 cursor-pointer hover:opacity-100 transition-opacity"
                      style={{ borderColor: tokens.line, opacity: 0.75 }} />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Info */}
            <div>
              {/* Category + badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[11.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: tokens.accentSoft, color: tokens.accent }}>
                  {product.eyebrow || product.category || "Merchandise"}
                </span>
                {product.is_new && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: product.color_accent || tokens.accent, color: "#fff" }}>
                    New Drop
                  </span>
                )}
                {goalReached && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: tokens.success, color: "#fff" }}>
                    🎉 Goal Reached
                  </span>
                )}
              </div>

              {/* Name */}
              <h1
                className="text-[1.7rem] leading-[1.15] md:text-[2rem] mb-3"
                style={{ fontFamily: "'Fraunces', serif", color: tokens.ink, fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {product.name}
              </h1>

              {/* Price + share */}
              <div className="flex items-center gap-4 mb-5">
                <span className="text-[28px] font-black" style={{ color: tokens.ink }}>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                <span className="text-[12px] px-2.5 py-1 rounded-full" style={{ background: tokens.paperSoft, color: tokens.inkMuted }}>
                  {product.currency || "INR"}
                </span>
                <button onClick={handleShare}
                  className="ml-auto inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border transition-all"
                  style={{ borderColor: tokens.line, color: tokens.inkMuted }}>
                  <Share2 size={13} /> {copied ? "Copied!" : "Share"}
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-[14.5px] mb-6" style={{ color: tokens.inkMuted, lineHeight: 1.75 }}>
                  {product.description}
                </p>
              )}
              {product.back_description && (
                <p className="text-[14px] mb-6 pt-4 border-t" style={{ color: tokens.inkMuted, lineHeight: 1.7, borderColor: tokens.line }}>
                  {product.back_description}
                </p>
              )}

              {/* Interest progress */}
              {required > 0 && (
                <div className="mb-6 p-4 rounded-2xl border" style={{ background: tokens.accentSoft, borderColor: `${tokens.accent}30` }}>
                  <div className="flex items-center justify-between text-[13px] font-bold mb-2" style={{ color: tokens.ink }}>
                    <span>🎯 Community Interest Goal</span>
                    <span>{count} / {required} votes ({pct}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden mb-2" style={{ background: "#E2DCD0" }}>
                    <div className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%`, background: goalReached ? tokens.success : tokens.accent }} />
                  </div>
                  <p className="text-[12px]" style={{ color: tokens.ink }}>
                    {goalReached
                      ? "🎉 Interest threshold reached! Pre-orders are now unlocking."
                      : `This drop needs ${required - count} more interest votes before we initiate production. Register yours below!`}
                  </p>
                </div>
              )}

              {/* Size selector */}
              {product.available_sizes?.length > 0 && (
                <div className="mb-6">
                  <p className="text-[13px] font-bold mb-3" style={{ color: tokens.ink }}>
                    Select Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map((s) => (
                      <button key={s} onClick={() => setSelectedSize(s)}
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-[13px] font-bold border transition-all duration-200"
                        style={selectedSize === s
                          ? { background: tokens.ink, color: tokens.paper, borderColor: tokens.ink, boxShadow: "0 2px 8px rgba(32,30,27,0.2)" }
                          : { background: tokens.card, color: tokens.inkMuted, borderColor: tokens.line }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand + Brand tag */}
              {product.brand && (
                <p className="text-[12.5px] mb-6" style={{ color: tokens.inkMuted }}>
                  Brand: <span className="font-semibold" style={{ color: tokens.ink }}>{product.brand}</span>
                </p>
              )}

              {/* CTA */}
              <button
                onClick={() => setShowModal(true)}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full text-[15px] font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: tokens.ink, color: tokens.paper }}
              >
                <Heart size={18} className="fill-current text-rose-400" />
                Express Interest{selectedSize ? ` — Size ${selectedSize}` : ""}
              </button>

              {/* External buy link if threshold reached */}
              {goalReached && product.external_purchase_link && (
                <a href={product.external_purchase_link} target="_blank" rel="noopener noreferrer"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-[14px] font-bold border transition-all duration-200"
                  style={{ borderColor: tokens.success, color: tokens.success }}>
                  Buy Now → Goal Unlocked
                </a>
              )}

              {/* Product details list */}
              <div className="mt-8 border-t pt-6 grid gap-3" style={{ borderColor: tokens.line }}>
                <h3 className="text-[13px] font-bold uppercase tracking-wider" style={{ color: tokens.inkFaint }}>
                  Product Details
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                  {product.brand && <><dt style={{ color: tokens.inkMuted }}>Brand</dt><dd style={{ color: tokens.ink, fontWeight: 500 }}>{product.brand}</dd></>}
                  {product.category && <><dt style={{ color: tokens.inkMuted }}>Category</dt><dd style={{ color: tokens.ink, fontWeight: 500 }}>{product.category}</dd></>}
                  {product.slug && <><dt style={{ color: tokens.inkMuted }}>SKU</dt><dd style={{ color: tokens.ink, fontWeight: 500 }}>{product.slug}</dd></>}
                  <dt style={{ color: tokens.inkMuted }}>Condition</dt><dd style={{ color: tokens.ink, fontWeight: 500 }}>New</dd>
                  <dt style={{ color: tokens.inkMuted }}>Ships To</dt><dd style={{ color: tokens.ink, fontWeight: 500 }}>India 🇮🇳</dd>
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Related products */}
        {!loading && related.length > 0 && (
          <section className="mt-16 pt-10 border-t" style={{ borderColor: tokens.line }}>
            <h2 className="text-[20px] mb-6" style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: tokens.ink }}>
              You Might Also Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.slice(0, 6).map((p) => <RelatedCard key={p.id || p.slug} product={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-24" style={{ borderTop: `1px solid ${tokens.line}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px]" style={{ color: tokens.inkMuted }}>
          <div className="flex items-center gap-2.5">
            <img src="/indian_space_hub_logo.png" alt="Logo" className="h-5 w-5 object-contain" />
            <span style={{ fontFamily: "'Fraunces', serif", color: tokens.ink }}>Indian Space Hub Store</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="mailto:crew@indianspacehub.com" style={{ color: tokens.inkMuted }}>crew@indianspacehub.com</a>
            <Link to="/privacy" style={{ color: tokens.inkMuted }}>Privacy</Link>
            <Link to="/" style={{ color: tokens.inkMuted }}>← All Products</Link>
          </div>
          <span className="text-[12px]" style={{ color: tokens.inkFaint }}>© {new Date().getFullYear()} Indian Space Hub</span>
        </div>
      </footer>

      {showModal && product && (
        <InterestModal
          product={product}
          selectedSize={selectedSize}
          onClose={() => setShowModal(false)}
          onSubmit={submitInterest}
        />
      )}
    </div>
  );
}
