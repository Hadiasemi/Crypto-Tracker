import axios from 'axios';

const baseURL =
  process.env.REACT_APP_ENV === 'prod' ? 'https://jinychoi.dev/flask/' : 'http://localhost:5000/';

export const userApi = axios.create({
  baseURL: baseURL,
});

userApi.interceptors.request.use((config) => ({
  ...config,
  headers: {
      'Content-Type': 'application/json',
      bearer: localStorage.getItem('token')
  },
}));

userApi.interceptors.response.use((response) => 
    response,
    async (error) => Promise.reject(error.response)
);

export const authApi = axios.create({
  baseURL: baseURL,
});

authApi.interceptors.request.use((config) => ({
    ...config
}));

userApi.interceptors.response.use((response) => 
    response,
    async (error) => Promise.reject(error.response)
);

// export { userApi, authApi };
