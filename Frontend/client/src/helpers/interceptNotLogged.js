export const handle401Error = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
  
    }
    window.location.replace("/login"); // Cambia "/login" por la ruta que desees
  };
  