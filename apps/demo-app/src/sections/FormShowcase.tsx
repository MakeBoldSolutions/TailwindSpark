import { Button, Checkbox, Input, Radio, Select, Textarea } from '@tailwindspark/ui-components';
import { Lock, Mail, Search, User } from 'lucide-react';
import React from 'react';

/**
 * Form component showcase section.
 * 
 * Demonstrates input fields, textareas, selects, checkboxes, radios, and
 * complete form layouts with validation and accessibility features.
 * 
 * @returns Form showcase section component
 * 
 * @example
 * ```tsx
 * <FormShowcase />
 * ```
 */
export const FormShowcase: React.FC = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    name: '',
    bio: '',
    country: '',
    newsletter: false,
    plan: 'free',
    search: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.name) newErrors.name = 'Name is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.warn('Form submitted:', formData);
    }
  };

  const countryOptions = [
    { value: '', label: 'Select Country' },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'au', label: 'Australia' },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-text mb-4 text-2xl font-bold">
          Form Components
        </h2>
        <p className="text-text-muted mb-6">
          Complete form controls with validation, icons, and accessibility features.
        </p>
      </div>

      {/* Input Variants */}
      <div className="space-y-6">
        <h3 className="text-text text-lg font-semibold">
          Input Fields
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            label="Basic Input"
            placeholder="Enter some text"
            helperText="This is a helper text"
          />

          <Input
            label="Email with Icon"
            type="email"
            placeholder="Enter your email"
            leftIcon={<Mail />}
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData(prev => ({ ...prev, email: e.target.value }))
            }
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            leftIcon={<Lock />}
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData(prev => ({ ...prev, password: e.target.value }))
            }
            error={errors.password}
          />

          <Input
            label="Search"
            placeholder="Search..."
            leftIcon={<Search />}
            value={formData.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData(prev => ({ ...prev, search: e.target.value }))
            }
          />

          <Input label="Disabled Input" placeholder="This is disabled" disabled />

          <Input
            label="Success State"
            placeholder="Valid input"
            variant="success"
            helperText="This input is valid"
          />
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-4">
        <h3 className="text-secondary-800 dark:text-secondary-200 text-lg font-semibold">
          Textarea
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Textarea
            label="Biography"
            placeholder="Tell us about yourself..."
            rows={4}
            value={formData.bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData(prev => ({ ...prev, bio: e.target.value }))
            }
            helperText="Max 500 characters"
          />

          <Textarea
            label="Comments"
            placeholder="Enter your comments"
            rows={4}
            error="This field has an error"
          />
        </div>
      </div>

      {/* Select */}
      <div className="space-y-4">
        <h3 className="text-secondary-800 dark:text-secondary-200 text-lg font-semibold">
          Select Dropdown
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            label="Country"
            options={countryOptions}
            value={formData.country}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFormData(prev => ({ ...prev, country: e.target.value }))
            }
            helperText="Select your country"
          />

          <Select label="Disabled Select" options={countryOptions} disabled />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <h3 className="text-secondary-800 dark:text-secondary-200 text-lg font-semibold">
          Checkboxes
        </h3>

        <div className="space-y-3">
          <Checkbox
            label="Subscribe to newsletter"
            checked={formData.newsletter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData(prev => ({ ...prev, newsletter: e.target.checked }))
            }
            helperText="We'll send you weekly updates"
          />

          <Checkbox label="Agree to terms and conditions" error="You must agree to the terms" />

          <Checkbox label="Disabled checkbox" disabled />
        </div>
      </div>

      {/* Radio Buttons */}
      <div className="space-y-4">
        <h3 className="text-secondary-800 dark:text-secondary-200 text-lg font-semibold">
          Radio Buttons
        </h3>

        <div className="space-y-3">
          <div className="text-secondary-900 dark:text-secondary-100 mb-2 text-sm font-medium">
            Choose a plan:
          </div>
          <Radio
            name="plan"
            value="free"
            label="Free Plan"
            checked={formData.plan === 'free'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData(prev => ({ ...prev, plan: e.target.value }))
            }
          />
          <Radio
            name="plan"
            value="pro"
            label="Pro Plan ($9/month)"
            checked={formData.plan === 'pro'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData(prev => ({ ...prev, plan: e.target.value }))
            }
          />
          <Radio
            name="plan"
            value="enterprise"
            label="Enterprise Plan ($29/month)"
            checked={formData.plan === 'enterprise'}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData(prev => ({ ...prev, plan: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Form Example */}
      <div className="space-y-4">
        <h3 className="text-secondary-800 dark:text-secondary-200 text-lg font-semibold">
          Complete Form Example
        </h3>

        <form
          onSubmit={handleSubmit}
          className="dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 space-y-6 rounded-xl border bg-white p-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Full Name"
              placeholder="John Doe"
              leftIcon={<User />}
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              error={errors.name}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              leftIcon={<Mail />}
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData(prev => ({ ...prev, email: e.target.value }))
              }
              error={errors.email}
              required
            />
          </div>

          <Input
            label="Password"
            type="password"
            placeholder="Enter a secure password"
            leftIcon={<Lock />}
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData(prev => ({ ...prev, password: e.target.value }))
            }
            error={errors.password}
            required
          />

          <Select
            label="Country"
            options={countryOptions}
            value={formData.country}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFormData(prev => ({ ...prev, country: e.target.value }))
            }
          />

          <Textarea
            label="Bio (Optional)"
            placeholder="Tell us about yourself..."
            rows={3}
            value={formData.bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData(prev => ({ ...prev, bio: e.target.value }))
            }
          />

          <div className="space-y-3">
            <Checkbox label="I agree to the terms and conditions" required />

            <Checkbox
              label="Subscribe to marketing emails"
              checked={formData.newsletter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData(prev => ({ ...prev, newsletter: e.target.checked }))
              }
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary">
              Create Account
            </Button>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
