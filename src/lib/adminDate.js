const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pad(value) {
  return String(value).padStart(2, '0');
}

function parseDateParts(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim();
    const match = normalizedValue.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?)?/
    );

    if (match) {
      return {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
        hours: Number(match[4] || 0),
        minutes: Number(match[5] || 0),
        seconds: Number(match[6] || 0),
      };
    }
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds(),
  };
}

function formatTime(hours, minutes) {
  const hour12 = hours % 12 || 12;
  const meridiem = hours >= 12 ? 'pm' : 'am';
  return `${pad(hour12)}:${pad(minutes)} ${meridiem}`;
}

export function formatAdminDate(value) {
  const parts = parseDateParts(value);
  if (!parts) {
    return '-';
  }

  return `${pad(parts.day)}/${pad(parts.month)}/${parts.year}`;
}

export function formatAdminDateTime(value) {
  const parts = parseDateParts(value);
  if (!parts) {
    return '-';
  }

  return `${pad(parts.day)} ${MONTH_NAMES[parts.month - 1]} ${parts.year}, ${formatTime(parts.hours, parts.minutes)}`;
}
