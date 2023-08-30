export type TypeExtractor<T> = T[keyof T];

export const RightStatus = {
  ORDINARY: 'Ordinary',
  ADMIN: 'Admin',
} as const;

export type RightStatus = TypeExtractor<typeof RightStatus>;
