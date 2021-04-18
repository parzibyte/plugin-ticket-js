/**
 * Una clase para interactuar con el plugin
 * 
 * @author parzibyte
 * @see https://parzibyte.me/blog
 */
const C = {
    AccionWrite: "write",
    AccionCut: "cut",
    AccionCash: "cash",
    AccionCutPartial: "cutpartial",
    AccionAlign: "align",
    AccionFontSize: "fontsize",
    AccionFont: "font",
    AccionEmphasize: "emphasize",
    AccionFeed: "feed",
    AccionQr: "qr",
    AlineacionCentro: "center",
    AlineacionDerecha: "right",
    AlineacionIzquierda: "left",
    FuenteA: "A",
    FuenteB: "B",
    AccionBarcode128: "barcode128",
    AccionBarcode39: "barcode39",
    AccionBarcode93: "barcode93",
    AccionBarcodeEAN: "barcodeEAN",
    AccionBarcodeTwoOfFiveSinInterleaved: "barcodeTwoOfFive",
    AccionBarcodeTwoOfFiveInterleaved: "barcodeTwoOfFiveInterleaved",
    AccionBarcodeCodabar: "barcodeCodabar",
    AccionBarcodeUPCA: "barcodeUPCA",
    AccionBarcodeUPCE: "barcodeUPCE",
    Medida80: 80,
    Medida100: 100,
    Medida156: 156,
    Medida200: 200,
    Medida300: 300,
    Medida350: 350,
};

const URL_PLUGIN = "http://localhost:8000";

class OperacionTicket {
    constructor(accion, datos) {
        this.accion = accion + "";
        this.datos = datos + "";
    }
}
class Impresora {
    constructor(ruta) {
        if (!ruta) ruta = URL_PLUGIN;
        this.ruta = ruta;
        this.operaciones = [];
    }

    static setImpresora(nombreImpresora, ruta) {
        if (ruta) URL_PLUGIN = ruta;
        return fetch(URL_PLUGIN + "/impresora", {
                method: "PUT",
                body: JSON.stringify(nombreImpresora),
            })
            .then(r => r.json())
            .then(respuestaDecodificada => respuestaDecodificada === nombreImpresora);
    }
    static setImpresoraSilencioso(nombreImpresora, ruta) {
        if (ruta) URL_PLUGIN = ruta;
        return fetch(URL_PLUGIN + "/impresora_silencioso", {
                method: "PUT",
                body: JSON.stringify(nombreImpresora),
            })
            .then(r => r.json())
            .then(respuestaDecodificada => respuestaDecodificada === nombreImpresora);
        }
    

    static getImpresora(ruta) {
        if (ruta) URL_PLUGIN = ruta;
        return fetch(URL_PLUGIN + "/impresora")
            .then(r => r.json());
    }

    static getImpresoras(ruta) {
        if (ruta) URL_PLUGIN = ruta;
        return fetch(URL_PLUGIN + "/impresoras")
            .then(r => r.json());
    }

    static getImpresorasRemotas(ip) {
        return fetch(URL_PLUGIN + "/impresoras_remotas?ip=" + ip)
            .then(r => r.json());
    }

    cut() {
        this.operaciones.push(new OperacionTicket(C.AccionCut, ""));
    }

    cash() {
        this.operaciones.push(new OperacionTicket(C.AccionCash, ""));
    }

    cutPartial() {
        this.operaciones.push(new OperacionTicket(C.AccionCutPartial, ""));
    }

    setFontSize(a, b) {
        this.operaciones.push(new OperacionTicket(C.AccionFontSize, `${a},${b}`));
    }

    setFont(font) {
        if (font !== C.FuenteA && font !== C.FuenteB) throw Error("Fuente inválida");
        this.operaciones.push(new OperacionTicket(C.AccionFont, font));
    }
    setEmphasize(val) {
        if (isNaN(parseInt(val)) || parseInt(val) < 0) throw Error("Valor inválido");
        this.operaciones.push(new OperacionTicket(C.AccionEmphasize, val));
    }
    setAlign(align) {
        if (align !== C.AlineacionCentro && align !== C.AlineacionDerecha && align !== C.AlineacionIzquierda) {
            throw Error(`Alineación ${align} inválida`);
        }
        this.operaciones.push(new OperacionTicket(C.AccionAlign, align));
    }

    write(text) {
        this.operaciones.push(new OperacionTicket(C.AccionWrite, text));
    }

    feed(n) {
        if (!parseInt(n) || parseInt(n) < 0) {
            throw Error("Valor para feed inválido");
        }
        this.operaciones.push(new OperacionTicket(C.AccionFeed, n));
    }

    end() {
        return fetch(this.ruta + "/imprimir", {
                method: "POST",
                body: JSON.stringify(this.operaciones),
            })
            .then(r => r.json());
    }

    imprimirEnImpresora(nombreImpresora) {
        const payload = {
            operaciones: this.operaciones,
            impresora: nombreImpresora,
        };
        return fetch(this.ruta + "/imprimir_en", {
                method: "POST",
                body: JSON.stringify(payload),
            })
            .then(r => r.json());
    }

    qr(contenido) {
        this.operaciones.push(new OperacionTicket(C.AccionQr, contenido));
    }

    validarMedida(medida) {
        medida = parseInt(medida);
        if (medida !== C.Medida80 &&
            medida !== C.Medida100 &&
            medida !== C.Medida156 &&
            medida !== C.Medida200 &&
            medida !== C.Medida300 &&
            medida !== C.Medida350) {
            throw Error("Valor para medida del barcode inválido");
        }
    }

    validarTipo(tipo) {
        if (
            [C.AccionBarcode128,
                C.AccionBarcode39,
                C.AccionBarcode93,
                C.AccionBarcodeEAN,
                C.AccionBarcodeTwoOfFiveInterleaved,
                C.AccionBarcodeTwoOfFiveSinInterleaved,
                C.AccionBarcodeCodabar,
                C.AccionBarcodeUPCA,
                C.AccionBarcodeUPCE,
            ]
            .indexOf(tipo) === -1
        ) throw Error("Tipo de código de barras no soportado");
    }

    barcode(contenido, medida, tipo) {
        this.validarMedida(medida);
        this.validarTipo(tipo);
        let payload = contenido.concat(",").concat(medida.toString());
        this.operaciones.push(new OperacionTicket(tipo, payload));
    }
    imprimirEnImpresoraConNombreEIp(nombreImpresora, ip) {
        const payload = {
            operaciones: this.operaciones,
            impresora: nombreImpresora,
            ip: ip,
        };
        return fetch(this.ruta + "/imprimir_y_reenviar", {
            method: "POST",
            body: JSON.stringify(payload),
        })
            .then(r => r.json());
    }

}