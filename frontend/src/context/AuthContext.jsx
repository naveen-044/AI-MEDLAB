import PropTypes from "prop-types";
import { createContext, useEffect, useReducer } from "react";

const parseJSON = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

const getUserFromLocalStorage = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user && user !== "null" && user !== "undefined" ? parseJSON(user) : null;
};

const getTokenFromLocalStorage = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  return token && token !== "null" && token !== "undefined" ? token : null;
};

const getRoleFromLocalStorage = () => {
  if (typeof window === "undefined") return null;
  const role = localStorage.getItem("role");
  return role && role !== "null" && role !== "undefined" ? role : null;
};

const initialState = {
  user: getUserFromLocalStorage(),
  role: getRoleFromLocalStorage(),
  token: getTokenFromLocalStorage(),
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        role: null,
        token: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };
    case "LOGOUT":
      return {
        user: null,
        role: null,
        token: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }

    if (state.token && state.token !== "null" && state.token !== "undefined") {
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("token");
    }

    if (state.role && state.role !== "null" && state.role !== "undefined") {
      localStorage.setItem("role", state.role);
    } else {
      localStorage.removeItem("role");
    }
  }, [state]);

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.role,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
