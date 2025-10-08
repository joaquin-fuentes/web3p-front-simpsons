import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { addUser, getUsers } from "../../services/users.services";

export default function CreateUserModal({ onClose, onSaved }) {

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombreUsuario: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = (data) => {
    const users = getUsers();
    const dup = users.some((user) => user.email === data.email.trim());
    if (dup) {
      Swal.fire({ title: "Email ya registrado", icon: "warning" });
      return;
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombreUsuario: data.nombreUsuario.trim(),
      email: data.email.trim(),
      password: data.password, // Demo/localStorage únicamente
      createdAt: new Date().toISOString(),
    };

    addUser(nuevoUsuario);
    reset();
    Swal.fire({
      title: "Usuario creado",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });
    onSaved?.();
  };

  return (
    <Modal show onHide={onClose} backdrop="static" centered>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo usuario</Modal.Title>
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

          <Form.Group className="mb-3">
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

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              isInvalid={!!errors.password}
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirmar contraseña"
              isInvalid={!!errors.confirmPassword}
              {...register("confirmPassword", {
                required: "Debe confirmar la contraseña",
                validate: (v) =>
                  v === password || "Las contraseñas no coinciden",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="text-muted small mt-2">
            *Para producción no guardes contraseñas en texto plano.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            Crear
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
