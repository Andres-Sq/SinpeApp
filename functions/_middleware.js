export const onRequest = async ({ request, next }) => {
    const url = new URL(request.url);
  
    // Permitir acceso solo si incluye ?client= en la URL
    if (!url.searchParams.has("client")) {
      return new Response("Acceso no autorizado", {
        status: 403,
        headers: { "Content-Type": "text/plain" }
      });
    }
  
    return next(); // continuar con la carga del sitio
  };  