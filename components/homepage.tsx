// components/homepage.tsx

"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import  LoginButton from '@/components/login-button';
import GuestLoginButton from "@/components/guestLogin-button";
import { useState, useEffect } from 'react';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import HCaptcha from '@hcaptcha/react-hcaptcha'


export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

  const handleStart = () => {
    if (user) {
      router.push('/lesson-plan'); // Navigate if already logged in
    } else {
      setIsModalOpen(true); // Open login modal
    }
  };

  const {signInAsGuest} = useAuth();

  const handleGuestLogin = async () => {
    try {
      await signInAsGuest(captchaToken);
      toast.success('Signed in as guest successfully!');
      handleStart();
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.error_description || 'Failed to sign in as guest.');
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
        <div id="captcha" className="visible z-10 translate-y-20">
          <HCaptcha sitekey="9928d4f0-5fe0-435a-8c20-3098663ad612" 
          onVerify={(token) => {
            setCaptchaToken(token)
            const captchaElement = document.getElementById("captcha");
            if (captchaElement) {
              captchaElement.style.display = "none";
            }
          }}/>
        </div>
        <div className="flex-row items-center space-x-5 justify-center">
        <LoginButton
          onClick={handleStart}
          aria-label="Login to start the lesson plan"
        />
        <GuestLoginButton
          onClick={handleGuestLogin}
          aria-label="Login as a guest to start the lesson plan"
        />
        </div>
        
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.main>
  );
}
