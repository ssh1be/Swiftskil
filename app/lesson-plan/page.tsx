// page.tsx

"use client";

import Image from "next/image";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import LessonPlan from '@/components/lesson-plan';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [lessonPlan, setLessonPlan] = useState(null);

  const handleSearch = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setLoading(true);
    setLessonPlan(null);
    try {
      console.log('Sending request to /api/ai');
      const topicResponse = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'searchTopic', payload: { topic } }),
      });
      console.log('Response status:', topicResponse.status);
      const topicResult = await topicResponse.json();
      console.log('Topic result:', topicResult);

      if (!topicResponse.ok) {
        throw new Error(topicResult.message || topicResult.error || `Failed to search topic: ${topicResponse.statusText}`);
      }

      const planResponse = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generateLessonPlan', payload: topicResult }),
      });
      console.log('Plan response status:', planResponse.status);
      const plan = await planResponse.json();
      console.log('Lesson plan:', plan);

      if (!planResponse.ok) {
        throw new Error(plan.message || plan.error || `Failed to generate lesson plan: ${planResponse.statusText}`);
      }

      setLessonPlan(plan);
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      toast.error(`Failed to generate lesson plan: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.error_description || 'Failed to sign out.');
    }
  };

  return (
  <ProtectedRoute>
    <motion.div
      className=""
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1 }}
    >
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover -z-10">
        <source src="assets/bg2birdsblue.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>AI-Powered Learning Platform</CardTitle>
          <CardDescription>Enter a topic to generate a personalized lesson plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter a topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
            <Button onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
          {lessonPlan && (
            <div className="mt-6">
              <LessonPlan plan={lessonPlan} />
            </div>
          )}
          
        </CardContent>
      </Card>
      
    </main>
    </motion.div>
  </ProtectedRoute>
  );
}
