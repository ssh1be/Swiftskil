// components/homepage.tsx

"use client";

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button'; // Ensure you have a Button component or use a standard button

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/lesson-plan'); // Navigates to the main application page
  };

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


        {/* Start Button */}
        <Button
          onClick={handleStart}
          className="mt-8 px-6 py-3 bg-[#52b39e] text-white rounded-md hover:bg-[#52b39e] transition-colors duration-300"
          aria-label="Start the lesson plan"
        >
          Start
        </Button>
      </div>
    </motion.main>
  );
}
