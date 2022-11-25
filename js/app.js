/** Esta función nos permitía que las variables y las funciones que declaramos en este archivo se queden de forma local, no se pasanesa las variable hacia los demás archivos. */
(function () {
  let DB;

  document.addEventListener("DOMContentLoaded", () => {
    crearDB();
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
})();
