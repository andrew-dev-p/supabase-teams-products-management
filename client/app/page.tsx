"use client";

import { ArrowRight, ShieldHalf, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-background px-4 text-center">
      <div className="space-y-12 max-w-3xl">
        <div className="flex items-center justify-center gap-10">
          <motion.div
            className="bg-primary/10 p-3 rounded-full"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>

          <Image
            src="/logo.png"
            alt="logo"
            width={56}
            height={56}
            className="rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-background"
          />
          <motion.div
            className="bg-primary/10 p-3 rounded-full"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4,
            }}
          >
            <ShieldHalf className="h-8 w-8 text-primary" />
          </motion.div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Let&apos;sCollab!
            </span>
          </h1>
          <p className="mx-auto max-w-[650px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Discover a new way to connect, create, and collaborate with our
            revolutionary platform that redefines the boundaries of
            collaboration and creativity. Join a community where imagination
            knows no limits and connections are limitless.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full px-8 group">
            <Link href="/login">
              Log In{" "}
              <ArrowRight className="mt-px h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 group"
          >
            <Link href="/signup" className="flex items-center gap-1">
              Sign Up{" "}
              <ArrowRight className="mt-px h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
