export const BASE_URL = import.meta.env.VITE_NODE_ENV === "development"
  ? `${import.meta.env.VITE_BASE_URL}`
  : "/";

  export const JISTI_URL = import.meta.env.VITE_NODE_ENV === "development"
  ? `${import.meta.env.VITE_JISTI_URL}`
  : "/";

  export const PORT = import.meta.env.VITE_NODE_ENV === "development"
  ? `${import.meta.env.VITE_PORT}`
  : "/";

  export const FRONTEND_PORT = import.meta.env.VITE_NODE_ENV === "development"
  ? `${import.meta.env.VITE_PORT_FRONTEND}`
  : "/";

  