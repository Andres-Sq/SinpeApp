export const onRequest = async (context) => {
  const url = new URL(context.request.url);
  if (
    url.pathname.startsWith('/assets/images') ||
    url.pathname.startsWith('/assets/scripts') ||
    url.pathname.startsWith('/favicon.ico:1')
  ) {
    return context.next();
  }
  if (!url.searchParams.has("client")) {
    return new Response("Acceso no autorizado", { status: 403 });
  }
  return context.next();
};