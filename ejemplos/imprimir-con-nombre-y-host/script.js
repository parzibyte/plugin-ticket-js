const RUTA_API = "http://localhost:8000";
const $estado = document.querySelector("#estado"),
    $nombreImpresora = document.querySelector("#nombre"),
    $ipImpresora = document.querySelector("#ip"),
    $mensaje = document.querySelector("#mensaje"),
    $btnLimpiarLog = document.querySelector("#btnLimpiarLog"),
    $btnImprimir = document.querySelector("#btnImprimir");



const loguear = texto => $estado.textContent += (new Date()).toLocaleString() + " " + texto + "\n";
const limpiarLog = () => $estado.textContent = "";

$btnLimpiarLog.addEventListener("click", limpiarLog);


$btnImprimir.addEventListener("click", () => {

    let nombreImpresora = $nombreImpresora.value
    mensaje = $mensaje.value,
    ip = $ipImpresora.value;
    if(!nombreImpresora || !mensaje || !ip) return;

    let impresora = new Impresora(RUTA_API);
    impresora.setFontSize(1, 1);
    impresora.write(`Tratando de imprimir en ${nombreImpresora} con host ${ip}
`);
    console.log(`Tratando de imprimir en ${nombreImpresora} con host ${ip}
`);
    impresora.write(mensaje);
    impresora.cut();
    impresora.cutPartial(); // Pongo este y también cut porque en ocasiones no funciona con cut, solo con cutPartial
    impresora.imprimirEnImpresoraConNombreEIp(nombreImpresora, ip)
        .then(valor => {
            loguear("Al imprimir: " + valor);
        });
});