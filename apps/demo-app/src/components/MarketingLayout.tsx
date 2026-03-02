import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from './Logo';

/**
 * Marketing layout component properties.
 */
interface MarketingLayoutProps {
  /**
   * Child elements to render within the marketing layout.
   */
  children: React.ReactNode;
}

/**
 * Marketing-focused layout with transparent header and smooth scrolling.
 * 
 * Features transparent navigation that becomes opaque on scroll, smooth section
 * navigation, and optimized for landing pages and promotional content.
 * 
 * @param root0 - Component props
 * @param root0.children - Child elements to render within the marketing layout
 * @returns Marketing layout component
 * 
 * @example
 * ```tsx
 * <MarketingLayout>
 *   <HeroSection />
 *   <FeaturesSection />
 * </MarketingLayout>
 * ```
 */
export const MarketingLayout: React.FC<MarketingLayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen scroll-smooth bg-surface text-text">
      {/* Navigation */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-surface/80 shadow-lg backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <Logo size="md" />
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  to="/demos"
                  className={`transform px-3 py-2 text-sm font-medium transition-colors duration-300 hover:scale-105 ${
                    isScrolled
                      ? 'text-text hover:text-brand'
                      : 'text-white hover:text-blue-200'
                  }`}
                >
                  ← Back to Demos
                </Link>
                {[
                  { name: 'Home', id: 'home' },
                  { name: 'Services', id: 'services' },
                  { name: 'Portfolio', id: 'portfolio' },
                  { name: 'Testimonials', id: 'testimonials' },
                  { name: 'Contact', id: 'contact' },
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className={`transform px-3 py-2 text-sm font-medium transition-colors duration-300 hover:scale-105 ${
                      isScrolled
                        ? 'text-text hover:text-brand'
                        : 'text-white hover:text-blue-200'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button and Theme Toggle */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  isScrolled
                    ? 'text-text hover:text-brand hover:bg-surface-alt'
                    : 'text-white hover:text-blue-200 hover:bg-white/10'
                }`}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              
              {/* CTA Button */}
              <button
                onClick={() => scrollToSection('contact')}
                className={`transform rounded-full px-6 py-2 font-semibold transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl'
                    : 'bg-white text-indigo-600 shadow-lg hover:bg-gray-100 hover:shadow-xl'
                }`}
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`rounded-md p-2 transition-colors duration-300 ${
                  isScrolled
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-white hover:text-blue-200'
                }`}
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 bg-white px-2 pb-3 pt-2 shadow-lg backdrop-blur-md">
              <Link
                to="/demos"
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ← Back to Demos
              </Link>
              <div className="my-2 border-t border-gray-200"></div>
              {[
                { name: 'Home', id: 'home' },
                { name: 'Services', id: 'services' },
                { name: 'Portfolio', id: 'portfolio' },
                { name: 'Testimonials', id: 'testimonials' },
                { name: 'Contact', id: 'contact' },
              ].map(item => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-indigo-600"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('contact')}
                className="mt-4 w-full rounded-full bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-indigo-700"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="mb-6 flex items-center">
                {/* eslint-disable-next-line no-raw-primary-class/no-raw-primary-class */}
                <div className="from-primary-600 to-accent-700 mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r">
                  <span className="text-xl font-bold text-white">⚡</span>
                </div>
                <span className="text-xl font-bold">TailwindSpark</span>
              </div>
              <p className="mb-6 max-w-md text-gray-400">
                A WebSpark by Mark Hazleton production. We create extraordinary digital experiences
                that ignite your brand's potential and drive meaningful results.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'Twitter', icon: '🐦' },
                  { name: 'LinkedIn', icon: '💼' },
                  { name: 'Instagram', icon: '📷' },
                  { name: 'GitHub', icon: '🐙' },
                ].map(social => (
                  /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                  <a
                    key={social.name}
                    href="#"
                    className="transform rounded-lg bg-gray-800 p-3 transition-colors duration-300 hover:scale-110 hover:bg-gray-700"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <span className="text-xl">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-6 text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', id: 'services' },
                  { name: 'Our Work', id: 'portfolio' },
                  { name: 'Services', id: 'services' },
                  { name: 'Contact', id: 'contact' },
                ].map(link => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-gray-400 transition-colors duration-300 hover:text-white"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="mb-6 text-lg font-semibold">Stay Updated</h4>
              <p className="mb-4 text-gray-400">
                Subscribe to our newsletter for the latest updates and insights.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-l-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
                <button
                  className="rounded-r-lg bg-indigo-600 px-4 py-2 transition-colors duration-300 hover:bg-indigo-700"
                  aria-label="Subscribe to newsletter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
            <p className="text-sm text-gray-400">
              © 2025 TailwindSpark. A WebSpark by Mark Hazleton production. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                href="#"
                className="text-sm text-gray-400 transition-colors duration-300 hover:text-white"
              >
                Privacy Policy
              </a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                href="#"
                className="text-sm text-gray-400 transition-colors duration-300 hover:text-white"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
