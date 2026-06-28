import { NavLink } from "react-router-dom";

import {
 LayoutDashboard,
 Users,
 FileText,
 Settings,
 UserPlus,
 HandCoins,
 Package,
 Factory
} from "lucide-react";

import logo from "../assets/Logo.png";
import "./Sidebar.css";
import { useAuth } from "../context/AuthContext";


function Sidebar({open,closeMenu}){

const { user } = useAuth();


return (

    <aside
    className={`sidebar ${open ? "open" : ""}`}
    onClick={closeMenu}
    >


    <div className="logo-container">

        {/*<img
        src={logo}
        className="logo-image"
        alt="MSB FILS"
        />*/}
        <Factory size={40} />
        <span>
        MSB FILS
        </span>
    </div>


    <nav>

        <NavLink to="/">
            <LayoutDashboard /> Accueil
        </NavLink>

        <NavLink to="/clients">
            <Users /> Clients
        </NavLink>     

        
        <NavLink to="/produits">
            <Package size={20}/>
            Produits
        </NavLink>    
        

        <NavLink to="/factures">
            <FileText /> Factures
        </NavLink>

        <NavLink to="/ca">
            <HandCoins /> Chiffre d'Affaire
        </NavLink>              

        <NavLink to="/parametres">
            <Settings /> Paramètres
        </NavLink>


    </nav>


    </aside>

)

}


export default Sidebar;