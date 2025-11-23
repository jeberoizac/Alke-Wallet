/*********************************************************
 * UTILIDADES GENERALES
 *********************************************************/
// Quita el foco del elemento activo para cerrar teclados virtuales.
function quitarFoco() { if (document.activeElement) document.activeElement.blur(); }

/**
 * Muestra una alerta de Bootstrap en el contenedor #alerta-container.
 * @param {string} mensaje - El texto a mostrar.
 * @param {string} tipo - Clase de la alerta (e.g., 'success', 'danger', 'warning').
 */
function mostrarAlertaBootstrap(mensaje, tipo) {
    // Genera el HTML de la alerta de Bootstrap
    const alertaHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    // Uso jQuery para reemplazar el contenido del contenedor de alertas
    $('#alerta-container').html(alertaHTML); 
    
    // Opcional: Para que la alerta desaparezca automáticamente después de un tiempo
    setTimeout(() => {
        $('#alerta-container').empty();
    }, 4000);
}


/*********************************************************
 * LOGIN (login.html) - USANDO JQUERY Y BOOTSTRAP
 *********************************************************/
function validarLogin(event) {
    // Previene el envío tradicional del formulario
    event.preventDefault(); 
    
    // jQuery: Obtiene los valores de los inputs
    const email = $("#inputEmail").val() || ""; 
    const pass  = $("#inputPassword").val() || "";
    
    const testEmail = "test@gmail.com";
    const testPass  = "4444";

    if (!email.trim()) return mostrarAlertaBootstrap("Ingrese email.", "warning");
    if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) return mostrarAlertaBootstrap("Email inválido.", "warning");
    if (!pass.trim()) return mostrarAlertaBootstrap("Ingrese contraseña.", "warning");
    
    if (email === testEmail && pass === testPass) {
        // Validación correcta
        mostrarAlertaBootstrap("Validación correcta. Redirigiendo...", "success");
        window.location.href = "menu.html"; 
    } else {
        // Error de credenciales
        mostrarAlertaBootstrap("Email o contraseña incorrectos.", "danger");
    }
}

/*********************************************************
 * SALDO GLOBAL
 *********************************************************/
function obtenerSaldo() { return Number(localStorage.getItem("saldoActual")) || 1200000; }
function guardarSaldo(valor) { localStorage.setItem("saldoActual", valor); }

/*********************************************************
 * TRANSACCIONES
 *********************************************************/
function registrarTransaccion(tipo, monto, detalle = "") {
    let lista = JSON.parse(localStorage.getItem("transacciones") || "[]");
    lista.unshift({ tipo, monto, detalle, fecha: new Date().toLocaleString() });
    localStorage.setItem("transacciones", JSON.stringify(lista));
}

/*********************************************************
 * DEPÓSITO (deposit.html)
 *********************************************************/
function initDeposito() {

    // Mostrar el saldo actual
    const saldo = obtenerSaldo().toLocaleString();
    $("#saldoActualDisplay").text(`$${saldo}`); 

    const btn = $("#depositar"); 
    const input = $("#inputMontoDeposito"); 
    const confirmacionDiv = $('<div id="deposito-confirmacion" class="mt-3 text-success fw-bold"></div>'); 
    
    // Agrega el div de confirmación después del botón
    btn.parent().after(confirmacionDiv); 

    if (!btn.length || !input.length) return; 
    
    // Asigna el evento click
    btn.on("click", e => {
        e.preventDefault();
        const monto = parseFloat(input.val()); 
        
        if (isNaN(monto) || monto <= 0) {
            mostrarAlertaBootstrap("Monto inválido para depositar.", "danger");
            return;
        }

        // Lógica del depósito
        const saldoNuevo = obtenerSaldo() + monto;
        guardarSaldo(saldoNuevo);
        registrarTransaccion("Depósito", monto);
        
        input.val('');

        // Muestra la leyenda de confirmación
        confirmacionDiv.text(`✅ Depósito de $${monto.toLocaleString()} realizado con éxito.`);

        // Muestra mensaje de éxito con Alerta de Bootstrap
        mostrarAlertaBootstrap(`¡Depósito Exitoso! Se acreditaron $${monto.toLocaleString()}. Redirigiendo...`, "success");

        // Redirige al menú principal después de 2 segundos
        setTimeout(() => {
            window.location.href = "menu.html";
        }, 2000); 
    });
}

