// assets/js/app.js

// Importa todas las funciones de inicialización desde sus respectivos módulos
import { validarLogin } from './modules/login.js';
import { initDeposito } from './modules/deposit.js';
import { initMenu } from './modules/menu.js';
import { initSendMoney } from './modules/envio.js';
import { initMovimientos } from './modules/transactiones.js';

// El código se ejecuta una vez que el DOM esté completamente cargado (requiere jQuery)
$(document).ready(function() {
    const id = document.body.id;
    
    // 1. Inicialización de Login
    if (id === "page-login") {
        $("#loginForm").on('submit', validarLogin);
    }
    
    // 2. Inicialización de páginas específicas por ID
    if (id === "page-deposito") initDeposito();
    if (id === "page-menu") initMenu();

    // 3. Inicialización de páginas con lógica compartida o más compleja
    // Estas funciones deben verificar si sus elementos existen internamente (como lo hacen ahora)
    initSendMoney();
    initMovimientos();
});