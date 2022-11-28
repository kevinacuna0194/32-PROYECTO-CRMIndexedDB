(function () {

    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        /** Actualizar registro */
        formulario.addEventListener('submit', actualizarCliente);

        /** Verificar el ID de la URL 
         * Primero va a leer la URL, query string; Así se le conoce y en caso de que haya uno, va a mandar llamar a esa función de obtener cliente.
        */
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');
        // console.log(idCliente);

        if (idCliente) {
            /** Esperar 1s a que se conecte a la BD y despues haga la consulta */
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    function actualizarCliente(e) {
        e.preventDefault();

        // Validar
        if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        /** Si se pasa esta validación tendríamos que actualizar el cliente */
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: nombreInput.value,
            id: Number(idCliente)
        };

        // console.log(clienteActualizado);
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        /** Esto lo que va a hacer es encontrar el ID y como nuestra BD le definimos keypath como el ID, entonces va a verlos que son iguales y va a actualizar con los nuevos datos. */
        objectStore.put(clienteActualizado);

        transaction.oncomplete = function () {
            imprimirAlerta('Editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = function () {
            imprimirAlerta('Hubo un error', 'error');
        }
    }

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
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
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