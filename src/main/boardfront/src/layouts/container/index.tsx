import Header from "../header";
import {Outlet, useLocation} from "react-router-dom";
import Footer from "../footer";
import {AUTH_PATH} from "../../constant";

export default function Container() {

    const {pathname} = useLocation();

    return (
        <>
            <Header />
            <Outlet />
            {pathname !== AUTH_PATH() && <Footer />}
        </>
    )
}