import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',  // adjust port if needed
  withCredentials: true,                // send cookies for session auth
});

export default instance;
