export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);

  // Permitir recursos estáticos sin client= (archivos en /assets/ y favicon.ico)
  const isStatic = url.pathname.startsWith("/assets/") || url.pathname.endsWith("/favicon.ico");

  // Excluir success.html de la verificación, pero solo si el usuario tiene sesión activa
  const isSuccessPage = url.pathname.endsWith("/checkpages/success.html");

  if (isStatic) {
    return next(); // permitir acceso sin client
  }

  // Si es success.html, verificar si el usuario tiene permiso
  if (isSuccessPage) {
    const isSmsSent = sessionStorage.getItem("sms_success");
    if (!isSmsSent) {
      return new Response("Acceso no autorizado", {
        status: 403,
        headers: { "Content-Type": "text/plain" }
      });
    }
  }

  // Bloquear el resto si no tiene ?client
  if (!url.searchParams.has("client")) {
    return new Response("Acceso no autorizado", {
      status: 403,
      headers: { "Content-Type": "text/plain" }
    });
  }

  return next(); // continuar con la carga del sitio
};