import { Button, Card, CardContent, CardFooter, CardHeader } from '@tailwindspark/ui-components';
import { Calendar, MapPin, Star, User } from 'lucide-react';
import React from 'react';

/**
 * Card component showcase section.
 * 
 * Demonstrates card variants, layouts, and compositional patterns with
 * headers, footers, and various content types.
 * 
 * @returns Card showcase section component
 * 
 * @example
 * ```tsx
 * <CardShowcase />
 * ```
 */
export const CardShowcase: React.FC = () => {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-text mb-4 text-2xl font-bold">
          Card Components
        </h2>
        <p className="text-text-muted mb-6">
          Versatile card layouts with headers, content, and footers.
        </p>
      </div>

      {/* Basic Cards */}
      <div className="space-y-4">
        <h3 className="text-text text-lg font-semibold">
          Card Variants
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card variant="default">
            <CardContent>
              <h4 className="mb-2 font-semibold">Default Card</h4>
              <p>A simple card with default styling.</p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent>
              <h4 className="mb-2 font-semibold">Bordered Card</h4>
              <p>A card with visible borders for clear separation.</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent>
              <h4 className="mb-2 font-semibold">Elevated Card</h4>
              <p>A card with shadow for a floating appearance.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Cards */}
      <div className="space-y-4">
        <h3 className="text-text text-lg font-semibold">
          Profile Cards
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card variant="elevated">
            <CardHeader title="Sarah Johnson" subtitle="Senior Frontend Developer" />
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-secondary-500" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-secondary-500" />
                  <span>Joined March 2022</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-warning-500" />
                  <span>4.9 rating</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" fullWidth>
                View Profile
              </Button>
            </CardFooter>
          </Card>

          <Card variant="bordered">
            <div className="p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-brand/10 dark:bg-brand/20 flex h-12 w-12 items-center justify-center rounded-full">
                  <User className="text-brand h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-text font-semibold">
                    Alex Chen
                  </h4>
                  <p className="text-text-muted text-sm">
                    UI/UX Designer
                  </p>
                </div>
              </div>
              <p className="text-text-muted mb-4 text-sm">
                Passionate about creating intuitive and beautiful user experiences that solve
                real-world problems.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" fullWidth>
                  Message
                </Button>
                <Button size="sm" fullWidth>
                  Connect
                </Button>
              </div>
            </div>
          </Card>

          <Card variant="default">
            <CardContent>
              <div className="text-center">
                <div className="bg-success-100 dark:bg-success-900 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <User className="text-success-600 dark:text-success-400 h-8 w-8" />
                </div>
                <h4 className="text-text mb-2 font-semibold">
                  Emma Wilson
                </h4>
                <p className="text-text-muted mb-4 text-sm">
                  Full Stack Developer
                </p>
                <div className="flex justify-center gap-2">
                  <Button size="sm" variant="ghost">
                    Portfolio
                  </Button>
                  <Button size="sm">Hire Me</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="space-y-4">
        <h3 className="text-text text-lg font-semibold">
          Feature Cards
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-brand/10 dark:bg-brand/20 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Star className="text-brand h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-text font-semibold">
                    Premium Features
                  </h4>
                  <p className="text-text-muted text-sm">
                    Unlock advanced capabilities
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="bg-brand h-1.5 w-1.5 rounded-full"></div>
                  Advanced analytics and reporting
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-brand h-1.5 w-1.5 rounded-full"></div>
                  Priority customer support
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-brand h-1.5 w-1.5 rounded-full"></div>
                  Custom integrations
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-brand h-1.5 w-1.5 rounded-full"></div>
                  Team collaboration tools
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="primary" fullWidth>
                Upgrade Now
              </Button>
            </CardFooter>
          </Card>

          <Card variant="bordered" padding="lg">
            <CardContent>
              <div className="text-center">
                <h4 className="text-text mb-2 text-3xl font-bold">
                  99.9%
                </h4>
                <p className="text-text-muted mb-4">Uptime Guarantee</p>
                <p className="text-text-muted mb-6 text-sm">
                  Our infrastructure is built for reliability and performance, ensuring your
                  applications are always available when you need them.
                </p>
                <Button variant="secondary" size="sm">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
