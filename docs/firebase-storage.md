## Integración de Firebase Storage en el proyecto (Simpsons + Backend Node)

### Objetivo
Subir imágenes desde el frontend (React + Vite) a Firebase Storage, obtener una URL pública y guardarla en el backend (MongoDB) dentro del campo `urlImagen` de cada producto. Luego mostrar esas imágenes en las vistas del frontend.

---

## 1) ¿Qué es Firebase?
Firebase es una plataforma de Google que provee servicios administrados para desarrollar aplicaciones web y móviles sin manejar servidores propios.

- Servicios relevantes:
  - Authentication: login con email/Google/etc.
  - Cloud Firestore: base de datos NoSQL.
  - Realtime Database: base de datos en tiempo real (generación anterior).
  - Cloud Storage: almacenamiento de archivos (imágenes, PDFs, videos).
  - Hosting: hosting estático.
  - Cloud Functions: funciones serverless.

- Servicio que usaremos: Cloud Storage, para almacenar imágenes y obtener URLs públicas.

---

## 2) Flujo de trabajo (alto nivel)
1. El usuario elige una imagen en el frontend.
2. El frontend sube la imagen a Firebase Storage.
3. Firebase devuelve una URL de descarga pública.
4. El frontend envía al backend los datos del producto con `urlImagen`.
5. El backend guarda `urlImagen` en MongoDB y la devuelve en los listados.

---

## 3) Requisitos previos
- Proyecto Firebase creado en `https://console.firebase.google.com`.
- Storage inicializado en Firebase Console (Build → Storage → Get Started).
- App web registrada en la sección de configuración del proyecto y credenciales copiadas.
- Frontend: proyecto React con Vite (ya presente en `simpsons`).
- Backend: modelo de producto con campo `urlImagen` (ya presente).

---

## 4) Instalación del SDK en el frontend

```bash
npm i firebase
```

---

## 5) Variables de entorno (Vite)
Crear `simpsons/.env` (o `.env.local`) con tus credenciales de Firebase:

```env
VITE_FIREBASE_API_KEY=TU_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=TU_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=TU_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=TU_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=TU_SENDER_ID
VITE_FIREBASE_APP_ID=TU_APP_ID
```

const firebaseConfig = {
  apiKey: "AIzaSyDlN4VJbGGML4mKzoW075FceRe3iI-ehuM",
  authDomain: "prueba222-27f2a.firebaseapp.com",
  projectId: "prueba222-27f2a",
  storageBucket: "prueba222-27f2a.firebasestorage.app",
  messagingSenderId: "502259281415",
  appId: "1:502259281415:web:24628d2abbc0d7350d84a2",
  measurementId: "G-PQJGBNCK8B"
};

Nota: Nunca subir `.env` al repositorio. Compartir un `.env.example` sin valores reales.

---

## 6) Servicio de Storage (frontend)
Crear `simpsons/src/services/storage.service.js`:

```javascript
// Importamos las funciones necesarias de Firebase
// initializeApp: inicializa la conexión con Firebase
// getStorage: obtiene el servicio de Storage
// ref: crea una referencia a un archivo en Storage
// uploadBytes: sube el archivo a Storage
// getDownloadURL: obtiene la URL pública del archivo subido
// deleteObject: elimina un archivo de Storage
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Configuración de Firebase que obtuvimos de la consola
// VITE_ es el prefijo que usa Vite para variables de entorno accesibles en el frontend
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,           // Clave de API para autenticar requests
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,   // Dominio para autenticación
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,     // ID único de tu proyecto
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // Bucket donde se guardan los archivos
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // Para notificaciones push
  appId: import.meta.env.VITE_FIREBASE_APP_ID,             // ID único de tu app web
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
```

---

## 7) Integración en creación de productos (frontend)
Archivo: `simpsons/src/components/admin/CreateProductosModal.jsx`

