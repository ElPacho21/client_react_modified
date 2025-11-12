import { useSelector } from "react-redux";
import { IStoredState } from "../system/store/SessionStore";
import "./Toolbar.css";

export default function Toolbar() {
  const user = useSelector((state: IStoredState) => state.user)

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark d-flex shadow">
      <div className="toolbar_icon">
        <img src="/assets/favicon.png" alt=""></img>
      </div>

      <div className="toolbar_title navbar-brand flex-grow-1">
        Microservicios {user ? " - " + user.name : ""}
      </div>

      <div className="toolbar_title navbar-brand">
        Docs:
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3000/docs/index.html" target="auth"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Auth
        </a>
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3001/docs/index.html" target="image"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Image
        </a>
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3002/docs/index.html" target="catalog"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Catalog
        </a>
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3003/docs/index.html" target="cart"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Cart
        </a>
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3004/docs/index.html" target="order"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Order
        </a>
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:3005/api-docs" target="order"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Questions
        </a>
      </div>

      <div className="btn-group navbar-nav">
        <a href="http://localhost:15672/" target="catalog"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          Rabbit
        </a>
      </div>
    </nav>
  );
}
