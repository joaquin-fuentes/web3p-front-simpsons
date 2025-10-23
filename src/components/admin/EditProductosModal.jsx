59;
import { Modal, Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { actualizarProducto } from "../../services/productos.service";
export default function EditProductModal({ producto, alCerrar, alGuardar }) {
  const [camposAdicionales, setCamposAdicionales] = useState({
    descripcion: producto?.descripcion || "",
    urlimagen: producto?.urlImagen || "",
    stock: producto?.stock || "",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombre: producto?.nombre ?? "",
      precio: producto?.precio ?? "",
    },
  });
  useEffect(() => {
    reset({
      nombre: producto?.nombre ?? "",
      precio: producto?.precio ?? "",
    });
    setCamposAdicionales({
      descripcion: producto?.descripcion || "",
      urlimagen: producto?.urlImagen || "",
      stock: producto?.stock || "",
    });
  }, [producto, reset]);
  const alEnviar = async (datos) => {
    try {
      await actualizarProducto(producto._id, {
        nombre: datos.nombre.trim(),
        precio: parseFloat(datos.precio) || 0,
        descripcion: camposAdicionales.descripcion.trim(),
        stock: parseInt(camposAdicionales.stock) || 0,
        urlImagen: camposAdicionales.urlimagen.trim(),
      });
      Swal.fire({
        title: "Producto actualizado",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
      alGuardar?.();
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      Swal.fire({
        title: "Error al actualizar",
        text: "No se pudo actualizar el producto",
        icon: "error",
      });
    }
  };
  const handleCampoChange = (campo, valor) => {
    setCamposAdicionales((prev) => ({
      ...prev,
      [campo]: valor,
    }));
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
          <Modal.Title>Editar Producto</Modal.Title>
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
              rows={3}
              maxLength={114}
              placeholder="Descripción del producto"
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
          <div className="text-muted small mt-2">
            Creado:{" "}
            {producto?.createdAt
              ? new Date(producto.createdAt).toLocaleString()
              : "-"}
            {producto?.updatedAt &&
              ` • Actualizado: ${new Date(
                producto.updatedAt
              ).toLocaleString()}`}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={alCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} variant="primary">
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