### 1) Agregar input para archivo y manejar estado:
```jsx
<Form.Group className="mb-3">
  <Form.Label>Imagen del producto</Form.Label>
  <Form.Control
    type="file"                    // Input para seleccionar archivos
    accept="image/*"               // Solo permite archivos de imagen (jpg, png, gif, etc.)
    onChange={(e) => handleCampoChange("file", e.target.files?.[0] ?? null)}
    // e.target.files es un array de archivos seleccionados
    // [0] = primer archivo (solo permitimos uno)
    // ?? null = si no hay archivo, guardamos null
  />
</Form.Group>
```

### 2) Subir a Storage antes de crear el producto:
```javascript
// Importamos nuestra función para subir imágenes
import { uploadImageAndGetURL } from "../../services/storage.service";

// dentro de la función alEnviar(datos)
async function alEnviar(datos) {
  try {
    // Inicializamos urlImagen vacía
    // Si el usuario pega una URL manual, la usamos
    let urlImagen = camposAdicionales.urlimagen?.trim() || "";

    // Si el usuario subió un archivo (no una URL manual)
    if (camposAdicionales.file) {
      const file = camposAdicionales.file;
      
      // VALIDACIONES DE SEGURIDAD:
      // Verificar que sea realmente una imagen
      if (!file.type.startsWith("image/")) {
        throw new Error("Archivo no es una imagen");
      }
      
      // Verificar tamaño máximo (2MB)
      const maxMB = 2;
      if (file.size > maxMB * 1024 * 1024) {
        throw new Error(`Imagen > ${maxMB}MB`);
      }

      // SUBIR A FIREBASE STORAGE:
      // uploadImageAndGetURL sube el archivo y devuelve la URL pública
      // "productos" es la carpeta donde se guardará en Storage
      urlImagen = await uploadImageAndGetURL(file, "productos");
    }

    // Crear el objeto producto con la URL de la imagen
    const nuevoProducto = {
      nombre: datos.nombre.trim(),
      precio: parseFloat(datos.precio) || 0,
      descripcion: camposAdicionales.descripcion.trim(),
      stock: parseInt(camposAdicionales.stock) || 0,
      urlImagen, // URL de Firebase Storage o URL manual
    };

    // Enviar al backend (que guardará en MongoDB)
    await crearProducto(nuevoProducto);
    
  } catch (error) {
    // Mostrar error al usuario
    console.error("Error:", error);
    Swal.fire("Error", error.message, "error");
  }
}
```

### ¿Qué pasa paso a paso?
1. **Usuario selecciona imagen** → Se guarda en `camposAdicionales.file`
2. **Usuario hace clic en "Crear"** → Se ejecuta `alEnviar()`
3. **Validamos el archivo** → Tipo y tamaño
4. **Subimos a Firebase** → `uploadImageAndGetURL()` devuelve URL
5. **Creamos objeto producto** → Con `urlImagen` de Firebase
6. **Enviamos al backend** → Backend guarda en MongoDB
7. **Backend devuelve producto** → Con `_id` y `urlImagen`

**Resultado**: El backend recibe un `urlImagen` que ya apunta a Firebase Storage.

---

## 8) Integración en edición de productos (frontend)
Archivo: `simpsons/src/components/admin/EditProductosModal.jsx`

### Estrategia de edición:
- **Si el usuario NO sube nueva imagen**: Mantener la `urlImagen` actual del producto
- **Si el usuario sube nueva imagen**: Subirla a Storage y actualizar `urlImagen`
- **(Opcional) Limpieza**: Eliminar la imagen anterior si fue subida a Storage

