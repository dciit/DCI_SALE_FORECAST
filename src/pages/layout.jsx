import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import Login from "./login";

function Layout() {
    const reducer = useSelector(state => state.reducer);
    return <>
        {
            reducer?.login ? <Outlet /> : <Login />
        }
    </>
}
export default Layout;