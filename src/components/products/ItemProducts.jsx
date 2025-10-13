import React from "react";
import { Button, FormControl, ListGroup } from "react-bootstrap";

const ItemProduct = ({
  indice,
  product,
  editandoIndex,
  setProductModificada,
  setEditandoIndex,
  handleDelete,
  handleUpdate,
  productModificada,
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
            <span>{product}</span>
            <div className="d-flex gap-3">
              <Button
                variant="warning"
                onClick={() => {
                  setEditandoIndex(indice);
                  setProductModificada(product);
                }}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(indice, product)}
              >
                Eliminar
              </Button>
            </div>
          </>
        ) : (
          <>
            <FormControl
              type="text"
              value={productModificada}
              onChange={(e) => setProductModificada(e.target.value)}
            />
            <div className="d-flex gap-3">
              <Button
                variant="success"
                onClick={() => handleUpdate(indice, productModificada)}
              >
                Guardar
              </Button>
            </div>
          </>
        )}
      </ListGroup.Item>
    </div>
  );
};

export default ItemProduct;
