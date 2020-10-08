const RUTA_API = "http://localhost:8000";
const $estado = document.querySelector("#estado"),
    $nombreImpresora = document.querySelector("#nombre"),
    $ipImpresora = document.querySelector("#ip"),
    $mensaje = document.querySelector("#mensaje"),
    $btnLimpiarLog = document.querySelector("#btnLimpiarLog"),
    $btnObtenerImpresoras = document.querySelector("#btnObtenerImpresoras");



const loguear = texto => $estado.textContent += (new Date()).toLocaleString() + " " + texto + "\n";
const limpiarLog = () => $estado.textContent = "";

$btnLimpiarLog.addEventListener("click", limpiarLog);


$btnObtenerImpresoras.addEventListener("click", () => {

    let ip = $ipImpresora.value;
    if (!ip) return;
    Impresora.getImpresorasRemotas(ip)
        .then(impresoras => {
            impresoras.forEach(impresora => {
                loguear(`Encontré una impresora: ${impresora}`);
            });
        });
});