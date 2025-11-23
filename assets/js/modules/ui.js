// assets/js/modules/ui.js

// Quita el foco del elemento activo
export function quitarFoco() { 
    if (document.activeElement) document.activeElement.blur(); 
}

/**
 * Muestra una alerta de Bootstrap en el contenedor #alerta-container.
 */
export function mostrarAlertaBootstrap(mensaje, tipo) {
    const alertaHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    $('#alerta-container').html(alertaHTML); 
    
    // La alerta desaparece automáticamente después de 4 segundos
    setTimeout(() => {
        $('#alerta-container').empty();
    }, 4000);
}

/**
 * Obtiene el tipo de transacción formateado con color.
 */
export function getTipoTransaccion(tipo) {
    const claseColor = tipo === 'Envío' ? 'text-danger' : 'text-success'; 
    return `<b><span class="${claseColor}">${tipo}</span></b>`;
}