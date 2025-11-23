// assets/js/modules/menu.js
import { DataService } from './data.js';

export function initMenu() {
    const saldoEl = $("#monto"); 
    if (!saldoEl.length) return;
    
    // Muestra el saldo formateado
    saldoEl.text("$" + DataService.getSaldo().toLocaleString()); 
    
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