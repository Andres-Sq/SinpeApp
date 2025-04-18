const numeroInput=document.getElementById("phone_number");
numeroInput.addEventListener("input",(function(e){let valor=e.target.value.replace(/\D/g,"");
if(valor.length>4){valor=valor.slice(0,4)+"-"+valor.slice(4,8)}e.target.value=valor}));

function sendSMS() {
    const isEnglish = window.location.pathname.includes("main_en");
    const amount = document.getElementById("amount").value;
    const phone_number = document.getElementById("phone_number").value.replace(/-/g, "");
    const details = document.getElementById("details").value;
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
  
    fetch("http://localhost:3000/api/sms/create-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    })
      .then(response => response.json())
      .then(data => {
        console.log("Server response:", data);
        // Message to show after successful SMS generation
        const alertMsg = isEnglish ? "Message generated successfully." : "Mensaje generado con éxito.";
        alert(alertMsg);
        window.location.href = ".../../checkpages/success.html"; // Redirect to success page
      })
      .catch(error => {
        console.error("Error:", error);
        //Message to show if there was an error generating the SMS
        const alertMsg = isEnglish ? "There was an error sending the message." : "Se ha producido un error al enviar el mensaje.";
        alert(alertMsg);
        window.location.href = ".../../checkpages/error.html"; // Redirect to error page
      });
  }