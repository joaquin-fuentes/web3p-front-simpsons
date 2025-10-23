# 🖼️ Almacenamiento Local de Imágenes - Alternativa a Firebase Storage

## 📋 **Descripción**
Implementar un sistema de almacenamiento de imágenes local en el servidor Node.js, como alternativa gratuita a Firebase Storage. Las imágenes se guardarán en una carpeta del servidor y se servirán a través de endpoints HTTP.

---

## 🤔 **¿Por qué almacenamiento local?**

### **Ventajas:**
- ✅ **Completamente gratuito** - Sin límites de uso
- ✅ **Control total** - Tú manejas los archivos
- ✅ **Sin dependencias externas** - No requiere servicios de terceros
- ✅ **Privacidad** - Las imágenes no salen de tu servidor
- ✅ **Sin configuración compleja** - Solo crear carpetas

### **Desventajas:**
- ❌ **No escalable** - Si tienes muchos usuarios, el servidor se llena
- ❌ **Sin CDN** - Carga más lenta para usuarios lejanos
- ❌ **Backup manual** - Tú debes hacer backups
- ❌ **Sin optimización automática** - No hay compresión automática

### **Cuándo usar:**
- ✅ Proyectos pequeños/medianos
- ✅ Prototipos y demos
- ✅ Cuando no quieres depender de servicios externos
- ✅ Aplicaciones internas

---

## 🔄 **Flujo Técnico**

### **1. Frontend → Backend**
```
Usuario selecciona imagen
↓
Frontend envía imagen como FormData
↓
Backend recibe imagen en endpoint /upload
↓
Backend guarda archivo en carpeta /public/images
↓
Backend devuelve nombre del archivo
↓
Frontend guarda nombre en MongoDB
```

### **2. Mostrar imagen**
```
Frontend hace petición a /images/nombre-archivo.jpg
↓
Backend sirve archivo estático
↓
Imagen se muestra en <img src="/images/nombre-archivo.jpg">
```

---

## 🛠️ **Implementación Paso a Paso**

### **Paso 1: Instalar dependencias en el backend**
```bash
cd Modulo-3
npm install multer
```
**¿Qué es multer?** Middleware para manejar archivos multipart/form-data (imágenes, videos, etc.)

### **Paso 2: Crear estructura de carpetas**
```bash
# En la carpeta Modulo-3
mkdir public
mkdir public/images
mkdir public/images/products
```

### **Paso 3: Configurar multer en el backend**
Crear `Modulo-3/src/middlewares/upload.middleware.js`:

```javascript
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento
const storage = multer.diskStorage({
  // Dónde guardar los archivos
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/images/products'));
  },
  // Cómo nombrar los archivos
  filename: function (req, file, cb) {
    // Crear nombre único: timestamp + nombre original
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
  // Solo permitir imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // Límite de 2MB
  }
});

export default upload;
```

### **Paso 4: Crear endpoint para subir imágenes**
Crear `Modulo-3/src/routes/upload.routes.js`:

```javascript
import { Router } from 'express';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

// Endpoint para subir imagen
router.post('/image', upload.single('image'), (req, res) => {
  try {
    // Verificar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se subió ningún archivo'
      });
    }

    // Devolver información del archivo
    res.status(200).json({
      success: true,
      message: 'Imagen subida correctamente',
      filename: req.file.filename, // Nombre del archivo guardado
      originalName: req.file.originalname,
      size: req.file.size,
      path: `/images/products/${req.file.filename}` // Ruta para acceder a la imagen
    });

  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir imagen',
      error: error.message
    });
  }
});

// Endpoint para eliminar imagen
router.delete('/image/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const fs = await import('fs');
    const path = await import('path');
    
    // Ruta del archivo
    const filePath = path.join(process.cwd(), 'public', 'images', 'products', filename);
    
    // Verificar si el archivo existe
    if (fs.existsSync(filePath)) {
      // Eliminar archivo
      fs.unlinkSync(filePath);
      res.status(200).json({
        success: true,
        message: 'Imagen eliminada correctamente'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Archivo no encontrado'
      });
    }

  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar imagen',
      error: error.message
    });
  }
});

export default router;
```

### **Paso 5: Servir archivos estáticos**
Modificar `Modulo-3/index.js`:

```javascript
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from 'path';
import { fileURLToPath } from 'url';
import routes from "./src/routes/index.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js"; // Nueva ruta
import { connectDB } from "./src/db/config.db.js";

const app = express();
const PORT = 3000;

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

// Middleware para json
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Servir archivos estáticos (IMPORTANTE: antes de las rutas de API)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Middleware para usar todas las rutas
app.use("/api", routes);
app.use("/api/upload", uploadRoutes); // Nueva ruta para uploads

app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto 3000");
  console.log("Imágenes disponibles en: http://localhost:3000/images/");
});
```

### **Paso 6: Actualizar modelo de producto**
Modificar `Modulo-3/src/models/productos.model.js`:

