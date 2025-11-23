// assets/js/modules/movimientos.js
import { DataService } from './data.js';
import { getTipoTransaccion } from './ui.js';

// Variable privada del módulo para guardar todos los movimientos
let todosLosMovimientos = [];

/**
 * Dibuja los movimientos en la lista HTML.
 */
function mostrarUltimosMovimientos(movs) {
    const lista = $("#lista-movimientos");
    if (!lista.length) return;
    lista.empty(); 

    if (movs.length === 0) {
        lista.html('<li class="list-group-item text-muted">No hay movimientos para este filtro.</li>');
        return;
    }

    movs.forEach(m => {
        const li = $("<li></li>");
        li.addClass("list-group-item");
        
        const tipoHTML = getTipoTransaccion(m.tipo); 
        
        li.html(`${tipoHTML} - $${m.monto.toLocaleString()}<br><small>${m.fecha}</small>${m.detalle ? "<br><i>A: "+m.detalle+"</i>" : ""}`);
        lista.append(li);
    });
}

/**
 * Inicializa la página de movimientos y añade el evento de filtro.
 */
export function initMovimientos() {
    if (!$("#lista-movimientos").length) return;

    // 1. Obtener todos los movimientos
    todosLosMovimientos = DataService.getTransacciones();
    
    // 2. Mostrar todos los movimientos inicialmente
    mostrarUltimosMovimientos(todosLosMovimientos); 
    
    // 3. Lógica de Filtrado (Event Listener)
    const filtroTipoEl = $("#filtroTipo"); 
    
    if (filtroTipoEl.length) {
        filtroTipoEl.on('change', function() {
            const filtroSeleccionado = filtroTipoEl.val(); 
            let movimientosFiltrados;

            if (filtroSeleccionado === "todos") {
                movimientosFiltrados = todosLosMovimientos;
            } else {
                movimientosFiltrados = todosLosMovimientos.filter(m => {
                    return m.tipo === filtroSeleccionado;
                });
            }

            // 4. Renderizar la lista filtrada
            mostrarUltimosMovimientos(movimientosFiltrados);
        });
    }
}