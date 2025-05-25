import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from 'react-router-dom';

type FormData = {
  username: string;
  password: string;
  email: string;
  name: string;
};

const OrgSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/signup/orgs', {
        org_username: data.username,
        org_password: data.password,
        org_email: data.email,
        org_name: data.name,
      });

      if (response.data.success) {
        // Show success toast
        toast.success('Signup successful!');

        // Redirect back to landing
        navigate("/");
      } else {
        toast.error('Signup error');
      }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error('Username or email already exists');
        } else {
        toast.error('Signup failed. Please try again.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl font-bold">Organization Sign Up</h1>
      
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="w-full max-w-sm space-y-6"
        >
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your name" 
                    {...field} 
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    {...field} 
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your username" 
                    {...field} 
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Enter your password" 
                    {...field} 
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
          <Button className="w-full" variant="outline">
            <Link to="/">Go back to landing</Link>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OrgSignup;