const modules = import.meta.glob('./patterns/*.js', { eager: true });
export const PATTERNS = Object.values(modules).map(m => m.default);

// Derive categories from the pattern data itself so a pattern can never
// declare a category that the filter UI doesn't offer.
export const CATEGORIES = ['All', ...[...new Set(PATTERNS.map(p => p.category))].sort()];
