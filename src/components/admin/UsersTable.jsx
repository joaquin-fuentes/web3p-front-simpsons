import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { getUsers, removeUserById } from "../../services/users.services";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import TableRow from "./TableRow";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso ?? "";
  }
}

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = () => setUsers(getUsers());

  useEffect(() => {
    load();
    const onStorage = (e) => {
      if (e.key === "usuarios") load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleRemove = async (id) => {
    const res = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (res.isConfirmed) {
      removeUserById(id);
      load();
      Swal.fire({
        title: "Eliminado",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">
        <h3 className="m-0">Usuarios registrados</h3>
        <Button variant="primary" onClick={() => setCreating(true)}>
          Nuevo usuario
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ minWidth: 80 }}>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th style={{ minWidth: 180 }}>Creado</th>
            <th style={{ minWidth: 200 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((user, idx) => (
              <TableRow
                key={user.id ?? idx}
                user={user}
                idx={idx}
                formatDate={formatDate}
                setEditing={setEditing}
                handleRemove={handleRemove}
              />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No hay usuarios registrados aún.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="text-muted small">
        Total: {users.length} usuario{users.length === 1 ? "" : "s"}
      </div>

      {creating && (
        <CreateUserModal
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            load();
          }}
        />
      )}

      {editing && (
        <EditUserModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}
