//DataVisit.js
//***************Contadores de boletos*****************
document.addEventListener("click", function (event) {
    const target = event.target;

    // Verificar si es un botón de agregar
    if (target.classList.contains("buttones") && target.textContent === "+") {
        const row = target.closest("tr");
        const span = row.querySelector("span");
        let contador = parseInt(span.innerText) || 0;
        contador += 1;
        span.innerText = contador;
        actualizarTotales();
    }

    // Verificar si es un botón de eliminar
    if (target.classList.contains("buttones") && target.textContent === "-") {
        const row = target.closest("tr");
        const span = row.querySelector("span");
        let contador = parseInt(span.innerText) || 0;
        if (contador > 0) {
            contador -= 1;
            span.innerText = contador;
            actualizarTotales();
        }
    }
});


//***************Total de boletos precio*****************

// Definir precios por tipo de boleto
const preciosBoletos = {
    'Normal (General)': 100,
    'Estudiante (Especial)': 80,
    '3ra edad (Especial)': 70,
    'Menor de edad (Especial)': 60,
    'VIP (Cortesía)': 0
};

// funcion para desabilitar el boton de agregar boletos-----------------
function deshabilitarBotones() {
    const botones = [
        "agregarGeneral",
        "agregarEstudiante",
        "agregar3ra",
        "agregarMenor",
        "agregarVip"
    ];
    botones.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = true;
    });
}

function habilitarBotones() {
    const botones = [
        "agregarGeneral",
        "agregarEstudiante",
        "agregar3ra",
        "agregarMenor",
        "agregarVip"
    ];
    botones.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = false;
    });
}


// Función para actualizar los totales
function actualizarTotales() {
    let totalBoletos = 0;
    let totalAmount = 0;

    // Recuperar los datos de PDFTickets.js
    const visitData = JSON.parse(localStorage.getItem("visitData")) || {};
    const totalVisitantes = parseInt(visitData.totalVisitantes) || 0;

    // Obtener todas las filas de la tabla
    const filas = document.querySelectorAll("table tr");
    for (let i = 1; i < filas.length; i++) {
        const fila = filas[i];
        const tipoBoleto = fila.querySelector("td:nth-child(2)").textContent.trim();
        const span = fila.querySelector("span");
        const cantidad = parseInt(span.innerText) || 0;

        totalBoletos += cantidad;
        const precioPorBoleto = preciosBoletos[tipoBoleto] || 0;
        totalAmount += cantidad * precioPorBoleto;
    }

    // Actualizar UI
    document.getElementById("totalBoletos").textContent = totalBoletos;
    document.getElementById("totalAmount").textContent = `$${totalAmount}MXN`;

    // 🔹 Deshabilitar si coincide con totalVisitantes
    if (totalVisitantes > 0 && totalBoletos >= totalVisitantes) {
        deshabilitarBotones();
    } else {
        habilitarBotones();
    }
}
//-------------------------------------------------------------


// Llamar la función al cargar la página para inicializar
document.addEventListener("DOMContentLoaded", function () {
    actualizarTotales();
});

//***************Boton cancelar boletos*****************
const btnCancelarBoleto = document.getElementById("cancelarBoleto");
btnCancelarBoleto.addEventListener("click", async function () {
    // Limpiar todos los contadores de boletos
    const totalGeneral = document.getElementById("totalGeneral");
    totalGeneral.innerText = 0;

    const totalEstudiante = document.getElementById("totalEstudiante"); // Corregí el nombre
    totalEstudiante.innerText = 0;

    const total3ra = document.getElementById("total3ra");
    total3ra.innerText = 0;

    const totalMenor = document.getElementById("totalMenor");
    totalMenor.innerText = 0;

    const totalVip = document.getElementById("totalVip");
    totalVip.innerText = 0;

    // Limpiar los totales
    const totalBoletos = document.getElementById("totalBoletos");
    totalBoletos.innerText = 0;

    const totalAmount = document.getElementById("totalAmount");
    totalAmount.innerText = "$0MXN";

    // Pequeña pausa para que el usuario vea que se limpiaron los campos
    await new Promise(resolve => setTimeout(resolve, 500));

    // Redireccionar a otra página
    window.location.href = "../HTML/FormsVisit.html";

});

