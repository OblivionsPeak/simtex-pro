export const CATEGORIES = ['All', 'Racing', 'Geometric', 'Technology', 'Organic', 'Utility', 'Industrial', 'Natural', 'Abstract'];

const modules = import.meta.glob('./patterns/*.js', { eager: true });
export const PATTERNS = Object.values(modules).map(m => m.default);
