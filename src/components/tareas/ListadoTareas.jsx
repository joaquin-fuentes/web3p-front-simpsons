import React, { useEffect, useState } from "react";
import { Button, FormControl, ListGroup } from "react-bootstrap";
// import loquesea from "../assets/imagen1.jpg";
import { guardarEnLocalStorage } from "../../utils/localStorage.util.js";
import ItemTarea from "./ItemTarea.jsx";
import clientAxios from "../../api/clientAxios.js";

const ListadoTareas = () => {
  const [listadoTareas, setListadoTareas] = useState([]);
  const [tarea, setTarea] = useState("");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [tareaModificada, setTareaModificada] = useState("");

  const API_URL = "http://localhost:3000/api/tareas";

  useEffect(() => {
    // const tareasGuardadas = obtenerDeLocalStorage("listadoTareas");
    // acceder al endpoint del backend de tareas y obtener las tareas
    async function fetchTareas() {
      try {
        // const respuesta = await fetch(API_URL);
        const respuesta = await clientAxios.get("/tareas");
        // const data = await respuesta.json();
        console.log(respuesta);
        setListadoTareas(respuesta.data.tareas);
      } catch (error) {
        console.log(error);
      }
    }

    fetchTareas();
  }, []);

  useEffect(() => {
    // Código que se ejecuta al montar o actualizar
    guardarEnLocalStorage("listadoTareas", listadoTareas);
    //codigo que se ejecuta al desmontar
  }, [listadoTareas]);

  function handleSubmit(e) {
    e.preventDefault();
    if (tarea != "") {
      setListadoTareas([...listadoTareas, tarea]);
      // limpiar el formulario
      setTarea("");
    } else {
      alert("Debe escribir algo");
    }
  }

  function handleDelete(tarea, indiceAEleminiar) {
    if (confirm(`Segudo que desea eliminar esta tarea? ${tarea}`)) {
      const nuevoListadoTareas = listadoTareas.filter(
        (item, index) => index != indiceAEleminiar
      );
      setListadoTareas(nuevoListadoTareas);
    }
  }
  function handleUpdate(indiceAEditar) {
    // crear nuevo array
    const nuevoArray = [...listadoTareas];
    // de ese Array, acceder al elemento que quiero modificar y asignarle un nuevo valor
    nuevoArray[indiceAEditar] = tareaModificada;
    // guardar el nuevo arrary en el listado de tareas
    setListadoTareas(nuevoArray);
    setEditandoIndex(null);
    setTareaModificada("");
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
