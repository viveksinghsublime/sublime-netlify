function trimValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif']);
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function hasValue(value) {
  if (typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  return trimValue(value) !== '';
}

function exceedsMaxLength(value, maxLength) {
  return trimValue(value).length > maxLength;
}

export function isValidEmail(value) {
  const email = trimValue(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(value) {
  const normalized = trimValue(value).replace(/[\s()+-]/g, '');
  return /^\d{7,15}$/.test(normalized);
}

export function isValidSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimValue(value));
}

export function isValidSchemaValue(value) {
  return /^[A-Z]+(?:_[A-Z]+)*$/.test(trimValue(value));
}

export function getFileExtension(name = '') {
  const parts = String(name).toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

export function validateImageFile(file, { maxSizeMB = 5 } = {}) {
  if (!file || typeof file !== 'object') {
    return '';
  }

  if (typeof file.arrayBuffer !== 'function' && typeof file.size !== 'number') {
    return '';
  }

  if (!file.size) {
    return '';
  }

  const extension = getFileExtension(file.name);
  if (!ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    return 'Image must be a JPG, JPEG, PNG, WEBP, or GIF file.';
  }

  if (file.type && !ALLOWED_IMAGE_MIME_TYPES.has(String(file.type).toLowerCase())) {
    return 'Image file type is not permitted.';
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Image must be ${maxSizeMB}MB or smaller.`;
  }

  return '';
}

export function validateAdminLoginForm(values) {
  if (!hasValue(values.email) || !hasValue(values.password)) {
    return 'Email and password are required.';
  }

  if (!isValidEmail(values.email)) {
    return 'Enter a valid email address.';
  }

  return '';
}

export function validateAdminPasswordChangeForm(values) {
  if (!hasValue(values.currentPassword)) {
    return 'Current password is required.';
  }
  if (!hasValue(values.newPassword)) {
    return 'New password is required.';
  }
  if (trimValue(values.newPassword).length < 8) {
    return 'New password must be at least 8 characters.';
  }
  if (!/[a-z]/.test(values.newPassword) || !/[A-Z]/.test(values.newPassword)) {
    return 'New password must include both uppercase and lowercase letters.';
  }
  if (!/\d/.test(values.newPassword)) {
    return 'New password must include at least one number.';
  }
  if (!/[^a-zA-Z0-9]/.test(values.newPassword)) {
    return 'New password must include at least one special character.';
  }
  if (!hasValue(values.confirmPassword)) {
    return 'Please confirm the new password.';
  }
  if (values.newPassword !== values.confirmPassword) {
    return 'New password and confirmation do not match.';
  }
  if (values.currentPassword === values.newPassword) {
    return 'New password must be different from the current password.';
  }

  return '';
}

export function validateContactForm(values) {
  if (!hasValue(values.fullName)) return 'Full name is required.';
  if (exceedsMaxLength(values.fullName, 120)) return 'Full name must be 120 characters or fewer.';
  if (!hasValue(values.emailAddress)) return 'Email address is required.';
  if (!isValidEmail(values.emailAddress)) return 'Enter a valid email address.';
  if (exceedsMaxLength(values.emailAddress, 254)) return 'Email address is too long.';
  if (!hasValue(values.phoneNumber)) return 'Phone number is required.';
  if (!isValidPhone(values.phoneNumber)) return 'Enter a valid phone number.';
  if (exceedsMaxLength(values.phoneNumber, 32)) return 'Phone number is too long.';
  if (hasValue(values.companyName) && exceedsMaxLength(values.companyName, 160)) {
    return 'Company name must be 160 characters or fewer.';
  }
  if (!hasValue(values.serviceInterestedIn)) return 'Please select a service.';
  if (exceedsMaxLength(values.serviceInterestedIn, 120)) return 'Selected service value is too long.';
  if (!hasValue(values.message)) return 'Project requirement / message is required.';
  if (trimValue(values.message).length < 10) {
    return 'Project requirement / message must be at least 10 characters.';
  }
  if (exceedsMaxLength(values.message, 5000)) {
    return 'Project requirement / message must be 5000 characters or fewer.';
  }
  if (hasValue(values.turnstileToken) === false) {
    return 'Please complete the verification check.';
  }
  return '';
}

export function validateJobApplicationForm(values) {
  if (!hasValue(values.fullName)) return 'Full name is required.';
  if (!hasValue(values.emailAddress)) return 'Email address is required.';
  if (!isValidEmail(values.emailAddress)) return 'Enter a valid email address.';
  if (!hasValue(values.phoneNumber)) return 'Phone number is required.';
  if (!isValidPhone(values.phoneNumber)) return 'Enter a valid phone number.';
  if (!values.resume) return 'Resume / CV is required.';

  const extension = getFileExtension(values.resume.name);
  if (!['pdf', 'doc', 'docx'].includes(extension)) {
    return 'Resume must be a PDF, DOC, or DOCX file.';
  }

  if (values.resume.size > 10 * 1024 * 1024) {
    return 'Resume must be 10MB or smaller.';
  }

  return '';
}

export function validateJobPostingForm(values) {
  if (!hasValue(values.title)) return 'Job title is required.';
  if (!hasValue(values.slug)) return 'Slug is required.';
  if (!isValidSlug(values.slug)) {
    return 'Slug can only contain lowercase letters, numbers, and hyphens.';
  }
  if (!hasValue(values.role_id)) return 'Role is required.';
  if (!hasValue(values.location_id)) return 'Location is required.';
  if (!hasValue(values.employment_type_id)) return 'Employment type is required.';
  if (!hasValue(values.description)) return 'Description is required.';
  if (trimValue(values.description).length < 20) {
    return 'Description must be at least 20 characters.';
  }
  return '';
}

export function validateCaseStudyForm(values) {
  if (!hasValue(values.title)) return 'Title is required.';
  if (!hasValue(values.category_url_name)) return 'Slug / Category URL Name is required.';
  if (!isValidSlug(values.category_url_name)) {
    return 'Slug / Category URL Name can only contain lowercase letters, numbers, and hyphens.';
  }
  if (!hasValue(values.categoryId)) return 'Category is required.';
  if (!hasValue(values.seo_title)) return 'SEO title is required.';
  if (!hasValue(values.seo_description)) return 'SEO description is required.';
  if (!hasValue(values.situation)) return 'Situation is required.';
  if (!hasValue(values.solution)) return 'Solution is required.';
  if (!hasValue(values.product_description)) return 'Product description is required.';
  if (hasValue(values.colorCode) && !/^#?[0-9a-fA-F]{3,8}$/.test(trimValue(values.colorCode))) {
    return 'Accent color must be a valid hex color.';
  }
  return '';
}

export function validateReviewForm(values) {
  if (!hasValue(values.name)) return 'Reviewer name is required.';
  if (!hasValue(values.message)) return 'Message is required.';
  if (trimValue(values.message).length < 10) return 'Message must be at least 10 characters.';
  if (hasValue(values.sort_order) && Number(values.sort_order) < 0) {
    return 'Sort order cannot be negative.';
  }
  const imageValidationMessage = validateImageFile(values.image);
  if (imageValidationMessage) {
    return imageValidationMessage;
  }
  return '';
}

export function validateCrudForm(fields, values) {
  for (const field of fields) {
    const value = values[field.name];

    if (field.required && !hasValue(value)) {
      return `${field.label} is required.`;
    }

    if (field.type === 'number' && hasValue(value) && Number.isNaN(Number(value))) {
      return `${field.label} must be a valid number.`;
    }

    if (field.type === 'number' && hasValue(value) && Number(value) < 0) {
      return `${field.label} cannot be negative.`;
    }

    if (field.name === 'value' && hasValue(value) && !isValidSchemaValue(value)) {
      return 'Schema Value must use uppercase letters with underscores, for example FULL_TIME.';
    }
  }

  return '';
}

export function validateContactLeadPayload(lead) {
  if (!hasValue(lead.name)) return 'Name is required.';
  if (exceedsMaxLength(lead.name, 120)) return 'Name must be 120 characters or fewer.';
  if (!hasValue(lead.email)) return 'Email is required.';
  if (!isValidEmail(lead.email)) return 'Enter a valid email address.';
  if (exceedsMaxLength(lead.email, 254)) return 'Email address is too long.';
  if (!hasValue(lead.phone)) return 'Phone is required.';
  if (!isValidPhone(lead.phone)) return 'Enter a valid phone number.';
  if (exceedsMaxLength(lead.phone, 32)) return 'Phone number is too long.';
  if (hasValue(lead.company_name) && exceedsMaxLength(lead.company_name, 160)) {
    return 'Company name must be 160 characters or fewer.';
  }
  if (hasValue(lead.service_interested_in) && exceedsMaxLength(lead.service_interested_in, 120)) {
    return 'Service value is too long.';
  }
  if (!hasValue(lead.source)) return 'Source is required.';
  if (exceedsMaxLength(lead.source, 120)) return 'Source is too long.';
  if (!hasValue(lead.subject)) return 'Subject is required.';
  if (exceedsMaxLength(lead.subject, 200)) return 'Subject is too long.';
  if (hasValue(lead.message) && trimValue(lead.message).length < 10) {
    return 'Message must be at least 10 characters.';
  }
  if (hasValue(lead.message) && exceedsMaxLength(lead.message, 5000)) {
    return 'Message must be 5000 characters or fewer.';
  }
  return '';
}

export { trimValue, hasValue };
