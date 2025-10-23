import React from "react";
import { Button } from "react-bootstrap";
import { FaRegStar } from "react-icons/fa";
import { LiaCertificateSolid } from "react-icons/lia";
import { FaQuestionCircle } from "react-icons/fa";
// import "../css/tabla.css";

const FilaTabla = ({
  producto,
  idx,
  setEditando,
  manejarEliminar,
  formatearFecha,
}) => {
  //  const obtenerIconoRol = (rol) => {
  //    switch (rol) {
  //      case "destacados":
  //        return (
  //          <FaRegStar className="text-warning" title="Producto Destacado" />
  //        );
  //      case "recomendado":
  //        return (
  //          <LiaCertificateSolid
  //            className="text-primary"
  //            title="Producto Recomendado"
  //          />
  //        );
  //      default:
  //        return (
  //          <FaQuestionCircle
  //            className="text-secondary"
  //            title="Rol no definido"
  //          />
  //        );
  //    }
  //  };

  return (
    <tr key={producto._id} className="fila-tabla">
      <td className="col-numero">
        <div className="numero-fila">
          <strong>{idx + 1}</strong>
        </div>
      </td>

      {/* <td className="col-rol">
        <div className="contenedor-rol">
          {producto.rol ? (
            <span className="badge-rol d-flex align-items-center gap-1">
              {obtenerIconoRol(producto.rol)}
              <span className="texto-rol">{producto.rol}</span>
            </span>
          ) : (
            <span className="badge-rol d-flex align-items-center gap-1">
              <FaQuestionCircle className="text-secondary" />
              <span className="texto-rol">Sin rol asignado</span>
            </span>
          )}
        </div>
      </td>  */}

      <td className="col-nombre">
        <div className="contenedor-nombre">
          {producto.urlImagen && (
            <img
              src={producto.urlImagen}
              alt={producto.nombre}
              style={{ width: "80px" }}
              className="imagen-producto"
            />
          )}
          <strong className="nombre-producto">{producto.nombre}</strong>
        </div>
      </td>

      <td className="col-descripcion">
        <div className="descripcion-producto">
          {producto.descripcion || "Sin descripción"}
        </div>
      </td>

      <td className="col-precio">
        <span className="precio-producto">
          ${producto.precio ? parseFloat(producto.precio).toFixed(2) : "0.00"}
        </span>
      </td>

      <td className="col-stock">
        <span
          className={`stock-producto ${
            producto.stock <= 0 ? "text-danger" : "text-success"
          }`}
        >
          {producto.stock || 0} unidades
        </span>
      </td>

      <td className="col-fecha">
        <span className="fecha-producto">
          {formatearFecha(producto.createdAt)}
        </span>
      </td>

      <td className="col-acciones">
        <div className="contenedor-botones">
          <Button
            className="btn-tabla btn-editar"
            size="sm"
            variant="secondary"
            onClick={() => setEditando(producto)}
          >
            Editar
          </Button>
          <Button
            className="btn-tabla btn-eliminar"
            size="sm"
            variant="danger"
            onClick={() => manejarEliminar(producto._id)}
          >
            Eliminar
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default FilaTabla;
