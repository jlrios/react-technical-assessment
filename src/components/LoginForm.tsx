import "./LoginForm.css";

import { login } from "../services/authService";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUsername } from "../store/authSlice";

import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userName.trim() === "" || password.trim() === "") {
      setError(true);
      return;
    }

    const dataUser = await login(userName, password);

    console.log(dataUser);

    dispatch(setToken(dataUser.accessToken));
    dispatch(setUsername(dataUser.username));

    setError(false);

    localStorage.setItem("token", dataUser.accessToken);
    localStorage.setItem("username", dataUser.username);

    //setUser(userName);
    navigate("/posts");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="cover">
        <h1>Iniciar sesión</h1>
        <p>
          Proporcione su nombre de usuario y contraseña para iniciar sesión en la aplicación.
        </p>
        <input 
          type="text" 
          placeholder="Nombre de usuario" 
          value={userName}
          onChange={(e => setUserName(e.target.value))}
        />
        <input 
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="login-btn">Iniciar sesión</button>
      </div>
      {error && <div>Todos los datos son obligatorios.</div>}
    </form>
  );
}

export default LoginForm;