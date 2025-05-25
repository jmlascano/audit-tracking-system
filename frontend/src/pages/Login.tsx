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
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/login', {
        username: data.username,
        password: data.password,
      });

      if (response.data.success) {
        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userType', response.data.userType);

        // Show success toast
        toast.success('Login successful!');

        // Redirect based on user type
        if (response.data.userType === 'org') {
          navigate('/org-member-mgt');
        } else {
          navigate('/member-fee-mgt');
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
        console.error('Login error:', error);
        toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl font-bold">Log in</h1>
      
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="w-full max-w-sm space-y-6"
        >
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
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
          <Button className="w-full" variant="outline">
            <Link to="/">Go back to landing</Link>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;