export const COLORS = {
  primary: '#2D5A5A',
  primaryLight: '#3A7575',
  primaryDark: '#1E3D3D',
  secondary: '#E8B86D',
  secondaryLight: '#F0CC8A',
  accentEmerald: '#34D399',
  bgDark: '#1A2F2F',
  bgMedium: '#243D3D',
  bgCharcoal: '#1E2D2D',
  textPrimary: '#F0F4F4',
  textSecondary: '#A0B4B4',
  textMuted: '#708888',
  danger: '#EF4444',
  success: '#34D399',
  warning: '#F59E0B',
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const PET_CATEGORIES = [
  { id: 'cat', label: 'Cat', labelHi: 'बिल्ली', emoji: '🐱' },
  { id: 'dog', label: 'Dog', labelHi: 'कुत्ता', emoji: '🐕' },
  { id: 'rabbit', label: 'Rabbit', labelHi: 'खरगोश', emoji: '🐰' },
  { id: 'bird', label: 'Bird', labelHi: 'पक्षी', emoji: '🐦' },
];

export const SERVICE_TYPES = [
  { id: 'veterinary', label: 'Veterinary', labelHi: 'पशु चिकित्सा', emoji: '🏥' },
  { id: 'grooming', label: 'Grooming', labelHi: 'ग्रूमिंग', emoji: '🛁' },
  { id: 'training', label: 'Training', labelHi: 'प्रशिक्षण', emoji: '🎓' },
  { id: 'supplies', label: 'Supplies', labelHi: 'सामान', emoji: '📦' },
];

export const CITIES = ['All', 'Mumbai', 'Bengaluru', 'Delhi', 'Pune', 'Ahmedabad'];
