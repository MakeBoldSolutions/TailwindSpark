import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';

// Icons used in the component
const IconSave = () => <span>💾</span>;
const IconKey = () => <span>🔑</span>;
const IconShield = () => <span>🛡️</span>;
const IconGlobe = () => <span>🌐</span>;
const IconMail = () => <span>✉️</span>;
const IconCreditCard = () => <span>💳</span>;

/**
 * Settings section component properties.
 */
interface SettingsSectionProps {
  /**
   * Section title.
   */
  title: string;
  /**
   * Section description.
   */
  description: string;
  /**
   * Icon element for the section.
   */
  icon: React.ReactNode;
  /**
   * Section content.
   */
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  icon,
  children,
}) => (
  <div className="overflow-hidden rounded-panel border border-border bg-[var(--card-bg)] shadow-card">
    <div className="border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-control border border-border bg-surface-alt text-brand">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text">{title}</h3>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const FormField: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  required?: boolean;
}> = ({ label, type = 'text', value, onChange, placeholder, description, required }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-text">
      {label} {required && <span className="text-error">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-control border border-border bg-surface px-3 py-2 text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
    />
    {description && <p className="text-xs text-text-muted">{description}</p>}
  </div>
);

const ToggleField: React.FC<{
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <h4 className="text-sm font-medium text-text">{label}</h4>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 ${
        enabled ? 'bg-brand' : 'bg-surface-hover'
      }`}
      role="switch"
      aria-checked={enabled ? 'true' : 'false'}
      aria-label={`Toggle ${label}`}
      title={`Toggle ${label}`}
      onClick={() => onChange(!enabled)}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

/**
 * Settings page with user preferences and account configuration.
 * 
 * Comprehensive settings interface for profile, security, notifications,
 * preferences, and billing management with form validation and save functionality.
 * 
 * @returns Settings page component
 * 
 * @example
 * ```tsx
 * <SettingsPage />
 * ```
 */
export const SettingsPage: React.FC = () => {
  // General Settings State
  const [companyName, setCompanyName] = useState('PromptSpark');
  const [companyEmail, setCompanyEmail] = useState('admin@promptspark.com');
  const [companyWebsite, setCompanyWebsite] = useState('https://promptspark.com');
  const [timezone, setTimezone] = useState('UTC-8');

  // Security Settings State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [passwordPolicy, setPasswordPolicy] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // API Settings State
  const [apiKey, setApiKey] = useState('sk-1234567890abcdef...');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSaveSettings = () => {
    console.warn('Saving settings...');
    setHasUnsavedChanges(false);
    // In a real app, you'd make an API call here
  };

  const handleGenerateApiKey = () => {
    // Generate cryptographically secure random API key
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    const newKey = 'sk-' + Array.from(array, num => num.toString(36)).join('');
    setApiKey(newKey);
    setHasUnsavedChanges(true);
  };

  return (
    <DashboardLayout
      pageTitle="Settings"
      pageDescription="Configure your application preferences and security settings."
      headerActions={
        hasUnsavedChanges && (
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 rounded-control bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--button-primary-fg)] shadow-button transition-colors hover:bg-[var(--button-primary-bg-hover)]"
          >
            <IconSave />
            Save Changes
          </button>
        )
      }
    >
      <div className="space-y-8">
        {/* General Settings */}
        <SettingsSection
          title="General"
          description="Basic application settings and preferences"
          icon={<IconGlobe />}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label="Company Name"
              value={companyName}
              onChange={value => {
                setCompanyName(value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Enter company name"
            />
            <FormField
              label="Contact Email"
              type="email"
              value={companyEmail}
              onChange={value => {
                setCompanyEmail(value);
                setHasUnsavedChanges(true);
              }}
              placeholder="admin@company.com"
            />
            <FormField
              label="Website URL"
              type="url"
              value={companyWebsite}
              onChange={value => {
                setCompanyWebsite(value);
                setHasUnsavedChanges(true);
              }}
              placeholder="https://example.com"
            />
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="mb-2 block text-sm font-medium text-text">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={e => {
                  setTimezone(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                title="Select timezone"
                className="w-full rounded-control border border-border bg-surface px-3 py-2 text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                <option value="UTC-12">UTC-12 (Baker Island)</option>
                <option value="UTC-8">UTC-8 (Pacific)</option>
                <option value="UTC-5">UTC-5 (Eastern)</option>
                <option value="UTC+0">UTC+0 (London)</option>
                <option value="UTC+1">UTC+1 (Paris)</option>
                <option value="UTC+8">UTC+8 (Singapore)</option>
                <option value="UTC+9">UTC+9 (Tokyo)</option>
              </select>
            </div>
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection
          title="Security"
          description="Manage authentication and security policies"
          icon={<IconShield />}
        >
          <div className="space-y-6">
            <ToggleField
              label="Two-Factor Authentication"
              description="Require 2FA for all user accounts"
              enabled={twoFactorEnabled}
              onChange={enabled => {
                setTwoFactorEnabled(enabled);
                setHasUnsavedChanges(true);
              }}
            />
            <ToggleField
              label="Password Policy"
              description="Enforce strong password requirements"
              enabled={passwordPolicy}
              onChange={enabled => {
                setPasswordPolicy(enabled);
                setHasUnsavedChanges(true);
              }}
            />
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="mb-2 block text-sm font-medium text-text">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={sessionTimeout}
                onChange={e => {
                  setSessionTimeout(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                title="Session timeout in minutes"
                placeholder="Enter timeout in minutes"
                className="w-full rounded-control border border-border bg-surface px-3 py-2 text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection
          title="Notifications"
          description="Configure email and push notification preferences"
          icon={<IconMail />}
        >
          <div className="space-y-6">
            <ToggleField
              label="Email Notifications"
              description="Receive important updates via email"
              enabled={emailNotifications}
              onChange={enabled => {
                setEmailNotifications(enabled);
                setHasUnsavedChanges(true);
              }}
            />
            <ToggleField
              label="Push Notifications"
              description="Get real-time browser notifications"
              enabled={pushNotifications}
              onChange={enabled => {
                setPushNotifications(enabled);
                setHasUnsavedChanges(true);
              }}
            />
            <ToggleField
              label="Weekly Reports"
              description="Receive weekly analytics summaries"
              enabled={weeklyReports}
              onChange={enabled => {
                setWeeklyReports(enabled);
                setHasUnsavedChanges(true);
              }}
            />
            <ToggleField
              label="Security Alerts"
              description="Get notified of security events"
              enabled={securityAlerts}
              onChange={enabled => {
                setSecurityAlerts(enabled);
                setHasUnsavedChanges(true);
              }}
            />
          </div>
        </SettingsSection>

        {/* API Settings */}
        <SettingsSection
          title="API Configuration"
          description="Manage API keys and integration settings"
          icon={<IconKey />}
        >
          <div className="space-y-6">
            <div>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="mb-2 block text-sm font-medium text-text">
                API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  readOnly
                  title="API Key (read-only)"
                  placeholder="API Key"
                  className="flex-1 cursor-not-allowed rounded-control border border-border bg-surface-alt px-3 py-2 text-text"
                />
                <button
                  onClick={handleGenerateApiKey}
                  className="rounded-control border border-border bg-surface-alt px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
                >
                  Regenerate
                </button>
              </div>
            </div>
            <FormField
              label="Webhook URL"
              type="url"
              value={webhookUrl}
              onChange={value => {
                setWebhookUrl(value);
                setHasUnsavedChanges(true);
              }}
              placeholder="https://your-app.com/webhook"
            />
            <ToggleField
              label="Rate Limiting"
              description="Enable API rate limiting protection"
              enabled={rateLimitEnabled}
              onChange={enabled => {
                setRateLimitEnabled(enabled);
                setHasUnsavedChanges(true);
              }}
            />
          </div>
        </SettingsSection>

        {/* Billing Settings */}
        <SettingsSection
          title="Billing & Subscription"
          description="Manage your subscription and payment information"
          icon={<IconCreditCard />}
        >
          <div className="space-y-4">
            <div className="rounded-panel border border-border bg-surface-alt p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text">Pro Plan</h4>
                  <p className="text-sm text-text-muted">
                    $29/month • Next billing: Jan 15, 2024
                  </p>
                </div>
                <button className="rounded-control bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--button-primary-fg)] shadow-button transition-colors hover:bg-[var(--button-primary-bg-hover)]">
                  Manage Subscription
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-panel border border-border p-4 text-center">
                <div className="text-2xl font-bold text-text">1,234</div>
                <div className="text-sm text-text-muted">API Calls This Month</div>
              </div>
              <div className="rounded-panel border border-border p-4 text-center">
                <div className="text-2xl font-bold text-text">89%</div>
                <div className="text-sm text-text-muted">Storage Used</div>
              </div>
            </div>
          </div>
        </SettingsSection>
      </div>
    </DashboardLayout>
  );
};
