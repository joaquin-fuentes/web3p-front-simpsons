import React, { useEffect, useState } from "react";
import { Button, FormControl, ListGroup } from "react-bootstrap";
// import loquesea from "../assets/imagen1.jpg";
import ItemProducts from "./ItemProducts.jsx";
import {
  actualizarProduct,
  crearProduct,
  eliminarProduct,
  obtenerProducts,
} from "../../services/products.service.js";

const ProductLists = () => {
  const [listadoProducts, setListadoProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [productModificada, setProductModificada] = useState("");

  async function fetchProducts() {
    try {
      // const respuesta = await fetch(API_URL);
      const products = await obtenerProducts();
      // const data = await respuesta.json();
      console.log(products);
      setListadoProducts(products);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (product != "") {
      // enviar esta product a mi base de datos a traves de un servicio
      try {
        const nuevaProduct = {
          descripcion: product,
        };
        await crearProduct(nuevaProduct);
        // actualizar el listado de products del front
        fetchProducts();
        alert("Product creada con éxito");
        // limpiar el formulario
        setProduct("");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Debe escribir algo");
    }
  }

  async function handleDelete(id, product) {
    if (confirm(`Segudo que desea eliminar esta product? ${product}`)) {
      try {
        // llamar al servicio que elimina la product
        await eliminarProduct(id);
        // actualizar el listado
        fetchProducts();
        // mostrar msj al usuario
        alert(`La product: ${product} fue eliminada con éxito`);
      } catch (error) {
        console.log(error);
      }
    }
  }
  async function handleUpdate(id, productModificada) {
    try {
      const productActualizada = {
        descripcion: productModificada,
      };
      // utilizar un servicio que envíe la product actualizada
      await actualizarProduct(id, productActualizada);
      alert("Product actualizada con éxito");
      fetchProducts();
      // actualizar el listado de products
      setEditandoIndex(null);
      setProductModificada("");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mt-2">
      <h1>Listado de products</h1>
      {/* <img src={loquesea} alt="imagen de prueba" /> */}
      {/* <Spinner animation="border" variant="primary" /> */}
      <form onSubmit={handleSubmit} className="d-flex w-50 ">
        <input
          type="text"
          placeholder="Ingrese la product"
          className="form-control m-2"
          onChange={(e) => setProduct(e.target.value)}
          value={product}
        />
        {/* <button type="submit" className="btn btn-primary">
          Guardar
        </button> */}
        <Button type="submit" variant="primary">
          Guardar
        </Button>
      </form>
      <h3>Listado</h3>
      {listadoProducts.length == 0 ? (
        <p>No tiene ninguna product pendiente. Puede dormir siesta 😎</p>
      ) : (
        <ListGroup>
          {listadoProducts.map((product, indice) => {
            return (
              <ItemProducts
                key={indice}
                indice={product._id}
                product={product.descripcion}
                editandoIndex={editandoIndex}
                setEditandoIndex={setEditandoIndex}
                setProductModificada={setProductModificada}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                productModificada={productModificada}
              ></ItemProducts>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
};

export default ProductLists;
