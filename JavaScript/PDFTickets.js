//**Validar datos del visitante************* */

const nombreInput = document.getElementById('nombre');

// Función para validar solo letras y espacios
function soloLetras(str) {
    return /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]*$/.test(str);
}

// Prevenir caracteres no alfabéticos mientras escribe
nombreInput.addEventListener('keypress', function (e) {
    const char = String.fromCharCode(e.which);

    // Permitir solo letras, espacios y caracteres especiales del español
    if (!/[A-Za-záéíóúÁÉÍÓÚñÑ\s]/.test(char)) {
        e.preventDefault(); //--*--*--*--* sobra la "s" que estaba aquí en tu código
        return false;
    }
});

// Validar al pegar texto
nombreInput.addEventListener('paste', function (e) {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');

    if (soloLetras(paste)) {
        this.value += paste;
    }
});

// Limpiar caracteres no válidos si se ingresan por otros medios
nombreInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ\s]/g, '');
});


//** Validar numeros, visitantes, cp y telefono  *******************/
// Función reutilizable para validar campos numéricos
function setupNumericValidation(inputId, options = {}) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const {
        allowDecimals = false,
        allowNegative = false,
        minValue = null,
        maxLength = null,
        fieldName = inputId
    } = options;

    // Validación en tiempo real mientras escribe
    input.addEventListener('input', function () {
        let valor = this.value;

        // Limpiar caracteres no válidos
        if (!allowDecimals) {
            valor = valor.replace(/\./g, '');
        }
        if (!allowNegative) {
            valor = valor.replace(/-/g, '');
        }

        // Aplicar maxLength si está definido
        if (maxLength && valor.length > maxLength) {
            valor = valor.substring(0, maxLength);
            this.value = valor;
        }

        const numericValue = parseFloat(valor);

        // Validaciones específicas
        if (this.value === '') {
            this.setCustomValidity('');
        } else if (isNaN(numericValue)) {
            this.setCustomValidity('Debe ser un número válido');
        } else if (minValue !== null && numericValue < minValue) {
            this.setCustomValidity(`Debe ser mayor o igual a ${minValue}`);
        } else if (!allowDecimals && !Number.isInteger(numericValue)) {
            this.setCustomValidity('Debe ser un número entero');
        } else {
            this.setCustomValidity('');
        }
    });

    // Prevenir caracteres no válidos al escribir
    input.addEventListener('keydown', function (e) {
        if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
            return;
        }

        if (allowDecimals && e.keyCode === 190 && this.value.indexOf('.') === -1) {
            return;
        }

        if (allowNegative && e.keyCode === 189 && this.value.length === 0) {
            return;
        }

        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    // Prevenir pegar contenido no válido
    input.addEventListener('paste', function (e) {
        e.preventDefault();
        let paste = (e.clipboardData || window.clipboardData).getData('text');

        paste = paste.replace(/[^0-9.-]/g, '');
        if (!allowDecimals) {
            paste = paste.replace(/\./g, '');
        }
        if (!allowNegative) {
            paste = paste.replace(/-/g, '');
        }

        if (maxLength) {
            paste = paste.substring(0, maxLength);
        }

        this.value = paste;
        this.dispatchEvent(new Event('input'));
    });
}

// Configurar validaciones para cada campo
document.addEventListener('DOMContentLoaded', function () {
    setupNumericValidation('cp', { allowDecimals: false, allowNegative: false, maxLength: 5, fieldName: 'código postal' });
    setupNumericValidation('telefono', { allowDecimals: false, allowNegative: false, maxLength: 10, fieldName: 'teléfono' });
    setupNumericValidation('cantHombres', { allowDecimals: false, allowNegative: false, minValue: 0, fieldName: 'cantidad hombres' });
    setupNumericValidation('cantMujeres', { allowDecimals: false, allowNegative: false, minValue: 0, fieldName: 'cantidad mujeres' });
    setupNumericValidation('totalVisitantes', { allowDecimals: false, allowNegative: false, minValue: 1, maxLength: 4, fieldName: 'total visitantes' });
});

// Validación al enviar el formulario
const form = document.getElementById('FormTicket');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const cp = document.getElementById('cp').value;
        const telefono = document.getElementById('telefono').value;
        const cantHombres = parseInt(document.getElementById('cantHombres').value) || 0;
        const cantMujeres = parseInt(document.getElementById('cantMujeres').value) || 0;
        const totalVisitantes = parseInt(document.getElementById('totalVisitantes').value);

        //--*--*--*--* ESTA VALIDACIÓN NO SIRVE: "visitantes" nunca se definió
        /*
        if (!visitantes || visitantes <= 0 || visitantes > 1000) {
            alert('Por favor, ingrese un número válido de visitantes (mayor a 0 y menor a 1000)');
            document.getElementById('visitantes').focus();
            return;
        }
        */

        if (cp && cp.length !== 5) {
            alert('El código postal debe tener exactamente 5 dígitos');
            document.getElementById('cp').focus();
            return;
        }

        if (telefono && telefono.length !== 10) {
            alert('El teléfono debe tener exactamente 10 dígitos');
            document.getElementById('telefono').focus();
            return;
        }

        if (cantHombres + cantMujeres !== totalVisitantes) {
            alert('La suma de hombres y mujeres debe coincidir con el total de visitantes');
            return;
        }

        // Si todo es válido
        alert(`Formulario válido!\nVisitantes: ${totalVisitantes}\nCP: ${cp}\nTeléfono: ${telefono}`);
    });
}


