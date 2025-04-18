const numeroInput = document.getElementById('phone_number');

numeroInput.addEventListener('input', function (e) {
  let valor = e.target.value.replace(/\D/g, '');

  if (valor.length > 4) {
    valor = valor.slice(0, 4) + '-' + valor.slice(4, 8);
  }

    e.target.value = valor;
  });

function createSMS() {
  const isEnglish = window.location.pathname.includes("main_en");

  const bank = document.getElementById("bank").value;
  const phone_number = document.getElementById("phone_number").value.replace(/-/g, '');
  const amount = document.getElementById("amount").value;
  const details = document.getElementById("details").value;    

  if (!bank || !phone_number || !amount || !details) {
     alertMsg = isEnglish
    ? "Please complete all fields."
    : "Por favor completa todos los campos.";
   alert(alertMsg);
  return;
  }

    const mensaje = `Pase ${amount} ${phone_number} ${details}`;
    const link = `sms:${bank}?&body=${encodeURIComponent(mensaje)}`;
  
    window.location.href = link;
  }
 
document.addEventListener("DOMContentLoaded", () => {
document.getElementById("year").textContent = new Date().getFullYear()});

//Disable
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "F12") e.preventDefault();
  if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) e.preventDefault();
  if (e.ctrlKey && e.key === "u") e.preventDefault();
  if (e.ctrlKey && e.key === "s") e.preventDefault();
});
