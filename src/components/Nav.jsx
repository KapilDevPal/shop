import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Rocket, Search, Menu, X, ExternalLink, Sparkles } from "lucide-react";
import { tokens } from "../tokens.js";

export default function Nav({ categories = [], active = "All", onChange, searchQuery = "", onSearchChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {/* Announcement Bar */}
      <div
        style={{ background: tokens.ink, color: tokens.paperSoft }}
        className="text-[11.5px] py-2 px-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
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

      {/* Main Navbar */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(246,244,239,0.94)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${tokens.line}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div
              className="relative overflow-hidden rounded-xl border p-1 shadow-sm transition-transform duration-300 group-hover:scale-105"
              style={{ background: tokens.card, borderColor: tokens.line }}
            >
              <img
                src="/indian_space_hub_logo.png"
                alt="Indian Space Hub Logo"
                className="h-9 w-9 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: tokens.ink,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Indian Space Hub
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: tokens.accentSoft,
                    color: tokens.accent,
                    border: `1px solid ${tokens.accent}30`,
                  }}
                >
                  STORE
                </span>
              </div>
              <span className="text-[11px] hidden sm:block" style={{ color: tokens.inkMuted }}>
                Official ISRO Inspired Merchandise & Gear
              </span>
            </div>
          </Link>

          {/* Desktop Category Tabs — only on home */}
          {isHome && categories.length > 0 && (
            <nav
              className="hidden lg:flex items-center gap-1 p-1 rounded-full border shadow-inner"
              style={{ background: tokens.paperSoft, borderColor: tokens.line }}
            >
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => onChange?.(c)}
                  className="px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200"
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

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {isHome && (
              <div className="relative flex items-center">
                <Search
                  size={14}
                  className="absolute left-3 pointer-events-none"
                  style={{ color: tokens.inkFaint }}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-8 pr-7 py-1.5 rounded-full text-[12.5px] outline-none transition-all duration-200 w-36 sm:w-48 focus:w-56"
                  style={{
                    background: tokens.card,
                    border: `1px solid ${tokens.line}`,
                    color: tokens.ink,
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange?.("")}
                    className="absolute right-2.5"
                  >
                    <X size={12} style={{ color: tokens.inkFaint }} />
                  </button>
                )}
              </div>
            )}

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-3 text-[13px]" style={{ color: tokens.inkMuted }}>
              <Link to="/contact" style={{ color: tokens.inkMuted }} className="hover:text-stone-900 transition-colors">Contact</Link>
              <Link to="/privacy" style={{ color: tokens.inkMuted }} className="hover:text-stone-900 transition-colors">Privacy</Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl border flex items-center justify-center"
              style={{ background: tokens.card, borderColor: tokens.line, color: tokens.ink }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            className="lg:hidden px-6 py-4 border-t space-y-4"
            style={{ background: tokens.card, borderColor: tokens.line }}
          >
            {isHome && categories.length > 0 && (
              <>
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider block"
                  style={{ color: tokens.inkFaint }}
                >
                  Categories
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => { onChange?.(c); setMobileOpen(false); }}
                      className="px-3.5 py-1.5 rounded-full text-[13px] font-medium"
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
              </>
            )}
            <div className="flex gap-4 text-[13px] pt-1 border-t" style={{ borderColor: tokens.line, color: tokens.inkMuted }}>
              <Link to="/contact" onClick={() => setMobileOpen(false)} style={{ color: tokens.inkMuted }}>Contact</Link>
              <Link to="/privacy" onClick={() => setMobileOpen(false)} style={{ color: tokens.inkMuted }}>Privacy</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
