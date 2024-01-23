import axios from "axios";

const getUsers = () => {
  return axios.get("http://localhost:3001/api/users");
};

const usersService = { getUsers };
export default usersService;
