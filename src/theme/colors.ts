export const colors = {
  background: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  accent: '#f43f5e',
  gold: '#fbbf24',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
} as const;

export type ColorKey = keyof typeof colors;
