import React from "react";
import { Button } from "react-bootstrap";

const TableRow = ({ user, idx, setEditing, handleRemove, formatDate }) => {
  return (
    <tr key={user.id}>
      <td>{idx + 1}</td>
      <td>{user.nombreUsuario}</td>
      <td>{user.email}</td>
      <td>{formatDate(user.createdAt)}</td>
      <td className="d-flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setEditing(user)}>
          Editar
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => handleRemove(user.id)}
        >
          Eliminar
        </Button>
      </td>
    </tr>
  );
};

export default TableRow;
