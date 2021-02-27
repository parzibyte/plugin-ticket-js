
"use strict";

var RUTA_API = "http://localhost:8000";
var $estado = document.querySelector("#estado"),
    $listaDeImpresoras = document.querySelector("#listaDeImpresoras"),
    $btnLimpiarLog = document.querySelector("#btnLimpiarLog"),
    $btnRefrescarLista = document.querySelector("#btnRefrescarLista"),
    $btnEstablecerImpresora = document.querySelector("#btnEstablecerImpresora"),
    $texto = document.querySelector("#texto"),
    $impresoraSeleccionada = document.querySelector("#impresoraSeleccionada"),
    $btnImprimir = document.querySelector("#btnImprimir");

var loguear = function loguear(texto) {
  return $estado.textContent += new Date().toLocaleString() + " " + texto + "\n";
};

var limpiarLog = function limpiarLog() {
  return $estado.textContent = "";
};

$btnLimpiarLog.addEventListener("click", limpiarLog);

var limpiarLista = function limpiarLista() {
  for (var i = $listaDeImpresoras.options.length; i >= 0; i--) {
    $listaDeImpresoras.remove(i);
  }
};

var obtenerListaDeImpresoras = function obtenerListaDeImpresoras() {
  loguear("Cargando lista...");
  Impresora.getImpresoras(function (listaDeImpresoras) {
    refrescarNombreDeImpresoraSeleccionada();
    loguear("Lista cargada");
    limpiarLista();
    listaDeImpresoras.forEach(function (nombreImpresora) {
      var option = document.createElement('option');
      option.value = option.text = nombreImpresora;
      $listaDeImpresoras.appendChild(option);
    });
  });
};

var establecerImpresoraComoPredeterminada = function establecerImpresoraComoPredeterminada(nombreImpresora) {
  loguear("Estableciendo impresora...");
  Impresora.setImpresora(nombreImpresora, function (respuesta) {
    refrescarNombreDeImpresoraSeleccionada();

    if (respuesta) {
      loguear("Impresora ".concat(nombreImpresora, " establecida correctamente"));
    } else {
      loguear("No se pudo establecer la impresora con el nombre ".concat(nombreImpresora));
    }
  });
};

var refrescarNombreDeImpresoraSeleccionada = function refrescarNombreDeImpresoraSeleccionada() {
  Impresora.getImpresora(function (nombreImpresora) {
    $impresoraSeleccionada.textContent = nombreImpresora;
  });
};

$btnRefrescarLista.addEventListener("click", obtenerListaDeImpresoras);
$btnEstablecerImpresora.addEventListener("click", function () {
  var indice = $listaDeImpresoras.selectedIndex;
  if (indice === -1) return loguear("No hay ninguna impresora seleccionada");
  var opcionSeleccionada = $listaDeImpresoras.options[indice];
  establecerImpresoraComoPredeterminada(opcionSeleccionada.value);
});
$btnImprimir.addEventListener("click", function () {
  var impresora = new Impresora(RUTA_API);
  impresora.setFontSize(1, 1);
  impresora.write("Fuente 1,1\n");
  impresora.setFontSize(1, 2);
  impresora.write("Fuente 1,2\n");
  impresora.setFontSize(2, 2);
  impresora.write("Fuente 2,2\n");
  impresora.setFontSize(2, 1);
  impresora.write("Fuente 2,1\n");
  impresora.setFontSize(1, 1);
  impresora.setEmphasize(1);
  impresora.write("Emphasize 1\n");
  impresora.setEmphasize(0);
  impresora.write("Emphasize 0\n");
  impresora.setAlign("center");
  impresora.write("Centrado\n");
  impresora.setAlign("left");
  impresora.write("Izquierda\n");
  impresora.setAlign("right");
  impresora.write("Derecha\n");
  impresora.setFont("A");
  impresora.write("Fuente A\n");
  impresora.setFont("B");
  impresora.write("Fuente B\n");
  impresora.feed(2);
  impresora.write("Separado por 2\n");
  impresora.cut();
  impresora.cutPartial(); // Pongo este y también cut porque en ocasiones no funciona con cut, solo con cutPartial

  impresora.end(function (valor) {
    loguear("Al imprimir: " + valor);
  });
}); // En el init, obtenemos la lista

obtenerListaDeImpresoras(); // Y también la impresora seleccionada

refrescarNombreDeImpresoraSeleccionada();