import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoadingDots = () => {
  return (
    <span className="inline-flex items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.25,
            delay: i * 0.2,
          }}
          className="mx-0.5"
        >
          .
        </motion.span>
      ))}
    </span>
  );
};

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkSavedUsername = async () => {
    const savedUsername = localStorage.getItem('letterboxd_username');
    if (savedUsername) {
      setIsLoading(true);
      setLoadingStatus('Checking saved profile');
      try {
        const status = await checkUserStatus(savedUsername);
        if (status === 'ready') {
          navigate('/recommendations');
        } else {
          // If not ready, start polling
          pollUserStatus(savedUsername);
        }
      } catch (error) {
        setError('Error checking saved profile');
        setIsLoading(false);
      }
    }
  };

  const extractUsername = (url) => {
    // Handle both full URLs and direct usernames
    const urlPattern = /letterboxd\.com\/([^/]+)/;
    const match = url.match(urlPattern);
    return match ? match[1] : url.trim();
  };

  const checkUserStatus = async (username) => {
    try {
      const response = await fetch(`https://api.whatdoi.watch/check_user/${username}`);
      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error('Error checking user status:', error);
      throw new Error('Failed to check user status');
    }
  };

  const pollUserStatus = async (username) => {
    while (true) {
      try {
        const status = await checkUserStatus(username);
        
        if (status === 'ready') {
          setIsLoading(false);
          navigate('/recommendations');
          return;
        } else if (status === 'new_user') {
          setLoadingStatus('Gathering data');
        } else if (status === 'scraping') {
          setLoadingStatus('Scraping your Letterboxd profile');
        } else if (status === 'movie_data') {
          setLoadingStatus('Generating your recommendations');
        } else {
          throw new Error('Unknown status received');
        }
        
        // Wait 2 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        setError('Something went wrong. Please try again.');
        setIsLoading(false);
        return;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoadingStatus('Checking profile');
  
    const username = extractUsername(profileUrl);
  
    try {
      const response = await fetch(`https://api.whatdoi.watch/lb_check/${username}`);
      const data = await response.json();
  
      if (data.status === true) {
        localStorage.setItem('letterboxd_username', username); // Save username
        await pollUserStatus(username);
      } else {
        setError('Profile not found. Please check the URL and try again.');
        setIsLoading(false);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Add useEffect at the top of your component to check on page load:
  useEffect(() => {
    checkSavedUsername();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8 text-center"
      >
        {/* Header */}
        <div className="space-y-4">
          <Film className="w-16 h-16 mx-auto text-purple-500" />
          <h1 className="text-4xl font-bold tracking-tight">
            What Do I Watch?
          </h1>
          <p className="text-xl text-gray-400">
            AI-powered movie recommendations based on your Letterboxd profile
          </p>
        </div>

        {/* Feature List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-400">Personalized</h3>
            <p className="text-gray-400">Tailored recommendations based on your unique taste</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-400">Intelligent</h3>
            <p className="text-gray-400">Advanced AI analysis of your viewing history</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-400">Simple</h3>
            <p className="text-gray-400">Just enter your profile URL and get started</p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="Enter your Letterboxd profile URL or username"
              className="px-4 py-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none w-full text-gray-100 placeholder-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              Get Recommendations
            </button>
          </div>
        </form>

        {/* Loading Animation */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-purple-400 mt-4 flex items-center justify-center space-x-2"
          >
            <span>{loadingStatus}</span>
            <LoadingDots />
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 mt-4"
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <footer className="mt-16 text-gray-500 text-sm">
        Powered by AI • Not affiliated with Letterboxd
      </footer>
    </div>
  );
};

export default HomePage;