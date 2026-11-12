export const COLORS = {
  // New Editorial Healthcare Palette
  bgWarm: '#F8F7F3',
  surfaceWhite: '#FFFFFF',
  primaryNavy: '#263B50',
  primaryNavyLight: '#324C66',
  primaryNavyDark: '#1A2837',
  textPrimary: '#263B50',
  textSecondary: '#68747C',
  textMuted: '#929EA5',
  border: '#E7E5DF',
  borderStrong: '#D5D2C9',
  sage: '#A7B7A4',
  sageLight: '#EFF3EE',
  sageDark: '#758872',
  terracotta: '#C98D72',
  terracottaLight: '#FBF2EE',
  terracottaDark: '#A86D53',
  danger: '#C94B45',
  dangerLight: '#FAECEB',
  success: '#3F8A61',
  successLight: '#EDF7F1',
  warning: '#D97706',

  // Backward-compat aliases
  primary: '#263B50',
  primaryLight: '#324C66',
  primaryDark: '#1A2837',
  secondary: '#C98D72',
  secondaryLight: '#FBF2EE',
  accentEmerald: '#A7B7A4',
  bgDark: '#F8F7F3',
  bgMedium: '#FFFFFF',
  bgCharcoal: '#F2EFEB',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const PET_CATEGORIES = [
  { id: 'cat', label: 'Cat', labelHi: 'बिल्ली', icon: 'cat' },
  { id: 'dog', label: 'Dog', labelHi: 'कुत्ता', icon: 'dog' },
  { id: 'rabbit', label: 'Rabbit', labelHi: 'खरगोश', icon: 'rabbit' },
  { id: 'bird', label: 'Bird', labelHi: 'पक्षी', icon: 'bird' },
];

export const SERVICE_TYPES = [
  { id: 'veterinary', label: 'Veterinary Care', labelHi: 'पशु चिकित्सा', icon: 'clinic' },
  { id: 'grooming', label: 'Grooming & Spa', labelHi: 'ग्रूमिंग', icon: 'bath' },
  { id: 'training', label: 'Behavior & Training', labelHi: 'प्रशिक्षण', icon: 'award' },
  { id: 'supplies', label: 'Supplies & Diet', labelHi: 'सामान', icon: 'package' },
];

export const CITIES = ['All', 'Mumbai', 'Bengaluru', 'Delhi', 'Pune', 'Ahmedabad'];