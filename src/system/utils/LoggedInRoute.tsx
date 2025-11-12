import { useSelector } from "react-redux";
import { Outlet } from 'react-router-dom';
import Welcome from "../../welcome/Welcome";
import { IStoredState } from "../store/SessionStore";

export default function LoggedInRoute() {
  const token = useSelector((state: IStoredState) => state.token)

  if (token === undefined) {
    return <Welcome /> 
  } else {
    return <Outlet />
  }
}