import axios from "axios";

const getMovies = () => {
  return axios.get("http://localhost:3001/api/movies");
};

const moviesService = { getMovies };
export default moviesService;