### Ejemplo detallado:
```javascript
// Importamos las funciones de Storage
import { uploadImageAndGetURL, deleteImageByUrl } from "../../services/storage.service";

// dentro de la función alEnviar(datos)
async function alEnviar(datos) {
  try {
    // Inicializamos con la URL actual del producto (si existe)
    // Esto mantiene la imagen actual si el usuario no sube una nueva
    let urlImagen = camposAdicionales.urlimagen?.trim() || producto?.urlImagen || "";
    
    // Si el usuario subió un archivo nuevo
    if (camposAdicionales.file) {
      // OPCIONAL: Eliminar imagen anterior si fue subida a Firebase
      // Solo si la URL actual es de Firebase Storage (contiene "firebasestorage")
      if (producto?.urlImagen && producto.urlImagen.includes("firebasestorage")) {
        try {
          await deleteImageByUrl(producto.urlImagen);
          console.log("Imagen anterior eliminada de Firebase");
        } catch (error) {
          console.warn("No se pudo eliminar imagen anterior:", error);
          // No fallar si no se puede eliminar
        }
      }
      
      // Subir nueva imagen a Firebase
      urlImagen = await uploadImageAndGetURL(camposAdicionales.file, "productos");
    }

    // Actualizar producto con nueva información
    await actualizarProducto(producto._id, {
      nombre: datos.nombre.trim(),
      precio: parseFloat(datos.precio) || 0,
      descripcion: camposAdicionales.descripcion.trim(),
      stock: parseInt(camposAdicionales.stock) || 0,
      urlImagen, // Nueva URL o URL actual
    });
    
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    Swal.fire("Error", "No se pudo actualizar el producto", "error");
  }
}
```

### ¿Cuándo eliminar la imagen anterior?
- **SÍ eliminar**: Si la URL actual es de Firebase Storage (`firebasestorage.googleapis.com`)
- **NO eliminar**: Si es una URL externa (ej: `https://ejemplo.com/imagen.jpg`)
- **¿Por qué?**: Evitamos eliminar imágenes que no son nuestras

---

## 9) Reglas de seguridad en Firebase Storage
**¿Qué son las reglas?** Son como "guardias" que deciden quién puede leer/escribir archivos en Storage.

**Configuración**: Firebase Console → Storage → Rules

### Opción 1: Para demos/desarrollo (NO recomendado para producción)
```text
service firebase.storage {
  match /b/{bucket}/o {                    // Para todos los archivos en el bucket
    match /{allPaths=**} {                 // En cualquier carpeta
      allow read, write: if true;          // Cualquiera puede leer y escribir
    }
  }
}
```
**⚠️ Problema**: Cualquiera puede subir/eliminar archivos sin autenticación.

### Opción 2: Recomendado (con autenticación)
```text
service firebase.storage {
  match /b/{bucket}/o {                    // Para todos los archivos en el bucket
    match /{allPaths=**} {                 // En cualquier carpeta
      allow read: if true;                 // Cualquiera puede LEER (ver imágenes)
      allow write: if request.auth != null; // Solo usuarios AUTENTICADOS pueden escribir
    }
  }
}
```
**✅ Ventajas**: 
- Las imágenes son públicas (se pueden ver en `<img>`)
- Solo usuarios logueados pueden subir/eliminar

### Opción 3: Más específica (avanzado)
```text
service firebase.storage {
  match /b/{bucket}/o {
    match /productos/{imageId} {           // Solo archivos en carpeta "productos"
      allow read: if true;                 // Público puede leer
      allow write: if request.auth != null; // Solo autenticados pueden escribir
    }
    match /{allPaths=**} {                 // Otras carpetas
      allow read, write: if false;         // Denegar todo lo demás
    }
  }
}
```

### ¿Cómo cambiar las reglas?
1. Ve a Firebase Console → Storage → Rules
2. Edita el código en el editor
3. Haz clic en "Publicar"
4. Las reglas se aplican inmediatamente

---

## 10) Backend (Node + MongoDB)
**¿El backend necesita Firebase?** NO para este caso.

### ¿Por qué no?
- El backend solo **recibe** la `urlImagen` del frontend
- **Guarda** esa URL en MongoDB (ya lo hace)
- **Devuelve** esa URL en las consultas (ya lo hace)
- No necesita subir/eliminar archivos directamente

