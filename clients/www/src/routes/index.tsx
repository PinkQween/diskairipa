import routerType from "../types/router";
import Home from "../pages/Home";
import FourZeroFour from '../pages/errors/404'

const pages: routerType[] = [
    {
        path: '/',
        element: <Home />,
        exact: true
    }
]

const errors: routerType[] = [
    {
        element: <FourZeroFour />,
    }
]

const allRoutes = [...pages, ...errors];

export default allRoutes;