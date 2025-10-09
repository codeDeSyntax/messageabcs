/**
 * Utility functions for generating and working with URL slugs
 */

/**
 * Generate a URL-friendly slug from a title
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

/**
 * Convert a slug back to a readable title (basic transformation)
 * @param slug - The slug to convert
 * @returns A title-case string
 */
export const slugToTitle = (slug: string): string => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
