import "../CSS/Dashboard.css";
import { useState, useEffect } from 'react'
import { supabase } from "../supabase.js";
import { NavLink } from "react-router-dom";
import ProductionChart from "../components/ProductionChart";
import VenteChart from "../components/VenteChart.jsx";
import AchatChart from "../components/AchatChart.jsx";
import { ShoppingCart } from "lucide-react";

import DepensesChart from "../components/DepensesChart.jsx";

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

    <div className="chart-card">


        <h2 className="titre_graphe">
            Top 10 des produits les plus vendus
        </h2>

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

        </div>

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

const [ventes, setVentes] = useState([]);
const [NbreVentes, setNbrVentes] = useState(0);
const [venteProduits, setVenteProduits] = useState([]);


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

async function getAllVentes(){

    const { data: VentesData } = await supabase
        .from("ventes")
        .select("*");
    
    setVentes(VentesData);
    setNbreVentes(VentesData.length);

    const { data: VenteProduitsData } = await supabase
        .from("venteproduits")
        .select("*");
    
    setVenteProduits(VenteProduitsData);
}

async function getAllProductions(){

    
}

{/* Vues select */}

// Top 10
const [datatop10,setData]=useState([]);
async function loadTop10(){
    const {data,error}=await supabase
    .from("vw_top10_produits")
    .select("*");

    setData(data);
}

// Top produits 
const [dataTopProd,setTopProd]=useState([]);
async function loadTopProd(){
    const {data,error}=await supabase
    .from("vw_dashboard_top_products")
    .select("*");

    setTopProd(data);
}


// Produit par site 
const [produitsBySite, setProduitBySite] = useState([]);
async function Produits_by_site(){
    const { data } = await supabase
    .from("vw_dashboard_products_site")
    .select("*");

    setProduitBySite(data);
}

// Ventes du mois
const [venteMois, setVenteMois] = useState([]);
async function Ventes_mois(){
    const { data } = await supabase
    .from("vw_dashboard_ca_mensuel")
    .select("*");

    setVenteMois(data);
}

// Productions du mois
const [prodMois, setProdMois] = useState([]);
async function Prods_mois(){
    const { data } = await supabase
    .from("vw_dashboard_production_mensuelle")
    .select("*");

    setProdMois(data);
}

// Dépenses catégorie
const [depensesCategorie, setDepensesCategorie] = useState([]);
async function Depenses_categorie(){
    const { data } = await supabase
    .from("vw_dashboard_depenses_categorie")
    .select("*");

    setDepensesCategorie(data);
}

// Dépenses sites
const [depenses_site, setDepenses_site] = useState([]);
async function Depenses_site(){
    const { data } = await supabase
    .from("vw_dashboard_depenses_site")
    .select("*");

    setDepense_site(data);
}

// Benefices
const [benefice, setBenefice] = useState([]);
async function Benefice(){
    const { data } = await supabase
    .from("vw_dashboard_benefice")
    .select("*");

    setBenefice(data);
}

// Stock
const [stock, setStock] = useState([]);
async function Stock(){
    const { data } = await supabase
    .from("vw_dashboard_stock")
    .select("*");

    setStock(data);
}


// Dernières ventes 
const [lastVente, setlastVente] = useState([]);
async function Stock(){
    const { data } = await supabase
    .from("vw_dashboard_last_sales")
    .select("*");

    setlastVente(data);
}

// Dernières productions 
const [lastProd, setlastProd] = useState([]);
async function LastProd(){
    const { data } = await supabase
    .from("vw_dashboard_last_productions")
    .select("*");

    setlastProd(data);
}

// Dernières dépenses 
const [lastDepense, setDepense] = useState([]);
async function LastDepense(){
    const { data } = await supabase
    .from("vw_dashboard_last_depenses")
    .select("*");

    setLastDente(data);
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
    getAllVentes();

    // Depenses
    Depenses_site();
    Depenses_categorie();

    loadTop10();
},[]);

return (

<div>    


    <div className="cards">
        <div className="card">            

            <TopProduitsChart
                data={datatop10}
            />

        </div>  
        <div className="card">            

            <DepensesChart
                ChartData={depensesCategorie}
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

    <h3> <ShoppingCart /> Ventes </h3>
    <div className="cards grid-4">
        <NavLink to="/ventes">
            <div className="card">
                <h3>Total des ventes</h3>
                <p>{NbreVentes}</p>
            </div>
        </NavLink>

        
    </div>
</div>

)

}


export default Dashboard;