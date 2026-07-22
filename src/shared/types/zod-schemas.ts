import { z, ZodString } from 'zod';

export const SingleDateInputSchema = z.object({
  value: z.string(),
});

export const RangeDateInputSchema = z.object({
  min: z.string(),
  max: z.string(),
});

export const MatchInputSchema = z.object({
  value: z.string(),
  op: z.string(),
});

export const MinDateInputSchema = z.object({
  min: z.string(),
});

export const MaxDateInputSchema = z.object({
  max: z.string(),
});

export const SingleIdInputSchema = z.object({
  value: z.string(),
});

export const ListOfIdsInputSchema = z.object({
  ids: z.array(z.string()),
});

export const MinNumberInputSchema = z.object({
  min: z.number(),
});

export const MaxNumberInputSchema = z.object({
  max: z.number(),
});

export const SingleNumberInputSchema = z.object({
  value: z.number(),
});

export const RangeNumberInputSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const InInputSchema = z.object({
  in: z.array(z.string()),
});

export const stringSchema = z.string();

export const numberSchema = z.number();

export const booleanSchema = z.boolean();
