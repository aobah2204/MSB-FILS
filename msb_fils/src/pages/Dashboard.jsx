import "../CSS/Dashboard.css";
import { useState, useEffect } from 'react'
import { supabase } from "../supabase.js";
import { NavLink } from "react-router-dom";
import ProductionChart from "../components/ProductionChart";


function Dashboard(){

const [clients,setClients] = useState([]);
const [NbreClient,setNbreClient] = useState(0);

const [produit,setProducts] = useState([]);
const [NbreProduit,setNbreProduct] = useState(0);

const [vehicules,setVehicules] = useState([]);
const [NbreVehicule,setNbreVehicule] = useState(0);

async function getAllClients(){

    const { data } = await supabase
        .from("clients")
        .select("*");
    
    setClients(data);
    setNbreClient(data.length);
}

async function getAllProducts(){

    const { data } = await supabase
        .from("products")
        .select("*");
    
    setProducts(data);
    setNbreProduct(data.length);
}

async function getAllVehicules(){

    const { data } = await supabase
        .from("vehicules")
        .select("*");
    
    setVehicules(data);
    setNbreVehicule(data.length);
}

useEffect(()=>{
    getAllClients();  
    getAllProducts();  
    getAllVehicules();
},[]);

return (

<div>

    <h2>        
        MSB & FILS Portail
    </h2>


    <div className="cards">

        <NavLink to="/clients" className="card">
            <div>
                <h3>Clients</h3>
                <p>{NbreClient}</p>
            </div>
        </NavLink>

        <NavLink to="/produits" className="card">
            <div>
                <h3>Produits</h3>
                <p>{NbreProduit}</p>
            </div>
        </NavLink>  

        <NavLink to="/vehicules" className="card">
            <div>
                <h3>Flottes</h3>
                <p>{NbreVehicule}</p>
            </div>
        </NavLink>     
    </div>

    <div className="cards">   

        <NavLink to="/factures" className="card">
            <div>
                <h3>Factures</h3>
                <p>0</p>
            </div>
        </NavLink>

        <NavLink to="/ca" className="card">
            <div>
                <h3>CA</h3>
                <p>45 000 000 000 000</p>
            </div>
        </NavLink> 
        
    </div>
    <br/>

    <h2> Statistique </h2>

    <div className="cards">

        <div className="card">
            <h3>
                Production
                </h3>
                <ProductionChart />
        </div> 
    </div>



</div>

)

}


export default Dashboard;