### ¿Qué hace el backend?
```javascript
// Modelo de producto (ya existe)
const ProductoSchema = new Schema({
  nombre: String,
  precio: Number,
  descripcion: String,
  stock: Number,
  urlImagen: String,  // ← Aquí guardamos la URL de Firebase
  // ... otros campos
});

// Al crear producto (ya funciona)
app.post('/productos', (req, res) => {
  const { nombre, precio, descripcion, stock, urlImagen } = req.body;
  // urlImagen ya viene con la URL de Firebase desde el frontend
  const producto = new ProductosModel({ nombre, precio, descripcion, stock, urlImagen });
  // Se guarda en MongoDB con la URL
});
```

### ¿Cuándo SÍ necesitarías Firebase en el backend?
- **Eliminar imágenes** cuando se borra un producto
- **Validar archivos** antes de guardar
- **Procesar imágenes** (redimensionar, comprimir)

### Opciones para eliminar imágenes:
1. **Desde el frontend** (recomendado para este proyecto):
   ```javascript
   // En el botón "Eliminar producto"
   await deleteImageByUrl(producto.urlImagen); // Eliminar de Firebase
   await eliminarProducto(producto._id);       // Eliminar de MongoDB
   ```

2. **Cloud Functions** (avanzado): Reaccionar a cambios en MongoDB
3. **Firebase Admin SDK** (avanzado): Integrar en el backend

---

## 10.1) Implementación completa del CRUD con imágenes

### **CREATE (Crear producto con imagen)**
✅ **Ya explicado en sección 7** - `CreateProductosModal.jsx`

### **READ (Mostrar productos con imágenes)**
**Archivo**: `simpsons/src/components/admin/FilaTabla.jsx`

```jsx
// Mostrar imagen en la tabla (ya funciona)
{producto.urlImagen && (
  <img
    src={producto.urlImagen}           // URL de Firebase Storage
    alt={producto.nombre}
    className="imagen-producto"
    style={{ width: "50px", height: "50px", objectFit: "cover" }}
    onError={(e) => {
      // Si la imagen no carga, mostrar placeholder
      e.target.style.display = "none";
    }}
  />
)}
```

**Mejora opcional - Preview en modal**:
```jsx
// En TablaProductos.jsx, agregar modal para ver imagen completa
<Modal show={previewImage} onHide={() => setPreviewImage(null)}>
  <Modal.Header closeButton>
    <Modal.Title>Imagen del producto</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <img 
      src={previewImage} 
      alt="Preview" 
      style={{ width: "100%", height: "auto" }}
    />
  </Modal.Body>
</Modal>
```

### **UPDATE (Editar producto y cambiar imagen)**
✅ **Ya explicado en sección 8** - `EditProductosModal.jsx`

**Funcionalidades adicionales**:
```jsx
// Botón para eliminar solo la imagen (sin eliminar el producto)
const handleRemoveImage = async () => {
  if (producto.urlImagen && producto.urlImagen.includes("firebasestorage")) {
    try {
      await deleteImageByUrl(producto.urlImagen);
      await actualizarProducto(producto._id, { urlImagen: "" });
      Swal.fire("Imagen eliminada", "", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la imagen", "error");
    }
  }
};

// En el modal de edición
<Button variant="outline-danger" onClick={handleRemoveImage}>
  Eliminar imagen
</Button>
```

### **DELETE (Eliminar producto y su imagen)**
**Archivo**: `simpsons/src/components/admin/TablaProductos.jsx`

```javascript
// Modificar la función manejarEliminar
const manejarEliminar = async (id) => {
  const resultado = await Swal.fire({
    title: "¿Eliminar producto?",
    text: "Esta acción eliminará el producto y su imagen",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
  
  if (resultado.isConfirmed) {
    try {
      // Buscar el producto para obtener su urlImagen
      const producto = productos.find(p => p._id === id);
      
      // Eliminar imagen de Firebase (si existe)
      if (producto?.urlImagen && producto.urlImagen.includes("firebasestorage")) {
        try {
          await deleteImageByUrl(producto.urlImagen);
          console.log("Imagen eliminada de Firebase");
        } catch (error) {
          console.warn("No se pudo eliminar imagen:", error);
          // Continuar aunque falle la eliminación de imagen
        }
      }
      
      // Eliminar producto de MongoDB
      await eliminarProducto(id);
      
      // Actualizar lista
      cargarProductos();
      
      Swal.fire({
        title: "Producto eliminado",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
      
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el producto",
        icon: "error",
      });
    }
  }
};
```

