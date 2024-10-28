// src/components/MovieModal.js
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MovieModal = ({ movie, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!movie) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackgroundClick}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center z-10">
            <h2 className="text-xl font-bold text-gray-100">{movie.title} ({movie.year})</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <motion.img 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                src={movie.poster} 
                alt={movie.title}
                className="w-full md:w-80 h-auto rounded-lg object-cover"
                onError={(e) => {
                  e.target.src = "/api/placeholder/300/450";
                }}
              />
              
              <div className="flex-1 space-y-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-4 flex-wrap"
                >
                  <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    IMDb {movie.imdb_rating}
                  </div>
                  {movie.metascore && (
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                      Metascore {movie.metascore}
                    </div>
                  )}
                  <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                    {movie.runtime}
                  </div>
                  <div className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                    {movie.rated}
                  </div>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 leading-relaxed text-lg"
                >
                  {movie.plot}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <div><span className="text-gray-400">Director:</span> {movie.director}</div>
                  <div><span className="text-gray-400">Writers:</span> {movie.writer}</div>
                  <div><span className="text-gray-400">Stars:</span> {movie.actors}</div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-2"
                >
                  {movie.genre.split(', ').map((genre, index) => (
                    <span 
                      key={index}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </motion.div>

                {movie.awards !== "N/A" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gray-700 p-4 rounded-lg"
                  >
                    <h3 className="font-semibold text-yellow-400 mb-2">Awards</h3>
                    <p className="text-gray-300">{movie.awards}</p>
                  </motion.div>
                )}

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-2"
                >
                  <div><span className="text-gray-400">Released:</span> {movie.released}</div>
                  <div><span className="text-gray-400">Country:</span> {movie.country}</div>
                  <div><span className="text-gray-400">Language:</span> {movie.language}</div>
                  {movie.box_office !== "N/A" && (
                    <div><span className="text-gray-400">Box Office:</span> {movie.box_office}</div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="pt-4"
                >
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on IMDb
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieModal;