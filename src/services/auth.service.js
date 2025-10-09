import clientAxios from "../api/clientAxios.js";

export const loginUser = async ({ email, password }) => {
  try {
    const response = await clientAxios.post(`/usuarios/login`, {
      emailUsuario: email,
      contrasenia: password,
    });
    console.log(response);
    const token = response.data?.token;
    const usuario = response.data?.payload;
    if (token) {
      localStorage.setItem("token", token);
      sessionStorage.setItem("usuario", JSON.stringify(usuario));
    }
    return response.data?.msg;
  } catch (error) {
    console.log(error);
  }
};
