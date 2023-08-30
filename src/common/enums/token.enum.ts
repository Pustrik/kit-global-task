import { TypeExtractor } from './rights.enum';

export const TokenType = {
  REFRESH_TOKEN: 'refreshToken',
  ACCESS_TOKEN: 'accessToken',
} as const;

export type TokenType = TypeExtractor<typeof TokenType>;
