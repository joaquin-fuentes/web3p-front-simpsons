import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import {
  agregarProducto,
  obtenerProductos,
} from "../../services/products.service";
export default function CreateProductModal({ alCerrar, alGuardar }) {
  const [camposAdicionales, setCamposAdicionales] = useState({
    descripcion: "",
    urlimagen: "",
    stock: "",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
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
  const alEnviar = (datos) => {
    const productos = obtenerProductos();
    const duplicado = productos.some(
      (producto) =>
        producto.nombre.toLowerCase() === datos.nombre.trim().toLowerCase()
    );
    if (duplicado) {
      Swal.fire({
        title: "Producto ya existe",
        text: "Ya hay un producto con ese nombre registrado",
        icon: "warning",
      });
      return;
    }
    const nuevoProducto = {
      id: Date.now(),
      nombre: datos.nombre.trim(),
      precio: parseFloat(datos.precio) || 0,
      description: camposAdicionales.descripcion.trim(),
      stock: parseInt(camposAdicionales.stock) || 0,
      urlimagen: camposAdicionales.urlimagen.trim(),
      createdAt: new Date().toISOString(),
    };
    agregarProducto(nuevoProducto);
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
            <Form.Label>URL de la imagen</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={camposAdicionales.urlimagen}
              onChange={(evento) =>
                handleCampoChange("urlimagen", evento.target.value)
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
