import { handleEvent } from 'flareact'
import { processCronTrigger } from './src/functions/cronTrigger'

const DEBUG = false;

addEventListener('fetch', (event) => {
  try {
    event.respondWith(
      handleEvent(event, require.context('./pages/', true, /\.js$/), DEBUG),
    )
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

addEventListener('scheduled', (event) => {
  event.waitUntil(processCronTrigger(event))
})

// Agregar cabeceras a todas las respuestas
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    // Realizar la solicitud original al servidor
    let response = await fetch(request);

    // Verificar si la respuesta es un error
    if (!response.ok) {
      // Si es un error, simplemente retornar la respuesta original
      return response;
    }

    // Clonar la respuesta para poder modificar las cabeceras
    let newResponse = new Response(response.body, response);

    // Agregar las nuevas cabeceras
    newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    newResponse.headers.set('X-Xss-Protection', '0');
    newResponse.headers.set('X-Frame-Options', 'DENY');
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    newResponse.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    newResponse.headers.set('Referrer-Policy', 'strict-origin');
    newResponse.headers.set('Expires', '0');
    newResponse.headers.set('Pragma', 'no-cache');
    // Agregar cualquier otra cabecera necesaria aquí

    return newResponse;
  } catch (error) {
    // Manejar errores y retornar una respuesta adecuada
    return new Response('Error occurred: ' + error.message, { status: 500 });
  }
}
