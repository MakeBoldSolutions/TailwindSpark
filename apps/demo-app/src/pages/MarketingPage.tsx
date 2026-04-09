import React, { useEffect, useState } from 'react';
import { MarketingLayout } from '../components/MarketingLayout';
import { portfolioItems, services, testimonials } from '../data/marketing-data';

/**
 * Marketing landing page with hero, services, portfolio, and testimonials.
 * 
 * Agency-style marketing page featuring parallax scrolling, animated sections,
 * service highlights, portfolio showcase, and rotating testimonials.
 * 
 * @returns Marketing page component
 * 
 * @example
 * ```tsx
 * <MarketingPage />
 * ```
 */
export const MarketingPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update CSS custom property for parallax effect
  useEffect(() => {
    document.documentElement.style.setProperty('--scroll-offset', `${scrollY * 0.5}px`);
  }, [scrollY]);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.message.trim()) errors.message = 'Message is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormStatus('submitting');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setFormStatus('success');
    setFormData({ name: '', email: '', company: '', message: '' });

    setTimeout(() => setFormStatus('idle'), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <MarketingLayout>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-data-viz-3 via-brand to-brand-hover">
          <div className="bg-pattern-dots parallax-element absolute inset-0 transform opacity-30 transition-transform duration-1000 ease-out" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <div className="translate-y-10 animate-[fadeInUp_1s_ease-out_0.2s_both] opacity-0">
            <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl">
              Ignite Your Brand's
              <span className="block bg-gradient-to-r from-data-viz-7 to-data-viz-5 bg-clip-text text-transparent">
                Digital Spark
              </span>
            </h1>
          </div>

          <div className="translate-y-10 animate-[fadeInUp_1s_ease-out_0.4s_both] opacity-0">
            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-white/90 md:text-2xl">
              We craft extraordinary digital experiences that captivate audiences and drive results.
              From stunning brand identities to cutting-edge web development.
            </p>
          </div>

          <div className="flex translate-y-10 animate-[fadeInUp_1s_ease-out_0.6s_both] flex-col justify-center gap-4 opacity-0 sm:flex-row">
            <button className="transform rounded-full bg-white px-8 py-4 font-semibold text-brand shadow-lg transition-all duration-300 hover:scale-105 hover:bg-surface-alt hover:shadow-xl">
              Start Your Project
            </button>
            <button className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-white hover:text-brand">
              View Our Work
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-surface-alt py-20" id="services">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text md:text-5xl">Our Services</h2>
            <p className="mx-auto max-w-3xl text-xl text-text-muted">
              We offer comprehensive digital solutions to elevate your brand and drive business
              growth
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="group transform rounded-2xl bg-surface p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-6 text-6xl transition-transform duration-300 group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-text">{service.title}</h3>
                <p className="mb-6 leading-relaxed text-text-muted">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-text">
                      <svg
                        className="mr-3 h-5 w-5 text-success"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="bg-surface py-20" id="portfolio">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text md:text-5xl">Our Portfolio</h2>
            <p className="mx-auto max-w-3xl text-xl text-text-muted">
              Discover the impact of our work through these selected case studies
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.map(item => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-75">
                  <div className="translate-y-4 transform p-6 text-center text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="mb-2 inline-block rounded-full bg-brand px-3 py-1 text-sm font-medium">
                      {item.category}
                    </span>
                    <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    <p className="text-white/80">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-surface-alt py-20" id="testimonials">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-text md:text-5xl">
              What Our Clients Say
            </h2>
            <p className="text-xl text-text-muted">
              Don't just take our word for it - hear from our satisfied clients
            </p>
          </div>

          <div className="relative">
            <div className="rounded-2xl bg-surface p-8 shadow-2xl md:p-12">
              <div className="mb-6 flex items-center">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="mr-1 h-5 w-5 text-warning"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="mb-8 text-xl italic leading-relaxed text-text-muted md:text-2xl">
                "{testimonials[activeTestimonial].content}"
              </blockquote>

              <div className="flex items-center">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].name}
                  className="mr-4 h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-text">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-text-muted">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation Dots */}
            <div className="mt-6 flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                    index === activeTestimonial ? 'bg-brand' : 'bg-border-strong'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        className="bg-gradient-to-br from-brand to-data-viz-3 py-20"
        id="contact"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Let's Create Something Amazing
            </h2>
            <p className="text-xl text-white/80">
              Ready to transform your digital presence? Get in touch with us today.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-2xl bg-surface p-8 shadow-2xl">
              <h3 className="mb-6 text-2xl font-bold text-text">Send us a message</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-text">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border-2 px-4 py-3 transition-colors duration-300 ${
                      formErrors.name
                        ? 'border-error focus:border-error focus:ring-error'
                        : 'border focus:border-brand focus:ring-brand'
                    }`}
                    placeholder="Your full name"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-error">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-text">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border-2 px-4 py-3 transition-colors duration-300 ${
                      formErrors.email
                        ? 'border-error focus:border-error focus:ring-error'
                        : 'border focus:border-brand focus:ring-brand'
                    }`}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-error">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-medium text-text">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-2 border px-4 py-3 transition-colors duration-300 focus:border-brand focus:ring-brand"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-text">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full resize-none rounded-lg border-2 px-4 py-3 transition-colors duration-300 ${
                      formErrors.message
                        ? 'border-error focus:border-error focus:ring-error'
                        : 'border focus:border-brand focus:ring-brand'
                    }`}
                    placeholder="Tell us about your project..."
                  />
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-error">{formErrors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`w-full rounded-lg px-6 py-4 font-semibold transition-all duration-300 ${
                    formStatus === 'success'
                      ? 'bg-success text-white hover:bg-success/90'
                      : formStatus === 'submitting'
                        ? 'cursor-not-allowed bg-muted text-white'
                        : 'transform bg-brand text-white shadow-lg hover:scale-105 hover:bg-brand-hover hover:shadow-xl'
                  }`}
                >
                  {formStatus === 'submitting' && (
                    <svg
                      className="-ml-1 mr-3 inline h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {formStatus === 'submitting'
                    ? 'Sending...'
                    : formStatus === 'success'
                      ? 'Message Sent!'
                      : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Company Info */}
            <div className="text-white">
              <h3 className="mb-8 text-2xl font-bold">Get in Touch</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 rounded-lg bg-white bg-opacity-20 p-3">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Office Location</h4>
                    <p className="text-white/80">
                      123 Innovation Drive
                      <br />
                      Tech City, TC 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 rounded-lg bg-white bg-opacity-20 p-3">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Email</h4>
                    <p className="text-white/80">
                      contact@tailwindspark.com
                      <br />
                      hello@tailwindspark.com
                      <br />
                      support@tailwindspark.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 rounded-lg bg-white bg-opacity-20 p-3">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Call Us</h4>
                    <p className="text-white/80">
                      +1 (555) 123-4567
                      <br />
                      Mon-Fri 9AM-6PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h4 className="mb-4 font-semibold">Follow Us</h4>
                <div className="flex space-x-4">
                  {['Twitter', 'LinkedIn', 'Instagram', 'GitHub'].map(social => (
                    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                    <a
                      key={social}
                      href="#"
                      className="transform rounded-lg bg-white bg-opacity-20 p-3 transition-all duration-300 hover:scale-110 hover:bg-opacity-30"
                    >
                      <span className="sr-only">{social}</span>
                      <div className="h-6 w-6 rounded bg-white"></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};
