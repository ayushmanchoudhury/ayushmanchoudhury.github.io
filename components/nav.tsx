"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { CommandBar } from "@/components/ui/command-bar";

const navLinks = [
  { href: "/#work", label: "Work" },
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#creative", label: "AI" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <CommandBar />
      <motion.header
        className="fixed inset-x-0 top-0 z-50 transition-all"
        animate={{
          backgroundColor: scrolled
            ? "rgba(6,7,15,0.88)"
            : "rgba(6,7,15,0)",
          borderBottomColor: scrolled
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        }}
        transition={{ duration: 0.25 }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <Link
            href="/"
            className="font-mono text-sm font-medium text-text-1 tracking-tight hover:text-blue-primary transition-colors"
          >
            AC<span className="text-blue-primary">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-text-2 hover:text-text-1 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => {
                const e = new KeyboardEvent("keydown", { key: "/", bubbles: true });
                window.dispatchEvent(e);
              }}
              className="hidden lg:flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-text-3 hover:text-text-2 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
            >
              <span>Press</span>
              <kbd className="font-mono px-1 py-0.5 rounded text-[10px]" style={{ background: "rgba(255,255,255,0.08)" }}>/</kbd>
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-accent px-4 py-1.5 text-sm text-text-1 hover:bg-surface-2 hover:border-white/20 transition-all"
            >
              Resume <span className="text-text-3">↗</span>
            </a>
          </div>

          <button
            className="md:hidden text-text-2 hover:text-text-1 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-bg md:hidden"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-medium text-text-2 hover:text-text-1 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-medium text-blue-primary"
            >
              Resume ↗
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
