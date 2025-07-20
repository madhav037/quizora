"use client";

import Link from "next/link";
import { Brain, Github, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-gradient-to-br from-black via-zinc-900 to-black text-muted-foreground px-5">
      <div className="container py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <Brain className="h-7 w-7 text-purple-500 drop-shadow-lg" />
              <span className="font-extrabold text-xl bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                Quizoraa
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              The ultimate AI-powered quiz platform for interactive learning and
              engagement.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Browse Quizzes", href: "/quizzes", color: "purple" },
                { label: "Create Quiz", href: "/create", color: "pink" },
                { label: "Leaderboard", href: "/leaderboard", color: "blue" },
                { label: "Badges", href: "/badges", color: "yellow" },
              ].map(({ label, href, color }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`transition hover:text-${color}-400 hover:pl-1 duration-200`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Help Center", href: "/help", color: "purple" },
                { label: "Contact Us", href: "/contact", color: "pink" },
                { label: "Privacy Policy", href: "/privacy", color: "blue" },
                { label: "Terms of Service", href: "/terms", color: "yellow" },
              ].map(({ label, href, color }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`transition hover:text-${color}-400 hover:pl-1 duration-200`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Connect
            </h4>
            <div className="flex space-x-4 mt-2">
              {[
                { icon: Twitter, color: "text-sky-400", href: "#" },
                { icon: Github, color: "text-white", href: "#" },
                { icon: Mail, color: "text-rose-400", href: "#" },
              ].map(({ icon: Icon, color, href }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="transition duration-200"
                >
                  <Link href={href} className={`hover:opacity-80 ${color}`}>
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">Social</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-purple-400 font-semibold">Quizoraa</span>. All
            rights reserved. Built with{" "}
            <span className="text-pink-500">❤️</span> to make learning fun.
          </p>
        </div>
      </div>
    </footer>
  );
}
