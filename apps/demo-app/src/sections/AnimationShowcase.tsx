import React, { useState } from 'react';

/**
 * Animation showcase section.
 * 
 * Interactive demonstrations of Tailwind CSS animations including transitions,
 * keyframes, transforms, and complex multi-property animations with controls.
 * 
 * @returns Animation showcase section component
 * 
 * @example
 * ```tsx
 * <AnimationShowcase />
 * ```
 */
export const AnimationShowcase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [bounceActive, setBounceActive] = useState(false);

  const triggerLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <>
      {/* Transition Effects */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-text">
            Transition Effects
          </h2>
          <p className="mb-8 text-text-muted">
            Smooth transitions for hover, focus, and state changes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Scale Transition */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-text">
              Scale Transform
            </h3>
            <div className="flex justify-center">
              <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-brand to-data-viz-3 transition-transform duration-300 hover:scale-110">
                <span className="font-medium text-white">Hover Me</span>
              </div>
            </div>
          </div>

          {/* Color Transition */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-text">
              Color Transition
            </h3>
            <div className="flex justify-center">
              <button className="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors duration-500 hover:bg-success-600">
                Hover for Color Change
              </button>
            </div>
          </div>

          {/* Opacity Transition */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-text">
              Opacity Fade
            </h3>
            <div className="flex justify-center">
              <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-error-600 to-data-viz-7 transition-opacity duration-700 hover:opacity-30">
                <span className="text-center font-medium text-white">Hover Me</span>
              </div>
            </div>
          </div>

          {/* Rotate Transition */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-text">
              Rotate Transform
            </h3>
            <div className="flex justify-center">
              <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-success-600 to-data-viz-6 transition-transform duration-500 hover:rotate-180">
                <span className="font-medium text-white">🔄</span>
              </div>
            </div>
          </div>

          {/* Translate Transition */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-text">
              Slide Transform
            </h3>
            <div className="flex justify-center overflow-hidden">
              <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-warning-500 to-data-viz-5 transition-transform duration-300 hover:translate-x-4">
                <span className="font-medium text-white">→</span>
              </div>
            </div>
          </div>

          {/* Shadow Transition */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-text">
              Shadow Growth
            </h3>
            <div className="flex justify-center">
              <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-br from-data-viz-1 to-data-viz-3 shadow-md transition-shadow duration-300 hover:shadow-2xl">
                <span className="font-medium text-white">✨</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keyframe Animations */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-text">
            Keyframe Animations
          </h2>
          <p className="mb-8 text-text-muted">
            Built-in CSS animations with Tailwind utility classes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Spin Animation */}
          <div className="rounded-lg border border-border bg-surface p-6 text-center shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-text">Spin</h3>
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
            </div>
            <p className="text-sm text-text-muted">Loading spinner</p>
          </div>

          {/* Ping Animation */}
          <div className="rounded-lg border border-border bg-surface p-6 text-center shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-text">Ping</h3>
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="h-4 w-4 rounded-full bg-success-600"></div>
                <div className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-success-600 opacity-75"></div>
              </div>
            </div>
            <p className="text-sm text-text-muted">Notification dot</p>
          </div>

          {/* Pulse Animation */}
          <div className="rounded-lg border border-border bg-surface p-6 text-center shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-text">Pulse</h3>
            <div className="mb-4 flex justify-center">
              <button
                onClick={() => setPulseActive(!pulseActive)}
                className={`h-16 w-16 rounded-lg bg-data-viz-3 font-medium text-white ${pulseActive ? 'animate-pulse' : ''}`}
              >
                {pulseActive ? 'ON' : 'OFF'}
              </button>
            </div>
            <p className="text-sm text-text-muted">Toggle pulse effect</p>
          </div>

          {/* Bounce Animation */}
          <div className="rounded-lg border border-border bg-surface p-6 text-center shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-text">Bounce</h3>
            <div className="mb-4 flex justify-center">
              <button
                onClick={() => setBounceActive(!bounceActive)}
                className={`h-12 w-12 rounded-full bg-error-600 font-medium text-white ${bounceActive ? 'animate-bounce' : ''}`}
              >
                ⚽
              </button>
            </div>
            <p className="text-sm text-text-muted">Toggle bounce effect</p>
          </div>
        </div>
      </section>

      {/* Interactive Animations */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-text">
            Interactive Animations
          </h2>
          <p className="mb-8 text-text-muted">
            User-triggered animations and state-based transitions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Loading Button */}
          <div className="rounded-lg border border-border bg-surface p-8 shadow-md">
            <h3 className="mb-6 text-xl font-semibold text-text">
              Loading States
            </h3>
            <div className="space-y-4">
              <button
                onClick={triggerLoading}
                disabled={isLoading}
                className={`w-full rounded-lg px-6 py-3 font-medium transition-all duration-200 ${
                  isLoading
                    ? 'cursor-not-allowed bg-border-strong'
                    : 'bg-brand hover:scale-105 hover:bg-brand-hover active:scale-95'
                } flex items-center justify-center gap-2 text-white`}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Loading...
                  </>
                ) : (
                  'Start Loading Animation'
                )}
              </button>
            </div>
          </div>

          {/* Modal Animation */}
          <div className="rounded-lg border border-border bg-surface p-8 shadow-md">
            <h3 className="mb-6 text-xl font-semibold text-text">
              Modal Transitions
            </h3>
            <button
              onClick={() => setShowModal(true)}
              className="w-full rounded-lg bg-success-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-success-700"
            >
              Open Animated Modal
            </button>
          </div>
        </div>
      </section>

      {/* Complex Animation Examples */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-text">
            Complex Animations
          </h2>
          <p className="mb-8 text-text-muted">
            Combining multiple animation properties for sophisticated effects
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Floating Card */}
          <div className="rounded-lg border border-border bg-surface p-8 shadow-md">
            <h3 className="mb-6 text-xl font-semibold text-text">
              Floating Card
            </h3>
            <div className="flex justify-center">
              <div className="group relative">
                <div className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-data-viz-7 via-data-viz-3 to-data-viz-1 transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 group-hover:shadow-2xl">
                  <span className="text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-125">
                    ✨
                  </span>
                </div>
                <div className="absolute inset-0 h-32 w-32 rounded-xl bg-gradient-to-br from-data-viz-7 via-data-viz-3 to-data-viz-1 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40 group-hover:blur-2xl"></div>
              </div>
            </div>
          </div>

          {/* Morphing Button */}
          <div className="rounded-lg border border-border bg-surface p-8 shadow-md">
            <h3 className="mb-6 text-xl font-semibold text-text">
              Morphing Button
            </h3>
            <div className="flex justify-center">
              <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-brand to-data-viz-3 px-8 py-4 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <span className="relative z-10 transition-all duration-300 group-hover:scale-110">
                  Hover to Transform
                </span>
                <div className="absolute inset-0 origin-left scale-x-0 transform bg-gradient-to-r from-data-viz-3 to-data-viz-7 transition-transform duration-300 group-hover:scale-x-100"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className="absolute inset-0 animate-pulse bg-black bg-opacity-50"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative w-full max-w-md transform animate-bounce rounded-xl bg-surface p-8 shadow-2xl transition-all duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-text-muted transition-colors hover:text-text"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-success-600 to-data-viz-6">
                <span className="text-2xl text-white">🎉</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-text">
                Animated Modal
              </h3>
              <p className="mb-6 text-text-muted">
                This modal demonstrates entrance animations with bounce and backdrop effects.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-brand px-6 py-2 text-white transition-colors duration-200 hover:bg-brand-hover"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