//*************Grupo verdadero o falso ***********************
const esGrupoSelect = document.getElementById('grupo');
const cantidadHombres = document.getElementById('cantHombres');
const cantidadMujeres = document.getElementById('cantMujeres');
const cantidadTotal = document.getElementById('totalVisitantes');

function actualizarCantidadTotal() {
    const hombres = parseInt(cantidadHombres.value) || 0;
    const mujeres = parseInt(cantidadMujeres.value) || 0;
    const totalVisitantes = hombres + mujeres;
    cantidadTotal.value = totalVisitantes > 0 ? totalVisitantes : 1;
}

function toggleCampos() {
    const esGrupo = esGrupoSelect.value === 'Sí';
    cantidadHombres.disabled = !esGrupo;
    cantidadMujeres.disabled = !esGrupo;

    if (!esGrupo) {
        cantidadHombres.value = 0;
        cantidadMujeres.value = 0;
        cantidadTotal.value = 1;
        actualizarPrecioTotal();
    }
    actualizarCantidadTotal();
}

esGrupoSelect.addEventListener('change', toggleCampos);
cantidadHombres.addEventListener('input', actualizarCantidadTotal);
cantidadMujeres.addEventListener('input', actualizarCantidadTotal);
cantidadHombres.addEventListener('change', actualizarCantidadTotal);
cantidadMujeres.addEventListener('change', actualizarCantidadTotal);

document.addEventListener('DOMContentLoaded', function () {
    toggleCampos();
    actualizarCantidadTotal();
});


//******PRECIO-BOLETO *********/
const tipoBoleto = document.getElementById('Tipo_boleto');
const totalAmountElement = document.getElementById('totalAmount');

function actualizarPrecioTotal() {
    const valorPrecio = parseInt(tipoBoleto.value) || 0;
    const totalVisitantes = parseInt(cantidadTotal.value) || 1;
    const precioTotal = valorPrecio * totalVisitantes;
    totalAmountElement.textContent = `$${precioTotal}MXN`;
}

tipoBoleto.addEventListener('change', actualizarPrecioTotal);
cantidadHombres.addEventListener('input', actualizarPrecioTotal);
cantidadMujeres.addEventListener('input', actualizarPrecioTotal);
cantidadHombres.addEventListener('change', actualizarPrecioTotal);
cantidadMujeres.addEventListener('change', actualizarPrecioTotal);

actualizarPrecioTotal();


//******** Generar QR y PDF ********// 
const btnImprimir = document.getElementById("imprimir");

const ECC = {
    L: QRCode.CorrectLevel.L,
    M: QRCode.CorrectLevel.M,
    Q: QRCode.CorrectLevel.Q,
    H: QRCode.CorrectLevel.H,
};

const eccEl = document.getElementById("ecc");

//****** Notificación de impresoras que hay *******/
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
    const nombre = document.getElementById("nombre").value;
    const tipoBoletoEl = document.getElementById("Tipo_boleto");
    const tipoBoletoTexto = tipoBoletoEl.options[tipoBoletoEl.selectedIndex].text;
    const totalVisitantes = document.getElementById("totalVisitantes").value;
    const totalTexto = document.getElementById("totalAmount").innerText;
    const printer = document.getElementById("seleccionImpre").value;

    if (!printer) {
        alert("Por favor selecciona una impresora.");
        return;
    }

    const fechaHora = new Date().toLocaleString("es-MX");
    const lugar = "Zacatecas, Zac";

    const qrText = `Lugar: ${lugar} Emitido: ${fechaHora} Visitante: ${nombre} Tipo de boleto: ${tipoBoletoTexto} Total visitantes: ${totalVisitantes} Precio: ${totalTexto}`;

    const tempDiv = document.createElement("div");
    const ecc = ECC[eccEl.value] || QRCode.CorrectLevel.M;
    new QRCode(tempDiv, { text: qrText, width: 150, height: 150, correctLevel: ecc });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 200] });

    let y = 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text("Lugar: " + lugar, 10, y); y += 8;
    doc.text("Emitido: " + fechaHora, 10, y); y += 8;
    let nombreTexto = doc.splitTextToSize("Visitante: " + nombre, 60);
    doc.text(nombreTexto, 10, y); y += nombreTexto.length * 6;
    doc.text("Tipo de boleto: " + tipoBoletoTexto, 10, y); y += 8;
    doc.text("Total visitantes: " + totalVisitantes, 10, y); y += 8;
    doc.text("Precio: " + totalTexto, 10, y); y += 12;

    setTimeout(async () => {
        let qrImg = tempDiv.querySelector("img") || tempDiv.querySelector("canvas");
        if (qrImg) {
            let qrDataUrl = qrImg.tagName.toLowerCase() === "img" ? qrImg.src : qrImg.toDataURL("image/png");
            doc.addImage(qrDataUrl, "PNG", 15, y, 50, 50);
            y += 60;
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

const btnCancelar = document.getElementById("cancelar");
btnCancelar.addEventListener("click", async function () {
    //--*--*--*--* este bloque de desconexión QZ Tray lo tienes comentado y no se usa:
    /*
    if (qz.websocket.isActive()) {
        await qz.websocket.disconnect();
    }
    alert("Conexión con QZ Tray cerrada.");
    location.reload();
    */

    document.getElementById("FormTicket").reset();
    actualizarPrecioTotal();
    toggleCampos();
    actualizarCantidadTotal();
});
