"use client";

import { sublimeLogo } from "@/assets/index";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { CONTACT_PATH, WORKS_PATH } from "@/lib/site";

const SCROLL_THRESHOLD = 12;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [spacerHeight, setSpacerHeight] = useState(72);
  const lastScrollY = useRef(0);
  const headerRef = useRef(null);

  const toggleMenu = () => setMenuOpen((open) => !open);

  const updateSpacerHeight = useCallback(() => {
    if (headerRef.current) {
      setSpacerHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    updateSpacerHeight();
    const observer = new ResizeObserver(updateSpacerHeight);
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [menuOpen, updateSpacerHeight]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setIsScrolled(currentY > 8);

        if (menuOpen) {
          setIsVisible(true);
        } else if (currentY <= SCROLL_THRESHOLD) {
          setIsVisible(true);
        } else if (currentY > lastScrollY.current + 2) {
          setIsVisible(false);
        } else if (currentY < lastScrollY.current - 2) {
          setIsVisible(true);
        }

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Career", href: "/careers" },
    { name: "Works", href: WORKS_PATH },
    { name: "About us", href: "/about" },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 top-0 z-50 w-full text-white transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "border-b border-white/10 bg-[#0D1114]/90 shadow-lg backdrop-blur-md"
            : "bg-[#0D1114]"
        }`}
      >
        <div className="max-w-8xl mx-8 flex items-center justify-between px-4 py-4">
          <Link href="/" className="shrink-0">
            <Image src={sublimeLogo} alt="Sublime Logo" className="h-10 w-auto" />
          </Link>

          <nav className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-md font-light text-[#FAFAFCBF] transition-colors hover:text-blue-400"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex">
            <Link
              href={CONTACT_PATH}
              className="flex items-center justify-center gap-2 rounded-full bg-[#0093dd] px-5 py-2 font-medium text-white transition duration-300 hover:bg-[#007dc0]"
            >
              Contact us
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="text-2xl text-white"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="space-y-4 border-t border-white/10 bg-[#0D1114]/95 px-4 pb-4 pt-3 backdrop-blur-md md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-sm text-white transition-colors hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={CONTACT_PATH}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0093dd] px-5 py-2 font-medium text-white transition duration-300 hover:bg-[#007dc0]"
              onClick={() => setMenuOpen(false)}
            >
              Contact us
            </Link>
          </div>
        )}
      </header>

      <div aria-hidden="true" style={{ height: spacerHeight }} className="shrink-0" />
    </>
  );
};

export default Header;
