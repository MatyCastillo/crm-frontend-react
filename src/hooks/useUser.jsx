// import { useCallback, useContext, useState } from "react";
// import Context from "../context/UserContext";
// import { loginService } from "../services";

// export default function useUser() {
//   const { jwt, setJWT } = useContext(Context);
//   const [type, setType] = useState();
//   const [state, setState] = useState({
//     loading: false,
//     error: false,
//     message: "",
//   });

//   const login = useCallback(
//     ({ nombre, password }) => {
//       setState({ loading: true, error: false });
//       loginService({ nombre, password })
//         .then((jwt) => {
//           window.sessionStorage.setItem("jwt", jwt.jwt);
//           window.sessionStorage.setItem("userType", jwt.userType);
//           window.sessionStorage.setItem("userName", jwt.userNombre);
//           setState({ loading: false, error: true });
//           setJWT(jwt.jwt);
//           if (jwt.userType === "administrador") {
//             setType("administrador");
//           }
//         })
//         .catch((error) => {
//           window.sessionStorage.removeItem("jwt");
//           setState({
//             loading: false,
//             error: true,
//             message: error.response.data.message,
//           });
//         });
//     },
//     [setJWT]
//   );

//   const logout = useCallback(() => {
//     window.sessionStorage.removeItem("jwt");
//     setJWT(null);
//   }, [setJWT]);
//   return {
//     //para ignorar el login y comebtar jwt e isLogged
//     // isLogged: true,
//     jwt: jwt,
//     isLogged: Boolean(jwt),
//     statusMessage: state.message,
//     isLoginLoading: state.loading,
//     hasLoginError: state.error,
//     tipoDeUsuario: type,
//     login,
//     logout,
//   };
// }
import { useCallback, useContext, useState, useEffect } from "react";
import Context from "../context/UserContext";
import { loginService } from "../services";

export default function useUser() {
  const { jwt, setJWT } = useContext(Context);
  const [type, setType] = useState("");
  const [state, setState] = useState({
    loading: false,
    error: false,
    message: "",
  });

  useEffect(() => {
    const savedJWT = window.sessionStorage.getItem("jwt");
    const savedUserType = window.sessionStorage.getItem("userType");
    if (savedJWT) {
      setJWT(savedJWT);
      setType(savedUserType);
    }
  }, [setJWT]);

  const login = useCallback(
    async ({ nombre, password }) => {
      setState({ loading: true, error: false, message: "" });
      try {
        const jwt = await loginService({ nombre, password });
        window.sessionStorage.setItem("jwt", jwt.jwt);
        window.sessionStorage.setItem("userType", jwt.user.userType);
        window.sessionStorage.setItem("userName", jwt.user.username);
        window.sessionStorage.setItem("branch", jwt.user.branch);
        window.sessionStorage.setItem("user", jwt.user.user);
        setJWT(jwt.jwt);
        setType(jwt.userType);
        setState({ loading: false, error: false, message: "" });
        return true;
      } catch (error) {
        window.sessionStorage.removeItem("jwt");
        setState({
          loading: false,
          error: true,
          // Mostrar un mensaje amigable si el error no es claro
          message:
            error.response?.data?.message ||
            "Ocurrió un error inesperado. Inténtelo nuevamente. En caso de persistir, comuníquese con soporte.",
        });
        return false;
      }
    },
    [setJWT]
  );

  const logout = useCallback(() => {
    window.sessionStorage.removeItem("jwt");
    window.sessionStorage.removeItem("userType");
    window.sessionStorage.removeItem("userName");
    setJWT(null);
    setType("");
  }, [setJWT]);

  return {
    jwt,
    isLogged: Boolean(jwt),
    statusMessage: state.message, // Mensaje que puedes mostrar al usuario
    isLoginLoading: state.loading,
    hasLoginError: state.error, // Indica si ocurrió un error
    tipoDeUsuario: type,
    login,
    logout,
  };
}
