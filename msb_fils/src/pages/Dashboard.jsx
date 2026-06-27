import "./Dashboard.css";
import { useState, useEffect } from 'react'
import { supabase } from "../supabase.js";

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


        <div className="card">
            <h3>Clients</h3>
            <p>{NbreClient}</p>
        </div>


        <div className="card">
            <h3>Factures</h3>
            <p>120</p>
        </div>


        <div className="card">
            <h3>CA</h3>
            <p>45 000 €</p>
        </div>


    </div>


</div>

)

}


export default Dashboard;