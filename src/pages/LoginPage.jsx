import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormLogin from "../components/auth/FormLogin";

const LoginPage = () => {
  return (
    <div
      className="d-flex align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f9e24c" }} // Amarillo Simpsons
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h1 className="mb-0" style={{ color: "#2e6db4" }}>
                    Iniciar sesión
                  </h1>
                  <small className="text-muted">
                    ¡Bienvenido de nuevo a la web de los Simpsons!
                  </small>
                </div>

                {/* Formulario */}
                <FormLogin></FormLogin>
                <div className="mt-4 text-center">
                  <span className="text-muted">¿No tenés cuenta?</span>{" "}
                  <Link
                    to="/registro"
                    className="fw-semibold"
                    style={{ color: "#2e6db4" }}
                  >
                    Crear una cuenta
                  </Link>
                  <div className="mt-2">
                    <Link to="/" className="text-decoration-none">
                      ← Volver al inicio
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
