import api from './api';

export const login = async (username, password) => {
  const res = await api.post('/auth/login', { username, password });
  localStorage.setItem('token', res.data.access_token);
  api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
