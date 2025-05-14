import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Define login schema for form validation
const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in - routes based on user role
  React.useEffect(() => {
    if (user) {
      // Redirect admins to /admins and company users to /dashboard
      navigate(user.role === "admin" ? "/admins" : "/dashboard");
    }
  }, [user, navigate]);

  // Create form with validation schema
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      // For demo purposes, simulate successful login with hardcoded credentials
      if (
        values.email === "admin@example.com" &&
        values.password === "adminpassword"
      ) {
        // Mock successful admin login
        const mockAdminResponse = {
          token: "mock-admin-token",
          role: "admin",
        };
        await login(values.email, values.password, mockAdminResponse);
        toast({
          title: "Login successful",
          description: "Welcome, Admin!",
        });
      } else if (
        values.email === "company@example.com" &&
        values.password === "companypassword"
      ) {
        // Mock successful company login
        const mockCompanyResponse = {
          token: "mock-company-token",
          role: "company",
        };
        await login(values.email, values.password, mockCompanyResponse);
        toast({
          title: "Login successful",
          description: "Welcome to your company dashboard!",
        });
      } else {
        // Real API call for other credentials
        await login(values.email, values.password);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Error handling is done in the login function already
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to fill demo credentials
  const fillDemoCredentials = (role: "admin" | "company") => {
    if (role === "admin") {
      form.setValue("email", "admin@example.com");
      form.setValue("password", "adminpassword");
    } else {
      form.setValue("email", "company@example.com");
      form.setValue("password", "companypassword");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-muted/20 p-4">
      {/* Login card with form */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email input field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password input field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit button with loading state */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        {/* Demo account information for testing */}
        <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>Click to auto-fill demo accounts:</p>
          <div className="flex gap-4 w-full justify-around">
            <Button
              variant="outline"
              onClick={() => fillDemoCredentials("admin")}
              className="text-xs p-2 h-auto"
            >
              Use Admin Account
            </Button>
            <Button
              variant="outline"
              onClick={() => fillDemoCredentials("company")}
              className="text-xs p-2 h-auto"
            >
              Use Company Account
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
