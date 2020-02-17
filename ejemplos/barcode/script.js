const $estado = document.querySelector("#estado"),
    $listaDeImpresoras = document.querySelector("#listaDeImpresoras"),
    $codigo = document.querySelector("#codigo"),
    $btnLimpiarLog = document.querySelector("#btnLimpiarLog"),
    $btnImprimir = document.querySelector("#btnImprimir"),
    $tamanioBarcode = document.querySelector("#tamanioBarcode"),
    $tipoBarcode = document.querySelector("#tipoBarcode");
const loguear = texto => $estado.textContent += (new Date()).toLocaleString() + " " + texto + "\n";
const limpiarLog = () => $estado.textContent = "";

$btnLimpiarLog.addEventListener("click", limpiarLog);
const limpiarLista = () => {
    for (let i = $listaDeImpresoras.options.length; i >= 0; i--) {
        $listaDeImpresoras.remove(i);
    }
};
const obtenerListaDeImpresoras = () => {
    loguear("Cargando lista...");
    Impresora.getImpresoras()
        .then(listaDeImpresoras => {
            loguear("Lista cargada");
            limpiarLista();
            listaDeImpresoras.forEach(nombreImpresora => {
                const option = document.createElement('option');
                option.value = option.text = nombreImpresora;
                $listaDeImpresoras.appendChild(option);
            })
        });
};
obtenerListaDeImpresoras();
/*
 * La magia sucede a continuación
 * */
$btnImprimir.addEventListener("click", () => {
    // Recuperar el código de barras
    let contenido = $codigo.value;
    // Validar
    if (!contenido) {
        return alert("Escribe el contenido del código de barras");
    }
    // Ahora la impresora
    let impresoraSeleccionada = $listaDeImpresoras.options[$listaDeImpresoras.selectedIndex].value;
    if (!impresoraSeleccionada) {
        return alert("Selecciona una impresora");
    }
    // El tamaño..
    let tamanioBarcode = $tamanioBarcode.options[$tamanioBarcode.selectedIndex].value;
    if (!tamanioBarcode) {
        return alert("Selecciona el tamaño");
    }
    // El tipo..
    let tipoBarcode = $tipoBarcode.options[$tipoBarcode.selectedIndex].value;
    if (!tipoBarcode) {
        return alert("Selecciona el tipo");
    }
    // Si está bien se ejecuta esto...
    let impresora = new Impresora();
    impresora.barcode(contenido, tamanioBarcode, tipoBarcode);
    // Dos saltos de línea
    impresora.feed(2);
    // Terminar en la impresora seleccionada
    loguear("Imprimiendo...");
    impresora.imprimirEnImpresora(impresoraSeleccionada)
        .then(respuesta => {
            loguear("Al imprimir el código de barras tenemos: " + respuesta);
        })
});