```javascript
import { Schema, model } from "mongoose";

const ProductoSchema = new Schema(
  {
    nombre: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
    },
    // Cambiar de urlImagen a imagePath para almacenamiento local
    imagePath: {
      type: String, // Ejemplo: "/images/products/1703123456789-foto.jpg"
    },
  },
  { timestamps: true }
);

export const ProductosModel = model("productos", ProductoSchema);
```

### **Paso 7: Actualizar controlador de productos**
Modificar `Modulo-3/src/controllers/productos.controller.js`:

```javascript
import {
  actualizarProductoService,
  crearProductoService,
  eliminarProductoService,
  obtenerProductoPorIdService,
  obtenerProductoService,
  validacionCampos,
} from "../services/productos.service.js";

export const obtenerProductosController = async (req, res) => {
  const productos = await obtenerProductoService();
  res.status(200).json({ productos });
};

export const obtenerProductoPorIdController = async (req, res) => {
  const id = req.params.id;
  const producto = await obtenerProductoPorIdService(id);
  if (!producto)
    return res.status(404).json({ msg: "producto no encontrado" });
  res.status(200).json({ producto });
};

export const crearProductoController = async (req, res) => {
  const { nombre, precio, descripcion, stock, imagePath } = req.body;
  
  const nuevoProducto = {
    nombre,
    precio,
    descripcion,
    stock,
    imagePath // Ruta de la imagen subida
  };

  const { msg, statusCode } = await crearProductoService(nuevoProducto);
  
  if (statusCode === 201) {
    res.status(statusCode).json({ nuevoProducto, msg });
  } else {
    res.status(statusCode).json({ msg });
  }
};

export const actualizarProductoController = async (req, res) => {
  const id = req.params.id;
  const { nombre, precio, descripcion, stock, imagePath } = req.body;

  const camposValidos = validacionCampos(nombre, precio, descripcion);
  if (camposValidos) {
    return res.status(400).json({
      msg: "Completar los campos",
    });
  }

  const { productoActualizado, msg, statusCode } =
    await actualizarProductoService(id, { nombre, precio, descripcion, stock, imagePath });

  if (statusCode === 200) {
    res.status(200).json({ productoActualizado, msg });
  } else {
    res.status(statusCode || 400).json({ msg });
  }
};

export const eliminarProductoController = async (req, res) => {
  const id = req.params.id;
  
  // Obtener producto para eliminar imagen
  const producto = await obtenerProductoPorIdService(id);
  
  if (producto && producto.imagePath) {
    // Eliminar imagen del servidor
    try {
      const fs = await import('fs');
      const path = await import('path');
      const imagePath = path.join(process.cwd(), 'public', producto.imagePath);
      
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Imagen eliminada:', imagePath);
      }
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
    }
  }
  
  const productoEliminado = await eliminarProductoService(id);
  res.status(200).json({ productoEliminado });
};
```

---

## 🎨 **Implementación en el Frontend**

### **Paso 8: Crear servicio para subir imágenes**
Crear `simpsons/src/services/upload.service.js`:

```javascript
import clientAxios from "../api/clientAxios.js";

// Subir imagen al servidor
export const uploadImage = async (file) => {
  try {
    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append('image', file);

    const response = await clientAxios.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};

// Eliminar imagen del servidor
export const deleteImage = async (filename) => {
  try {
    const response = await clientAxios.delete(`/upload/image/${filename}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
};
```

### **Paso 9: Actualizar CreateProductosModal**
Modificar `simpsons/src/components/admin/CreateProductosModal.jsx`:

```jsx
import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { crearProducto } from "../../services/productos.service";
import { uploadImage } from "../../services/upload.service"; // Nuevo servicio

