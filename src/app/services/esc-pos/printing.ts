//printing.ts
import { Injectable } from '@angular/core';
//Obtener hora y fecha actual
import { formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import * as QRCode from 'qrcode';

import { PrecioTotal, boletosselect, nivelErrorQR, NivelCorreccionQR } from '../../components/operador-components/boletos/boletos-form-list/boletos-form-list';
import { nombreVisitante, ExportFechaEmision, ExportTotalVisitantes } from '../../components/operador-components/form-visit/form-visit';


interface DatosTicket {
  nombre: string;
  totalVisitantes: number;
  precio: string;
  fechaHora: string;
  lugar: string;
  boletosSeleccionados: string;
}

interface DatosQR {
  totalVisitantes: number;
  boletos: string;
  precioTotal: string;
  'fecha-expiracion': string;
}


@Injectable({
  providedIn: 'root',
})
export class Printing {

  constructor() { }

  //Obtener hora y fecha actual
  private obtenerFechaActual(): string {
    const ahora = new Date();
    return formatDate(ahora, 'dd/MM/yyyy HH:mm:ss', 'es-MX');
  }

  //Obtener datos para el ticket
  private obtenerDatosTicket(): DatosTicket | null {
    const nombre = nombreVisitante;
    const totalVisitantes = ExportTotalVisitantes;
    const precio = PrecioTotal.toFixed(2);
    const fechaHora = this.obtenerFechaActual();
    const lugar = 'Zacatecas, México';
    const boletosSeleccionados: string = boletosselect;

    if (!nombre || !totalVisitantes || !precio) {
      console.error('Faltan datos para generar el ticket');
      alert('Faltan datos para generar el ticket');
      return null;
    }

    return {
      fechaHora,
      lugar,
      nombre,
      totalVisitantes,
      precio,
      boletosSeleccionados
    };
  }

  // Genera los datos para el código QR
  private generarDatosQR(datosTicket: DatosTicket): DatosQR {
    const fechaExpiracion = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

    return {
      totalVisitantes: datosTicket.totalVisitantes,
      boletos: datosTicket.boletosSeleccionados,
      precioTotal: datosTicket.precio,
      'fecha-expiracion': fechaExpiracion.toLocaleString('es-MX')
    };
  }

  // Método para descargar ticket como PDF
  public async descargarTicketPDF(): Promise<void> {
    const datosTicket = this.obtenerDatosTicket();
    if (!datosTicket) {
      console.error('No se pudieron obtener los datos del ticket');
      return;
    }

    const datosQR = this.generarDatosQR(datosTicket);
    const datosQRString = JSON.stringify(datosQR);

    // Crear PDF con tamaño de ticket térmico (80mm de ancho)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200] // ancho x alto en mm
    });

    let y = 10; // posición Y inicial

    // Título
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Museo', 40, y, { align: 'center' });
    y += 10;

    // Lugar
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Lugar: ${datosTicket.lugar}`, 40, y, { align: 'center' });
    y += 8;

    // Fecha y hora
    pdf.setFontSize(8);
    pdf.text(`Emitido: ${datosTicket.fechaHora}`, 40, y, { align: 'center' });
    y += 10;

    // Nombre del visitante
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bienvenido(a):', 40, y, { align: 'center' });
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.text(datosTicket.nombre, 40, y, { align: 'center' });
    y += 10;

    // Total visitantes
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Total visitantes: ${datosTicket.totalVisitantes}`, 40, y, { align: 'center' });
    y += 10;

    // Boletos seleccionados
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const boletos = datosTicket.boletosSeleccionados.split(',');
    boletos.forEach(boleto => {
      if (boleto.trim()) {
        pdf.text(boleto.trim(), 40, y, { align: 'center' });
        y += 5;
      }
    });
    y += 5;

    // Precio total
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Precio total: $${datosTicket.precio}`, 40, y, { align: 'center' });
    y += 15;

    // Generar código QR como imagen
    try {
      const qrCodeDataURL = await QRCode.toDataURL(datosQRString, {
        errorCorrectionLevel: nivelErrorQR,
        width: 150,
        margin: 1
      });

      // Agregar QR al PDF (centrado)
      const qrSize = 50; // tamaño en mm
      const qrX = (80 - qrSize) / 2; // centrar en el ticket de 80mm
      pdf.addImage(qrCodeDataURL, 'PNG', qrX, y, qrSize, qrSize);
      y += qrSize + 5;

      // Nivel de corrección
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Nivel de corrección: ${nivelErrorQR}`, 40, y, { align: 'center' });

    } catch (error) {
      console.error('Error generando QR:', error);
    }

    // Descargar PDF
    pdf.save(`ticket-${datosTicket.nombre}-${Date.now()}.pdf`);

    console.log('PDF generado con QR', {
      datosTicket,
      datosQR,
      nivelErrorQR
    });
  }
}