//Empireza la generación de PDF y QR*-*-*-*
//******** Generar QR y PDF ********// 
const btnImprimir = document.getElementById("imprimirBoleto");
const ECC = {
    L: QRCode.CorrectLevel.L,
    M: QRCode.CorrectLevel.M,
    Q: QRCode.CorrectLevel.Q,
    H: QRCode.CorrectLevel.H,
};

const eccEl = document.getElementById("ecc");

//-*** (Notificación de impresoras que hay) ***-/
window.addEventListener("load", async () => {
    try {
        // Verificar si ya hay conexión antes de conectar
        if (!qz.websocket.isActive()) {
            await qz.websocket.connect();
        }
        const printers = await qz.printers.find();
        const seleccionImpre = document.getElementById("seleccionImpre");

        seleccionImpre.innerHTML = "";
        printers.forEach(pr => {
            let option = document.createElement("option");
            option.value = pr;
            option.textContent = pr;
            seleccionImpre.appendChild(option);
        });
        console.log("Impresoras cargadas correctamente");

    } catch (err) {
        console.error("Error al obtener impresoras:", err);
        alert("No se pudieron obtener impresoras. Verifica QZ Tray.");
    }
});

function obtenerDatosTicket() {

    // Obtener datos del localStorage (enviados desde PDFTickets.js)
    const visitData = JSON.parse(localStorage.getItem("visitData")) || {};
    const nombre = visitData.nombre || "Sin nombre";
    const totalVisitantes = visitData.totalVisitantes || "0";

    // calcula el total de boletos seleccionados
    let totalBoletos = 0;
    const filas = document.querySelectorAll("table tr");
    for (let i = 1; i < filas.length; i++) {
        const fila = filas[i];
        const span = fila.querySelector("span");
        const cantidad = parseInt(span.innerText) || 0;
        totalBoletos += cantidad;
    }
    // Validar que el total de boletos coincida con totalVisitantes 
    // si no es así no se genera el ticket QR
    if (totalVisitantes > 0 && totalBoletos >= totalVisitantes) {
        // Continúa con el proceso de impresión
        console.log("Validación exitosa - proceder con la impresión");
    } else {
        alert("Debe seleccionar la cantidad correcta de boletos antes de imprimir.");
        return;
    }

    // Obtener información de los boletos y precio total
    const totalTexto = document.getElementById("totalAmount").innerText;
    const fechaHora = new Date().toLocaleString("es-MX");
    const lugar = "Zacatecas, Zac";

    // Obtener detalles de los boletos seleccionados
    let boletosSeleccionados = [];
    for (let i = 1; i < filas.length; i++) {
        const fila = filas[i];
        const tipoBoleto = fila.querySelector("td:nth-child(2)").textContent.trim();
        const span = fila.querySelector("span");
        const cantidad = parseInt(span.innerText) || 0;

        if (cantidad > 0) {
            // Asegurar que el precio sea válido, incluso si es 0 (VIP)
            const precioPorBoleto = preciosBoletos.hasOwnProperty(tipoBoleto) ? preciosBoletos[tipoBoleto] : 0;
            const totalPrecio = cantidad * precioPorBoleto;

            let tipoAbreviado = tipoBoleto
                .replace("Menor de edad (Especial)", "Menor")
                .replace("VIP (Cortesía)", "VIP")
                .replace("Adulto mayor", "AM")
                .replace("Estudiante", "Est");

            boletosSeleccionados.push(`${tipoAbreviado}: ${cantidad}x${precioPorBoleto}MXN`);
        }
    }

    // Crear texto para QR con información específica solicitada
    // Validar que tengamos boletos seleccionados
    if (boletosSeleccionados.length === 0) {
        alert("Debe seleccionar al menos un boleto antes de imprimir.");
        return;
    }

    return {
        nombre,
        totalVisitantes,
        totalTexto,
        fechaHora, lugar,
        boletosSeleccionados
    };

}


