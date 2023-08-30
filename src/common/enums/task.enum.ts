import { TypeExtractor } from './rights.enum';

export const TaskStatus = {
  NEW: 'New',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
} as const;

export type TaskStatus = TypeExtractor<typeof TaskStatus>;
