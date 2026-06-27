import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { Outlet } from "react-router-dom";

import "./DashboardLayout.css";


function DashboardLayout(){


const [menuOpen,setMenuOpen] = useState(false);



return (

<div className="dashboard">


    <button
        className="mobile-menu"
        onClick={() => setMenuOpen(!menuOpen)}
        >
        ☰
    </button>


    <Sidebar 
        open={menuOpen}
        closeMenu={() => setMenuOpen(false)}
    />



    <div className="main">


        <Header />


        <main className="content">

            <Outlet />

        </main>


    </div>


</div>

)

}


export default DashboardLayout;