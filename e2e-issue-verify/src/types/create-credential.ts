/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { mattrConfigSchema, issuerSchema } from "./common";

export const credentialSubjectSchema = z
  .object({
    id: z.string().startsWith("did:", "Please enter a valid DID"),
  })
  .nonstrict();

export const credentialBrandingSchema = z.object({
  backgroundColor: z.string().url().optional(),
  watermarkImageUrl: z.string().url().optional(),
});

export const createCredentialReqBodySchema = z.object({
  payload: z.object({
    name: z.string(),
    description: z.string().optional(),
    "@context": z.string().array().optional(),
    type: z.string().array().min(1),
    issuer: issuerSchema,
    credentialSubject: credentialSubjectSchema,
    credentialBranding: credentialBrandingSchema.optional(),
  }),
  persist: z.boolean().optional(),
  revocable: z.boolean().optional(),
});

export const createCredentialArgsSchema = z.object({
  config: mattrConfigSchema,
  body: createCredentialReqBodySchema,
});

export const createCredentialResBodySchema = z.object({
  id: z.string(),
  credential: z.any(),
});

export type CreateCredentialArgs = z.infer<
  typeof createCredentialArgsSchema
>;

export type CreateCredentialReqBody = z.infer<
  typeof createCredentialReqBodySchema
>;

export type CreateCredentialResBody = z.infer<
  typeof createCredentialResBodySchema
>;