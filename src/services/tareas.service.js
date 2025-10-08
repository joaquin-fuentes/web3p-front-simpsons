import clientAxios from "../api/clientAxios.js";

// Obtener todas las tareas
export const obtenerTareas = async () => {
  try {
    const response = await clientAxios.get("/tareas");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Obtener una tarea por ID
export const obtenerTarea = async (id) => {
  try {
    const response = await clientAxios.get(`/tareas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

// Crear una nueva tarea
export const crearTarea = async (nuevaTarea) => {
  try {
    const response = await clientAxios.post("/tareas", nuevaTarea);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Actualizar una tarea
export const actualizarTarea = async (id, tareaActualizada) => {
  try {
    const response = await clientAxios.put(`/tareas/${id}`, tareaActualizada);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Eliminar una tarea
export const eliminarTarea = async (id) => {
  try {
    const response = await clientAxios.delete(`/tareas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
