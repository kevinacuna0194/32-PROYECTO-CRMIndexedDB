(function () {

    let DB;

    const nombreInput = document.querySelector('#nombre');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        /** Verificar el ID de la URL 
         * Primero va a leer la URL, query string; Así se le conoce y en caso de que haya uno, va a mandar llamar a esa función de obtener cliente.
        */
        const parametrosURL = new URLSearchParams(window.location.search);
        const idCliente = parametrosURL.get('id');
        // console.log(idCliente);

        if (idCliente) {
            /** Esperar 1s a que se conecte a la BD y despues haga la consulta */
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    function obtenerCliente(id) {
        /** Para obtener el cliente necesitamos conectarnos a la base de datos. */
        const transaction = DB.transaction(['crm'], 'readonly'); // 'readwrite'
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                // console.log(cursor.value);
                if (cursor.value.id === Number(id)) {
    
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        const { nombre } = datosCliente;

        nombreInput.value = nombre;
    }

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

})();