### **Funcionalidades adicionales del CRUD**

#### **1. Preview de imagen antes de subir**
```jsx
// En CreateProductosModal.jsx
const [previewUrl, setPreviewUrl] = useState(null);

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    // Crear preview local
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    handleCampoChange("file", file);
  }
};

// En el JSX
{camposAdicionales.file && (
  <div className="mt-2">
    <img 
      src={previewUrl} 
      alt="Preview" 
      style={{ maxWidth: "200px", maxHeight: "200px" }}
    />
  </div>
)}
```

#### **2. Estado de carga durante subida**
```jsx
const [isUploading, setIsUploading] = useState(false);

// En alEnviar
if (camposAdicionales.file) {
  setIsUploading(true);
  try {
    urlImagen = await uploadImageAndGetURL(file, "productos");
  } finally {
    setIsUploading(false);
  }
}

// En el botón
<Button type="submit" disabled={isUploading}>
  {isUploading ? "Subiendo imagen..." : "Crear Producto"}
</Button>
```

#### **3. Validación de URL de imagen existente**
```jsx
// En EditProductosModal.jsx
const [imageError, setImageError] = useState(false);

// Verificar si la imagen actual carga correctamente
useEffect(() => {
  if (producto?.urlImagen) {
    const img = new Image();
    img.onload = () => setImageError(false);
    img.onerror = () => setImageError(true);
    img.src = producto.urlImagen;
  }
}, [producto?.urlImagen]);

// En el JSX
{producto?.urlImagen && !imageError ? (
  <img src={producto.urlImagen} alt="Imagen actual" />
) : (
  <div className="text-muted">Sin imagen</div>
)}
```

---

## 11) UX y buenas prácticas

### Validaciones esenciales:
```javascript
// Tipo de archivo
if (!file.type.startsWith("image/")) {
  throw new Error("Solo se permiten imágenes");
}

// Tamaño máximo (2MB)
const maxMB = 2;
if (file.size > maxMB * 1024 * 1024) {
  throw new Error(`Imagen muy grande (máximo ${maxMB}MB)`);
}

// Formatos permitidos
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
if (!allowedTypes.includes(file.type)) {
  throw new Error("Solo JPG, PNG y WebP");
}
```

### Mejoras de UX:
- **Preview de imagen**: Mostrar antes de subir
- **Estado de carga**: "Subiendo imagen..." con spinner
- **Progreso**: Barra de progreso durante la subida
- **Reemplazar imagen**: Botón para cambiar imagen existente
- **Eliminar imagen**: Botón para quitar imagen sin reemplazar

### Nombres de archivos:
```javascript
// Evitar colisiones con timestamp
const uniqueName = `${Date.now()}-${file.name}`;

// O con UUID (más profesional)
import { v4 as uuidv4 } from 'uuid';
const uniqueName = `${uuidv4()}-${file.name}`;
```

### Compresión (avanzado):
```bash
npm i browser-image-compression
```
```javascript
import imageCompression from 'browser-image-compression';

const compressedFile = await imageCompression(file, {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
});
```

---

## 12) Guion para clase (demo en vivo)

### 1) Introducción (5 min)
- ¿Qué es Firebase? Plataforma de Google
- Servicios: Auth, Firestore, Storage, Hosting, Functions
- **Storage**: Almacenamiento de archivos en la nube
- **Ventajas**: URLs públicas, escalable, CDN global

### 2) Configuración (10 min)
- Crear proyecto en Firebase Console
- Habilitar Storage (elegir ubicación)
- Registrar app web (copiar credenciales)
- Mostrar `.env` con variables VITE_

