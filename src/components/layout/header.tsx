"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Quizzes", href: "/quizzes" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Badges", href: "/badges" },
];

// Mock user - in real app this would come from auth context
const mockUser = {
  name: "Alice Johnson",
  email: "alice@example.com",
  role: "creator" as const,
  avatar:
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
};

export function Header() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "participant",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      await fetch("/api/admin")
        .then((res) => res.json())
        .then((data) => {
          setUser(data.user);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const pathname = usePathname();
  const isAuthenticated = !pathname.startsWith("/auth");

  return (
    <header className="sticky top-0 z-50 w-full px-10 border-b border-zinc-800 bg-black">
      <div className="container flex h-16 items-center justify-between animate-fadeIn">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="h-6 w-6 text-purple-400 drop-shadow" />
            </motion.div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
              Quizoraa
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-2 py-1.5 transition-all duration-300 hover:text-white hover:bg-purple-700/30 ${pathname === item.href
                    ? "bg-purple-600/20 text-white"
                    : "text-zinc-300"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Sheet Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden hover:bg-purple-700/10"
            >
              <Menu className="h-5 w-5 text-white" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-zinc-900 text-white">
            <SheetHeader>
              <SheetTitle>
                <Link href="/" className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-purple-400" />
                  <span className="font-bold">Quizoraa</span>
                </Link>
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigation menu
              </SheetDescription>
            </SheetHeader>
            <div className="my-6 flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md transition-colors hover:bg-purple-700/20 ${pathname === item.href
                      ? "bg-purple-600/20 text-white"
                      : "text-zinc-300"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {user?.name ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-60 bg-zinc-800 text-white border-zinc-700"
                align="end"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-semibold">{mockUser.name}</span>
                    <span className="text-xs text-zinc-400">
                      {mockUser.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  {user.name ? (
                    <Link href="/" onClick={() => setUser({
                      name: "",
                      email: "",
                      role: "participant",
                      password: "",
                      confirmPassword: "",
                      phone: "",
                    })}>Sign out</Link>
                  ) : (
                    <Link href="/auth/login">Sign in</Link>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-300 hover:text-white"
                asChild
              >
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                asChild
              >
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
