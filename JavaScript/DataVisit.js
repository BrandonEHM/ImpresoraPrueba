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
    window.location.href = "../HTML/FormsVisit.html"; // Cambia por tu ruta

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
        await qz.websocket.connect();
        const printers = await qz.printers.find();
        const seleccionImpre = document.getElementById("seleccionImpre");

        seleccionImpre.innerHTML = "";
        printers.forEach(pr => {
            let option = document.createElement("option");
            option.value = pr;
            option.textContent = pr;
            seleccionImpre.appendChild(option);
        });

    } catch (err) {
        console.error("Error al obtener impresoras:", err);
        alert("No se pudieron obtener impresoras. Verifica QZ Tray.");
    }
});




btnImprimir.addEventListener("click", async function () {

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
        totalBoletos += cantidad; // Suma todas las cantidades de boletos
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
    const printer = document.getElementById("seleccionImpre").value;

    if (!printer) {
        alert("Por favor selecciona una impresora.");
        return;
    }

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
            // --*--SOLUCIÓN 1: Abreviar nombres de boletos para reducir longitud
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

    //const qrText = `Total visitantes: ${totalVisitantes} | Boletos: ${boletosSeleccionados.join(' | ')} | Precio total: ${totalTexto}`;
    const qrText = `Visitantes: ${totalVisitantes} | ${boletosSeleccionados.join(' | ')}`;

    console.log("QR Text:", qrText); // Para debug - puedes quitar esta línea después
    console.log("QR Text Length:", qrText.length); // Para verificar longitud

    //---**-- SOLUCIÓN 3: Se agrego la version más alta para mayor capacidad
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
        //---**--  SOLUCIÓN 4: Crear texto aún más corto
        console.warn("QR muy largo, usando versión ultra compacta");
        const qrTextCorto = `${totalVisitantes}:${boletosSeleccionados.length}boletos`;

        new QRCode(tempDiv, {
            text: qrTextCorto,
            width: 150,
            height: 150,
            correctLevel: ecc,
            version: 10
        });
    }

    const { jsPDF } = window.jspdf;
    //const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 200] });
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });


    let y = 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    //Alineación, todo va centrado al ancho del ticket
    const pageWidth = doc.internal.pageSize.getWidth();

    // Información del ticket (solo lo que solicitaste)
    doc.text(lugar, pageWidth / 2, y, { align: "center" }); y += 8;
    doc.text("Emitido: " + fechaHora, pageWidth / 2, y, { align: "center" }); y += 8;
    let nombreTexto = doc.splitTextToSize("Bienvenido: " + nombre, 70);
    doc.text(nombreTexto, pageWidth / 2, y, { align: "center" }); y += nombreTexto.length * 6;
    doc.text("Total visitantes: " + totalVisitantes, pageWidth / 2, y, { align: "center" }); y += 8;
    doc.text("Precio total: " + totalTexto, pageWidth / 2, y, { align: "center" }); y += 12;

    setTimeout(async () => {
        //forzar a usar el canvas para evitar bordes redondeados
        let qrCanvas = tempDiv.querySelector("canvas");
        if (qrCanvas) {
            let qrDataUrl = qrCanvas.toDataURL("image/png", 1.0);
            //QR centrado en el ticket
            doc.addImage(qrDataUrl, "PNG", (pageWidth - 60) / 2, y, 60, 60);
            y += 70;
        }

        const pdfBase64 = btoa(doc.output());

        try {
            const config = qz.configs.create(printer);
            const data = [{ type: 'pdf', format: 'base64', data: pdfBase64 }];
            await qz.print(config, data);
            alert("Ticket enviado a la impresora: " + printer);
        } catch (err) {
            console.error(err);
            alert("Error al imprimir: " + err);
        }

        doc.save("ticket.pdf");
        window.open(doc.output("bloburl"), "_blank");
    }, 500);
});

//termina la generación de PDF y QR*-*-*-*

