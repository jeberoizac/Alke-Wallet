// assets/js/modules/data.js

// Objeto para manejar todas las operaciones de lectura/escritura en localStorage
export const DataService = {
    // SALDO
    getSaldo: () => Number(localStorage.getItem("saldoActual")) || 1200000,
    setSaldo: (valor) => localStorage.setItem("saldoActual", valor),

    // TRANSACCIONES
    getTransacciones: () => JSON.parse(localStorage.getItem("transacciones") || "[]"),
    registrarTransaccion: (tipo, monto, detalle = "") => {
        let lista = DataService.getTransacciones();
        lista.unshift({ tipo, monto, detalle, fecha: new Date().toLocaleString() });
        localStorage.setItem("transacciones", JSON.stringify(lista));
    },

    // CONTACTOS
    getContactos: () => JSON.parse(localStorage.getItem("contactos") || "[]"),
    setContactos: (contactos) => localStorage.setItem("contactos", JSON.stringify(contactos))
};