import { z } from "zod";

export const objectIdSchema = z.string().length(24);
export const signInSchema = z.object({
  username: z.string().min(4),
  password: z.string(),
});

export const createServerSchema = z.object({
  name: z.string().min(4).max(32),
  path: z.string(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(4)
    .max(32)
    .regex(/^(?=.{4,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
  password: z.string(),
  port: z.coerce.number(),
  domain: z.string(),
  ip: z.string().ip(),
  accessToken: z.string().or(z.null()).or(z.undefined()),
});

export const editServerSchema = z.object({
  id: objectIdSchema,
  name: z.string().min(4).max(32),
  path: z.string(),
  isActive: z.boolean(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(4)
    .max(32)
    .regex(/^(?=.{4,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/)
    .or(z.undefined()),
  password: z.string().or(z.undefined()),
  port: z.coerce.number(),
  domain: z.string().or(z.null()),
});

export const createServiceSchema = z.object({
  inbound: z.coerce.number(),
  serverId: z.string().length(24),
});
export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(4)
    .max(32)
    .regex(/^(?=.{4,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
  inbound: z.coerce.number(),
  serverId: z.string().length(24),
  service: z.coerce.number(),
});

export const rechargeUserSchema = z.object({
  id: objectIdSchema,
  inbound: z.coerce.number(),
  serverId: z.string().length(24),
  service: z.coerce.number(),
});

export const getServersListFilterSchema = z
  .object({
    isActive: z.boolean().or(z.undefined()),
    includeServersCount: z.boolean().or(z.undefined()),
  })
  .or(z.undefined());
