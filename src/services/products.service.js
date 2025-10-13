const STORAGE_KEY = "productos";
export function obtenerProductos() {
  try {
    const datosLocalStorage = localStorage.getItem(STORAGE_KEY);
    const datos = JSON.parse(datosLocalStorage);
    return Array.isArray(datos) ? datos : [];
  } catch (err) {
    console.error("Error al obtener productos:", err);
    return [];
  }
}
export function guardarProductos(productos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
  } catch (err) {
    console.error("Error al guardar productos:", err);
  }
}
export function agregarProducto(producto) {
  const productos = obtenerProductos();
  productos.push(producto);
  guardarProductos(productos);
}
export function eliminarProductoPorId(id) {
  const productos = obtenerProductos().filter((producto) => producto.id !== id);
  guardarProductos(productos);
}
export function obtenerProductoPorId(id) {
  return obtenerProductos().find((producto) => producto.id === id);
}
export function actualizarProducto(id, cambios) {
  const productos = obtenerProductos();
  const index = productos.findIndex((producto) => producto.id === id);
  if (index === -1) return false;
  if (cambios.nombre) {
    const nombreDuplicado = productos.some(
      (producto) => producto.nombre === cambios.nombre && producto.id !== id
    );
  }
  productos[index] = {
    ...productos[index],
    ...cambios,
    updatedAt: new Date().toISOString(),
  };
  guardarProductos(productos);
  return true;
}