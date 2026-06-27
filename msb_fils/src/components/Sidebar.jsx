import { NavLink } from "react-router-dom";

import {
 LayoutDashboard,
 Users,
 FileText,
 Settings,
 UserPlus
} from "lucide-react";


import "./Sidebar.css";


function Sidebar({open,closeMenu}){


return (

    <aside
    className={`sidebar ${open ? "open" : ""}`}
    onClick={closeMenu}
    >


    <div className="logo">
    MSB FILS
    </div>


    <nav>

        <NavLink to="/">
            <LayoutDashboard /> Dashboard
        </NavLink>


        <NavLink to="/clients">
            <Users /> Clients
        </NavLink>


        <NavLink to="/clientcreate">
            <UserPlus /> Nouveau client
        </NavLink>


        <NavLink to="/factures">
            <FileText /> Factures
        </NavLink>


        <NavLink to="/parametres">
            <Settings /> Paramètres
        </NavLink>


    </nav>


    </aside>

)

}


export default Sidebar;