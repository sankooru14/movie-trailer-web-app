/** @format */

// Importing necessary dependencies and components
import MovieCard from "./components/MovieCard";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import axios from "axios";
import YouTube from "react-youtube";

// Main function component
function App() {
  // Constants for image path and API URL
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280";
  const API_URL = "https://api.themoviedb.org/3";

  // State variables
  const [movies, setMovies] = useState([]); // Movies list
  const [selectedMovie, setSelectedMovie] = useState({}); // Selected movie details
  const [searchKey, setSearchKey] = useState(""); // Search query
  const [playTrailer, setPlayTrailer] = useState(false); // Boolean to control trailer playing
  const searchRef = useRef(null); // Reference for search input element

  // Function to fetch movies from API
  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover"; // Check if searching or discovering
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY, // API Key
        query: searchKey, // Search query
      },
    });
    setMovies(results); // Set movies state
    await selectMovie(results[0]); // Select the first movie in the list
  };

  // Function to fetch details of a single movie
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY,
        append_to_response: "videos", // Append videos to response
      },
    });
    return data;
  };

  // Function to select a movie
  const selectMovie = async (movie) => {
    setPlayTrailer(false); // Ensure trailer is closed
    const data = await fetchMovie(movie.id); // Fetch details of selected movie
    setSelectedMovie(data); // Set selected movie state
  };

  // useEffect to fetch initial movies and add event listener for Ctrl+K
  useEffect(() => {
    fetchMovies(); // Fetch initial movies
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === "k") {
        // Focus on the search input when Ctrl+K is pressed
        searchRef.current.focus();
        event.preventDefault(); // Prevent default behavior of Ctrl+K
      }
    };
    document.addEventListener("keydown", handleKeyPress); // Add event listener
    return () => {
      document.removeEventListener("keydown", handleKeyPress); // Remove event listener on cleanup
    };
  }, []);

  // Function to render movie cards
  const renderMovies = () =>
    movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} selectMovie={selectMovie} />
    ));

  // Function to handle search submission
  const searchMovies = (e) => {
    e.preventDefault(); // Prevent form submission
    fetchMovies(searchKey); // Fetch movies based on search query
  };

  // Function to render YouTube trailer
  const renderTrailer = () => {
    const trailer = selectedMovie.videos.results.find(
      (vid) => vid.name === "Official Trailer"
    ); // Find official trailer
    const key = trailer ? trailer.key : selectedMovie.videos.results[0].key; // Get trailer key
    return (
      <YouTube
        videoId={key}
        containerClassName={"youtube-container"}
        opts={{
          width: "100%",
          playerVars: {
            autoplay: 1, // Autoplay trailer
            controls: 0, // Hide controls
          },
        }}
      />
    );
  };

  // JSX return
  return (
    <div className="App">
      <header className={"header"}>
        <div className={"header-content max-center"}>
          <h1>Movie Trailer App</h1>
          {/* Search form */}
          <form onSubmit={searchMovies}>
            <input
              ref={searchRef}
              type="text"
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Search Movies..."
              style={{ borderRadius: "5px", padding: "5px" }}
            />
            <button type={"submit"} style={{ padding: "5px" }}>
              Search
            </button>
          </form>
        </div>
      </header>
      {/* Hero section */}
      <div
        className="hero"
        style={{
          backgroundImage: `url(${IMAGE_PATH}${selectedMovie.backdrop_path})`,
        }}
      >
        <div className="hero-content max-center">
          {/* Close button */}
          {playTrailer ? (
            <button
              className={"button button-close"}
              onClick={() => setPlayTrailer(false)}
            >
              Close
            </button>
          ) : null}

          {/* Play trailer button */}
          <button className={"button"} onClick={() => setPlayTrailer(true)}>
            Play Trailer
          </button>
          {/* Movie details */}
          <h1 className={"hero-title"}>{selectedMovie.title}</h1>
          {selectedMovie.overview ? (
            <p className={"hero-overview"}> {selectedMovie.overview}</p>
          ) : null}
        </div>
      </div>
      {/* Render trailer if selected movie has videos */}
      {selectedMovie.videos && playTrailer ? renderTrailer() : null}
      {/* Movies container */}
      <div className="container max-center">{renderMovies()}</div>
    </div>
  );
}

export default App;
