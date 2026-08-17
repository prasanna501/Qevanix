import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Sparkles,
  UserCheck,
  FileText,
  BookOpen,
  Send,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CommandPalette } from './CommandPalette';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Services', href: '/#services' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Resume', href: '/resume', isRoute: true },
    { label: 'Blog', href: '/blog', isRoute: true },
    { label: 'FAQ', href: '/#faq' },
  ];

  const handleNavClick = (href: string, isRoute?: boolean) => {
    setMobileMenuOpen(false);
    if (isRoute) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetHash = href.startsWith('/#') ? href.substring(1) : href;
      const id = targetHash.replace('#', '');
      if (location.pathname !== '/') {
        navigate(`/${targetHash}`);
      } else {
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `/#${id}`);
        } else {
          navigate(`/${targetHash}`);
        }
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3.5 border-b border-slate-200/60 dark:border-slate-800/80 shadow-md backdrop-blur-md'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 via-cyan-400 to-purple-500 shadow-md shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-200">
              <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden flex items-center justify-center">
                <img
                  src="/logo-icon.png"
                  alt="Qevanix"
                  className="w-full h-full object-contain p-0.5 rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                Qevanix
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              </span>
              <span className="text-[9px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mt-1">
                Code • Create • Inspire
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/80 backdrop-blur-md">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href, link.isRoute)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/90 transition-all"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2.5">
            {/* Quick Command Palette Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              aria-label="Open Command Palette"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-850 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/60 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/80 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Contact CTA Button */}
            <button
              onClick={() => handleNavClick('/#contact')}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-[1.02]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Let&apos;s Talk</span>
            </button>

            {/* Admin Link or Status */}
            {isAuthenticated && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-nav border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 animate-fade-in">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCommandPaletteOpen(true);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <Search className="w-4 h-4 text-indigo-500" />
                <span>Quick Search / Jump to...</span>
              </button>

              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href, link.isRoute)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                >
                  <span>{link.label}</span>
                </button>
              ))}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-500 py-2 px-4"
                >
                  Admin Portal →
                </Link>
                <button
                  onClick={() => handleNavClick('/#contact')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white"
                >
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
};
