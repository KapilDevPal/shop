import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, ExternalLink, Instagram, Linkedin } from "lucide-react";
import { tokens } from "../tokens.js";

export const INSTAGRAM_URL = "https://www.instagram.com/isro.unoffical";
export const LINKEDIN_URL = "https://www.linkedin.com/company/isro-indian-space-hub/";

export default function Nav({ categories = [], active = "All", onChange, searchQuery = "", onSearchChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {/* Top Announcement Bar */}
      <div
        style={{ background: tokens.ink, color: tokens.paperSoft }}
        className="text-[11.5px] py-1.5 px-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 shrink-0 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium tracking-wide truncate">
              Indian Space Hub · The New Era of Indian Space
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <span className="text-white/40">|</span>
            <a
              href="https://indianspacehub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors text-[11px]"
            >
              Main Hub <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Responsive Navbar */}
      <header
        className="sticky top-0 z-40 transition-all duration-200"
        style={{
          background: "rgba(246,244,239,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${tokens.line}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-2.5 flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group min-w-0">
            <div
              className="relative overflow-hidden rounded-xl border p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0"
              style={{ background: tokens.card, borderColor: tokens.line }}
            >
              <img
                src="/indian_space_hub_logo.png"
                alt="Indian Space Hub Logo"
                className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: tokens.ink,
                    letterSpacing: "-0.02em",
                  }}
                  className="truncate"
                >
                  Indian Space Hub
                </span>
                <span
                  className="px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shrink-0"
                  style={{
                    background: tokens.accentSoft,
                    color: tokens.accent,
                    border: `1px solid ${tokens.accent}30`,
                  }}
                >
                  STORE
                </span>
              </div>
              <span className="text-[10.5px] hidden md:block" style={{ color: tokens.inkMuted }}>
                The New Era of Indian Space · Wear India's Space Story
              </span>
            </div>
          </Link>

          {/* Desktop Category Navigation Pills (Only on Home) */}
          {isHome && categories.length > 0 && (
            <nav
              className="hidden lg:flex items-center gap-1 p-1 rounded-full border shadow-inner"
              style={{ background: tokens.paperSoft, borderColor: tokens.line }}
            >
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => onChange?.(c)}
                  className="px-3.5 py-1 rounded-full text-[12px] font-medium transition-all duration-200"
                  style={
                    active === c
                      ? {
                          background: tokens.ink,
                          color: tokens.paper,
                          boxShadow: "0 2px 8px rgba(32,30,27,0.15)",
                        }
                      : { background: "transparent", color: tokens.inkMuted }
                  }
                >
                  {c}
                </button>
              ))}
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search Input (Desktop) */}
            {isHome && (
              <div className="hidden sm:flex relative items-center">
                <Search
                  size={14}
                  className="absolute left-3 pointer-events-none"
                  style={{ color: tokens.inkFaint }}
                />
                <input
                  type="text"
                  placeholder="Search store..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-8 pr-7 py-1.5 rounded-full text-[12px] outline-none transition-all duration-200 w-36 md:w-44 lg:w-48 focus:w-56 border"
                  style={{
                    background: tokens.card,
                    borderColor: tokens.line,
                    color: tokens.ink,
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange?.("")}
                    className="absolute right-2.5 p-0.5 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            )}

            {/* Mobile Search Toggle Button */}
            {isHome && (
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="sm:hidden p-2 rounded-xl border flex items-center justify-center transition-colors"
                style={{ background: tokens.card, borderColor: tokens.line, color: tokens.ink }}
                aria-label="Toggle search"
              >
                <Search size={16} />
              </button>
            )}

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-3 text-[12.5px] ml-1" style={{ color: tokens.inkMuted }}>
              <Link to="/refund-policy" className="hover:text-stone-900 transition-colors">Return Policy</Link>
              <Link to="/contact" className="hover:text-stone-900 transition-colors">Contact</Link>
              <Link to="/privacy" className="hover:text-stone-900 transition-colors">Privacy</Link>
            </div>

            {/* Mobile Navigation Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl border flex items-center justify-center"
              style={{ background: tokens.card, borderColor: tokens.line, color: tokens.ink }}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Expanded Search Bar */}
        {isHome && showMobileSearch && (
          <div className="sm:hidden px-4 py-2 border-t" style={{ background: tokens.card, borderColor: tokens.line }}>
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 pointer-events-none" style={{ color: tokens.inkFaint }} />
              <input
                type="text"
                autoFocus
                placeholder="Search ISRO t-shirts, scale models, telescopes..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-8 pr-8 py-2 rounded-xl text-[13px] outline-none border"
                style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange?.("")}
                  className="absolute right-2.5"
                >
                  <X size={14} style={{ color: tokens.inkFaint }} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div
            className="lg:hidden px-5 py-4 border-t space-y-4 shadow-xl"
            style={{ background: tokens.card, borderColor: tokens.line }}
          >
            {/* Mobile Categories */}
            {isHome && categories.length > 0 && (
              <div>
                <span
                  className="text-[11px] font-bold uppercase tracking-wider block mb-2"
                  style={{ color: tokens.inkFaint }}
                >
                  Filter Categories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onChange?.(c);
                        setMobileOpen(false);
                      }}
                      className="px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors"
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

            {/* Mobile Nav Links */}
            <div className="pt-3 border-t grid gap-2.5 text-[13.5px] font-medium" style={{ borderColor: tokens.line }}>
              <Link to="/refund-policy" onClick={() => setMobileOpen(false)} style={{ color: tokens.ink }}>
                Return & Refund Policy
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} style={{ color: tokens.ink }}>
                Contact Support
              </Link>
              <Link to="/privacy" onClick={() => setMobileOpen(false)} style={{ color: tokens.ink }}>
                Privacy Policy
              </Link>
            </div>

            {/* Mobile Social Links & Tagline */}
            <div className="pt-3 border-t flex items-center justify-between gap-3 text-[12px]" style={{ borderColor: tokens.line, color: tokens.inkMuted }}>
              <span className="italic">The New Era of Indian Space</span>
              <div className="flex items-center gap-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-1.5 rounded-lg border hover:bg-stone-100 transition-colors"
                  style={{ borderColor: tokens.line, color: tokens.ink }}
                >
                  <Instagram size={15} />
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-1.5 rounded-lg border hover:bg-stone-100 transition-colors"
                  style={{ borderColor: tokens.line, color: tokens.ink }}
                >
                  <Linkedin size={15} />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
