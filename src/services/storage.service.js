// Importamos las funciones necesarias de Firebase
// initializeApp: inicializa la conexión con Firebase
// getStorage: obtiene el servicio de Storage
// ref: crea una referencia a un archivo en Storage
// uploadBytes: sube el archivo a Storage
// getDownloadURL: obtiene la URL pública del archivo subido
// deleteObject: elimina un archivo de Storage
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// Configuración de Firebase que obtuvimos de la consola
// VITE_ es el prefijo que usa Vite para variables de entorno accesibles en el frontend
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Clave de API para autenticar requests
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, // Dominio para autenticación
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, // ID único de tu proyecto
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // Bucket donde se guardan los archivos
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // Para notificaciones push
  appId: import.meta.env.VITE_FIREBASE_APP_ID, // ID único de tu app web
};

// Inicializamos Firebase con nuestra configuración
// Esto crea la conexión entre nuestro frontend y Firebase
const app = initializeApp(firebaseConfig);

// Obtenemos el servicio de Storage específico de nuestro proyecto
// Es como "conectarnos" al almacén de archivos de Firebase
const storage = getStorage(app);

// Función para subir una imagen y obtener su URL pública
export async function uploadImageAndGetURL(file, pathPrefix = "productos") {
  // Creamos un nombre único para evitar conflictos
  // Date.now() = timestamp actual (ej: 1703123456789)
  // file.name = nombre original del archivo (ej: "foto.jpg")
  // Resultado: "1703123456789-foto.jpg"
  console.log("FILE:", file);
  const uniqueName = `${Date.now()}-${file.name}`;

  // Creamos una referencia al archivo en Storage
  // ref(storage, "productos/1703123456789-foto.jpg")
  // Esto NO sube el archivo aún, solo crea la "dirección" donde estará
  const objectRef = ref(storage, `${pathPrefix}/${uniqueName}`);

  // Ahora SÍ subimos el archivo a Firebase Storage
  // uploadBytes toma la referencia y el archivo real
  // await = esperamos a que termine la subida antes de continuar
  await uploadBytes(objectRef, file);

  // Una vez subido, obtenemos la URL pública para acceder al archivo
  // Esta URL se puede usar en <img src="..." /> directamente
  // Ejemplo: "https://firebasestorage.googleapis.com/v0/b/mi-proyecto.appspot.com/o/productos%2F1703123456789-foto.jpg?alt=media&token=abc123"
  return await getDownloadURL(objectRef);
}

// Función para eliminar un archivo de Storage (opcional)
export async function deleteImageByUrl(downloadUrl) {
  // Convertimos la URL de descarga en una referencia de Storage
  // Firebase necesita la referencia para poder eliminar el archivo
  const objectRef = ref(storage, downloadUrl);

  // Eliminamos el archivo de Storage
  // Una vez eliminado, la URL ya no funcionará
  await deleteObject(objectRef);
}
