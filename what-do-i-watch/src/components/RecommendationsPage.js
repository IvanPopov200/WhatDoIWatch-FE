// src/components/RecommendationsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';

const RecommendationSection = ({ title, description, movies, onMovieClick }) => {
  if (!movies.length) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">{title}</h2>
        <p className="text-gray-400">{description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies.map((movie, index) => (
          <motion.div
            key={movie.imdb_id}
            variants={{
              initial: { opacity: 0, y: 50 },
              animate: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 260,
                  damping: 20 
                }
              }
            }}
          >
            <MovieCard 
              movie={movie} 
              onClick={onMovieClick}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const username = localStorage.getItem('letterboxd_username');
      if (!username) {
        navigate('/');
        return;
      }

      try {
        // First check if user is ready
        const statusResponse = await fetch(`https://api.whatdoi.watch/check_user/${username}`);
        const statusData = await statusResponse.json();
        
        if (statusData.status !== 'ready') {
          navigate('/');
          return;
        }

        // Fetch recommendations
        const recommendationsResponse = await fetch(`https://api.whatdoi.watch/status/${username}`);
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error('Error:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  const handleRegenerate = async () => {
    const username = localStorage.getItem('letterboxd_username');
    if (!username) return;

    setIsRegenerating(true);
    try {
      await fetch(`https://api.whatdoi.watch/regenerate/${username}`, {
        method: 'POST'
      });
      
      const response = await fetch(`https://api.whatdoi.watch/status/${username}`);
      const newRecommendations = await response.json();
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error regenerating recommendations:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const sortedRecommendations = () => {
    const allRecs = recommendations.filter(movie => movie.recommendation_type	 === "all");
    const ratedRecs = recommendations.filter(movie => movie.recommendation_type	 === "rated");

    const sortMovies = (movies) => {
      switch (sortBy) {
        case 'rating':
          return [...movies].sort((a, b) => b.imdb_rating - a.imdb_rating);
        case 'year':
          return [...movies].sort((a, b) => b.year - a.year);
        case 'title':
          return [...movies].sort((a, b) => a.title.localeCompare(b.title));
        default:
          return movies;
      }
    };

    return {
      all: sortMovies(allRecs),
      rated: sortMovies(ratedRecs)
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xl text-purple-400 flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-3 border-purple-400 border-t-transparent rounded-full"
          />
          Loading recommendations...
        </motion.div>
      </div>
    );
  }

  const { all, rated } = sortedRecommendations();
  const totalMovies = all.length + rated.length;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Your Recommendations</h1>
          <p className="text-gray-400 mb-6">
            Based on your Letterboxd profile
          </p>
          <motion.button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={`
              bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg 
              transition-colors inline-flex items-center gap-2
              ${isRegenerating ? 'opacity-75 cursor-not-allowed' : ''}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isRegenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Regenerating...
              </>
            ) : (
              'Generate New Recommendations'
            )}
          </motion.button>
        </motion.div>

        {/* Filters and Sort */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="text-gray-400 text-sm">
            Showing {totalMovies} recommendations
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-gray-100 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
          >
            <option value="default">Sort by Default</option>
            <option value="rating">Sort by Rating</option>
            <option value="year">Sort by Year</option>
            <option value="title">Sort by Title</option>
          </select>
        </motion.div>

        {/* Recommendations Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={sortBy}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 }
            }}
          >
            <RecommendationSection
              title="Based on Your Watch History"
              description="These recommendations are generated based on all movies you've watched on Letterboxd"
              movies={all}
              onMovieClick={setSelectedMovie}
            />
            
            <RecommendationSection
              title="Based on Your Highly Rated Movies"
              description="These recommendations are tailored to match the movies you've rated highest"
              movies={rated}
              onMovieClick={setSelectedMovie}
            />
          </motion.div>
        </AnimatePresence>

        {/* Modal */}
        {selectedMovie && (
          <MovieModal 
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;