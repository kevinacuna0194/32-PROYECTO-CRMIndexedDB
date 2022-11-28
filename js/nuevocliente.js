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
    
        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        }
    
        abrirConexion.onsuccess = function() {
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

        /** Tenemos que abrir una conexión y después, por medio de transacciones, colocar o agregar ese nuevo registro. 
         * Object literal enhancement
        */
        const cliente = {
            nombre,
            email,
            telefono,
            empresa
        }

        /** Generar un ID único */
        cliente.id = Date.now();

        crearNuevoCliente(cliente);
    }

    /** A estas alturas ya pase la validación */
    function crearNuevoCliente(cliente) {
        /** DB - instancia la la DB conectarDB() */
        const transaction = DB.transaction(['crm'], 'readwrite');

        /** Definir ObjectStore 
         * Hace las acciones
        */
        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = function () {
            // console.error('Hubo un error')

            imprimirAlerta('Hubo un Error', 'error');
        };

        transaction.oncomplete = function () {
            // console.log('Cliente agregado');

            imprimirAlerta('El Cliente se Agregó correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };
    }
})();