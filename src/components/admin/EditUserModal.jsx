import { Modal, Form, Button } from "react-bootstrap";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { updateUser } from "../../services/users.services";
import {} from "react";

export default function EditUserModal({ user, onClose, onSaved }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombreUsuario: user?.nombreUsuario ?? "",
      email: user?.email ?? "",
    },
  });

  useEffect(() => {
    reset({
      nombreUsuario: user?.nombreUsuario ?? "",
      email: user?.email ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await updateUser(user.id, {
        nombreUsuario: data.nombreUsuario.trim(),
        email: data.email.trim(),
      });
      Swal.fire({
        title: "Usuario actualizado",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
      onSaved?.();
    } catch (err) {
      if (err?.code === "EMAIL_EXISTS") {
        Swal.fire({
          title: "Email ya utilizado",
          text: "Existe otro usuario con ese email.",
          icon: "warning",
        });
      } else {
        console.error(err);
        Swal.fire({ title: "Error al actualizar", icon: "error" });
      }
    }
  };

  return (
    <Modal show onHide={onClose} backdrop="static" centered>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              isInvalid={!!errors.nombreUsuario}
              {...register("nombreUsuario", {
                required: "El nombre es obligatorio",
                minLength: { value: 4, message: "Mínimo 4 caracteres" },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombreUsuario?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              isInvalid={!!errors.email}
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email inválido",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="text-muted small mt-2">
            Creado:{" "}
            {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
            {user?.updatedAt &&
              ` • Actualizado: ${new Date(user.updatedAt).toLocaleString()}`}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
