import React from "react";
import { Button, FormControl, ListGroup } from "react-bootstrap";

const ItemTarea = ({
  indice,
  tarea,
  editandoIndex,
  setTareaModificada,
  setEditandoIndex,
  handleDelete,
  handleUpdate,
  tareaModificada,
}) => {
  return (
    <div>
      <ListGroup.Item
        variant="primary"
        key={indice}
        className="d-flex justify-content-between align-items-center"
      >
        {editandoIndex !== indice ? (
          <>
            <span>{tarea}</span>
            <div className="d-flex gap-3">
              <Button
                variant="warning"
                onClick={() => {
                  setEditandoIndex(indice);
                  setTareaModificada(tarea);
                }}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(tarea, indice)}
              >
                Eliminar
              </Button>
            </div>
          </>
        ) : (
          <>
            <FormControl
              type="text"
              value={tareaModificada}
              onChange={(e) => setTareaModificada(e.target.value)}
            />
            <div className="d-flex gap-3">
              <Button variant="success" onClick={() => handleUpdate(indice)}>
                Guardar
              </Button>
            </div>
          </>
        )}
      </ListGroup.Item>
    </div>
  );
};

export default ItemTarea;