function generarPDF() {
    const { nombre, totalVisitantes, totalTexto, fechaHora, lugar, boletosSeleccionados } = obtenerDatosTicket();
    // Crear texto para QR
    const qrText = `Visitantes: ${totalVisitantes} | ${boletosSeleccionados.join(' | ')}`;
    console.log("QR Text:", qrText); // Para debug - puedes quitar esta línea después
    console.log("QR Text Length:", qrText.length); // Para verificar longitud

    const tempDiv = document.createElement("div");
    const ecc = ECC[eccEl.value] || QRCode.CorrectLevel.M;

    try {
        new QRCode(tempDiv, {
            text: qrText,
            width: 150,
            height: 150,
            correctLevel: ecc,
            version: 15 // Mayor version para más capacidad (hasta 40)
        });
    } catch (error) {

        console.warn("QR muy largo, usando versión ultra compacta");
        const qrTextCorto = `${totalVisitantes}:${boletosSeleccionados.length}boletos`;

        new QRCode(tempDiv, {
            text: qrTextCorto,
            width: 180,
            height: 180,
            correctLevel: ecc,
            version: 15
        });
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 200]
    });

    const offset = 0; // Mover lado izquierdo es num negativo
    let y = 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(20);
    //Alineación, todo va centrado al ancho del ticket
    const pageWidth = doc.internal.pageSize.getWidth();

    // Información del ticket 
    doc.text(lugar, pageWidth / 2 + offset, y, { align: "center" }); y += 8;

    doc.setFontSize(15); // Tamaño de texto reducido
    doc.text("Emitido: " + fechaHora, pageWidth / 2 + offset, y, { align: "center" }); y += 8;

    doc.setFontSize(17); // Tamaño de texto aumentado
    let nombreTexto = doc.splitTextToSize("Bienvenido: " + nombre, 70);
    doc.text(nombreTexto, pageWidth / 2 + offset, y, { align: "center" }); y += nombreTexto.length * 8;

    doc.setFontSize(17); // Tamaño de texto aumentado
    doc.text("Total visitantes: " + totalVisitantes, pageWidth / 2 + offset, y, { align: "center" }); y += 8;
    doc.text("Precio total: " + totalTexto, pageWidth / 2 + offset, y, { align: "center" }); y += 12;

    setTimeout(async () => {
        //forzar a usar el canvas para evitar bordes redondeados
        let qrCanvas = tempDiv.querySelector("canvas");
        if (qrCanvas) {
            let qrDataUrl = qrCanvas.toDataURL("image/png", 1.0);
            //QR centrado en el ticket
            const qrSize = 55;
            doc.addImage(qrDataUrl, "PNG", (pageWidth - qrSize) / 2, y, qrSize, qrSize);
            y += 70;
        }
        //Descargar el PDF
        doc.save("ticket.pdf");
        window.open(doc.output("bloburl"), "_blank");
    }, 500);

}


