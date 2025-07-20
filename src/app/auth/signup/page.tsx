"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Github, Mail, Users, Crown, Shield } from "lucide-react";
import { useState } from "react";
import { log } from "console";

export default function SignupPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "participant",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleRoleChange = (value: string) => {
    setUser((prev) => ({ ...prev, role: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here

    console.log(user);

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Here you would typically send the user data to your backend
    // For demonstration, we'll just log it to the console
    await fetch("/api/admin/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User data submitted:", data);

        if (data.status === 200) {
          window.location.href = "/dashboard";
        }
      })
      .catch((error) => {
        console.error("Error submitting user data:", error);
      });
  };
  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 bg-black text-white">
      {/* Left Section */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-purple-900 via-black to-black p-10 text-white">
        {/* Logo */}
        <div className="z-10 flex items-center text-xl font-semibold">
          <Brain className="mr-2 h-7 w-7 text-purple-400" />
          <span className="font-extrabold text-xl bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
            Quizoraa
          </span>
        </div>

        {/* Animation GIF */}
        <div className="z-10 flex justify-center">
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*QtX9tWcVWv1YFYr_rFEjbA.gif"
            alt="AI Animation"
            className="w-72 h-72 object-contain rounded-xl shadow-lg"
          />
        </div>

        {/* Quote */}
        <motion.div
          className="z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <blockquote className="space-y-3 text-lg">
            <p className="text-purple-300">
              &quot;Join thousands of educators and learners who are
              transforming the way they create and participate in quizzes.&quot;
            </p>
            <footer className="text-sm text-purple-200">
              — The Quizoraa Community
            </footer>
          </blockquote>
        </motion.div>
      </div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Get started with Quizoraa today
            </p>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-white">Sign Up</CardTitle>
              <CardDescription className="text-zinc-400">
                Choose your preferred sign-up method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="hover:border-purple-500 text-white border-zinc-700 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  className="hover:border-pink-500 text-white border-zinc-700 bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="bg-zinc-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
                <div className="space-y-2">
                  <Label htmlFor="name">User Name</Label>
                  <Input
                    id="name"
                    placeholder="JohnDoe"
                    className="bg-zinc-800 text-white border-zinc-700 focus:border-purple-500 focus:ring-purple-500"
                    required
                    name="name"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="bg-zinc-800 text-white border-zinc-700 focus:border-purple-500 focus:ring-purple-500"
                    required
                    name="email"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Select
                    defaultValue="participant"
                    onValueChange={(value) => handleRoleChange(value)}
                  >
                    <SelectTrigger className="bg-zinc-800 text-white border-zinc-700 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                      <SelectItem value="participant">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          Participant
                        </div>
                      </SelectItem>
                      <SelectItem value="creator">
                        <div className="flex items-center">
                          <Crown className="mr-2 h-4 w-4" />
                          Creator
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="bg-zinc-800 text-white border-zinc-700 focus:border-purple-500 focus:ring-purple-500"
                    required
                    name="password"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="bg-zinc-800 text-white border-zinc-700 focus:border-purple-500 focus:ring-purple-500"
                    required
                    name="confirmPassword"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="bg-zinc-800 text-white border-zinc-700 focus:border-purple-500 focus:ring-purple-500"
                    required
                    name="phone"
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-500 hover:to-pink-400"
                >
                  {/* <Link href="*">Create Account</Link> */}
                </Button>
              </form>

              <p className="text-xs text-center text-zinc-400">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-purple-400">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline hover:text-purple-400"
                >
                  Privacy Policy
                </Link>
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-purple-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
