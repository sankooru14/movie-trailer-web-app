/** @format */

import React from "react";

/**
 * Functional component representing a movie card.
 * @param {Object} props - The props object.
 * @param {Object} props.movie - The movie object containing details like title, poster_path, etc.
 * @param {Function} props.selectMovie - Callback function to handle selection of a movie.
 * @returns {JSX.Element} Movie card component.
 */
const MovieCard = ({ movie, selectMovie }) => {
  // Base URL for movie poster images
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";

  return (
    <div className={"movie-card"} onClick={() => selectMovie(movie)}>
      {/* Render movie poster if available, otherwise show placeholder */}
      {movie.poster_path ? (
        <img
          className={"movie-cover"}
          src={`${IMAGE_PATH}${movie.poster_path}`}
          alt=""
        />
      ) : (
        <div className={"movie-placeholder"}>No Image Found</div>
      )}
      <h5 className={"movie-title"}>{movie.title}</h5>
    </div>
  );
};

export default MovieCard;
