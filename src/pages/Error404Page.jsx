import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Error404Page = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#f9e24c",
        color: "#2e6db4",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "8rem",
          fontWeight: "bold",
          textShadow: "3px 3px #000",
        }}
      >
        404
      </h1>
      <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>
        ¡D'oh! Página no encontrada
      </h2>
      <p style={{ maxWidth: "500px" }}>
        Parece que esta página se perdió en Springfield. Vuelve al inicio para
        seguir disfrutando.
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={handleGoHome}
        style={{
          backgroundColor: "#2e6db4",
          border: "none",
          borderRadius: "25px",
          padding: "10px 30px",
          fontWeight: "bold",
        }}
      >
        Volver al Inicio
      </Button>
    </Container>
  );
};

export default Error404Page;
