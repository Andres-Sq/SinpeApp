export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);

  // Permitir recursos estáticos sin client=
  const isStatic = url.pathname.startsWith("/assets/") || url.pathname.endsWith("/favicon.ico");

  if (isStatic) {
    return next(); // permitir acceso sin client
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