/*********************************************************
 * MENÚ PRINCIPAL (menu.html)
 *********************************************************/
function initMenu() {
    const saldoEl = $("#monto"); 
    if (!saldoEl.length) return;
    // Muestra el saldo formateado
    saldoEl.text("$" + obtenerSaldo().toLocaleString()); 
    
    const cont = $("#enlaces-navegacion"); 
    if (cont.length) {
        // Asigna evento a todos los botones de navegación
        cont.on("click", ".nav-btn", e => { 
            e.preventDefault();
            alert("Redirigiendo a: " + $(e.target).text().trim()); 
            window.location.href = $(e.target).attr('href');
        });
    }
}

/*********************************************************
 * CONTACTOS + ENVÍO DINERO (sendmoney.html)
 *********************************************************/
let contactos = [];
let contactoSeleccionado = null;
let todosLosMovimientos = []; // Variable global para el filtro de movimientos

function guardarContactos() { localStorage.setItem("contactos", JSON.stringify(contactos)); }

// Carga los contactos del LocalStorage e inicia el renderizado
function cargarContactos() {
    const guardados = JSON.parse(localStorage.getItem("contactos") || "[]");
    contactos = guardados;
    renderizarContactos(contactos);
}

// Renderiza la lista de contactos (puede ser filtrada)
function renderizarContactos(lista) {
    const listaEl = $("#listaContactos"); 
    if (!listaEl.length) return;
    listaEl.empty(); // Limpia la lista
    if (lista.length === 0) {
        listaEl.html('<li class="list-group-item text-muted">No se encontraron contactos que coincidan.</li>');
        return;
    }
    lista.forEach(c => agregarContactoALista(c));
}

// Filtra la lista de contactos por nombre o alias
function filtrarContactos(termino) {
    const terminoLower = termino.toLowerCase().trim();
    
    if (terminoLower === "") {
        renderizarContactos(contactos);
        return;
    }

    // Filtra la lista de contactos
    const contactosFiltrados = contactos.filter(c => {
        return c.nombre.toLowerCase().includes(terminoLower) || c.alias.toLowerCase().includes(terminoLower);
    });

    renderizarContactos(contactosFiltrados);
}

// Valida y obtiene los datos del modal de nuevo contacto
function validarModal() {
    const nombre = $("#nombreApellido").val().trim(); 
    const cbu = $("#numeroCuenta").val().trim(); 
    const alias = ($("#id-alias").val() || $("#idAlias").val() || "").trim(); 
    const banco = $("#nombreBanco").val().trim(); 
    const error = $("#mensajeError"); 

    if (nombre.length < 3) { if (error.length) error.text("Nombre mínimo 3 letras"); return false; } 
    if (!/^\d{10}$/.test(cbu) && !/^\d{22}$/.test(cbu)) { if (error.length) error.text("CBU inválido"); return false; }
    if (alias.length < 3) { if (error.length) error.text("Alias mínimo 3"); return false; }
    if (banco.length < 3) { if (error.length) error.text("Banco inválido"); return false; }
    if (error.length) error.text("");
    return { nombre, cbu, alias, banco };
}

