// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Aquí podrías realizar alguna lógica para comprobar la autenticación del usuario
    // Puedes utilizar localStorage, cookies, o cualquier otra forma de persistencia
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const isUserLogged = () => user !== null;

  const login = (userData) => {
    // Aquí podrías realizar la lógica de autenticación
    // Por ejemplo, guardar el usuario en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // Aquí podrías realizar la lógica de cierre de sesión
    // Por ejemplo, eliminar el usuario de localStorage
    localStorage.removeItem('user');
    setUser(null);
  };

  const contextValue = {
    user,
    isUserLogged,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
