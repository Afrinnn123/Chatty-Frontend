import axios from 'axios';

interface Headers {
  'Content-Type': string;
  Authorization?: string; 
}

let headers: Headers = {
  'Content-Type': 'application/json',
};


if (typeof window !== 'undefined') {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  headers,
});

export default axiosInstance;
