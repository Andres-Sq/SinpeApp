export const onRequest = async (context) => {
  const url = new URL(context.request.url);

  if (!url.searchParams.has("client")) {
    return new Response("Acceso no autorizado", { status: 403 });
  }

  // Continuar si tiene ?client
  return context.next();
};