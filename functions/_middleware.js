export const onRequest = async (context) => {
  const url = new URL(context.request.url);

  // Permitir acceso a /checkpages/success.html sin necesidad del parámetro "client"
  if (url.pathname === "/checkpages/success.html") {
    return context.next();
  }

  // Permitir acceso a archivos estáticos
  if (
    url.pathname.startsWith('/assets/images') ||
    url.pathname.startsWith('/assets/scripts')
  ) {
    return context.next();
  }

  // Verificar parámetro "client" en otras rutas
  if (!url.searchParams.has("client")) {
    return new Response("Acceso no autorizado", { status: 403 });
  }

  return context.next();
};