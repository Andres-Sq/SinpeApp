// clientValidation.js
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const client = urlParams.get('client');
    
    if (!client) {
      // Si no hay cliente, redirige a la página de error
      window.location.href = "/checkpages/error.html";
    } else {
      // Verificamos el cliente en la API
      fetch(`https://sinpe-api-production.up.railway.app/api/config/${client}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("Cliente no encontrado");
          }
          return res.json();
        })
        .then(data => {
          // Aquí podrías guardar los datos del cliente si son válidos
          console.log("Cliente válido:", data);
        })
        .catch(err => {
          console.error("Error al obtener configuración del cliente:", err);
          // Si no se encuentra el cliente, redirige a la página de error
          window.location.href = "/checkpages/error.html";
        });
    }
  });  