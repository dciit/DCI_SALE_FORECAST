import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import Login from "./login";
import ToolbarComponent from "../components/ToolbarComponent";
import { Stack} from '@mui/material';
import FooterComponent from "../components/FooterComponent";
import BreadcrumbsComponent from "../components/BreadcrumbsComponent";

function Layout() {
    const reducer = useSelector(state => state.reducer);
    return <>
        {
            reducer?.login ? <Stack className="h-[100%]">
                <ToolbarComponent />
                {/* <BreadcrumbsComponent/> */}
                <Outlet />
                {/* <FooterComponent/> */}
            </Stack> : <Login />
        }
    </>
}
export default Layout;