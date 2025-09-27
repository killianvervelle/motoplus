import { z } from "zod"

export const signUpFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email." }).trim(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})

export type ContactFormData = z.infer<typeof signUpFormSchema>;