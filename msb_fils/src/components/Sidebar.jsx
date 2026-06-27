import { NavLink } from "react-router-dom";

import {
 LayoutDashboard,
 Users,
 FileText,
 Settings,
 UserPlus,
 HandCoins,
 Package
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
            <LayoutDashboard /> Accueil
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

        <NavLink to="/ca">
            <HandCoins /> Chiffre d'Affaire
        </NavLink>


        <NavLink to="/produits">
            <Package size={20}/>
            Produits
        </NavLink>

        <NavLink to="/produits/nouveau">
            <Package size={20}/>
            Nouveau produit
        </NavLink>

        <NavLink to="/parametres">
            <Settings /> Paramètres
        </NavLink>


    </nav>


    </aside>

)

}


export default Sidebar;