// src/server/routers/_app.ts
import { createTRPCRouter } from '../trpc';
import { taskRouter } from './tasks';

export const appRouter = createTRPCRouter({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;