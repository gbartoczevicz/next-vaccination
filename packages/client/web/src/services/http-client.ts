import axios from 'axios';

const baseUrl = 'http://localhost:3333';

const httpClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Device: 'Web'
  }
});

export default httpClient;
