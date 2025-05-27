'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import pi from '@/assets/pi.png'; // Adjust the path as necessary
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (username === 'admin@example.com' && password === 'Admin@123') {
        await router.push('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-[#800000] text-white py-3 px-6 shadow-md">
        <h1 className="text-lg font-bold">PiSync Admin Dashboard</h1>
      </div>

      {/* Login Layout */}
      <div className="flex flex-col md:flex-row items-center justify-evenly h-[calc(100vh-56px)] px-4">
        {/* Logo */}
        <div className="mb-8 md:mb-0 md:mr-12">
          <Image
            src={pi}
            alt="Pi Logo"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Form */}
        <div className="w-full max-w-sm space-y-4">
          <Input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-400"
          />
          <Input
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400"
          />

          <div className="text-right text-sm">
            <a href="#" className="text-teal-700 font-semibold hover:underline">
              Forgot password
            </a>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            className="w-full bg-black cursor-pointer hover:bg-gray-800 text-white rounded-md border border-blue-700"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