// Crea y agrega un contacto a la lista visual (con eventos)
function agregarContactoALista(datos) {
    const lista = $("#listaContactos"); 
    if (!lista.length) return;
    const li = $("<li></li>"); 
    li.addClass("list-group-item d-flex justify-content-between align-items-center"); 
    li.css("cursor", "pointer"); 
    li.html(`<span class="nombre">${datos.nombre}</span><button class="btn btn-danger btn-sm btnEliminar">Eliminar</button>`); 
    
    // Asignación de evento de selección
    li.on("click", e => {
        if ($(e.target).hasClass("btnEliminar")) return; 
        $("#listaContactos li").removeClass("active"); // Desactiva otros contactos
        li.addClass("active"); // Activa el contacto seleccionado
        contactoSeleccionado = datos;
        const btnE = $("#btnEnviar"); 
        if (btnE.length) btnE.show(); // Muestra botón Enviar Dinero
    });
    
    // Asignación de evento de eliminación
    li.find(".btnEliminar").on("click", () => { 
        li.remove();
        contactos = contactos.filter(c => c.cbu !== datos.cbu);
        guardarContactos();
        contactoSeleccionado = null;
        const btnE = $("#btnEnviar"); 
        if (btnE.length) btnE.hide(); // Oculta botón Enviar Dinero
    });
    lista.append(li); 
}

// Inicializa la página de envío de dinero
function initSendMoney() {
    const listaEl = $("#listaContactos"); 
    if (!listaEl.length) return;
    cargarContactos(); 
    
    // LÓGICA DE BÚSQUEDA
    const inputBuscar = $("#inputBuscarContacto");
    const searchForm = $("#searchForm");

    if (inputBuscar.length) {
        // Captura evento 'submit' (Enter) para buscar
        searchForm.on('submit', function(e) {
            e.preventDefault(); 
            filtrarContactos(inputBuscar.val());
        });

        // Captura evento 'keyup' para buscar mientras se escribe
        inputBuscar.on('keyup', function() {
            filtrarContactos(inputBuscar.val());
        });
    }

    // Lógica para guardar nuevo contacto
    const btnGuardar = $("#guardarContacto");
    if (btnGuardar.length) {
        btnGuardar.on("click", () => {
            const datos = validarModal();
            if (!datos) return;

            contactos.push(datos);
            guardarContactos();
            cargarContactos(); 
            $("#nombreApellido").val(""); 
            $("#numeroCuenta").val(""); 
            if ($("#id-alias").length) $("#id-alias").val(""); 
            if ($("#idAlias").length) $("#idAlias").val(""); 
            $("#nombreBanco").val(""); 
            quitarFoco();
            // Oculta modal
            if (window.bootstrap && $("#modalContacto").length) bootstrap.Modal.getInstance($("#modalContacto")[0]).hide();
        });
    }

    // Lógica para abrir el modal de envío de dinero
    const btnEnviar = $("#btnEnviar");
    if (btnEnviar.length) {
        btnEnviar.on("click", () => {
            if (!contactoSeleccionado) return;
            // Limpia inputs y errores al abrir
            if ($("#inputMontoEnviar").length) $("#inputMontoEnviar").val("");
            if ($("#errorMontoEnviar").length) $("#errorMontoEnviar").text("");
            
            // Muestra modal de envío
            if (window.bootstrap && $("#modalMontoEnviar").length) new bootstrap.Modal($("#modalMontoEnviar")[0]).show();
        });
    }

    // Lógica para confirmar el envío de dinero
    const btnConfirmar = $("#btnConfirmarEnvio");
    if (btnConfirmar.length) {
        btnConfirmar.on("click", () => {
            const monto = parseFloat($("#inputMontoEnviar").val());
            const error = $("#errorMontoEnviar");

            if (isNaN(monto) || monto <= 0) { if (error.length) error.text("Monto inválido"); return; }
            if (monto > obtenerSaldo()) { if (error.length) error.text("Saldo insuficiente"); return; }
            
            // Realiza la transacción
            guardarSaldo(obtenerSaldo() - monto); 
            registrarTransaccion("Envío", monto, contactoSeleccionado.nombre);
            
            // Muestra confirmación
            if ($("#mensajeConfirmacion").length) $("#mensajeConfirmacion").text(`✔ Se enviaron $${monto.toLocaleString()} a ${contactoSeleccionado.nombre}`);
            
            quitarFoco();
            // Oculta modal
            if (window.bootstrap && $("#modalMontoEnviar").length) bootstrap.Modal.getInstance($("#modalMontoEnviar")[0]).hide();
            
            // Redirige al menú principal después de 3 segundos
            setTimeout(function(){
                window.location.href = "menu.html"; 
            }, 3000); 
        });
    }
}

