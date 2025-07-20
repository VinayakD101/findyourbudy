import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { ArrowLeft, ArrowRight, Check, User, Mail, MapPin, Trophy, Calendar, Clock } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  password: string;
  pinCode: string;
  sports: string[];
  skillLevel: string;
  availability: Record<string, string[]>;
}

const SPORTS = [
  'Football', 'Badminton', 'Table Tennis', 'Cricket', 'Tennis', 'Basketball', 'Volleyball', 'Squash'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = ['Morning (6-10 AM)', 'Afternoon (12-5 PM)', 'Evening (5-9 PM)', 'Night (9-11 PM)'];

export function Join() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    pinCode: '',
    sports: [],
    skillLevel: '',
    availability: {}
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSportToggle = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const handleAvailabilityToggle = (day: string, timeSlot: string) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day]?.includes(timeSlot)
          ? prev.availability[day].filter(t => t !== timeSlot)
          : [...(prev.availability[day] || []), timeSlot]
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Sign up user
      const { data: authData, error: authError } = await signUp(formData.email, formData.password);
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: formData.name,
            pin_code: formData.pinCode,
            sports: formData.sports,
            skill_level: formData.skillLevel,
            availability: formData.availability,
            is_available: true
          });

        if (profileError) throw profileError;
        
        navigate('/matches');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.password;
      case 2:
        return formData.pinCode;
      case 3:
        return formData.sports.length > 0 && formData.skillLevel;
      case 4:
        return Object.keys(formData.availability).length > 0;
      default:
        return false;
    }
  };

  const stepVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Find Your Buddy
          </h1>
          <p className="text-gray-600">
            Create your profile to start connecting with players
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
              initial={{ width: '25%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <motion.div
          key={step}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {step === 1 && (
            <div>
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-emerald-600 mr-2" />
                <h2 className="text-xl font-semibold">Basic Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Create a password"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-emerald-600 mr-2" />
                <h2 className="text-xl font-semibold">Location</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pin Code / City
                </label>
                <input
                  type="text"
                  value={formData.pinCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, pinCode: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="e.g., 411001 or Pune"
                />
                <p className="text-sm text-gray-500 mt-2">
                  We'll use this to find players near you
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-center mb-6">
                <Trophy className="w-6 h-6 text-emerald-600 mr-2" />
                <h2 className="text-xl font-semibold">Sports & Skill Level</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Your Sports
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SPORTS.map((sport) => (
                      <button
                        key={sport}
                        onClick={() => handleSportToggle(sport)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.sports.includes(sport)
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{sport}</span>
                          {formData.sports.includes(sport) && (
                            <Check className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Skill Level
                  </label>
                  <div className="space-y-2">
                    {['Beginner', 'Intermediate', 'Pro'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setFormData(prev => ({ ...prev, skillLevel: level }))}
                        className={`w-full p-3 rounded-lg border-2 transition-all ${
                          formData.skillLevel === level
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{level}</span>
                          {formData.skillLevel === level && (
                            <Check className="w-5 h-5" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-emerald-600 mr-2" />
                <h2 className="text-xl font-semibold">Availability</h2>
              </div>
              
              <div className="space-y-4">
                {DAYS.map((day) => (
                  <div key={day} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">{day}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.map((timeSlot) => (
                        <button
                          key={timeSlot}
                          onClick={() => handleAvailabilityToggle(day, timeSlot)}
                          className={`p-2 text-xs rounded-md border transition-all ${
                            formData.availability[day]?.includes(timeSlot)
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {timeSlot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={step === 1 ? () => navigate('/') : handleBack}
            className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === 1 ? 'Back to Home' : 'Previous'}
          </button>

          <button
            onClick={step === 4 ? handleSubmit : handleNext}
            disabled={!isStepValid() || loading}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : step === 4 ? (
              'Complete Setup'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}