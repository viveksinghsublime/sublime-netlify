'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronDown,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { THANK_YOU_PATH } from '@/lib/site';
import { validateContactForm } from '@/lib/validation';

const initialFormState = {
  fullName: '',
  emailAddress: '',
  phoneNumber: '',
  companyName: '',
  serviceInterestedIn: '',
  message: '',
  secondary_email: '',
  turnstileToken: '',
};

const serviceOptions = [
  'Web Application Development',
  'Mobile App Development',
  'ERP Solutions',
  'Custom Software Development',
  'AI Solutions',
  'Hire Developers',
];

const inputClasses =
  'w-full rounded-lg border border-[#C8C8C8] bg-white px-4 py-[14px] text-base text-[#161F33] outline-none transition placeholder:text-[#4A5568] focus:border-[#008DD2] focus:ring-1 focus:ring-[#008DD2]/30';

const selectClasses =
  'w-full rounded-lg border border-[#C8C8C8] bg-white px-4 py-3 text-base text-[#4A5568] outline-none transition appearance-none focus:border-[#008DD2] focus:ring-1 focus:ring-[#008DD2]/30';

const textareaClasses =
  'w-full rounded-lg border border-[#C8C8C8] bg-white px-4 py-3 text-base text-[#161F33] outline-none transition placeholder:text-[#4A5568] focus:border-[#008DD2] focus:ring-1 focus:ring-[#008DD2]/30 resize-y min-h-[122px]';

function FieldLabel({ children, required = false }) {
  return (
    <span className="text-sm font-medium text-[#161F33]">
      {children}
      {required ? <span className="ml-0.5 text-red-400">*</span> : null}
    </span>
  );
}

function TextInput({
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A0AEC0]" />
      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputClasses} pl-12`}
      />
    </div>
  );
}

export default function ContactUsForm() {
  const router = useRouter();
  const turnstileRef = useRef(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (String(formData.secondary_email || '').trim()) {
      return;
    }

    const validationMessage = validateContactForm(formData);
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.emailAddress,
          phone: formData.phoneNumber,
          company_name: formData.companyName,
          service_interested_in: formData.serviceInterestedIn,
          message: formData.message,
          turnstileToken: formData.turnstileToken,
          secondary_email: formData.secondary_email,
          source: 'contact-us',
          subject: 'New contact enquiry from sublimetechnocorp.com',
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.message || 'Unable to submit the form right now.');
        setFormData((current) => ({ ...current, turnstileToken: '' }));
        turnstileRef.current?.reset?.();
        setIsSubmitting(false);
        return;
      }

      router.push(THANK_YOU_PATH);
    } catch {
      setErrorMessage('Something went wrong while submitting the form.');
      setFormData((current) => ({ ...current, turnstileToken: '' }));
      turnstileRef.current?.reset?.();
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white p-10 shadow-lg">
      <div>
        <h2 className="font-inter text-[32px] font-bold leading-[48px] text-[#161F33]">
          Send Us a Message
        </h2>
        <p className="mt-1 text-base leading-6 text-[#3D3D3C]">
          We'd love to hear from you. Please fill out the form.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative mt-6 grid gap-6">
        <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0" aria-hidden="true">
          <label htmlFor="secondary_email">Secondary email</label>
          <input
            id="secondary_email"
            type="text"
            name="secondary_email"
            value={formData.secondary_email}
            onChange={handleChange}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="grid gap-2">
            <FieldLabel required>Full Name</FieldLabel>
            <TextInput
              icon={User}
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </label>

          <label className="grid gap-2">
            <FieldLabel required>Email</FieldLabel>
            <TextInput
              icon={Mail}
              required
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </label>

          <label className="grid gap-2">
            <FieldLabel required>Contact No.</FieldLabel>
            <TextInput
              icon={Phone}
              required
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your contact number"
            />
          </label>

          <label className="grid gap-2">
            <FieldLabel>Company Name</FieldLabel>
            <TextInput
              icon={Building2}
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
            />
          </label>
        </div>

        <label className="grid gap-2">
          <FieldLabel required>Service Interested In</FieldLabel>
          <div className="relative">
            <select
              required
              name="serviceInterestedIn"
              value={formData.serviceInterestedIn}
              onChange={handleChange}
              className={selectClasses}
            >
              <option value="" disabled>Select a service</option>
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A0AEC0]" />
          </div>
        </label>

        <label className="grid gap-2">
          <FieldLabel>Project Requirement / Message</FieldLabel>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project"
            className={textareaClasses}
          />
        </label>

        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#F7F9FE] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#008DD2] text-white">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#161F33]">Schedule an Appointment</h3>
              <p className="mt-1 text-sm leading-6 text-[#3D3D3C]">
                Pick a time to talk with our team.
              </p>
            </div>
          </div>

          <Link
            href="mailto:info@sublimetechnocorp.com?subject=Schedule%20a%20Consultation"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#008DD2] px-4 py-2 text-sm font-medium text-[#008DD2] transition-colors hover:bg-[#008DD2]/10"
          >
            Schedule to Talk
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          {turnstileSiteKey ? (
            <div className="mb-4 overflow-hidden rounded-lg border border-[#C8C8C8] bg-white px-3 py-3">
              <Turnstile
                ref={turnstileRef}
                id="contact-turnstile"
                siteKey={turnstileSiteKey}
                onSuccess={(token) => {
                  setFormData((current) => ({ ...current, turnstileToken: token }));
                }}
                onExpire={() => {
                  setFormData((current) => ({ ...current, turnstileToken: '' }));
                }}
                onError={() => {
                  setFormData((current) => ({ ...current, turnstileToken: '' }));
                }}
                options={{
                  theme: 'light',
                  size: 'flexible',
                }}
              />
            </div>
          ) : (
            <p className="mb-4 text-sm text-red-400">
              Bot protection is not configured yet. Add the Turnstile site key to enable form submissions.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#008DD2] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#007bb8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
            <ArrowRight className="h-5 w-5" />
          </button>

          {errorMessage ? <p className="mt-3 text-sm text-red-400">{errorMessage}</p> : null}
        </div>

        <div className="flex items-center gap-2 text-sm text-[#3D3D3C]">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[#3D3D3C]" />
          <p>We respect your privacy. Your information will never be shared.</p>
        </div>
      </form>
    </div>
  );
}