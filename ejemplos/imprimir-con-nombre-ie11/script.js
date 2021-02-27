
"use strict";

var RUTA_API = "http://localhost:8000";
var $estado = document.querySelector("#estado"),
    $nombreImpresora = document.querySelector("#nombre"),
    $mensaje = document.querySelector("#mensaje"),
    $btnLimpiarLog = document.querySelector("#btnLimpiarLog"),
    $btnImprimir = document.querySelector("#btnImprimir");

var loguear = function loguear(texto) {
  return $estado.textContent += new Date().toLocaleString() + " " + texto + "\n";
};

var limpiarLog = function limpiarLog() {
  return $estado.textContent = "";
};

$btnLimpiarLog.addEventListener("click", limpiarLog);
$btnImprimir.addEventListener("click", function () {
  var nombreImpresora = $nombreImpresora.value,
      mensaje = $mensaje.value;
  if (!nombreImpresora || !mensaje) return;
  var impresora = new Impresora(RUTA_API);
  impresora.setFontSize(1, 1);
  impresora.write("Tratando de imprimir en ".concat(nombreImpresora, "\n"));
  impresora.write(mensaje);
  impresora.cut();
  impresora.cutPartial(); // Pongo este y también cut porque en ocasiones no funciona con cut, solo con cutPartial

  impresora.imprimirEnImpresora(nombreImpresora, function (valor) {
    loguear("Al imprimir: " + valor);
  });
});