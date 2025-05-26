import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { UserPlus, Menu, X, ArrowRight } from 'lucide-react';

type FormData = {
  username: string;
  password: string;
  email: string;
  name: string;
  degree_program?: string;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
};

const MemberSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      degree_program: "",
      gender: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/signup/members', {
        member_username: data.username,
        member_password: data.password,
        member_email: data.email,
        member_name: data.name,
        degree_program: data.degree_program || null,
        gender: data.gender || null,
      });

      if (response.data.success) {
        toast.success('Signup successful!');
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 py-4 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-yellow-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              Batis
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-800 hover:text-purple-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-xl border border-white/30">
              <button
                onClick={() => navigate('/')}
                className="block w-full text-center font-medium text-lg py-2 text-gray-800 hover:text-purple-600"
              >
                Home
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all duration-700 opacity-100 translate-y-0">
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-t-xl -mt-8 -mx-8 p-4 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-yellow-400 mr-2" />
            <h1 className="text-2xl font-bold text-white">Member Sign Up</h1>
          </div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-400/20 rounded-full animate-pulse" aria-hidden="true"></div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        required
                        className="border-purple-200 focus:ring-purple-600 rounded-lg"
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
                    <FormLabel className="text-gray-800 font-semibold">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        required
                        className="border-purple-200 focus:ring-purple-600 rounded-lg"
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
                    <FormLabel className="text-gray-800 font-semibold">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        {...field}
                        required
                        className="border-purple-200 focus:ring-purple-600 rounded-lg"
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
                    <FormLabel className="text-gray-800 font-semibold">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        required
                        className="border-purple-200 focus:ring-purple-600 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="degree_program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">Degree Program (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your degree program"
                        {...field}
                        className="border-purple-200 focus:ring-purple-600 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-semibold">Gender (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-purple-200 focus:ring-purple-600 rounded-lg">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-600 font-semibold rounded-full py-2.5 transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-purple-600" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-full py-2.5 transition-all duration-200"
                asChild
              >
                <Link to="/">Go Back to Home</Link>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MemberSignup;