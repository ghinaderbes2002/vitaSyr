// src/lib/utils/currencyFormatter.ts

/**
 * Format price in USD with proper Arabic formatting
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) {
    return "السعر عند الاستعلام";
  }

  const formatter = new Intl.NumberFormat("ar-SY", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(price);
}

/**
 * Format price in USD without currency symbol (just the number)
 */
export function formatPriceNumber(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) {
    return "غير محدد";
  }

  const formatter = new Intl.NumberFormat("ar-SY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(price);
}

/**
 * Format price with custom USD label
 */
export function formatPriceWithLabel(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) {
    return "السعر عند الاستعلام";
  }

  const formatter = new Intl.NumberFormat("ar-SY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `${formatter.format(price)} $`;
}

/**
 * Parse price string to number (for form inputs)
 */
export function parsePrice(priceString: string): number {
  // Remove any non-numeric characters except dots and commas
  const cleaned = priceString.replace(/[^\d.,]/g, "");
  // Replace comma with dot for decimal
  const normalized = cleaned.replace(",", ".");
  return parseFloat(normalized) || 0;
}
