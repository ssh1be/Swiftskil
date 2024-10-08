// components/homepage.tsx

"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import  LoginButton from '@/components/login-button';
import { useState, useEffect } from 'react';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    if (user) {
      router.push('/lesson-plan'); // Navigate if already logged in
    } else {
      setIsModalOpen(true); // Open login modal
    }
  };

  useEffect(() => {
    if (user) {
      // Automatically navigate if user is logged in
      router.push('/lesson-plan');
    }
  }, [user, router]);

  return (
    <motion.main
      className="flex min-h-screen flex-col items-center justify-center p-24 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
    >
      {/* Background Video */}
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover -z-10">
        <source src="/assets/bg2birds.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Centered Content */}
      <div className="relative flex flex-col items-center justify-center user-select-none">
        {/* Transparent Image */}
        <Image
          src="/assets/transparent.svg"
          alt="Transparent Image"
          width={1000} // Adjust width and height as needed
          height={1000}
        />

        {/* Descriptive Text */}
        <div
          style={{
            fontFamily: 'Comfortaa, sans-serif',
            color: '#52b39e',
            fontSize: '25px',
            userSelect: 'none',
          }}
          className="text-center mt-4"
        >
          Learn about{" "}
          <span className="font-bold">Anything</span>
        </div>

        {/* Login Button */}
        <LoginButton
          onClick={handleStart}
          aria-label="Login to start the lesson plan"
        />
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.main>
  );
}
