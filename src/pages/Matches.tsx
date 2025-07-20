import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { supabase, Profile } from '../lib/supabase';
import { RefreshCw, Filter, MapPin, Trophy, Clock, Mail, User } from 'lucide-react';

export function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Profile[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchMatches();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setUserProfile(data);
    }
  };

  const fetchMatches = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // First get user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      // Find potential matches based on:
      // 1. Same sports interests
      // 2. Same pin code (location)
      // 3. Similar availability
      // 4. Exclude current user
      const { data: potentialMatches, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .eq('is_available', true);

      if (error) throw error;

      // Filter matches by shared sports and location
      const filteredMatches = potentialMatches?.filter(match => {
        const hasSharedSport = match.sports.some(sport => profile.sports.includes(sport));
        const sameLocation = match.pin_code === profile.pin_code;
        return hasSharedSport || sameLocation;
      }) || [];

      setMatches(filteredMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const getSharedSports = (buddy: Profile) => {
    if (!userProfile) return [];
    return buddy.sports.filter(sport => userProfile.sports.includes(sport));
  };

  const getMatchScore = (buddy: Profile) => {
    const sharedSports = getSharedSports(buddy);
    const sameLocation = userProfile?.pin_code === buddy.pin_code;
    const sameSkillLevel = userProfile?.skill_level === buddy.skill_level;
    
    let score = 0;
    score += sharedSports.length * 30; // 30 points per shared sport
    score += sameLocation ? 25 : 0; // 25 points for same location
    score += sameSkillLevel ? 15 : 0; // 15 points for same skill level
    
    return Math.min(score, 100);
  };

  const sortedMatches = matches
    .map(match => ({ ...match, score: getMatchScore(match) }))
    .sort((a, b) => b.score - a.score);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding your perfect sports buddies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Sports Buddies
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {sortedMatches.length > 0 
              ? `Found ${sortedMatches.length} potential buddies near you!`
              : "No matches found yet. Try expanding your sports interests or location."
            }
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center space-x-4 mb-8"
        >
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Matches
          </button>
          
          <button className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </motion.div>

        {/* User Profile Card */}
        {userProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 mb-8 text-white"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                <div className="flex items-center space-x-4 text-white/80 mt-1">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {userProfile.pin_code}
                  </span>
                  <span className="flex items-center">
                    <Trophy className="w-4 h-4 mr-1" />
                    {userProfile.skill_level}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {userProfile.sports.map((sport) => (
                    <span
                      key={sport}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Matches Grid */}
        {sortedMatches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMatches.map((buddy, index) => {
              const sharedSports = getSharedSports(buddy);
              const matchScore = buddy.score;
              
              return (
                <motion.div
                  key={buddy.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Match Score Badge */}
                  <div className="relative">
                    <div className="absolute top-4 right-4 z-10">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        matchScore >= 70 ? 'bg-emerald-500 text-white' :
                        matchScore >= 50 ? 'bg-amber-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {matchScore}% Match
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {/* Profile Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {buddy.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {buddy.pin_code}
                          </div>
                        </div>
                      </div>

                      {/* Skill Level */}
                      <div className="flex items-center space-x-2 mb-4">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {buddy.skill_level}
                        </span>
                      </div>

                      {/* Shared Sports */}
                      {sharedSports.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Shared Interests:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {sharedSports.map((sport) => (
                              <span
                                key={sport}
                                className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium"
                              >
                                {sport}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* All Sports */}
                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Plays:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {buddy.sports.map((sport) => (
                            <span
                              key={sport}
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                sharedSports.includes(sport)
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {sport}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Connect Button */}
                      <a
                        href={`mailto:${buddy.id}@findyourbuddy.com?subject=Let's play sports together!&body=Hi ${buddy.name}, I found your profile on Find Your Buddy and would love to play ${sharedSports.join(', ') || buddy.sports[0]} together!`}
                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 font-medium"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Connect Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No matches found yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Don't worry! More players are joining every day. Try refreshing or updating your preferences.
            </p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Matches
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}