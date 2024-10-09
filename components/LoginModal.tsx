// components/LoginModal.tsx

"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signIn, signUp } = useAuth(); // Access signIn and signUp from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

  const handleAuth = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, captchaToken);
        toast.success('Signed up successfully! Please check your email to confirm.');
        onClose();
      } else {
        await signIn(email, password, captchaToken);
        toast.success('Logged in successfully!');
        onClose();
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      if (error.status === 400 && error.error_description === 'Email not confirmed') {
        toast.error('Your email is not confirmed. Please check your inbox.');
        // Optionally, you can add a button to resend confirmation email here
      } else if (error.status === 400 && error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password.');
      } else {
        toast.error(error.message || 'Failed to authenticate.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-80"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: .5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <div className="flex flex-col space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div id="captcha2" className='-translate-x-3.5'>
          <HCaptcha sitekey="9928d4f0-5fe0-435a-8c20-3098663ad612" 
          onVerify={(token) => {
            setCaptchaToken(token)
            const captchaElement = document.getElementById("captcha2");
            if (captchaElement) {
              captchaElement.style.display = "none";
            }
          }}/>
          </div>
          <Button onClick={handleAuth} disabled={loading}>
            {loading ? (isSignUp ? 'Signing Up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <p className="text-sm text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              onClick={toggleMode}
              className="text-blue-500 cursor-pointer underline"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}