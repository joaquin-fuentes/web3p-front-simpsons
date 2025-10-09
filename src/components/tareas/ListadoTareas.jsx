import React, { useEffect, useState } from "react";
import { Button, FormControl, ListGroup } from "react-bootstrap";
// import loquesea from "../assets/imagen1.jpg";
import ItemTarea from "./ItemTarea.jsx";
import {
  actualizarTarea,
  crearTarea,
  eliminarTarea,
  obtenerTareas,
} from "../../services/tareas.service.js";

const ListadoTareas = () => {
  const [listadoTareas, setListadoTareas] = useState([]);
  const [tarea, setTarea] = useState("");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [tareaModificada, setTareaModificada] = useState("");

  async function fetchTareas() {
    try {
      // const respuesta = await fetch(API_URL);
      const tareas = await obtenerTareas();
      // const data = await respuesta.json();
      console.log(tareas);
      setListadoTareas(tareas);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTareas();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (tarea != "") {
      // enviar esta tarea a mi base de datos a traves de un servicio
      try {
        const nuevaTarea = {
          descripcion: tarea,
        };
        await crearTarea(nuevaTarea);
        // actualizar el listado de tareas del front
        fetchTareas();
        alert("Tarea creada con éxito");
        // limpiar el formulario
        setTarea("");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Debe escribir algo");
    }
  }

  async function handleDelete(id, tarea) {
    if (confirm(`Segudo que desea eliminar esta tarea? ${tarea}`)) {
      try {
        // llamar al servicio que elimina la tarea
        await eliminarTarea(id);
        // actualizar el listado
        fetchTareas();
        // mostrar msj al usuario
        alert(`La tarea: ${tarea} fue eliminada con éxito`);
      } catch (error) {
        console.log(error);
      }
    }
  }
  async function handleUpdate(id, tareaModificada) {
    try {
      const tareaActualizada = {
        descripcion: tareaModificada,
      };
      // utilizar un servicio que envíe la tarea actualizada
      await actualizarTarea(id, tareaActualizada);
      alert("Tarea actualizada con éxito");
      fetchTareas();
      // actualizar el listado de tareas
      setEditandoIndex(null);
      setTareaModificada("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mt-2">
      <h1>Listado de tareas</h1>
      {/* <img src={loquesea} alt="imagen de prueba" /> */}
      {/* <Spinner animation="border" variant="primary" /> */}
      <form onSubmit={handleSubmit} className="d-flex w-50 ">
        <input
          type="text"
          placeholder="Ingrese la tarea"
          className="form-control m-2"
          onChange={(e) => setTarea(e.target.value)}
          value={tarea}
        />
        {/* <button type="submit" className="btn btn-primary">
          Guardar
        </button> */}
        <Button type="submit" variant="primary">
          Guardar
        </Button>
      </form>
      <h3>Listado</h3>
      {listadoTareas.length == 0 ? (
        <p>No tiene ninguna tarea pendiente. Puede dormir siesta 😎</p>
      ) : (
        <ListGroup>
          {listadoTareas.map((tarea, indice) => {
            return (
              <ItemTarea
                key={indice}
                indice={tarea._id}
                tarea={tarea.descripcion}
                editandoIndex={editandoIndex}
                setEditandoIndex={setEditandoIndex}
                setTareaModificada={setTareaModificada}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                tareaModificada={tareaModificada}
              ></ItemTarea>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
};

export default ListadoTareas;
