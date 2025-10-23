import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { crearProducto } from "../../services/productos.service";
import { uploadImageAndGetURL } from "../../services/storage.service.js";
export default function CreateProductModal({ alCerrar, alGuardar }) {
  // const [previewUrl, setPreviewUrl] = useState(null);
  const [camposAdicionales, setCamposAdicionales] = useState({
    descripcion: "",
    urlimagen: "",
    stock: "",
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
      // si la imagen es grande muestro un alerta con el error
      let urlImagenFirebase = await uploadImageAndGetURL(
        camposAdicionales.file
      );
      console.log(camposAdicionales.file);
      const nuevoProducto = {
        nombre: datos.nombre.trim(),
        precio: parseFloat(datos.precio) || 0,
        descripcion: camposAdicionales.descripcion.trim(),
        stock: parseInt(camposAdicionales.stock) || 0,
        urlImagen: urlImagenFirebase,
      };

      await crearProducto(nuevoProducto);

      reset();
      setCamposAdicionales({
        descripcion: "",
        urlimagen: "",
        stock: "",
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
        text: "No se pudo crear el producto",
        icon: "error",
      });
    }
  };
  return (
    <Modal
      show
      onHide={alCerrar}
      backdrop="static"
      centered
      size="lg"
      dialogClassName="modal-dark"
    >
      <Form onSubmit={handleSubmit(alEnviar)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del producto *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del producto"
              isInvalid={!!errors.nombre}
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
                maxLength: {
                  value: 35,
                  message:
                    "Llegó a la cantidad máxima de caracteres permitidos",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre?.message}
            </Form.Control.Feedback>
          </Form.Group>
          {/* Campo: Precio */}
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
              isInvalid={!!errors.descripcion}
              value={camposAdicionales.descripcion}
              onChange={(evento) =>
                handleCampoChange("descripcion", evento.target.value)
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="0"
              value={camposAdicionales.stock}
              onChange={(evento) => {
                const valor = parseInt(evento.target.value);

                if (!isNaN(valor) && valor >= 0) {
                  handleCampoChange("stock", valor);
                } else if (valor < 0) {
                  handleCampoChange("stock", 0);
                }
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imagen de producto</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(evento) =>
                handleCampoChange("file", evento.target.files?.[0] ?? null)
              }
            />
            {camposAdicionales.urlimagen && (
              <div className="mt-2">
                <img
                  src={camposAdicionales.urlimagen}
                  alt="Vista previa del producto"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                  onError={(evento) => {
                    evento.target.style.display = "none";
                  }}
                />
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
