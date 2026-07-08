import { NavLink } from "react-router-dom";
import {
    useState,
    useEffect
} from "react";


import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    UserPlus,
    HandCoins,
    Package,
    Factory,
    ShoppingCart,
    ShoppingBag,
    ChartBar,
    Truck,
    Cog
} from "lucide-react";

import logo from "../assets/Logo.png";
import "./Sidebar.css";
import { useAuth } from "../context/AuthContext";


function Sidebar({open,closeMenu}){

const { user } = useAuth();

const menu = [
  {
    key: "dashboard",
    title: "  Tableau de bord",
    icon: <ChartBar />,
    items: [
      { label: "Dashboard", to: "/" }
    ]
  },
  {
    key: "administration",
    title: "  Administration",
    icon: <Users />,
    items: [
      { label: "Salariés", to: "/salaries" },
      { label: "Sites de production", to: "/production-sites" },
      { label: "Fournisseurs", to: "/fournisseurs" },
      { label: "Dépenses", to: "/depenses" }
    ]
  },
  {
    key: "commercial",
    title: "  Gestion commerciale",
    icon: <Users />,
    items: [
      { label: "Clients", to: "/clients" },
      { label: "Fournisseurs", to: "/fournisseurs" },
      { label: "Commandes", to: "/commandes" },
      { label: "Achats", to: "/achats" },
      { label: "Ventes", to: "/ventes" },
      { label: "Marchandises", to: "/marchandises" }
    ]
  },
  {
    key: "production",
    title: "   Production",
    icon: <Factory />,
    items: [
      { label: "Produits", to: "/produits" },
      { label: "Matières premières", to: "/matierespremieres" },
      { label: "Productions", to: "/productions" }
    ]
  },
  {
    key: "livraison",
    title: "  Livraison",
    icon: <Truck />,
    items: [
      { label: "Véhicules", to: "/vehicules" },
      { label: "Livraisons", to: "/livraisons" }
    ]
  },
  {
    key: "prestation",
    title: "  Prestation de service",
    icon: <Truck />,
    items: [
      { label: "Prestataires", to: "/" },
      { label: "Prestation", to: "/" },
      { label: "Conceptions", to: "/" },
      { label: "Chantiers", to: "/" },
    ]
  },
  {
    key: "distribution",
    title: "  Distribution",
    icon: <Factory />,
    items: [
      { label: "Produits", to: "/" },
      { label: "Conceptions", to: "/" },
      { label: "Chantiers", to: "/" },
      { label: "Plan et Réalisation", to: "/" }
    ]
  }
];

const [openMenus, setOpenMenus] = useState({
    dashboard: true,
    commercial: true,
    production: false,
    logistique: false,
    finance: false,
    administration: false
});

const toggleMenu = (key) => {
    setOpenMenus(prev => ({
        ...prev,
        [key]: !prev[key]
    }));
};

const [sidebarOpen, setSidebarOpen] = useState(false);

const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
};

return (

    <>
    <div
        className={open ? "overlay active" : "overlay"}
        onClick={closeMenu}
    />

    <aside className={`sidebar ${open ? "open" : ""}`}>

        <div className="logo-container">
            <Factory size={40}/>
            <span>MSB & FILS</span>
        </div>

        {menu.map(section => (

            <div key={section.key} className="menu-section">

                <button
                    className="menu-title"
                    onClick={() => toggleMenu(section.key)}
                >

                    <div className="menu-left">

                        {section.icon}

                        <span>{section.title}</span>

                    </div>

                    <span>

                        {openMenus[section.key] ? "▼" : "▶"}

                    </span>

                </button>

                {openMenus[section.key] && (

                    <div className="submenu">

                        {section.items.map(item => (

                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={()=>{
                                    if(window.innerWidth<768){
                                        closeMenu();
                                    }
                                }}
                            >
                                {item.label}
                            </NavLink>

                        ))}

                    </div>

                )}

            </div>

        ))}

    </aside>
</>
)

}


export default Sidebar;