btnImprimir.addEventListener("click", async function () {
    const printer = document.getElementById("seleccionImpre").value;
    if (!printer) {
        alert("Por favor selecciona una impresora.");
        return;
    }

    const datosTicket = obtenerDatosTicket();
    if (!datosTicket) return; // Si no hay datos, salir
    const { nombre, totalVisitantes, totalTexto, fechaHora, lugar, boletosSeleccionados } = datosTicket;
    //Datos para el QR
    const datosQR = {
        "lugar": lugar,
        "fechaHora": fechaHora,
        "nombre": nombre,
        "totalVisitantes": totalVisitantes,
        "boletos": boletosSeleccionados,
        "precioTotal": totalTexto,
        "fecha-expiracion": new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleString()
    };

    try {

        const found = await qz.printers.find(printer);

        let config = qz.configs.create(found);
        let datosQRString = JSON.stringify(datosQR);
        let qrDataLength = datosQRString.length;
        let commandLength = qrDataLength + 3;

        // Nivel de corrección de errores según selección
        const eccValue = eccEl.value || 'M';
        let eccCode = '\x31'; // M por defecto
        switch (eccValue) {
            case 'L':
                eccCode = '\x30';
                break;
            case 'M':
                eccCode = '\x31';
                break;
            case 'Q':
                eccCode = '\x32';
                break;
            case 'H':
                eccCode = '\x33';
                break;
        }

        // Ejemplos de justificación de texto
        /*
        //-- Left Justification
        write("0x1B 0x40  0x1B 0x61 0x00  A 0x0A AB 0x0A ABC")

        //-- Center Justification
        write("0x1B 0x40  0x1B 0x61 0x01  A 0x0A AB 0x0A ABC")

        //-- Right Justification
        write("0x1B 0x40  0x1B 0x61 0x02  A 0x0A AB 0x0A ABC")

        Left		0x1B 0x61 0x00
        Center		0x1B 0x61 0x01
        Right	    0x1B 0x61 0x02


        '\x1B' + '\x45' + '\x01', // Negrita ON
        '\x1B' + '\x45' + '\x01', // Negrita OFF

        mas en https://medium.com/@osamainayat4999/esc-pos-commands-f0ab0c3b22cc
        */
        let data = [
            '\x1B' + '\x40',          // Initialize printer
            '\x1B' + '\x61' + '\x01', // Center alignment

            '\x1B' + '\x21' + '\x30', // Double height text and Double width
            '\x1B' + '\x21' + '\x08', // Emphasized
            'Museo\n',
            '\x1B' + '\x21' + '\x00', // Normal text
            '\n',

            '\x1B' + '\x21' + '\x10', // Double width text
            'Lugar: ' + lugar + '\n',
            '\x1B' + '\x21' + '\x00', // Normal text
            '\n',

            'Emitido: ' + fechaHora + '\n',
            '\n',

            '\x1B' + '\x21' + '\x08', // Emphasized
            'Bienvenido:\n',
            '\x1B' + '\x21' + '\x00', // Normal text
            nombre + '\n',
            '\n',

            '\x1B' + '\x21' + '\x08', // Emphasized
            'Total visitantes: ' + totalVisitantes + '\n',
            '\x1B' + '\x21' + '\x00',
            '\n',

            /*
            'Boletos:\n',
            boletosSeleccionados.join('\n') + '\n',
            '\n',
            */
            '\x1B' + '\x21' + '\x18', // Double width + Emphasized
            'Precio total: ' + totalTexto + '\n',
            '\x1B' + '\x21' + '\x00',
            '\n\n',
            // Configuración del QR
            '\x1D' + '\x28' + '\x6B' + '\x04' + '\x00' + '\x31' + '\x41' + '\x32' + '\x00', // GS ( k - Modelo 2
            '\x1D' + '(k' + '\x03' + '\x00' + '\x31' + '\x43' + '\x08', // Tamaño del módulo (8 unidades)
            '\x1D' + '(k' + '\x03' + '\x00' + '\x31' + '\x45' + eccCode, // Nivel de corrección de errores
            '\x1D' + '(k' + String.fromCharCode(commandLength & 0xFF) + String.fromCharCode((commandLength >> 8) & 0xFF) + '\x31' + '\x50' + '\x30' + datosQRString, // Almacenar datos del QR
            '\x1D' + '(k' + '\x03' + '\x00' + '\x31' + '\x51' + '\x30', // Imprimir el QR
            '\x1B' + '\x61' + '\x00', // Left alignment
            '\n\n\n\n\n',             // Feed paper
            '\x1D' + '\x56' + '\x41' + '\x10' // Cut paper
        ];
        await qz.print(config, data);
        alert("Impresión enviada a " + found);
        generarPDF();
    } catch (err) {
        alert("Error durante la impresión: " + err);
        console.error("Error durante la impresión:", err);
    }

});
    //Desconectar QZ Tray cuando se cierra la ventana
/*window.addEventListener("beforeunload", function() {
    if (qz.websocket.isActive()) {
        qz.websocket.disconnect();
    }
});*/


