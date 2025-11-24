// assets/js/modules/deposito.js

import { DataService } from './data.js';
import { mostrarAlertaBootstrap } from './ui.js';

// Función para formatear el dinero
function formatCurrency(amount) {
    // Usamos 'es-CL' (o 'es-CLP' para moneda más específica) para formato chileno,
    // o simplemente el locale predeterminado con estilo de moneda.
    return amount.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}


export function initDeposito() {
    const saldoDisplay = $("#saldoActualDisplay");
    const btnDepositar = $("#depositar"); 
    const inputMonto = $("#inputMontoDeposito"); 
    
    // 1. Mostrar el saldo actual al cargar
    function actualizarSaldoDisplay() {
        const saldo = DataService.getSaldo();
        saldoDisplay.text(formatCurrency(saldo));
    }

    actualizarSaldoDisplay(); 
    
    // 2. Evento del botón de depósito
    if (!btnDepositar.length || !inputMonto.length) return; 
    
    btnDepositar.on("click", e => {
        e.preventDefault();
        
        // Convertir a número, asegurando un punto decimal
        let montoString = inputMonto.val().replace(',', '.');
        const monto = parseFloat(montoString);
        
        // 3. Validación
        if (isNaN(monto) || monto <= 0) {
            mostrarAlertaBootstrap("🚫 Error: Por favor, ingrese un monto válido mayor a $0.", "danger");
            inputMonto.val(''); // Limpiar el campo
            return;
        }

        // 4. Lógica del depósito usando DataService
        try {
            const saldoNuevo = DataService.getSaldo() + monto;
            DataService.setSaldo(saldoNuevo);
            DataService.registrarTransaccion("Depósito", monto); // Asume que registrarTransaccion maneja el signo
            
            // Limpiar el input y actualizar el saldo
            inputMonto.val('');
            actualizarSaldoDisplay();
            
            // Mostrar éxito y redirigir
            const montoFormateado = formatCurrency(monto);
            mostrarAlertaBootstrap(
                `🎉 **¡Depósito Exitoso!** Se han acreditado ${montoFormateado} a tu cuenta. Redirigiendo al menú...`, 
                "success"
            );

            // Redirige al menú principal después de 3 segundos
            setTimeout(() => {
                window.location.href = "menu.html";
            }, 3000); 
            
        } catch (error) {
             mostrarAlertaBootstrap("❌ Error: No se pudo completar la transacción. Intente de nuevo.", "danger");
             console.error("Error al realizar el depósito:", error);
        }
    });
}