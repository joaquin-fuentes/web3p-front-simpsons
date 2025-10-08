import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

const CharacterSection = () => {
  //  crear mi estado donde guardare el listado de tareas
  const [listadoPersonajes, setListadoPersonajes] = useState([]);

  const API_URL = "https://thesimpsonsapi.com/api/characters?page=1";
  const CDN_BASE = "https://cdn.thesimpsonsapi.com/200";

  //  cuando el componente cargue traer los datos de la api
  useEffect(() => {
    // obtener los datos de la api
    async function fetchCharacters() {
      const respuesta = await fetch(API_URL);
      const data = await respuesta.json();
      setListadoPersonajes(data.results);
    }

    fetchCharacters();
  }, []);
  // cuando tenga los datos los guardo en mi estado de useState
  console.log(listadoPersonajes);
  return (
    <div className="container-fluid">
      <h2>Listado de personajes</h2>
      <Row xs={1} md={2} lg={4} className="g-4">
        {listadoPersonajes.map((personaje, indice) => (
          <Col key={indice}>
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={CDN_BASE + personaje.portrait_path}
              />
              <Card.Body>
                <Card.Title>{personaje.name}</Card.Title>
                <Card.Text className="text-body-secondary">
                  <span className="d-block mb-1">
                    <strong>Edad:</strong> {personaje.age}
                  </span>
                  <span className="d-block mb-1">
                    <strong>Fecha de cumpleaños:</strong> {personaje.birthdate}
                  </span>
                  <span className="d-block mb-1">
                    <strong>Genero:</strong> {personaje.gender}
                  </span>
                  <span className="d-block mb-1">
                    <strong>Ocupacion:</strong> {personaje.occupation}
                  </span>
                  <span className="d-block mb-1">
                    <strong>Estado:</strong> {personaje.status}
                  </span>
                  <div className="d-flex gap-3 justify-content-center">
                    <Button variant="primary">Ver detalle</Button>
                    <Button variant="success">Agregar a favoritos</Button>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CharacterSection;