export default function CreateProductModal({ alCerrar, alGuardar }) {
  const [camposAdicionales, setCamposAdicionales] = useState({
    descripcion: "",
    stock: "",
    file: null, // Archivo seleccionado
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombre: "",
      precio: "",
    },
  });

  const handleCampoChange = (campo, valor) => {
    setCamposAdicionales((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const alEnviar = async (datos) => {
    try {
      let imagePath = "";

      // Si hay archivo seleccionado, subirlo
      if (camposAdicionales.file) {
        const file = camposAdicionales.file;
        
        // Validaciones
        if (!file.type.startsWith("image/")) {
          throw new Error("Solo se permiten archivos de imagen");
        }
        
        const maxMB = 2;
        if (file.size > maxMB * 1024 * 1024) {
          throw new Error(`Imagen muy grande (máximo ${maxMB}MB)`);
        }

        // Subir imagen
        const uploadResult = await uploadImage(file);
        imagePath = uploadResult.path; // Ejemplo: "/images/products/1703123456789-foto.jpg"
      }

      // Crear producto
      const nuevoProducto = {
        nombre: datos.nombre.trim(),
        precio: parseFloat(datos.precio) || 0,
        descripcion: camposAdicionales.descripcion.trim(),
        stock: parseInt(camposAdicionales.stock) || 0,
        imagePath, // Ruta de la imagen
      };

      await crearProducto(nuevoProducto);

      // Limpiar formulario
      reset();
      setCamposAdicionales({
        descripcion: "",
        stock: "",
        file: null,
      });

      Swal.fire({
        title: "Producto creado",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      alGuardar?.();
    } catch (error) {
      console.error("Error al crear producto:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo crear el producto",
        icon: "error",
      });
    }
  };

  return (
    <Modal show onHide={alCerrar} backdrop="static" centered size="lg">
      <Form onSubmit={handleSubmit(alEnviar)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Campos existentes */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre del producto *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del producto"
              isInvalid={!!errors.nombre}
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio *</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              placeholder="0.00"
              isInvalid={!!errors.precio}
              {...register("precio", {
                required: "El precio es obligatorio",
                min: { value: 0, message: "El precio no puede ser negativo" },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.precio?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción *</Form.Label>
            <Form.Control
              as="textarea"
              maxLength={114}
              rows={3}
              placeholder="Descripción del producto"
              value={camposAdicionales.descripcion}
              onChange={(e) => handleCampoChange("descripcion", e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="0"
              value={camposAdicionales.stock}
              onChange={(e) => {
                const valor = parseInt(e.target.value);
                if (!isNaN(valor) && valor >= 0) {
                  handleCampoChange("stock", valor);
                } else if (valor < 0) {
                  handleCampoChange("stock", 0);
                }
              }}
            />
          </Form.Group>

          {/* NUEVO: Input para imagen */}
          <Form.Group className="mb-3">
            <Form.Label>Imagen del producto</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => handleCampoChange("file", e.target.files?.[0] ?? null)}
            />
            {camposAdicionales.file && (
              <div className="mt-2">
                <small className="text-muted">
                  Archivo seleccionado: {camposAdicionales.file.name}
                </small>
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={alCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? "Creando..." : "Crear Producto"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
```

### **Paso 10: Actualizar FilaTabla para mostrar imágenes**
Modificar `simpsons/src/components/admin/FilaTabla.jsx`:

```jsx
// En la sección donde se muestra la imagen
{producto.imagePath && (
  <img
    src={`http://localhost:3000${producto.imagePath}`} // URL completa del servidor
    alt={producto.nombre}
    className="imagen-producto"
    style={{ width: "50px", height: "50px", objectFit: "cover" }}
    onError={(e) => {
      // Si la imagen no carga, ocultar
      e.target.style.display = "none";
    }}
  />
)}
```

---

## 🧪 **Testing y Validación**

### **Endpoints para probar:**
1. **Subir imagen**: `POST http://localhost:3000/api/upload/image`
2. **Ver imagen**: `GET http://localhost:3000/images/products/nombre-archivo.jpg`
3. **Eliminar imagen**: `DELETE http://localhost:3000/api/upload/image/nombre-archivo.jpg`

### **Validaciones implementadas:**
- ✅ Solo archivos de imagen (JPEG, PNG, GIF, etc.)
- ✅ Tamaño máximo de 2MB
- ✅ Nombres únicos para evitar conflictos
- ✅ Eliminación automática al borrar producto

---

## 📁 **Estructura final de archivos**

```
Modulo-3/
├── public/
│   └── images/
│       └── products/
│           ├── 1703123456789-foto1.jpg
│           ├── 1703123456790-foto2.png
│           └── ...
├── src/
│   ├── middlewares/
│   │   └── upload.middleware.js
│   ├── routes/
│   │   └── upload.routes.js
│   └── controllers/
│       └── productos.controller.js (modificado)
└── index.js (modificado)

simpsons/
├── src/
│   ├── services/
│   │   └── upload.service.js
│   └── components/
│       └── admin/
│           ├── CreateProductosModal.jsx (modificado)
│           └── FilaTabla.jsx (modificado)
```

---

## ⚠️ **Consideraciones importantes**

### **Seguridad:**
- Validar tipos de archivo en el backend
- Limitar tamaño de archivos
- Sanitizar nombres de archivos
- Considerar autenticación para subir archivos

### **Rendimiento:**
- Para muchos archivos, considerar compresión
- Implementar cache de imágenes
- Considerar CDN para producción

### **Backup:**
- Hacer backup regular de la carpeta `public/images`
- Considerar sincronización con servicios de nube

---

## 🔄 **Comparación: Firebase vs Local**

| Característica | Firebase Storage | Almacenamiento Local |
|----------------|------------------|---------------------|
| **Costo** | Gratuito hasta límites | Completamente gratuito |
| **Escalabilidad** | Automática | Manual |
| **CDN** | Sí | No |
| **Backup** | Automático | Manual |
| **Configuración** | Media | Simple |
| **Control** | Limitado | Total |
| **Dependencias** | Externas | Ninguna |

---

## 🎯 **Cuándo usar cada opción**

### **Usar Firebase Storage cuando:**
- Proyecto va a crecer mucho
- Necesitas CDN global
- Quieres backup automático
- Tienes presupuesto para servicios

### **Usar almacenamiento local cuando:**
- Proyecto pequeño/mediano
- Quieres control total
- No quieres dependencias externas
- Es un prototipo o demo

---

## 📚 **Recursos adicionales**

- [Documentación de Multer](https://github.com/expressjs/multer)
- [Express Static Files](https://expressjs.com/en/starter/static-files.html)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

¡Ahora tienes las dos opciones implementadas! Puedes elegir la que mejor se adapte a tus necesidades.
