// src/components/MovieCard.js
import React from 'react';
import { motion } from 'framer-motion';

const MovieCard = ({ movie, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(movie)}
    >
      <div className="relative">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-[300px] object-cover"
          onError={(e) => {
            e.target.src = "/api/placeholder/200/300";
          }}
        />
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
          IMDb {movie.imdb_rating}
        </div>
        {movie.metascore && (
          <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
            Meta {movie.metascore}
          </div>
        )}
      </div>
      
      <div className="p-3 space-y-2">
        <div>
          <h3 className="text-base font-semibold text-gray-100 truncate" title={movie.title}>
            {movie.title} ({movie.year})
          </h3>
          <p className="text-gray-400 text-sm truncate" title={movie.director}>
            {movie.director}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {movie.genre.split(', ').map((genre, index) => (
            <span 
              key={index}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
        
        <div className="text-sm text-gray-400 line-clamp-3" title={movie.plot}>
          {movie.plot}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{movie.runtime}</span>
          <span>{movie.rated}</span>
        </div>
        
        <a
          href={`https://www.imdb.com/title/${movie.imdb_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-yellow-600 hover:bg-yellow-700 text-white py-1.5 rounded-lg transition-colors text-center text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          IMDb
        </a>
      </div>
    </motion.div>
  );
};

export default MovieCard;