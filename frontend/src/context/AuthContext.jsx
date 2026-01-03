import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

axios.defaults.baseURL = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      const userData = response.data.user;
      
      // Fetch employee profile to get full user data
      try {
        const profileResponse = await axios.get(`/api/employees/${userData.id}`);
        const fullUser = {
          ...userData,
          ...profileResponse.data,
          role: userData.role.toLowerCase()
        };
        setUser(fullUser);
      } catch (profileError) {
        // If profile fetch fails, use basic user data
        setUser({
          ...userData,
          role: userData.role.toLowerCase()
        });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Fetch employee profile to get full user data
    try {
      const profileResponse = await axios.get(`/api/employees/${userData.id}`);
      const fullUser = {
        ...userData,
        ...profileResponse.data,
        role: userData.role.toLowerCase()
      };
      setUser(fullUser);
      return fullUser;
    } catch (profileError) {
      // If profile fetch fails, use basic user data
      const basicUser = {
        ...userData,
        role: userData.role.toLowerCase()
      };
      setUser(basicUser);
      return basicUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.role === 'ADMIN';
  };

  const isEmployee = () => {
    return user?.role === 'employee' || user?.role === 'EMPLOYEE';
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      loading, 
      isAdmin, 
      isEmployee,
      updateProfile,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
