const RUTA_API = "http://localhost:8484";
const $estado = document.querySelector("#estado"),
    $btnLimpiarLog = document.querySelector("#btnLimpiarLog"),
    $btnImprimir = document.querySelector("#btnImprimir");



const loguear = texto => $estado.textContent += (new Date()).toLocaleString() + " " + texto + "\n";
const limpiarLog = () => $estado.textContent = "";


// Obtener la IP inmediatamente, sin eventos
loguear("Obteniendo IP...");
Impresora.getIp().then(ip => {
    console.log("La ip es: " + ip);
    loguear("La ip es: " + ip);
});
