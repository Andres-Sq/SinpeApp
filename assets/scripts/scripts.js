let config = {};

window.addEventListener("DOMContentLoaded", () => {
  const numeroInput = document.getElementById("phone_number");

  numeroInput.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length > 4) {
      valor = valor.slice(0, 4) + "-" + valor.slice(4, 8);
    }
    e.target.value = valor;
  });

  const urlParams = new URLSearchParams(window.location.search);
  const client = urlParams.get("client");

  if (!client) {
    alert("Cliente no especificado en la URL");
    return;
  }

  fetch(`https://sinpe-api-production.up.railway.app/api/config/${client}`)
    .then((res) => {
      if (!res.ok) throw new Error("Cliente no encontrado");
      return res.json();
    })
    .then((data) => {
      config = data;
      document.getElementById("phone_number").value = data.phone;
    })
    .catch((err) => {
      console.error("Error al obtener configuración:", err);
      alert("No se pudo cargar la configuración del cliente.");
    });
});

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
      console.log("Server response:", data);

      const smsMessage = data.message;
      const smsUrl = `sms:${phone_number}?&body=${encodeURIComponent(smsMessage)}`;
      window.location.href = smsUrl;

      const alertMsg = isEnglish ? "Message generated successfully." : "Mensaje generado con éxito.";
      alert(alertMsg);
      sessionStorage.setItem("sms_success", "true");
      window.location.href = "/checkpages/success.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      const alertMsg = isEnglish ? "There was an error sending the message." : "Se ha producido un error al enviar el mensaje.";
      alert(alertMsg);
      sessionStorage.setItem("sms_error", "true");
      window.location.href = "/checkpages/error.html";
    });
}
