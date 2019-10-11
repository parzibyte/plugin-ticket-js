const RUTA_API = "http://localhost:8000";
const $estado = document.querySelector("#estado"),
    $listaDeImpresoras = document.querySelector("#listaDeImpresoras"),
    $btnLimpiarLog = document.querySelector("#btnLimpiarLog"),
    $btnRefrescarLista = document.querySelector("#btnRefrescarLista"),
    $btnEstablecerImpresora = document.querySelector("#btnEstablecerImpresora"),
    $texto = document.querySelector("#texto"),
    $impresoraSeleccionada = document.querySelector("#impresoraSeleccionada"),
    $btnImprimir = document.querySelector("#btnImprimir");



const loguear = texto => $estado.textContent += (new Date()).toLocaleString() + " " + texto + "\n";
const limpiarLog = () => $estado.textContent = "";

$btnLimpiarLog.addEventListener("click", limpiarLog);

const limpiarLista = () => {
    for (let i = $listaDeImpresoras.options.length; i >= 0; i--) {
        $listaDeImpresoras.remove(i);
    }
};

const obtenerListaDeImpresoras = () => {
    loguear("Getting printers...");
    Impresora.getImpresoras()
        .then(listaDeImpresoras => {
            refrescarNombreDeImpresoraSeleccionada();
            loguear("Printers loaded");
            limpiarLista();
            listaDeImpresoras.forEach(nombreImpresora => {
                const option = document.createElement('option');
                option.value = option.text = nombreImpresora;
                $listaDeImpresoras.appendChild(option);
            })
        });
}

const establecerImpresoraComoPredeterminada = nombreImpresora => {
    loguear("Setting printer...");
    Impresora.setImpresora(nombreImpresora)
        .then(respuesta => {
            refrescarNombreDeImpresoraSeleccionada();
            if (respuesta) {
                loguear(`Printer ${nombreImpresora} set successfully`);
            } else {
                loguear(`Cannot set the printer ${nombreImpresora}`);
            }
        });
};

const refrescarNombreDeImpresoraSeleccionada = () => {
    Impresora.getImpresora()
        .then(nombreImpresora => {
            $impresoraSeleccionada.textContent = nombreImpresora;
        });
}


$btnRefrescarLista.addEventListener("click", obtenerListaDeImpresoras);
$btnEstablecerImpresora.addEventListener("click", () => {
    const indice = $listaDeImpresoras.selectedIndex;
    if (indice === -1) return loguear("No printers")
    const opcionSeleccionada = $listaDeImpresoras.options[indice];
    establecerImpresoraComoPredeterminada(opcionSeleccionada.value);
});

$btnImprimir.addEventListener("click", () => {
    let impresora = new Impresora(RUTA_API);
    impresora.setFontSize(1, 1);
    impresora.write("Font 1,1\n");
    impresora.setFontSize(1, 2);
    impresora.write("Font 1,2\n");
    impresora.setFontSize(2, 2);
    impresora.write("Font 2,2\n");
    impresora.setFontSize(2, 1);
    impresora.write("Font 2,1\n");
    impresora.setFontSize(1, 1);
    impresora.setEmphasize(1);
    impresora.write("Emphasize 1\n");
    impresora.setEmphasize(0);
    impresora.write("Emphasize 0\n");
    impresora.setAlign("center");
    impresora.write("Centered\n");
    impresora.setAlign("left");
    impresora.write("Left\n");
    impresora.setAlign("right");
    impresora.write("Right\n");
    impresora.setFont("A");
    impresora.write("Font A\n");
    impresora.setFont("B");
    impresora.write("Font B\n");
    impresora.feed(2);
    impresora.write("New line 2\n");
    impresora.cut();
    impresora.cutPartial(); // use both because sometimes cut and/or cutPartial do not work
    impresora.end()
        .then(valor => {
            loguear("Response: " + valor);
        });
});

// En el init, obtenemos la lista
obtenerListaDeImpresoras();
// Y también la impresora seleccionada
refrescarNombreDeImpresoraSeleccionada();