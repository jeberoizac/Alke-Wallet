// assets/js/modules/envio.js
import { DataService } from './data.js';
import { quitarFoco, mostrarAlertaBootstrap } from './ui.js';

// Variables privadas del módulo
let contactos = [];
let contactoSeleccionado = null;

// Sincroniza la lista contactos del módulo con localStorage
function guardarContactos() { 
    DataService.setContactos(contactos);
}

// Carga los contactos del LocalStorage
function cargarContactos() {
    contactos = DataService.getContactos();
    renderizarContactos(contactos);
}

// Renderiza la lista de contactos
function renderizarContactos(lista) {
    const listaEl = $("#listaContactos"); 
    if (!listaEl.length) return;
    listaEl.empty(); 
    if (lista.length === 0) {
        listaEl.html('<li class="list-group-item text-muted">No se encontraron contactos que coincidan.</li>');
        return;
    }
    lista.forEach(c => agregarContactoALista(c));
}

// Filtra la lista de contactos
function filtrarContactos(termino) {
    const terminoLower = termino.toLowerCase().trim();
    
    if (terminoLower === "") {
        renderizarContactos(contactos);
        return;
    }

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

// Crea y agrega un contacto a la lista visual
function agregarContactoALista(datos) {
    const lista = $("#listaContactos"); 
    if (!lista.length) return;
    const li = $("<li></li>"); 
    li.addClass("list-group-item d-flex justify-content-between align-items-center"); 
    li.css("cursor", "pointer"); 
    li.html(`<span class="nombre">${datos.nombre}</span><button class="btn btn-danger btn-sm btnEliminar">Eliminar</button>`); 
    
    // Evento de selección
    li.on("click", e => {
        if ($(e.target).hasClass("btnEliminar")) return; 
        $("#listaContactos li").removeClass("active"); 
        li.addClass("active"); 
        contactoSeleccionado = datos;
        $("#btnEnviar").show(); 
    });
    
    // Evento de eliminación
    li.find(".btnEliminar").on("click", () => { 
        li.remove();
        contactos = contactos.filter(c => c.cbu !== datos.cbu);
        guardarContactos();
        contactoSeleccionado = null;
        $("#btnEnviar").hide(); 
    });
    lista.append(li); 
}


export function initSendMoney() {
    if (!$("#listaContactos").length) return;
    cargarContactos(); 
    
    // LÓGICA DE BÚSQUEDA
    const inputBuscar = $("#inputBuscarContacto");
    const searchForm = $("#searchForm");

    if (inputBuscar.length) {
        searchForm.on('submit', function(e) {
            e.preventDefault(); 
            filtrarContactos(inputBuscar.val());
        });
        inputBuscar.on('keyup', function() {
            filtrarContactos(inputBuscar.val());
        });
    }

    // Lógica para guardar nuevo contacto
    $("#guardarContacto").on("click", () => {
        const datos = validarModal();
        if (!datos) return;

        contactos.push(datos);
        guardarContactos();
        cargarContactos(); 
        $("#nombreApellido").val(""); 
        $("#numeroCuenta").val(""); 
        $("#id-alias, #idAlias").val(""); 
        $("#nombreBanco").val(""); 
        quitarFoco();
        
        // Ocultar modal
        if (window.bootstrap && $("#modalContacto").length) {
            bootstrap.Modal.getInstance($("#modalContacto")[0]).hide();
        }
    });
    
    // Lógica para abrir el modal de envío de dinero
    $("#btnEnviar").on("click", () => {
        if (!contactoSeleccionado) return;
        $("#inputMontoEnviar").val("");
        $("#errorMontoEnviar").text("");
        
        if (window.bootstrap && $("#modalMontoEnviar").length) {
            new bootstrap.Modal($("#modalMontoEnviar")[0]).show();
        }
    });

    // Lógica para confirmar el envío de dinero
    $("#btnConfirmarEnvio").on("click", () => {
        const monto = parseFloat($("#inputMontoEnviar").val());
        const error = $("#errorMontoEnviar");

        if (isNaN(monto) || monto <= 0) { if (error.length) error.text("Monto inválido"); return; }
        if (monto > DataService.getSaldo()) { if (error.length) error.text("Saldo insuficiente"); return; }
        
        // Realiza la transacción
        DataService.setSaldo(DataService.getSaldo() - monto); 
        DataService.registrarTransaccion("Envío", monto, contactoSeleccionado.nombre);
        
        $("#mensajeConfirmacion").text(`✔ Se enviaron $${monto.toLocaleString()} a ${contactoSeleccionado.nombre}`);
        
        quitarFoco();
        // Ocultar modal
        if (window.bootstrap && $("#modalMontoEnviar").length) {
            bootstrap.Modal.getInstance($("#modalMontoEnviar")[0]).hide();
        }
        
        // Redirige al menú principal después de 3 segundos
        setTimeout(function(){
            window.location.href = "menu.html"; 
        }, 3000); 
    });
}