/** Esta función nos permitía que las variables y las funciones que declaramos en este archivo se queden de forma local, no se pasanesa las variable hacia los demás archivos. */
(function () {
  let DB;

  document.addEventListener("DOMContentLoaded", () => {
    crearDB();

    /** Esta función solamente se va a ejecutar en caso de que exista la base de datos de CRM. */
    if (window.indexedDB.open('crm', 1)) {
      obtenerClientes();
    }
  });

  /** Crea la BD de IndexedDB */
  function crearDB() {
    const crearDB = window.indexedDB.open("crm", 1);

    /** En caso de que alguien trate de crear una base de datos en un navegador que no soporta IndexedDB va a marcar un error. */
    crearDB.onerror = function () {
      console.log("Hubo un error");
    };

    crearDB.onsuccess = function () {
      DB = crearDB.result;
    };

    /** Esta función corre una sola vez. Es decir, cuando se crea nuestra base de datos va a registrar todas las columnas. Toma un evento*/
    crearDB.onupgradeneeded = function (e) {
      const db = e.target.result;

      const ObjectStore = db.createObjectStore("crm", {
        keyPath: "id",
        autoIncrement: true,
      });

      ObjectStore.createIndex("nombre", "nombre", { unique: false });
      ObjectStore.createIndex("email", "email", { unique: true });
      ObjectStore.createIndex("telefono", "telefono", { unique: false });
      ObjectStore.createIndex("empresa", "empresa", { unique: false });
      ObjectStore.createIndex("id", "id", { unique: true });

      console.log("DB Lista y Creada");
    };
  }

  function obtenerClientes() {

    let abrirConexion = window.indexedDB.open('crm', 1);

    // si hay un error, lanzarlo
    abrirConexion.onerror = function () {
      console.log('Hubo un error');
    };

    // si todo esta bien, asignar a database el resultado
    abrirConexion.onsuccess = function () {
      // guardamos el resultado
      DB = abrirConexion.result;

      const objectStore = DB.transaction('crm').objectStore('crm');


      // retorna un objeto request o petición, 
      objectStore.openCursor().onsuccess = function (e) {
        // cursor se va a ubicar en el registro indicado para accede a los datos
        const cursor = e.target.result;

        if (cursor) {
          const { nombre, empresa, email, telefono, id } = cursor.value;

          const listadoClientes = document.querySelector('#listado-clientes');
          listadoClientes.innerHTML += `

              <tr>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                      <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                      <p class="text-gray-700">${telefono}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                      <p class="text-gray-600">${empresa}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                      <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5 uppercase">Editar</a>
                      <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 uppercase">Eliminar</a>
                  </td>
              </tr>
          `;

          cursor.continue();
        } else {
          //  console.log('llegamos al final...');
        }
      };
    }
  }
})();
