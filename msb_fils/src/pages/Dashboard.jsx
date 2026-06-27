import "./Dashboard.css";
import { useState, useEffect } from 'react'
import { supabase } from "../supabase.js";
import { NavLink } from "react-router-dom";

function Dashboard(){

const [clients,setClients] = useState([]);
const [NbreClient,setNbreClient] = useState(0);

async function getAllClients(){

    const { data } = await supabase
        .from("clients")
        .select("*");
    
    setClients(data);
    setNbreClient(data.length);
}

useEffect(()=>{
    getAllClients();    
},[]);

return (

<div>

    <h1>
        Bienvenue 👋
    </h1>


    <div className="cards">

        <NavLink to="/clients" className="card-link">
            <div className="card">
                <h3>Clients</h3>
                <p>{NbreClient}</p>
            </div>
        </NavLink>
        

        <NavLink to="/factures" className="card-link">
            <div className="card">
                <h3>Factures</h3>
                <p>0</p>
            </div>
        </NavLink>

        <NavLink to="/ca" className="card-link">
            <div className="card">
                <h3>CA</h3>
                <p>45 000 000 000 FG</p>
            </div>
        </NavLink>
        


    </div>


</div>

)

}


export default Dashboard;