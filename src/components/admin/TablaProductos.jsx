import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import {
  obtenerProductos,
  eliminarProducto,
} from "../../services/productos.service";
import CreateProductModal from "./CreateProductosModal";
import EditProductModal from "./EditProductosModal";
import FilaTabla from "./FilaTabla";

function formatearFecha(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso ?? "";
  }
}

export default function TablaProductos() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);

  const cargarProductos = async () => {
    try {
      const productosData = await obtenerProductos();
      setProductos(productosData);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los productos",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const manejarEliminar = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (resultado.isConfirmed) {
      try {
        await eliminarProducto(id);
        cargarProductos();
        Swal.fire({
          title: "Producto eliminado",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el producto",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">
        <h3 className="m-0 text-dark fs-1">Productos registrados</h3>
        <Button variant="primary" onClick={() => setCreando(true)}>
          Nuevo producto
        </Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ minWidth: 80 }}>#</th>
            {/* <th>Rol</th> */}
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th style={{ minWidth: 120 }}>Stock</th>
            <th style={{ minWidth: 250 }}>Creado</th>
            <th style={{ minWidth: 250 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length ? (
            productos.map((producto, idx) => (
              <FilaTabla
                key={producto._id ?? idx}
                producto={producto}
                idx={idx}
                formatearFecha={formatearFecha}
                setEditando={setEditando}
                manejarEliminar={manejarEliminar}
              />
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-4">
                No hay productos registrados aún.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="text-light fs-5">
        Total: {productos.length} producto{productos.length === 1 ? "" : "s"}
      </div>

      {creando && (
        <CreateProductModal
          alCerrar={() => setCreando(false)}
          alGuardar={() => {
            setCreando(false);
            cargarProductos();
          }}
        />
      )}
      {editando && (
        <EditProductModal
          producto={editando}
          alCerrar={() => setEditando(null)}
          alGuardar={() => {
            setEditando(null);
            cargarProductos();
          }}
        />
      )}
    </div>
  );
}
