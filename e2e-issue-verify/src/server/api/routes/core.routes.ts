import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const coreRoutes = createTRPCRouter({
  issueCredential: publicProcedure.query(() => ({ firedAt: Date.now() })),
  createPresentationRequestQueryByExample: publicProcedure.query(() => ({
    firedAt: Date.now(),
  })),
});