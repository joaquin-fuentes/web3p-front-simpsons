import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import LogoNav from "../assets/imagenesSimpsons/logo.png";

// const API_KEY = import.meta.env.VITE_API_KEY;

const Header = () => {
  // const [clima, setClima] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const navegacion = useNavigate();
  // const obtenerClima = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // obtenemos datos de latitud y longitud desde el navegador de la compu
  //     navigator.geolocation.getCurrentPosition(async (position) => {
  //       const { latitude, longitude } = position.coords;

  //       const res = await fetch(
  //         `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=es`
  //       );
  //       const data = await res.json();

  //       if (!res.ok) throw new Error(data.message || "Error al obtener clima");

  //       setClima(data);
  //       setLoading(false);
  //     });
  //   } catch (err) {
  //     setError(err.message);
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   obtenerClima();
  // }, []);

  function handleLogout() {
    sessionStorage.removeItem("usuario");
    navegacion("/");
  }
  const usuarioLogueado = JSON.parse(sessionStorage.getItem("usuario")) || null;
  return (
    <Navbar sticky="top" bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="#home">
          <img src={LogoNav} alt="Logo de los simpsons" />
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={NavLink} to="/">
            Inicio
          </Nav.Link>
          {usuarioLogueado ? (
            <>
              <Nav.Link as={NavLink} to="/favoritos">
                Favoritos
              </Nav.Link>
              <Nav.Link as={NavLink} to="/admin">
                Panel Administrador
              </Nav.Link>
              <Nav.Link as={NavLink} to="/tareas">
                Listado Tareas
              </Nav.Link>
              <Button variant="danger" className="mx-3" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Nav.Link as={NavLink} to="/login">
              Iniciar Sesión
            </Nav.Link>
          )}

          {/* {loading && <div className="ms-3">Cargando...</div>}
          {error && <div className="ms-3 text-danger">⚠ {error}</div>}
          {clima && (
            <div className="ms-3 px-3 py-1 bg-light rounded shadow-sm">
              🌤 {Math.round(clima.main.temp)}°C - {clima.weather[0].description}{" "}
              <br />
              📍 {clima.name}
            </div>
          )} */}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
