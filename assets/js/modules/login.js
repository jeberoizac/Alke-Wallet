// assets/js/modules/login.js
import { mostrarAlertaBootstrap } from './ui.js';

// Exportamos la función para que app.js pueda usarla
export function validarLogin(event) {
    // Previene el envío tradicional del formulario
    event.preventDefault(); 
    const email = $("#inputEmail").val() || ""; 
    const pass  = $("#inputPassword").val() || "";
    
    // Credenciales de prueba
    const testEmail = "test@gmail.com";
    const testPass  = "4444";

    // Validaciones básicas
    if (!email.trim()) return mostrarAlertaBootstrap("Ingrese email.", "warning");
    if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) return mostrarAlertaBootstrap("Email inválido.", "warning");
    if (!pass.trim()) return mostrarAlertaBootstrap("Ingrese contraseña.", "warning");
    
    // Verificación de credenciales
    if (email === testEmail && pass === testPass) {
        mostrarAlertaBootstrap("Validación correcta. Redirigiendo...", "success");
        // Redirección al menú principal
        window.location.href = "menu.html"; 
    } else {
        mostrarAlertaBootstrap("Email o contraseña incorrectos.", "danger");
    }
}