//Empireza la generación de PDF y QR*-*-*-*
//******** Generar QR y PDF ********// 
/*const btnImprimir = document.getElementById("imprimirBoleto");
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
        await qz.websocket.connect();
        const printers = await qz.printers.find();
        const seleccionImpre = document.getElementById("seleccionImpre");

        seleccionImpre.innerHTML = "";
        printers.forEach(pr => {
            let option = document.createElement("option");
            option.value = pr;
            option.textContent = pr;
            seleccionImpre.appendChild(option);
        });

    } catch (err) {
        console.error("Error al obtener impresoras:", err);
        alert("No se pudieron obtener impresoras. Verifica QZ Tray.");
    }
});

btnImprimir.addEventListener("click", async function () {
    // Obtener datos del localStorage (enviados desde PDFTickets.js)
    const visitData = JSON.parse(localStorage.getItem("visitData")) || {};
    const nombre = visitData.nombre || "Sin nombre";
    const totalVisitantes = visitData.totalVisitantes || "0";

    // Obtener información de los boletos y precio total
    const totalTexto = document.getElementById("totalAmount").innerText;
    const printer = document.getElementById("seleccionImpre").value;

    if (!printer) {
        alert("Por favor selecciona una impresora.");
        return;
    }

    const fechaHora = new Date().toLocaleString("es-MX");
    const lugar = "Zacatecas, Zac";

    // Obtener detalles de los boletos seleccionados
    let boletosSeleccionados = [];
    const filas = document.querySelectorAll("table tr");
    for (let i = 1; i < filas.length; i++) {
        const fila = filas[i];
        const tipoBoleto = fila.querySelector("td:nth-child(2)").textContent.trim();
        const span = fila.querySelector("span");
        const cantidad = parseInt(span.innerText) || 0;

        if (cantidad > 0) {
            // Asegurar que el precio sea válido, incluso si es 0 (VIP)
            const precioPorBoleto = preciosBoletos.hasOwnProperty(tipoBoleto) ? preciosBoletos[tipoBoleto] : 0;
            const totalPrecio = cantidad * precioPorBoleto;
            boletosSeleccionados.push(`${tipoBoleto}: ${cantidad} boleto(s) - ${totalPrecio}MXN`);
        }
    }

    // Crear texto para QR con información específica solicitada
    // Validar que tengamos boletos seleccionados
    if (boletosSeleccionados.length === 0) {
        alert("Debe seleccionar al menos un boleto antes de imprimir.");
        return;
    }

    //const qrText = `Total visitantes: ${totalVisitantes} | Boletos: ${boletosSeleccionados.join(' | ')} | Precio total: ${totalTexto}`;
    const qrText = `Visitantes: ${totalVisitantes} | ${boletosSeleccionados.join(' | ')}`;

    console.log("QR Text:", qrText); // Para debug - puedes quitar esta línea después

    const tempDiv = document.createElement("div");
    const ecc = ECC[eccEl.value] || QRCode.CorrectLevel.M;
    new QRCode(tempDiv, {
        text: qrText,
        width: 150,
        height: 150,
        correctLevel: ecc
        //version: 10 // aumenta la capacidad (1–40)
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 200] });

    let y = 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    //Alineación, todo va centrado al ancho del ticket
    const pageWidth = doc.internal.pageSize.getWidth();

    // Información del ticket (solo lo que solicitaste)
    doc.text("Lugar: " + lugar, pageWidth / 2, y, { align: "center" }); y += 8;
    doc.text("Emitido: " + fechaHora, pageWidth / 2, y, { align: "center" }); y += 8;
    let nombreTexto = doc.splitTextToSize("Visitante: " + nombre, 70);
    doc.text(nombreTexto, pageWidth / 2, y, { align: "center" }); y += nombreTexto.length * 6;
    doc.text("Total visitantes: " + totalVisitantes, pageWidth / 2, y, { align: "center" }); y += 8;
    doc.text("Precio total: " + totalTexto, pageWidth / 2, y, { align: "center" }); y += 12;

    setTimeout(async () => {
        //forzar a usar el canvas para evitar bordes redondeados
        let qrCanvas = tempDiv.querySelector("canvas");
        if (qrCanvas) {
            let qrDataUrl = qrCanvas.toDataURL("image/png", 1.0);
            //QR centrado en el ticket
            doc.addImage(qrDataUrl, "PNG", (pageWidth - 60) / 2, y, 60, 60);
            y += 70;
        }

        const pdfBase64 = btoa(doc.output());

        try {
            const config = qz.configs.create(printer);
            const data = [{ type: 'pdf', format: 'base64', data: pdfBase64 }];
            await qz.print(config, data);
            alert("Ticket enviado a la impresora: " + printer);
        } catch (err) {
            console.error(err);
            alert("Error al imprimir: " + err);
        }

        doc.save("ticket.pdf");
        window.open(doc.output("bloburl"), "_blank");
    }, 500);
});
//termina la generación de PDF y QR*-*-*-*
*/


