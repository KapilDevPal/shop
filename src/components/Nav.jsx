import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, ExternalLink, Instagram, Linkedin, ShieldCheck, Mail, Lock, RotateCcw } from "lucide-react";
import { tokens } from "../tokens.js";

export const INSTAGRAM_URL = "https://www.instagram.com/isro.unoffical";
export const LINKEDIN_URL = "https://www.linkedin.com/company/isro-indian-space-hub/";

export default function Nav({ categories = [], active = "All", onChange, searchQuery = "", onSearchChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {/* Top Announcement Bar */}
      <div
        style={{ background: tokens.ink, color: tokens.paperSoft }}
        className="text-[11px] sm:text-[11.5px] py-1.5 px-3 sm:px-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 shrink-0 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-medium tracking-wide truncate">
              Indian Space Hub · The New Era of Indian Space
            </span>
          </div>
          <a
            href="https://indianspacehub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 hover:text-amber-400 transition-colors text-[11px] shrink-0"
          >
            Main Hub <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* Main Responsive Header */}
      <header
        className="sticky top-0 z-40 transition-all duration-200"
        style={{
          background: "rgba(246,244,239,0.96)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${tokens.line}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8 py-2.5 flex items-center justify-between gap-2 overflow-hidden">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-2 shrink min-w-0 group">
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
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: tokens.ink,
                    letterSpacing: "-0.02em",
                  }}
                  className="truncate sm:text-[1.1rem]"
                >
                  Indian Space Hub
                </span>
                <span
                  className="px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wider shrink-0"
                  style={{
                    background: tokens.accentSoft,
                    color: tokens.accent,
                    border: `1px solid ${tokens.accent}30`,
                  }}
                >
                  STORE
                </span>
              </div>
              <span className="text-[10px] hidden xl:block" style={{ color: tokens.inkMuted }}>
                The New Era of Indian Space · Wear India's Space Story
              </span>
            </div>
          </Link>

          {/* Desktop Category Navigation Pills (XL Screens only) */}
          {isHome && categories.length > 0 && (
            <nav
              className="hidden xl:flex items-center gap-1 p-1 rounded-full border shadow-inner shrink-0"
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

          {/* Desktop Search Bar (XL Screens only) */}
          {isHome && (
            <div className="hidden xl:flex relative items-center shrink-0">
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
                className="pl-8 pr-7 py-1.5 rounded-full text-[12px] outline-none transition-all duration-200 w-44 focus:w-56 border"
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

          {/* Desktop Nav Links (XL Screens only) */}
          <div className="hidden xl:flex items-center gap-3 text-[12.5px] shrink-0" style={{ color: tokens.inkMuted }}>
            <Link to="/refund-policy" className="hover:text-stone-900 transition-colors">Return Policy</Link>
            <Link to="/contact" className="hover:text-stone-900 transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-stone-900 transition-colors">Privacy</Link>
          </div>

          {/* Mobile & Tablet Action Controls (< 1280px / XL) */}
          <div className="flex xl:hidden items-center gap-1.5 shrink-0">
            {/* Search Icon Button */}
            {isHome && (
              <button
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="p-2 rounded-xl border flex items-center justify-center transition-colors"
                style={{
                  background: showSearchInput || searchQuery ? tokens.ink : tokens.card,
                  borderColor: tokens.line,
                  color: showSearchInput || searchQuery ? tokens.paper : tokens.ink,
                }}
                aria-label="Toggle search bar"
              >
                <Search size={16} />
              </button>
            )}

            {/* Menu Drawer Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl border flex items-center justify-center transition-colors"
              style={{
                background: mobileOpen ? tokens.ink : tokens.card,
                borderColor: tokens.line,
                color: mobileOpen ? tokens.paper : tokens.ink,
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {isHome && (showSearchInput || searchQuery) && (
          <div className="xl:hidden px-3 sm:px-6 py-2.5 border-t" style={{ background: tokens.card, borderColor: tokens.line }}>
            <div className="relative flex items-center max-w-xl mx-auto">
              <Search size={15} className="absolute left-3 pointer-events-none" style={{ color: tokens.inkFaint }} />
              <input
                type="text"
                autoFocus={showSearchInput}
                placeholder="Search ISRO t-shirts, hoodies, scale models..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-9 pr-9 py-2 rounded-xl text-[13px] outline-none border"
                style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }}
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange?.("")}
                  className="absolute right-3 p-1 text-stone-500 hover:text-stone-800"
                >
                  <X size={14} />
                </button>
              ) : (
                <button
                  onClick={() => setShowSearchInput(false)}
                  className="absolute right-3 text-[11px] font-semibold text-stone-400 hover:text-stone-700"
                >
                  CLOSE
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile & Tablet Full Navigation Drawer */}
        {mobileOpen && (
          <div
            className="xl:hidden px-4 sm:px-6 py-4 border-t space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto"
            style={{ background: tokens.card, borderColor: tokens.line }}
          >
            {/* Category Filter Pills */}
            {isHome && categories.length > 0 && (
              <div>
                <span
                  className="text-[10.5px] font-bold uppercase tracking-wider block mb-2"
                  style={{ color: tokens.inkFaint }}
                >
                  Categories
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

            {/* Quick Navigation Links */}
            <div className="pt-3 border-t space-y-2" style={{ borderColor: tokens.line }}>
              <span
                className="text-[10.5px] font-bold uppercase tracking-wider block mb-2"
                style={{ color: tokens.inkFaint }}
              >
                Quick Links
              </span>
              <div className="grid gap-2">
                <Link
                  to="/refund-policy"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border text-[13px] font-medium transition-colors hover:bg-stone-50"
                  style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }}
                >
                  <RotateCcw size={15} style={{ color: tokens.accent }} />
                  <span>Return & Refund Policy</span>
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border text-[13px] font-medium transition-colors hover:bg-stone-50"
                  style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }}
                >
                  <Mail size={15} style={{ color: tokens.accent }} />
                  <span>Contact Support (crew@indianspacehub.com)</span>
                </Link>

                <Link
                  to="/privacy"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border text-[13px] font-medium transition-colors hover:bg-stone-50"
                  style={{ background: tokens.paperSoft, borderColor: tokens.line, color: tokens.ink }}
                >
                  <Lock size={15} style={{ color: tokens.accent }} />
                  <span>Privacy Policy</span>
                </Link>
              </div>
            </div>

            {/* Social Links & Tagline */}
            <div className="pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]" style={{ borderColor: tokens.line, color: tokens.inkMuted }}>
              <span className="italic text-center sm:text-left">The New Era of Indian Space</span>
              <div className="flex items-center gap-3">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-xl border hover:bg-stone-100 transition-colors flex items-center gap-1.5 font-medium"
                  style={{ borderColor: tokens.line, color: tokens.ink }}
                >
                  <Instagram size={15} /> Instagram
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 rounded-xl border hover:bg-stone-100 transition-colors flex items-center gap-1.5 font-medium"
                  style={{ borderColor: tokens.line, color: tokens.ink }}
                >
                  <Linkedin size={15} /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
