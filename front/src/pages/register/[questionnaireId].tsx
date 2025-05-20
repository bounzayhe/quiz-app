import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

// Schema for client registration
const registrationSchema = z.object({
  fullname: z.string().min(3, {
    message: "Name must be at least 3 characters",
  }),
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function ClientRegistration() {
  const router = useRouter();
  const { toast } = useToast();
  const { questionnaireId, token } = router.query;

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullname: "",
    },
  });

  const onSubmit = async (data: RegistrationData) => {
    try {
      // Register the client
      const result = await api.registerClient(data.fullname);

      if (result.client_id) {
        // Create a new tentative for this client
        const tentative = await api.createTentative(
          result.client_id,
          questionnaireId as string
        );

        if (tentative.tentative_id) {
          // Redirect to the survey page with all necessary parameters
          router.push(
            `/survey/${questionnaireId}?tentativeId=${tentative.tentative_id}&token=${token}`
          );
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register to take the survey
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your name to begin
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Registering..." : "Start Survey"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
