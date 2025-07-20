"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Brain, Users, Trophy, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/app/lib/utils";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Questions",
    description:
      "Generate intelligent questions instantly using advanced AI technology",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description:
      "Host live quiz sessions with real-time participant interaction",
  },
  {
    icon: Trophy,
    title: "Competitive Leaderboards",
    description:
      "Track performance and compete with others on global leaderboards",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get immediate feedback and detailed analytics after each quiz",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Teacher",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content:
      "QuizAI has transformed how I engage with my students. The AI-generated questions are incredibly relevant and save me hours of preparation time.",
  },
  {
    name: "Mike Rodriguez",
    role: "Corporate Trainer",
    avatar:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content:
      "The real-time features and analytics help me understand exactly where my team needs improvement. It's a game-changer for corporate training.",
  },
  {
    name: "Emily Watson",
    role: "Student",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    content:
      "I love the competitive aspect and the badges system. It makes learning fun and motivates me to keep improving my knowledge.",
  },
];

const steps = [
  {
    step: "1",
    title: "Create or Join",
    description:
      "Start by creating a new quiz or joining an existing session with a code",
  },
  {
    step: "2",
    title: "AI Enhancement",
    description:
      "Use our AI to generate questions or enhance your existing content",
  },
  {
    step: "3",
    title: "Live Interaction",
    description:
      "Host real-time sessions with live leaderboards and instant feedback",
  },
  {
    step: "4",
    title: "Track Progress",
    description:
      "Analyze results, earn badges, and climb the global leaderboard",
  },
];

export default function HomePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "participant",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  useEffect(() => {
    // Fetch user data or perform any necessary side effects
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      await fetch("/api/admin")
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-muted-foreground ">
      {/* Hero Section */}

      <div className="min-h-screen relative w-full overflow-hidden flex flex-col items-center justify-center rounded-lg">
        <div className="absolute inset-0 w-full h-full z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

        <Boxes />
        <div className="relative flex justify-center items-center">
          <motion.div
            className="flex flex-col items-center space-y-6 text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-purple-500 text-white px-3 py-1 rounded-full">
              <Brain className="mr-1 h-4 w-4" /> AI-Powered Learning
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-pink-500 bg-clip-text text-transparent">
              Transform Learning with AI-Powered Quizzes
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              Create dynamic quizzes, host sessions, and analyze progress with
              ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-fuchsia-600 hover:bg-fuchsia-700 relative z-30"
              >
                <Link href="/auth/signup">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-fuchsia-500 text-fuchsia-400 relative z-30"
              >
                <Link href="/demo">View Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 px-10 flex justify-center items-center">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-cyan-400">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tools that empower your quiz-making journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-gradient-to-br from-cyan-700 to-fuchsia-700 text-white shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <feature.icon className="w-10 h-10 mb-4" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-10 min-h-screen flex justify-center items-center">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-fuchsia-400">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Get started in minutes with our intuitive platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg text-center shadow-lg"
                whileHover={{ rotate: 2 }}
              >
                <div className="bg-fuchsia-500 text-white w-12 h-12 mx-auto flex items-center justify-center rounded-full mb-4 font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-10  min-h-screen flex justify-center items-center">
        <div className="container px-4">
          <div className="grid md:grid-cols-1 gap-8">
            <motion.div
              className="bg-fuchsia-800 p-6 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="w-10 h-10 mb-2 text-white" />
              <h3 className="text-xl font-bold text-white">Host a Quiz</h3>
              <p className="text-gray-300 mb-4">
                Create engaging quizzes and host real-time interactions.
              </p>
              <Button asChild className="bg-white text-black">
                <Link href="/create">
                  Create Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              className="bg-cyan-800 p-6 rounded-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-10 h-10 mb-2 text-white" />
              <h3 className="text-xl font-bold text-white">Join a Quiz</h3>
              <p className="text-gray-300 mb-4">
                Enter a quiz code to join competitive sessions.
              </p>
              <Button
                asChild
                variant="outline"
                className="border-white text-white"
              >
                <Link href="/join">
                  Join Quiz <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-10 min-h-screen flex justify-center items-center">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-yellow-400">
              What Our Users Say
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Join thousands of learners loving QuizAI.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-xl text-white shadow-lg"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <span className="text-sm text-gray-400">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-sm">&quot;{testimonial.content}&quot;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-10 bg-gradient-to-br from-fuchsia-700 to-cyan-600 text-white text-center">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4">
              Ready to Revolutionize Your Learning?
            </h2>
            <p className="text-lg md:text-xl mb-6">
              Join thousands already creating smarter, more fun quizzes with
              QuizAI.
            </p>
            <Button
              size="lg"
              asChild
              variant="secondary"
              className="bg-white text-black"
            >
              <Link href="/auth/signup">
                Start Now for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
