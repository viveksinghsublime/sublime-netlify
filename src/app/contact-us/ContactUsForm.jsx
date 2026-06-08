'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { THANK_YOU_PATH } from '@/lib/site';
import { validateContactForm } from '@/lib/validation';

const initialFormState = {
  fullName: '',
  emailAddress: '',
  phoneNumber: '',
  companyName: '',
  serviceInterestedIn: '',
  message: '',
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
  'w-full rounded-xl border border-white/10 bg-[#0F1F33] px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[#0088FF] focus:ring-2 focus:ring-[#0088FF]/20';

function FieldLabel({ children, required = false }) {
  return (
    <span className="text-sm font-medium text-white">
      {children}
      {required ? <span className="ml-1 text-red-400">*</span> : null}
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
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
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
          source: 'contact-us',
          subject: 'New contact enquiry from sublimetechnocorp.com',
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.message || 'Unable to submit the form right now.');
        setIsSubmitting(false);
        return;
      }

      router.push(THANK_YOU_PATH);
    } catch {
      setErrorMessage('Something went wrong while submitting the form.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(13,27,46,0.88)_0%,rgba(12,31,50,0.96)_100%)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-8 lg:p-10">
      <div>
        <h2 className="text-3xl font-bold text-white sm:text-[2rem]">Send Us a Message</h2>
        <p className="mt-3 text-base text-slate-400">
          We&apos;d love to hear from you. Please fill out the form.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="grid gap-2">
            <FieldLabel required>Name</FieldLabel>
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
          <FieldLabel required>Service</FieldLabel>
          <div className="relative">
            <select
              required
              name="serviceInterestedIn"
              value={formData.serviceInterestedIn}
              onChange={handleChange}
              className={`${inputClasses} appearance-none pr-12`}
            >
              <option value="">Select a service</option>
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </div>
        </label>

        <label className="grid gap-2">
          <FieldLabel>Project Description</FieldLabel>
          <textarea
            rows={5}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project"
            className={`${inputClasses} min-h-[150px] resize-y`}
          />
        </label>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[rgba(26,41,66,0.6)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0088FF]/20 text-[#00B4FF]">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Schedule an Appointment</h3>
              <p className="mt-1 text-sm text-slate-400">
                Pick a time to talk with our experts.
              </p>
            </div>
          </div>

          <Link
            href="mailto:info@sublimetechnocorp.com?subject=Schedule%20a%20Consultation"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0088FF] px-4 py-2 text-sm font-medium text-[#00B4FF] transition-colors hover:bg-[#0088FF]/10"
          >
            Schedule to Talk
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A8DFF] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#0b7fe4] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Submitting...' : 'Send Message'}
            <ArrowRight className="h-5 w-5" />
          </button>

          {errorMessage ? <p className="mt-3 text-sm text-red-400">{errorMessage}</p> : null}
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <p>We respect your privacy. Your information will never be shared.</p>
        </div>
      </form>
    </div>
  );
}
