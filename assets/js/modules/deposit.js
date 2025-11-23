// assets/js/modules/deposito.js
import { DataService } from './data.js';
import { mostrarAlertaBootstrap } from './ui.js';

export function initDeposito() {
    // Mostrar el saldo actual
    const saldo = DataService.getSaldo().toLocaleString();
    $("#saldoActualDisplay").text(`$${saldo}`); 

    const btn = $("#depositar"); 
    const input = $("#inputMontoDeposito"); 
    const confirmacionDiv = $('<div id="deposito-confirmacion" class="mt-3 text-success fw-bold"></div>'); 
    
    btn.parent().after(confirmacionDiv); 

    if (!btn.length || !input.length) return; 
    
    btn.on("click", e => {
        e.preventDefault();
        const monto = parseFloat(input.val()); 
        
        if (isNaN(monto) || monto <= 0) {
            mostrarAlertaBootstrap("Monto inválido para depositar.", "danger");
            return;
        }

        // Lógica del depósito usando DataService
        const saldoNuevo = DataService.getSaldo() + monto;
        DataService.setSaldo(saldoNuevo);
        DataService.registrarTransaccion("Depósito", monto);
        
        input.val('');

        confirmacionDiv.text(`✅ Depósito de $${monto.toLocaleString()} realizado con éxito.`);

        mostrarAlertaBootstrap(`¡Depósito Exitoso! Se acreditaron $${monto.toLocaleString()}. Redirigiendo...`, "success");

        // Redirige al menú principal después de 2 segundos
        setTimeout(() => {
            window.location.href = "menu.html";
        }, 2000); 
    });
}