import clientAxios from "../api/clientAxios.js";

// Obtener todos los productos
export const obtenerProductos = async () => {
  try {
    const response = await clientAxios.get("/productos");
    return response.data.productos;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Obtener un producto por ID
export const obtenerProducto = async (id) => {
  try {
    const response = await clientAxios.get(`/productos/${id}`);
    return response.data.producto;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Crear un nuevo producto
export const crearProducto = async (nuevoProducto) => {
  try {
    const response = await clientAxios.post("/productos", nuevoProducto);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Actualizar un producto
export const actualizarProducto = async (id, productoActualizado) => {
  try {
    const response = await clientAxios.put(
      `/productos/${id}`,
      productoActualizado
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Eliminar un producto
export const eliminarProducto = async (id) => {
  try {
    const response = await clientAxios.delete(`/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
