// --- Año en el footer ---
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// --- Validación y formato de número SINPE ---
window.addEventListener("DOMContentLoaded", () => {
  const numeroInput = document.getElementById("phone_number");

  if (numeroInput) {
    numeroInput.addEventListener("input", (e) => {
      let valor = e.target.value.replace(/\D/g, "");
      if (valor.length > 4) {
        valor = valor.slice(0, 4) + "-" + valor.slice(4, 8);
      }
      e.target.value = valor;
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const client = urlParams.get("client");

  if (!client) {
    alert("Cliente no especificado en la URL");
    window.location.href = "/checkpages/error.html";
    return;
  }

  fetch(`https://sinpe-api-production.up.railway.app/api/config/${client}`)
    .then((res) => {
      if (!res.ok) throw new Error("Cliente no encontrado");
      return res.json();
    })
    .then((data) => {
      document.getElementById("phone_number").value = data.phone;
    })
    .catch((err) => {
      console.error("Error al obtener configuración:", err);
      alert("No se pudo cargar la configuración del cliente.");
      window.location.href = "/checkpages/error.html";
    });
});

// --- Función para enviar el SMS ---
function sendSMS() {
  const isEnglish = window.location.pathname.includes("main_en");

  const amount = document.getElementById("amount").value.trim();
  const details = document.getElementById("details").value.trim();
  const phone_number = document.getElementById("phone_number").value.replace(/-/g, "");
  const bank = document.getElementById("bank").value;

  if (!bank || !phone_number || !amount || !details) {
    const alertMsg = isEnglish ? "Please complete all fields." : "Por favor completa todos los campos.";
    alert(alertMsg);
    return;
  }

  const datos = {
    bank,
    phone_number,
    amount,
    details
  };

  fetch("https://sinpe-api-production.up.railway.app/api/sms/create-sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  })
    .then((response) => response.json())
    .then((data) => {
      const smsMessage = data.message;
      const smsUrl = `sms:${bank}?&body=${encodeURIComponent(smsMessage)}`;
  
      // Guardamos el estado en sessionStorage
      sessionStorage.setItem("sms_success", "true");
  
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
  
      const alertMsg = isEnglish
        ? "Message generated successfully. You will now be redirected to your SMS app."
        : "Mensaje generado con éxito. Ahora serás redirigido a tu app de mensajes.";
      
      alert(alertMsg);
  
      // En iOS no se puede hacer una redirección posterior al abrir la app de mensajes
      if (isIOS) {
        // Redirige al SMS y el usuario debe volver manualmente al navegador
        window.location.href = smsUrl;
        // No pongas nada después de esta línea
      } else if (isAndroid) {
        // En Android se puede usar setTimeout para redirigir después de abrir SMS
        window.location.href = smsUrl;
        setTimeout(() => {
          window.location.href = "/checkpages/success.html";
        }, 1500); // Da tiempo a que se abra la app de mensajes
      } else {
        // Por si se usa en navegador de escritorio u otro sistema
        alert("This feature is intended for mobile devices.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      const alertMsg = isEnglish
        ? "There was an error sending the message."
        : "Se ha producido un error al enviar el mensaje.";
      alert(alertMsg);
      sessionStorage.setItem("sms_error", "true");
      window.location.href = "/checkpages/error.html";
    });  

window.addEventListener('DOMContentLoaded', () => {
  // Obtener el parámetro 'client' de la URL actual
  const urlParams = new URLSearchParams(window.location.search);
  const client = urlParams.get('client');
  
  // Si 'client' existe, actualizar los enlaces de idioma
  if (client) {
    const langLinks = document.querySelectorAll('#lang-en, #lang-es'); // Selecciona los enlaces de idioma por id
    
    langLinks.forEach(link => {
      const href = link.getAttribute('href');
      // Añadir el parámetro client=cliente al enlace
      link.setAttribute('href', href + (href.includes('?') ? '&' : '?') + 'client=' + client);
    });
  }
});
