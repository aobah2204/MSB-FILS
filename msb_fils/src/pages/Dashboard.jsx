import "../CSS/Dashboard.css";
import { useState, useEffect } from 'react'
import { supabase } from "../supabase.js";
import { NavLink } from "react-router-dom";
import ProductionChart from "../components/ProductionChart";
import VenteChart from "../components/VenteChart.jsx";
import AchatChart from "../components/AchatChart.jsx";


function Dashboard(){

const [clients,setClients] = useState([]);
const [NbreClient,setNbreClient] = useState(0);

const [produit,setProducts] = useState([]);
const [NbreProduit,setNbreProduct] = useState(0);

const [vehicules,setVehicules] = useState([]);
const [NbreVehicule,setNbreVehicule] = useState(0);

const [fournisseurs,setFournisseurs] = useState([]);
const [NbreFournisseur,setNbreFournisseur] = useState(0);

const [sites,setSites] = useState([]);
const [NbreSite,setNbreSite] = useState(0);

const [matprems,setMatPrems] = useState([]);
const [NbreMatPrem,setNbreMatPrem] = useState(0);

const [salaries,setSalaries] = useState([]);
const [NbreSalaries,setNbreSalaries] = useState(0);

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

async function getAllFournisseurs(){

    const { data } = await supabase
        .from("fournisseurs")
        .select("*");
    
    setFournisseurs(data);
    setNbreFournisseur(data.length);
}

async function getAllSites(){

    const { data } = await supabase
        .from("siteproduction")
        .select("*");
    
    setSites(data);
    setNbreSite(data.length);
}

async function getAllMatPrems(){

    const { data } = await supabase
        .from("matierespremieres")
        .select("*");
    
    setMatPrems(data);
    setNbreMatPrem(data.length);
}

async function getAllSalaries(){

    const { data } = await supabase
        .from("utilisateurs")
        .select("*");
    
    setSalaries(data);
    setNbreSalaries(data.length);
}

useEffect(()=>{
    getAllClients();  
    getAllProducts();  
    getAllVehicules();
    getAllFournisseurs();
    getAllMatPrems();
    getAllSalaries();
    getAllSites();
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
                <h3>Véhicules</h3>
                <p>{NbreVehicule}</p>
            </div>
        </NavLink>     
    </div>

    <div className="cards">   

        <NavLink to="/fournisseurs" className="card">
            <div>
                <h3>Fournisseurs</h3>
                <p>{NbreFournisseur}</p>
            </div>
        </NavLink>

        <NavLink to="/production-sites" className="card">
            <div>
                <h3>Sites de production</h3>
                <p>{NbreSite}</p>
            </div>
        </NavLink>

        <NavLink to="/matierespremieres" className="card">
            <div>
                <h3>Matières premières</h3>
                <p>{NbreMatPrem}</p>
            </div>
        </NavLink>

        <NavLink to="/salaries" className="card">
            <div>
                <h3>Salariés</h3>
                <p>{NbreSalaries}</p>
            </div>
        </NavLink>
        
    </div>
    <br/>

    <h2> Statistique </h2>

    <div className="cards">

        <div className="card">            
            <AchatChart />
        </div> 

        <div className="card">
            <ProductionChart />
        </div> 

        <div className="card">
            <VenteChart />
        </div> 

    </div>



</div>

)

}


export default Dashboard;