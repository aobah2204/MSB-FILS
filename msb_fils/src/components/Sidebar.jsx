import { NavLink } from "react-router-dom";

import {
 LayoutDashboard,
 Users,
 FileText,
 Settings
} from "lucide-react";


import "./Sidebar.css";


function Sidebar(){


return (

<aside className="sidebar">


<div className="logo">
MSB FILS
</div>


<nav>


<NavLink to="/">
<LayoutDashboard size={20}/>
Dashboard
</NavLink>


<NavLink to="/clients">
<Users size={20}/>
Clients
</NavLink>


<NavLink to="/factures">
<FileText size={20}/>
Factures
</NavLink>


<NavLink to="/parametres">
<Settings size={20}/>
Paramètres
</NavLink>


</nav>


</aside>

)

}


export default Sidebar;