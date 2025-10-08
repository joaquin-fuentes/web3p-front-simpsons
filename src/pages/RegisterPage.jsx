import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormRegister from "../components/auth/FormRegister";

const RegisterPage = () => {
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
                    Crear cuenta
                  </h1>
                  <small className="text-muted">
                    Registrate para empezar a disfrutar la web de los Simpsons
                  </small>
                </div>

                {/* Formulario de registro */}
                <FormRegister></FormRegister>

                {/* Links secundarios */}
                <div className="mt-4 text-center">
                  <span className="text-muted">¿Ya tenés cuenta?</span>{" "}
                  <Link
                    to="/login"
                    className="fw-semibold"
                    style={{ color: "#2e6db4" }}
                  >
                    Iniciar sesión
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

export default RegisterPage;
