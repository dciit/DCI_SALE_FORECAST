import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../pages/layout";
import Page404 from "../pages/page404";
import { useDispatch, useSelector } from "react-redux";
import SealForecase from "../pages/SaleForecase";
import Home from "../pages/Home";
const Routers = () => {
    const dispatch = useDispatch();
    const BasePath = import.meta.env.VITE_PATH;
    const version = import.meta.env.VITE_VERSION;
    const reducer = useSelector(state => state.reducer);
    if (reducer.version == 'undefined' || reducer.version != version) {
        dispatch({ type: 'RESET', payload: { version: version, login: false } });
    }
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path={BasePath + '/'} element={<Home />} />
                    <Route path={BasePath + '/edit'} element={<SealForecase />} />
                </Route>
                <Route path="*" element={<Page404 />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Routers;