import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app/App";
import "./styles.css";
import sessionStore from "./system/store/SessionStore";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
<Provider store={sessionStore}>
    <App />
</Provider>
);

