import "../CSS/Dashboard.css";
import { useState, useEffect } from 'react'
import { supabase } from "../supabase.js";
import { NavLink } from "react-router-dom";
import ProductionChart from "../components/ProductionChart";
import VenteChart from "../components/VenteChart.jsx";
import AchatChart from "../components/AchatChart.jsx";
import { ShoppingCart } from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

function TopProduitsChart({data}){

    return(

        <ResponsiveContainer
            width="100%"
            height={400}
        >

            <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="nom"
                   tickFormatter={(value, index) =>
                        `${value} ${data[index].categorie}`
                    }
                   angle={-25}
                    textAnchor="end"
                    height={80}
                    tickFormatter={(nom)=>
                        nom.length>12
                        ? nom.substring(0,12)+"..."
                        : nom
                    }/>

            <YAxis
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)} M`}
            />

            <Tooltip 
                formatter={(value)=>

                new Intl.NumberFormat("fr-FR").format(value)+" FG"

                }
            />

            <Legend/>

            <Bar

                dataKey="cout_production"

                fill="#ef4444"

                name="Production"

            />

            <Bar

                dataKey="chiffre_affaires"

                fill="#22c55e"

                name="Vente"

            />

            <Bar

                dataKey="benefice"

                fill="#2563eb"

                name="Bénéfice"

            />

            </BarChart>

        </ResponsiveContainer>

    );

}

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

const [cmdEncours,setCmdEncours] = useState([]);
const [NbreCmdEncours,setNbreCmdEncours] = useState(0);

const [cmdValides,setCmdValides] = useState([]);
const [NbreCmdValides,setNbreCmdValides] = useState(0);

const [cmdLivree,setCmdLivree] = useState([]);
const [NbreCmdLivree,setNbreCmdLivree] = useState(0);

const [cmdAnnulee,setCmdAnnulee] = useState([]);
const [NbreCmdAnnulee,setNbreCmdAnnulee] = useState(0);

const [prodEncours,setProdEncours] = useState(0);
const [NbreProdEncours,setNbreProdEncours] = useState(0);


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

async function getAllCommandes(){

    const { data: cmdEncours } = await supabase
        .from("commandes")
        .select("*")
        .eq("statut","En cours");
    
    setCmdEncours(cmdEncours);
    setNbreCmdEncours(cmdEncours.length);

    const { data: cmdValides } = await supabase
        .from("commandes")
        .select("*")
        .eq("statut","Validée");
    
    setCmdValides(cmdValides);
    setNbreCmdValides(cmdValides.length);

    const { data: cmdLivree } = await supabase
        .from("commandes")
        .select("*")
        .eq("statut","Livrée");
    
    setCmdLivree(cmdLivree);
    setNbreCmdLivree(cmdLivree.length);

    const { data: cmdAnnulee } = await supabase
        .from("commandes")
        .select("*")
        .eq("statut","Annulée");
    
    setCmdAnnulee(cmdAnnulee);
    setNbreCmdAnnulee(cmdAnnulee.length);
}

async function getAllProductions(){

    
}

const [datatop10,setData]=useState([]);

async function loadTop10(){

    const {data,error}=await supabase

    .from("vw_top10_produits")

    .select("*");

    setData(data);
    console.log(data);

}

useEffect(()=>{
    getAllClients();  
    getAllProducts();  
    getAllVehicules();
    getAllFournisseurs();
    getAllMatPrems();
    getAllSalaries();
    getAllSites();
    getAllCommandes();
    loadTop10();
},[]);

return (

<div>    

    <h2> Top 10 des produits les vendus </h2>

    <div className="cards">
        <div className="card">            

            <TopProduitsChart
                data={datatop10}
            />

        </div>  
    </div>


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

    <h3> <ShoppingCart /> Commandes </h3>
    <div className="cards grid-4">
        <NavLink to="/commandes">
            <div className="card">
                <h3>Commandes en cours</h3>
                <p>{NbreCmdEncours}</p>
            </div>
        </NavLink>

        <NavLink to="/commandes">
            <div className="card">
                <h3>Commandes validées</h3>
                <p>{NbreCmdValides}</p>
            </div>
        </NavLink>

        <NavLink to="/commandes">
            <div className="card">
                <h3>Commandes livrées</h3>
                <p>{NbreCmdLivree}</p>
            </div>
        </NavLink>
        <NavLink to="/commandes">
            <div className="card">
                <h3>Commandes annulées</h3>
                <p>{NbreCmdAnnulee}</p>
            </div>
        </NavLink>
    </div>
</div>

)

}


export default Dashboard;