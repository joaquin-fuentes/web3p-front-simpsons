import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useNavigate } from "react-router-dom";
function FormLogin() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navegacion = useNavigate();

  function obtenerUsuariosDeLocalStorage() {
    try {
      const listadoUsuariosJSON = localStorage.getItem("usuarios");
      const listadoUsuarios = JSON.parse(listadoUsuariosJSON);
      return listadoUsuarios ? listadoUsuarios : [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  function onSubmit(data) {
    const usuariosDeLaDb = obtenerUsuariosDeLocalStorage();
    const usuario = usuariosDeLaDb.find(
      (usuarioLS) => usuarioLS.email === data.email
    );
    if (!usuario) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El usuario no existe en la base de datos",
      });
      return;
    }
    if (usuario.password != data.password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Contraseña incorrecta",
      });
      return;
    }

    const usuarioLogueado = {
      email: data.email,
      loginAt: new Date().toISOString(),
    };
    sessionStorage.setItem("usuario", JSON.stringify(usuarioLogueado));
    Swal.fire({
      title: "Usuario Logueado",
      icon: "success",
      draggable: true,
    });
    reset();
    navegacion("/");
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingrese su email"
          isInvalid={errors.email}
          {...register("email", {
            required: "El email es requerido",
            // Esta expresion regular evalua que sea un email valido
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Debe ingresar un email válido",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Ingrese su password"
          isInvalid={errors.password}
          {...register("password", {
            required: "El password es requerido",
            minLength: {
              value: 4,
              message: "El minimo es 4 caracteres",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">
        Iniciar sesión
      </Button>
    </Form>
  );
}
export default FormLogin;