### 3) Código (15 min)
- `npm i firebase`
- Crear `storage.service.js` con comentarios
- Explicar `uploadBytes` y `getDownloadURL`
- Mostrar la URL resultante

### 4) Integración (10 min)
- Modificar `CreateProductosModal`
- Agregar input file
- Subir imagen antes de crear producto
- Mostrar en la tabla

### 5) Seguridad (5 min)
- Explicar reglas de Storage
- Mostrar diferencias entre opciones
- **Demo**: Intentar subir sin autenticación

### 6) Q&A (5 min)
- Costos y límites gratuitos
- Alternativas (Cloudinary, ImgBB)
- Mejores prácticas

---

## 13) Checklist de implementación

### Configuración inicial:
- [ ] Proyecto Firebase creado
- [ ] Storage habilitado y ubicación elegida
- [ ] App web registrada
- [ ] Credenciales copiadas a `.env`
- [ ] `npm i firebase` ejecutado

### Código frontend:
- [ ] `storage.service.js` creado y funcionando
- [ ] `CreateProductosModal` con input file
- [ ] Validaciones de tipo y tamaño
- [ ] Subida a Firebase antes de crear producto
- [ ] `EditProductosModal` (opcional) para reemplazar imagen

### Seguridad:
- [ ] Reglas de Storage configuradas
- [ ] Probadas con/sin autenticación
- [ ] Alertas de uso configuradas

### Testing:
- [ ] Crear producto con imagen
- [ ] Ver imagen en la tabla
- [ ] Editar producto (cambiar imagen)
- [ ] Eliminar producto (opcional: eliminar imagen)

---

## 13.1) Resumen del CRUD completo con Firebase Storage

### **¿Qué puedes hacer con esta implementación?**

#### **✅ CREATE (Crear)**
- Subir imagen desde el dispositivo
- Pegar URL manual de imagen
- Validar tipo y tamaño de archivo
- Preview antes de subir
- Guardar producto con `urlImagen` en MongoDB

#### **✅ READ (Leer/Mostrar)**
- Listar productos con sus imágenes
- Mostrar imágenes en tabla (thumbnails)
- Preview de imagen completa en modal
- Manejo de errores si imagen no carga

#### **✅ UPDATE (Actualizar)**
- Cambiar imagen del producto
- Mantener imagen actual si no se sube nueva
- Eliminar solo la imagen (sin eliminar producto)
- Limpiar imagen anterior de Firebase

#### **✅ DELETE (Eliminar)**
- Eliminar producto completo
- Eliminar imagen de Firebase automáticamente
- Confirmación antes de eliminar
- Manejo de errores si falla eliminación

### **Flujo completo de datos:**
```
1. Usuario selecciona imagen → Frontend
2. Frontend sube a Firebase Storage → Firebase
3. Firebase devuelve URL pública → Frontend
4. Frontend envía datos + URL → Backend
5. Backend guarda en MongoDB → MongoDB
6. Backend devuelve producto → Frontend
7. Frontend muestra imagen → Usuario
```

### **Archivos modificados:**
- `storage.service.js` - Servicio de Firebase Storage
- `CreateProductosModal.jsx` - Crear con imagen
- `EditProductosModal.jsx` - Editar con imagen
- `TablaProductos.jsx` - Listar y eliminar
- `FilaTabla.jsx` - Mostrar imagen en tabla

---

## 14) Referencias y recursos

### Documentación oficial:
- [Firebase Storage](https://firebase.google.com/docs/storage)
- [SDK Web](https://firebase.google.com/docs/web/setup)
- [Reglas de Storage](https://firebase.google.com/docs/storage/security)

### Herramientas útiles:
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite): Testing local
- [Firebase CLI](https://firebase.google.com/docs/cli): Comandos desde terminal
- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression): Comprimir imágenes

### Alternativas a Firebase Storage:
- **Cloudinary**: Más funciones de transformación
- **AWS S3**: Más control, más complejo
- **ImgBB**: Simple, solo para imágenes
- **Base64**: Guardar en base de datos (no recomendado)