/*********************************************************
 * MOVIMIENTOS (transactiones.html)
 *********************************************************/

/**
 * [RENOMBRADA] Obtiene el tipo de transacción formateado con color.
 * @param {string} tipo - El tipo de transacción (e.g., 'Envío', 'Depósito').
 * @returns {string} HTML del tipo de transacción con estilo.
 */
function getTipoTransaccion(tipo) {
    // Asigna color basado en el tipo: rojo para envío, verde para depósito
    const claseColor = tipo === 'Envío' ? 'text-danger' : 'text-success'; 
    return `<b><span class="${claseColor}">${tipo}</span></b>`;
}

/**
 * [RENOMBRADA] Dibuja los movimientos en la lista HTML.
 * @param {Array} movs - La lista de movimientos a mostrar (ya filtrada).
 */
function mostrarUltimosMovimientos(movs) {
    const lista = $("#lista-movimientos");
    if (!lista.length) return;
    lista.empty(); // Limpia la lista actual

    if (movs.length === 0) {
        lista.html('<li class="list-group-item text-muted">No hay movimientos para este filtro.</li>');
        return;
    }

    movs.forEach(m => {
        const li = $("<li></li>");
        li.addClass("list-group-item");
        
        // Usa la función renombrada para obtener el HTML del tipo
        const tipoHTML = getTipoTransaccion(m.tipo); 
        
        li.html(`${tipoHTML} - $${m.monto.toLocaleString()}<br><small>${m.fecha}</small>${m.detalle ? "<br><i>A: "+m.detalle+"</i>" : ""}`);
        lista.append(li);
    });
}

/**
 * Inicializa la página de movimientos y añade el evento de filtro.
 */
function initMovimientos() {
    // 1. Obtener todos los movimientos y asignarlos a la variable global
    todosLosMovimientos = JSON.parse(localStorage.getItem("transacciones") || "[]"); 
    
    // 2. Mostrar todos los movimientos inicialmente (Llama a la función renombrada)
    mostrarUltimosMovimientos(todosLosMovimientos); 
    
    // 3. Lógica de Filtrado (Event Listener)
    const filtroTipoEl = $("#filtroTipo"); // Elemento del dropdown
    
    if (filtroTipoEl.length) {
        
        // Escuchamos el evento 'change'
        filtroTipoEl.on('change', function() {
            // Obtener el valor seleccionado
            const filtroSeleccionado = filtroTipoEl.val(); 

            let movimientosFiltrados;

            if (filtroSeleccionado === "todos") {
                // Si selecciona "Todos", usa la lista completa
                movimientosFiltrados = todosLosMovimientos;
            } else {
                // Si seleccionó un tipo específico, filtra el array
                movimientosFiltrados = todosLosMovimientos.filter(m => {
                    return m.tipo === filtroSeleccionado;
                });
            }

            // 4. Renderizar la lista filtrada (Llama a la función renombrada)
            mostrarUltimosMovimientos(movimientosFiltrados);
        });
    }
}

/*********************************************************
 * INICIALIZAR SEGÚN PÁGINA
 *********************************************************/
// Ejecuta el código una vez que el DOM esté completamente cargado
$(document).ready(function() {
    const id = document.body.id;
    
    if (id === "page-login") {
        $("#loginForm").on('submit', validarLogin);
    }
    
    if (id === "page-deposito") initDeposito();
    
    if (id === "page-menu") initMenu();

    // Estas funciones se ejecutan en páginas donde existan los elementos (sendmoney y transactiones)
    initSendMoney();
    initMovimientos();
});