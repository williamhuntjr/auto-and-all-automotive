import { z } from "zod";
import { ESTIMATE_SERVICES } from "./estimate-services";

export const estimateSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  contact: z
    .string()
    .trim()
    .min(1, "Please enter a phone number or email.")
    .max(150),
  vehicle: z
    .string()
    .trim()
    .min(1, "Please enter the year, make and model.")
    .max(150),
  service: z.enum(ESTIMATE_SERVICES, { message: "Please choose a service." }),
  details: z
    .string()
    .trim()
    .min(1, "Please describe the damage, symptoms or project.")
    .max(5000, "Please keep this under 5,000 characters."),
});

export type EstimateRequest = z.infer<typeof estimateSchema>;
export type EstimateField = keyof EstimateRequest;
