import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { SiAsda } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

function BasicExample() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      nombreUsuario: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
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

  function guardarEnLocalStorage(usuarios) {
    try {
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  function onSubmit(data) {
    try {
      if (data.password != data.confirmPassword) {
        Swal.fire({
          title: "sus contraseñas no coinciden",
          icon: "warning",
        });
        return;
      }
      const nuevoUsuario = {
        id: Date.now(),
        nombreUsuario: data.nombreUsuario,
        email: data.email,
        password: data.password,
        createdAt: new Date().toISOString(),
      };
      if (data.email === "joaquin.fuentes@gmail.com") {
        nuevoUsuario.rol === "Admin";
      } else {
        nuevoUsuario.rol === "Visitante";
      }
      const usuariosDelLocalStorage = obtenerUsuariosDeLocalStorage();
      //  preguntar si alguno de los usuarios de localstorage tiene el mismo email
      // que el nuevo usuario que estoy creando , si esto parseAst, mostrar un mensaje de error
      // y retornar la funcion para que termine aqui

      guardarEnLocalStorage([...usuariosDelLocalStorage, nuevoUsuario]);
      reset();
      Swal.fire({
        title: "Cuenta creada",
        text: "el registro se envió",
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Error al registrar usuario",
        icon: "error",
      });
      console.error(error);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="px-4">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Nombre de usuario</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingrese su nombre de usuario"
          isInvalid={errors.nombreUsuario}
          isValid={!errors.nombreUsuario}
          {...register("nombreUsuario", {
            required: "El campo es obligatorio",
            minLength: {
              value: 4,
              message: "Debe ingresar al menos 4 caracteres",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.nombreUsuario?.message}
        </Form.Control.Feedback>
        <Form.Control.Feedback type="valid">Bien hecho!</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingrese su correo electrónico"
          isInvalid={errors.email}
          {...register("email", {
            required: "El campo es obligatorio",
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
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Ingrese su contraseña"
          isInvalid={errors.password}
          {...register("password", {
            required: "El campo es obligatorio",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Confirmar contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirme su contraseña"
          isInvalid={errors.confirmPassword}
          {...register("confirmPassword", {
            required: "El campo es obligatorio",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit">
        Registrar
      </Button>
    </Form>
  );
}

export default BasicExample;
