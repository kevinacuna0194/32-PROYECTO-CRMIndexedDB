(function () {
    let DB;

    /** VARIABLES */
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });

    function conectarDB() {

        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function () {
            /** Instancia a la BD con todos los métodos disponibles */
            DB = abrirConexion.result;
        }
    }

    function validarCliente(e) {
        e.preventDefault();

        /** Leer todos los inputs */
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            // console.error('Error');
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }
    }

    function imprimirAlerta(mensaje, tipo) {

        const alerta = document.querySelector('.alerta');

        if(!alerta) {
            /** Crear alerta */
            const divMensaje = document.createElement('div');

            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'max-auto', 'mt-6', 'text-center', 'border', 'alerta');

            if (tipo === 'error') {
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }

            divMensaje.textContent = mensaje;

            formulario.appendChild(divMensaje);

            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }
})();