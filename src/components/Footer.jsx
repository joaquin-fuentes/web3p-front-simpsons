import { Container, Row, Col, Image, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

export default function Footer({
  logoSrc = "/logo.png",
  siteName = "Los Simpsons App",
  description = "Explorá personajes, episodios y agregá tus favoritos de Los Simpsons.",
  organization = {
    name: "Los Simpsons App",
    url: "https://tu-dominio.com",
    logo: "/logo.png",
  },
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organization.name,
    url: organization.url,
    logo: organization.logo,
  };

  return (
    <footer className="bg-dark text-light mt-auto" role="contentinfo">
      {/* JSON-LD ayuda al SEO de marca sin afectar el layout */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container fluid="lg" className="py-5">
        <Row className="gy-4">
          {/* Columna 1: Branding */}
          <Col xs={12} md={6} lg={4}>
            <div className="d-flex flex-column align-items-center gap-3 mb-3">
              <Image
                src={logoSrc}
                alt={`${siteName} - logo`}
                width={250}
                height={48}
                rounded
                loading="lazy"
              />
              <h2 className="h5 m-0">{siteName}</h2>
            </div>
            <p className="mb-3 text-light-50">{description}</p>
            {/* Social opcional (SVG inline para no agregar dependencias) */}
            <nav aria-label="Redes sociales">
              <ul className="list-unstyled d-flex gap-3 m-0">
                <li>
                  <a
                    className="link-light text-decoration-none"
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                  >
                    {/* ícono simple */}
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M20.3 3H17l-4.2 5.9L9 3H3l7.3 10.5L3.4 21H7l4.7-6.5L15 21h6l-7.8-10.9L20.3 3z"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    className="link-light text-decoration-none"
                    href="https://github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-3 .7-3.6-1.4-3.6-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.3-1.1.6-1.4-2.4-.3-4.9-1.2-4.9-5.5 0-1.2.4-2.2 1-3-.1-.3-.5-1.5.1-3 0 0 .9-.3 3 1.1a10.3 10.3 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.7.1 3 .7.8 1 1.8 1 3 0 4.3-2.5 5.2-5 5.5.3.2.6.8.6 1.7v2.5c0 .3.2.6.7.5A10 10 0 0 0 12 2z"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>
          </Col>

          {/* Columna 2: Navegación */}
          <Col xs={12} sm={6} lg={4}>
            <h3
              id="footer-nav-title"
              className="h6 text-uppercase text-light-50 mb-3"
            >
              Navegación
            </h3>
            <Nav className="flex-column" aria-labelledby="footer-nav-title">
              <Nav.Link as={Link} to="/" className="px-0 link-light">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/personajes" className="px-0 link-light">
                Personajes
              </Nav.Link>
              <Nav.Link as={Link} to="/favoritos" className="px-0 link-light">
                Favoritos
              </Nav.Link>
              <Nav.Link as={Link} to="/episodios" className="px-0 link-light">
                Episodios
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="px-0 link-light">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/registro" className="px-0 link-light">
                Registro
              </Nav.Link>
            </Nav>
          </Col>

          {/* Columna 3: Info / contacto */}
          <Col xs={12} sm={6} lg={4}>
            <h3 className="h6 text-uppercase text-light-50 mb-3">
              Información
            </h3>
            <address className="mb-3">
              <div className="text-light-50">Proyecto fan de Los Simpsons.</div>
              <div className="text-light-50">
                Hecho con React y React-Bootstrap.
              </div>
            </address>
            <div className="small text-light-50">
              <p className="mb-2">
                <strong>Disclaimer:</strong> Esta es una app de fans y no está
                afiliada ni respaldada por 20th Television/Disney.
              </p>
              <p className="mb-0">
                © {currentYear} {siteName}. Todos los derechos reservados.
              </p>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary my-4" />

        {/* mini-barra inferior */}
        <Row>
          <Col className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <span className="small text-light-50">
              <a
                as={Link}
                href="/accesibilidad"
                className="link-light text-decoration-none"
              >
                Accesibilidad
              </a>{" "}
              ·{" "}
              <a
                as={Link}
                href="/privacidad"
                className="link-light text-decoration-none"
              >
                Privacidad
              </a>{" "}
              ·{" "}
              <a
                as={Link}
                href="/terminos"
                className="link-light text-decoration-none"
              >
                Términos
              </a>
            </span>
            <span className="small text-light-50">
              Hecho por fans para fans 💛
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
