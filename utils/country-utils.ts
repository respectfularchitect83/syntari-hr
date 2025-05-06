// Country dial codes
export const countryDialCodes: Record<string, string> = {
  "South Africa": "+27",
  Namibia: "+264",
}

// Function to format phone with country code
export function formatPhoneWithCountryCode(phone: string, country: string): string {
  if (!phone) return ""

  const dialCode = countryDialCodes[country] || ""

  // Remove any existing dial code or leading zeros
  const cleanPhone = phone.replace(/^\+\d+\s*/, "").replace(/^0+/, "")

  // If the phone is empty after cleaning, return empty string
  if (!cleanPhone) return ""

  // If country has a dial code and phone doesn't already have it, add it
  if (dialCode && !phone.startsWith(dialCode)) {
    return `${dialCode} ${cleanPhone}`
  }

  return phone
}
