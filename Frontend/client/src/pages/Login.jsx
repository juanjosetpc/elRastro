import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../services/auth';
import {jwtDecode} from 'jwt-decode';

const Login = ({ onLogin }) => {

    const navigate = useNavigate();

    async function handleCallbackRespones(res) {
      console.log("Encoded JWT ID token: " + res.credential);
      var user = jwtDecode(res.credential);
      console.log(user);
      localStorage.setItem("token", res.credential); // Guarda el token en localStorage
      onLogin(user, res.credential);

      try {
        const response = await auth.post("/logged", { token: res.credential });
        if(response.status === 200){
            navigate("/");
        }
        console.log(response.data);
      } catch (error) {
        console.error("Error al enviar el token al backend", error);
      }
    }

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_CLIENT_ID,
      callback: handleCallbackRespones,
    });

    google.accounts.id.renderButton(
      document.getElementById("sigInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div id="sigInDiv"></div>
    </div>
  );
};

export default Login;
