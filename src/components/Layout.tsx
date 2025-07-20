import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Find Your Buddy
              </span>
            </motion.div>

            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}