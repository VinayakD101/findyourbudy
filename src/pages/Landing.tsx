import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, MapPin, Clock, Star } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              Find Players.{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Play Sports.
              </span>{' '}
              Near You.
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with passionate players in your city. Whether it's football, 
              badminton, tennis, or cricket - find your perfect sports buddy today.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <button
                onClick={() => navigate('/join')}
                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full hover:from-emerald-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Cards */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
          >
            <span className="text-2xl">🏸</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute top-1/3 right-1/4 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
          >
            <span className="text-2xl">⚽</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/3 left-1/6 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
          >
            <span className="text-2xl">🏓</span>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to find your perfect sports buddy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Create Profile",
                description: "Tell us about your sports interests, skill level, and availability"
              },
              {
                icon: MapPin,
                title: "Find Matches",
                description: "We'll connect you with players nearby who share your interests"
              },
              {
                icon: Star,
                title: "Start Playing",
                description: "Connect with your matches and schedule your next game"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: "500+", label: "Active Players" },
              { number: "1000+", label: "Games Organized" },
              { number: "50+", label: "Cities Covered" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-white"
              >
                <div className="text-4xl sm:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-xl opacity-90">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to Find Your Sports Buddy?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of players who have found their perfect sports partners
            </p>
            <button
              onClick={() => navigate('/join')}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full hover:from-emerald-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join Now - It's Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}