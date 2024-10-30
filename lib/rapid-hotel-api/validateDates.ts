// Regex to validate dates in YYYY-MM-DD format
const dateRegex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

// Validates the date format to ensure it matches YYYY-MM-DD.
export function validateDateFormat(
  date: string | null,
  searchParam: string
): string | null {
  if (!date || !dateRegex.test(date)) {
    return `Invalid ${searchParam} format. Use YYYY-MM-DD. Use only numbers.`;
  }
  return null;
}

// Validates that the check-out date is the same as or after the check-in date. Also, check if check-in date is not in the past.
export function validateDateRange(
  checkin_date: string | null,
  checkout_date: string | null
): string | null {
  if (!checkin_date || !checkout_date)
    return "Invalid date range format or missing checkin_date and/or checkout_date.";

  const checkin = new Date(checkin_date);
  const checkout = new Date(checkout_date);
  const today = new Date();

  if (checkin < today) {
    return "Check-in date cannot be in the past.";
  }
  if (checkout < checkin) {
    return "Check-out date must be after or the same as the check-in date.";
  }
  return null;
}

export function validateDateFormatAndDateRange(
  checkin_date: string | null,
  checkout_date: string | null
): string[] | null {
  let errors: string[] = [];

  const checkinDateFormatError = validateDateFormat(
    checkin_date,
    "checkin_date"
  );
  const checkoutDateFormatError = validateDateFormat(
    checkout_date,
    "checkout_date"
  );
  if (checkinDateFormatError) errors.push(checkinDateFormatError);
  if (checkoutDateFormatError) errors.push(checkoutDateFormatError);
  // Validate date range between check-in and check-out dates
  const dateRangeError = validateDateRange(checkin_date, checkout_date);
  if (dateRangeError) errors.push(dateRangeError);

  return errors.length > 0 ? errors : null;
}