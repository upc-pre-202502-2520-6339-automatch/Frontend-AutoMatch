// src/global-polyfills.js

// Algunos paquetes (como sockjs-client → browser-crypto.js)
// esperan que exista 'global' como en Node.
// En el navegador lo igualamos a window.

window.global = window;
globalThis.global = window;
