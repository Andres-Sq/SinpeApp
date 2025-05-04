document.addEventListener("DOMContentLoaded", () => {
  setYearInFooter();
  formatPhoneInput();
  validateAndLoadClient();
  updateLanguageLinks();
});

// --- Función para mostrar el año actual en el footer ---
function setYearInFooter() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// --- Formateo en vivo del número SINPE ---
function formatPhoneInput() {
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
}

// --- Verificar 'client' y cargar configuración del API ---
function validateAndLoadClient() {
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
      const phoneInput = document.getElementById("phone_number");
      if (phoneInput) phoneInput.value = data.phone;
    })
    .catch((err) => {
      console.error("Error al obtener configuración:", err);
      alert("No se pudo cargar la configuración del cliente.");
      window.location.href = "/checkpages/error.html";
    });
}

// --- Actualizar enlaces de idioma con ?client ---
function updateLanguageLinks() {
  const urlParams = new URLSearchParams(window.location.search);
  const client = urlParams.get("client");

  if (client) {
    const langLinks = document.querySelectorAll('#lang-en, #lang-es');
    langLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.setAttribute('href', href + (href.includes('?') ? '&' : '?') + 'client=' + client);
    });
  }
}

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

      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      const alertMsg = isEnglish
        ? "Message generated successfully. You will now be redirected to your SMS app."
        : "Mensaje generado con éxito. Ahora serás redirigido a tu app de mensajes.";
      
      // Mostrar mensaje
      alert(alertMsg);

      // Limpiar las casillas de texto después de enviar
      document.getElementById("amount").value = "";
      document.getElementById("details").value = "";

      // En iOS no se puede hacer una redirección posterior al abrir la app de mensajes
      if (isIOS) {
        // Redirige al SMS y el usuario debe volver manualmente al navegador
        window.location.href = smsUrl;
        // No pongas nada después de esta línea
      } else if (isAndroid) {
        // En Android se puede usar setTimeout para redirigir después de abrir SMS
        window.location.href = smsUrl;
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
      window.location.href = "/checkpages/error.html";
    });
}