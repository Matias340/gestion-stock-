import Afip from "@afipsdk/afip.js";
import fs, { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const cert = fs.readFileSync("./certificado/certificado.crt", { encoding: "utf8" });
const key = fs.readFileSync("./llavePrivada/MiClavePrivada.key", { encoding: "utf8" });
const CUIT = 20425737563;

// Inicializar AFIP en modo homologación
const afip = new Afip({
  cert,
  key,
  CUIT,
  production: false,
});

async function emitirComprobante() {
  try {
    const punto_de_venta = 12;

    /**
     * Tipo de factura
     **/
    const tipo_de_factura = 1; // 1 = Factura A

    /**
     * Número de la ultima Factura A
     **/
    const last_voucher = await afip.ElectronicBilling.getLastVoucher(punto_de_venta, tipo_de_factura);

    /**
     * Concepto de la factura
     *
     * Opciones:
     *
     * 1 = Productos
     * 2 = Servicios
     * 3 = Productos y Servicios
     **/
    const concepto = 1;

    /**
     * Tipo de documento del comprador
     *
     * Opciones:
     *
     * 80 = CUIT
     * 86 = CUIL
     * 96 = DNI
     * 99 = Consumidor Final
     **/
    const tipo_de_documento = 80;

    /**
     * Numero de documento del comprador (0 para consumidor final)
     **/
    const numero_de_cuit = 33693450239;

    /**
     * Numero de factura
     **/
    const numero_de_factura = last_voucher + 1;

    /**
     * Fecha de la factura en formato aaaa-mm-dd (hasta 10 dias antes y 10 dias despues)
     **/
    const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];

    /**
     * Importe sujeto al IVA (sin incluir IVA)
     **/
    const importe_gravado = 100;

    /**
     * Importe exento al IVA
     **/
    const importe_exento_iva = 0;

    /**
     * Importe de IVA
     **/
    const importe_iva = 21;

    /**
     * Condición frente al IVA del receptor
     *
     * 1 = IVA Responsable Inscripto
     * 4 = IVA Sujeto Exento
     * 5 = Consumidor Final
     * 6 = Responsable Monotributo
     * 7 = Sujeto No Categorizado
     * 8 = Proveedor del Exterior
     * 9 = Cliente del Exterior
     * 10 = IVA Liberado – Ley N° 19.640
     * 13 = Monotributista Social
     * 15 = IVA No Alcanzado
     * 16 = Monotributo Trabajador Independiente Promovido
     **/
    const condicion_iva_receptor = 1;

    let fecha_servicio_desde = null,
      fecha_servicio_hasta = null,
      fecha_vencimiento_pago = null;

    if (concepto === 2 || concepto === 3) {
      const hoy = new Date();

      const formatoAfip = (fecha) => parseInt(fecha.toISOString().split("T")[0].replace(/-/g, ""));

      const desde = new Date(hoy);
      const hasta = new Date(hoy);
      hasta.setDate(hasta.getDate() + 1); // Servicio de un día de duración

      const vencimiento = new Date(hoy);
      vencimiento.setDate(vencimiento.getDate() + 10); // Pago a 10 días

      fecha_servicio_desde = formatoAfip(desde);
      fecha_servicio_hasta = formatoAfip(hasta);
      fecha_vencimiento_pago = formatoAfip(vencimiento);
    }

    const data = {
      CantReg: 1, // Cantidad de facturas a registrar
      PtoVta: punto_de_venta,
      CbteTipo: tipo_de_factura,
      Concepto: concepto,
      DocTipo: tipo_de_documento,
      DocNro: numero_de_cuit,
      CbteDesde: numero_de_factura,
      CbteHasta: numero_de_factura,
      CbteFch: parseInt(fecha.replace(/-/g, "")),
      FchServDesde: fecha_servicio_desde,
      FchServHasta: fecha_servicio_hasta,
      FchVtoPago: fecha_vencimiento_pago,
      ImpTotal: importe_gravado + importe_iva + importe_exento_iva,
      ImpTotConc: 0, // Importe neto no gravado
      ImpNeto: importe_gravado,
      ImpOpEx: importe_exento_iva,
      ImpIVA: importe_iva,
      ImpTrib: 0, //Importe total de tributos
      MonId: "PES", //Tipo de moneda usada en la factura ('PES' = pesos argentinos)
      MonCotiz: 1, // Cotización de la moneda usada (1 para pesos argentinos)
      CondicionIVAReceptorId: condicion_iva_receptor,
      Iva: [
        // Alícuotas asociadas a la factura
        {
          Id: 5, // Id del tipo de IVA (5 = 21%)
          BaseImp: importe_gravado,
          Importe: importe_iva,
        },
      ],
    };

    const response = await afip.ElectronicBilling.createVoucher(data, false);

    const cae = response.CAE;
    const caeVencimiento = response.CAEFchVto;

    console.log("✅ Comprobante emitido con éxito");
    console.log("📌 CAE:", response.CAE);
    console.log("📆 Vencimiento del CAE:", response.CAEFchVto);

    (async () => {
      // Descargamos el HTML de ejemplo (ver mas arriba)
      // y lo guardamos como bill.html
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      // Ruta al archivo HTML
      const html = readFileSync(join(__dirname, "bill.html"), "utf8");

      const tipo_de_factura = 1; // 1 = Factura A, 6 = B, 11 = C, etc.
      const cuit_emisor = 20425737563;
      const condicion_iva_receptor = 1;
      const numero_de_cuit_comprador = 33693450239;
      const punto_de_venta = 12;
      const last_voucher = await afip.ElectronicBilling.getLastVoucher(punto_de_venta, tipo_de_factura);
      const numero_de_factura = last_voucher + 1;
      const importe_gravado = 100;
      const importe_exento_iva = 0;
      const importe_iva = 21;

      const data = {
        ImpTotal: importe_gravado + importe_iva + importe_exento_iva,
      };

      const concepto = 1;

      let fecha_servicio_desde = null,
        fecha_servicio_hasta = null,
        fecha_vencimiento_pago = null;

      if (concepto === 2 || concepto === 3) {
        const hoy = new Date();

        const formatoAfip = (fecha) => parseInt(fecha.toISOString().split("T")[0].replace(/-/g, ""));

        const desde = new Date(hoy);
        const hasta = new Date(hoy);
        hasta.setDate(hasta.getDate() + 1); // Servicio de un día de duración

        const vencimiento = new Date(hoy);
        vencimiento.setDate(vencimiento.getDate() + 10); // Pago a 10 días

        fecha_servicio_desde = formatoAfip(desde);
        fecha_servicio_hasta = formatoAfip(hasta);
        fecha_vencimiento_pago = formatoAfip(vencimiento);
      }

      const tipoFacturaMap = {
        1: "A",
        6: "B",
        11: "C",
      };

      const tipoCondicionIvaMap = {
        1: "IVA Responsable Inscripto",
        4: "IVA Sujeto Exento",
        5: "Consumidor Final",
        6: "Responsable Monotributo",
        7: "Sujeto No Categorizado",
        8: "Proveedor del Exterior",
        9: "Cliente del Exterior",
        10: "IVA Liberado - Ley N° 19.640",
        13: "Monotributista Social",
        15: "IVA No Alcanzado",
        16: "Monotributo Trabajador Independiente Promovido",
      };

      const tipoFactura = tipoFacturaMap[tipo_de_factura] || "?"; // fallback
      const tipoCondicionIva = tipoCondicionIvaMap[condicion_iva_receptor] || "?";

      function formatearFechaAfip(fechaAfip) {
        if (!fechaAfip) return "";
        const str = fechaAfip.toString();
        return `${str.slice(6, 8)}/${str.slice(4, 6)}/${str.slice(0, 4)}`;
      }

      // Reemplazamos el marcador en el HTML
      let htmlProcesado = html
        .replace(/{{tipo_factura}}/g, tipoFactura)
        .replace(/{{cuit_emisor}}/g, cuit_emisor)
        .replace(/{{condicion_iva_receptor}}/g, tipoCondicionIva)
        .replace(/{{numero_de_cuit_comprador}}/g, numero_de_cuit_comprador)
        .replace(/{{punto_de_venta}}/g, punto_de_venta)
        .replace(/{{numero_de_factura}}/g, numero_de_factura)
        .replace(/{{imp_total}}/g, data.ImpTotal)
        .replace(/{{importe_gravado}}/g, importe_gravado)
        .replace(/{{cae}}/g, cae)
        .replace(/{{cae_vencimiento}}/g, caeVencimiento);

      // Reemplazar fechas solo si el concepto es 2 o 3
      if (concepto === 2 || concepto === 3) {
        htmlProcesado = htmlProcesado
          .replace(/{{fecha_servicio_desde}}/g, formatearFechaAfip(fecha_servicio_desde))
          .replace(/{{fecha_servicio_hasta}}/g, formatearFechaAfip(fecha_servicio_hasta))
          .replace(/{{fecha_vencimiento_pago}}/g, formatearFechaAfip(fecha_vencimiento_pago));
      } else {
        htmlProcesado = htmlProcesado
          .replace(/{{fecha_servicio_desde}}/g, "")
          .replace(/{{fecha_servicio_hasta}}/g, "")
          .replace(/{{fecha_vencimiento_pago}}/g, "");
      }

      // Nombre para el archivo (sin .pdf)
      const name = "PDF de prueba";

      // Opciones para el archivo
      const options = {
        width: 8, // Ancho de pagina en pulgadas. Usar 3.1 para ticket
        marginLeft: 0.4, // Margen izquierdo en pulgadas. Usar 0.1 para ticket
        marginRight: 0.4, // Margen derecho en pulgadas. Usar 0.1 para ticket
        marginTop: 0.4, // Margen superior en pulgadas. Usar 0.1 para ticket
        marginBottom: 0.4, // Margen inferior en pulgadas. Usar 0.1 para ticket
      };

      // Creamos el PDF
      const res = await afip.ElectronicBilling.createPDF({
        html: htmlProcesado,
        file_name: name,
        options: options,
      });

      // Mostramos la url del archivo creado
      console.log("pdf", res.file);
    })();
  } catch (error) {
    console.error("❌ Error al emitir comprobante:");
    console.error(error.message || error);
  }
}

emitirComprobante();
