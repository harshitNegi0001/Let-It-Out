import MainLayout from "../../pages/MainLayout.jsx";
import { authorizedRoutes } from "./authorizedRoutes.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export const getAllRoutes = ()=>{
     authorizedRoutes.map((r)=>{
        r.element=<ProtectedRoute route={r}>{r.element}</ProtectedRoute>
     });
     return{
        path:'/',
        element:<MainLayout/>,
        children:authorizedRoutes
     }
}