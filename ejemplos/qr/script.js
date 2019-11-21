let impresora = new Impresora();
impresora.write("Probando codigos QR desde JS!");
impresora.qr("Proudly brought to you by Parzibyte");
impresora.write("Podemos tener un poco de texto...");
impresora.qr("https://parzibyte.me");
impresora.end();