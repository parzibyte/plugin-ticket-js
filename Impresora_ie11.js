"use strict";
/**
 * Una clase para interactuar con el plugin
 * Compatible con Internet Explorer 11. Requiere jQuery porque se usa $.ajax
 * 
 * @author parzibyte
 * @see https://parzibyte.me/blog
 */
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var C = {
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
  Medida350: 350
};
var URL_PLUGIN = "http://localhost:8000";

var OperacionTicket = function OperacionTicket(accion, datos) {
  _classCallCheck(this, OperacionTicket);

  this.accion = accion + "";
  this.datos = datos + "";
};

var Impresora = /*#__PURE__*/function () {
  function Impresora(ruta) {
    _classCallCheck(this, Impresora);

    if (!ruta) ruta = URL_PLUGIN;
    this.ruta = ruta;
    this.operaciones = [];
  }

  _createClass(Impresora, [{
    key: "cut",
    value: function cut() {
      this.operaciones.push(new OperacionTicket(C.AccionCut, ""));
    }
  }, {
    key: "cash",
    value: function cash() {
      this.operaciones.push(new OperacionTicket(C.AccionCash, ""));
    }
  }, {
    key: "cutPartial",
    value: function cutPartial() {
      this.operaciones.push(new OperacionTicket(C.AccionCutPartial, ""));
    }
  }, {
    key: "setFontSize",
    value: function setFontSize(a, b) {
      this.operaciones.push(new OperacionTicket(C.AccionFontSize, "".concat(a, ",").concat(b)));
    }
  }, {
    key: "setFont",
    value: function setFont(font) {
      if (font !== C.FuenteA && font !== C.FuenteB) throw Error("Fuente inválida");
      this.operaciones.push(new OperacionTicket(C.AccionFont, font));
    }
  }, {
    key: "setEmphasize",
    value: function setEmphasize(val) {
      if (isNaN(parseInt(val)) || parseInt(val) < 0) throw Error("Valor inválido");
      this.operaciones.push(new OperacionTicket(C.AccionEmphasize, val));
    }
  }, {
    key: "setAlign",
    value: function setAlign(align) {
      if (align !== C.AlineacionCentro && align !== C.AlineacionDerecha && align !== C.AlineacionIzquierda) {
        throw Error("Alineaci\xF3n ".concat(align, " inv\xE1lida"));
      }

      this.operaciones.push(new OperacionTicket(C.AccionAlign, align));
    }
  }, {
    key: "write",
    value: function write(text) {
      this.operaciones.push(new OperacionTicket(C.AccionWrite, text));
    }
  }, {
    key: "feed",
    value: function feed(n) {
      if (!parseInt(n) || parseInt(n) < 0) {
        throw Error("Valor para feed inválido");
      }

      this.operaciones.push(new OperacionTicket(C.AccionFeed, n));
    }
  }, {
    key: "end",
    value: function end(cb) {
      $.ajax(this.ruta + "/imprimir", {
        data: JSON.stringify(this.operaciones),
        contentType: "application/json",
        success: function success(respuesta) {
          cb(JSON.parse(respuesta));
        },
        method: "POST"
      });
    }
  }, {
    key: "imprimirEnImpresora",
    value: function imprimirEnImpresora(nombreImpresora, cb) {
      var payload = {
        operaciones: this.operaciones,
        impresora: nombreImpresora
      };
      $.ajax(this.ruta + "/imprimir_en", {
        data: JSON.stringify(payload),
        contentType: "application/json",
        success: function success(respuesta) {
          cb(JSON.parse(respuesta));
        },
        method: "POST"
      });
    }
  }, {
    key: "qr",
    value: function qr(contenido) {
      this.operaciones.push(new OperacionTicket(C.AccionQr, contenido));
    }
  }, {
    key: "validarMedida",
    value: function validarMedida(medida) {
      medida = parseInt(medida);

      if (medida !== C.Medida80 && medida !== C.Medida100 && medida !== C.Medida156 && medida !== C.Medida200 && medida !== C.Medida300 && medida !== C.Medida350) {
        throw Error("Valor para medida del barcode inválido");
      }
    }
  }, {
    key: "validarTipo",
    value: function validarTipo(tipo) {
      if ([C.AccionBarcode128, C.AccionBarcode39, C.AccionBarcode93, C.AccionBarcodeEAN, C.AccionBarcodeTwoOfFiveInterleaved, C.AccionBarcodeTwoOfFiveSinInterleaved, C.AccionBarcodeCodabar, C.AccionBarcodeUPCA, C.AccionBarcodeUPCE].indexOf(tipo) === -1) throw Error("Tipo de código de barras no soportado");
    }
  }, {
    key: "barcode",
    value: function barcode(contenido, medida, tipo) {
      this.validarMedida(medida);
      this.validarTipo(tipo);
      var payload = contenido.concat(",").concat(medida.toString());
      this.operaciones.push(new OperacionTicket(tipo, payload));
    }
  }], [{
    key: "setImpresora",
    value: function setImpresora(nombreImpresora, cb, ruta) {
      if (ruta) URL_PLUGIN = ruta;
      $.ajax(URL_PLUGIN + "/impresora", {
        data: JSON.stringify(nombreImpresora),
        contentType: "application/json",
        success: function success(respuesta) {
          cb(JSON.parse(respuesta));
        },
        method: "PUT"
      });
    }
  }, {
    key: "getImpresora",
    value: function getImpresora(cb, ruta) {
      if (ruta) URL_PLUGIN = ruta;
      $.ajax(URL_PLUGIN + "/impresora", {
        contentType: "application/json",
        success: function success(respuesta) {
          cb(JSON.parse(respuesta));
        },
        method: "GET"
      });
    }
  }, {
    key: "getImpresoras",
    value: function getImpresoras(cb, ruta) {
      if (ruta) URL_PLUGIN = ruta;
      $.ajax(URL_PLUGIN + "/impresoras", {
        contentType: "application/json",
        success: function success(respuesta) {
          cb(JSON.parse(respuesta));
        },
        method: "GET"
      });
    }
  }]);

  return Impresora;
}();