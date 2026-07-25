import "../CSS/Dashboard.css";
import { useState, useEffect } from 'react'
import { supabase } from "../supabase.js";
import { NavLink } from "react-router-dom";
import ProductionChart from "../components/ProductionChart";
import VenteChart from "../components/VenteChart.jsx";
import AchatChart from "../components/AchatChart.jsx";
import ChiffreAffaireMensuelBySiteChart from "../components/ChiffreAffaireMensuelBySiteChart.jsx";
import ChiffreAffaireMensuelGlobalChart from "../components/ChiffreAffaireMensuelGlobalChart.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import { ShoppingCart, User2, Factory, HandCoins, Users, Handshake, Truck } from "lucide-react";

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
import Achats from "./Achats.jsx";

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

const [marchandises, setMarchandises] = useState([]);
const [NbrMarchandise, setNbrMarchandises] = useState();

async function getAllMarchandises(){

    const { data } = await supabase
        .from("marchandises")
        .select("*");
    
    setMarchandises(data);
    setNbrMarchandises(data.length);
}

const [livraisons, setLivraisons] = useState([]);
const [NbrLivraison, setNbrLivraisons] = useState();

async function getAllLivraisons(){

    const { data } = await supabase
        .from("livraisons")
        .select("*");
    
    setLivraisons(data);
    setNbrLivraisons(data.length);
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
    setNbrVentes(VentesData.length);

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
    .from("vw_dashboard_production_mensuelle_site")
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

    setDepenses_site(data);
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

// Productions du mois
const [prodVenteMois, setProdVenteMois] = useState([]);
async function ProdVente_mois(){
    const { data } = await supabase
    .from("vw_dashboard_production_vente_mensuelle_site")
    .select("*");

    const chartData = data.map(item => ({
        ...item,
        label: `${item.site} - ${item.mois}`
    }));

    setProdVenteMois(chartData);
}

// Productions du mois
const [financeMois, setFinanceMois] = useState([]);
async function FinanceByMois(){
    const { data } = await supabase
    .from("vw_dashboard_finance_mensuelle")
    .select("*");   

    setFinanceMois(data);
}

// Client evolution 
const [clientStats, setClientStats] = useState({});

async function loadClientStats() {

    const { data } = await supabase
        .from("vw_dashboard_clients_evolution")
        .select("*")
        .single();

    setClientStats(data);

}

// Fournisseur evolution 
const [fournisseurStats, setFournisseurStats] = useState({});

async function loadFournisseurStats() {

    const { data } = await supabase
        .from("vw_dashboard_fournisseurs_evolution")
        .select("*")
        .single();

    setFournisseurStats(data);

}

// vente evolution 
const [venteStats, setVentesStats] = useState({});

async function loadVenteStats() {

    const { data } = await supabase
        .from("vw_dashboard_ventes_evolution")
        .select("*")
        .single();

    setVentesStats(data);

}

// production evolution 
const [productionStats, setProductionsStats] = useState({});
const [Allproductions, setProductions] = useState({});
async function loadProductionStats() {

    const { data } = await supabase
        .from("vw_dashboard_production_evolution")
        .select("*")
        .single();

    setProductionsStats(data);

    const { data: dataP } = await supabase
        .from("productions")
        .select("*");

    setProductions(dataP);

}

// depense evolution 
const [depenseStats, setDepensesStats] = useState({});
const [depenses, setDepenses] = useState([]);
async function loadDepenseStats() {

    const { data } = await supabase
        .from("vw_dashboard_depenses_evolution")
        .select("*")
        .single();

    setDepensesStats(data);

    const { data: dataD } = await supabase
        .from("depenses")
        .select("*");

    setDepenses(dataD);

}

// achats evolution 
const [achatsStats, setachatsStats] = useState({});
const [achats, setachats] = useState([]);
async function loadachatsStats() {

    const { data } = await supabase
        .from("vw_dashboard_achats_evolution")
        .select("*")
        .single();

    setachatsStats(data);

    const { data: dataD } = await supabase
        .from("achats")
        .select("*");

    setachats(dataD);

}

// commandes evolution 
const [commandesStats, setcommandesStats] = useState({});
const [commandes, setcommandes] = useState([]);
async function loadcommandesStats() {

    const { data } = await supabase
        .from("vw_dashboard_commandes_evolution")
        .select("*")
        .single();

    setcommandesStats(data);

    const { data: dataD } = await supabase
        .from("commandes")
        .select("*");

    setcommandes(dataD);

}

// Livraison evolution 
const [livraisonsStats, setLivraisonsStats] = useState({});

async function loadLivraisonStats() {

    const { data } = await supabase
        .from("vw_dashboard_livraisons_evolution")
        .select("*")
        .single();

    setLivraisonsStats(data);

}

useEffect(()=>{
    getAllClients();  
    getAllProducts(); 
    getAllMarchandises(); 
    getAllVehicules();
    
    // Fournisseurs
    getAllFournisseurs();
    loadFournisseurStats();
    
    getAllMatPrems();
    getAllSalaries();
    getAllSites();

    // Commandes
    getAllCommandes();
    loadcommandesStats();

    // Depenses
    Depenses_site();
    Depenses_categorie();
    loadDepenseStats();

    // production 
    Prods_mois();
    loadProductionStats();

    // Chiffre d'affaires par mois 
    Ventes_mois();
    ProdVente_mois();
    FinanceByMois();

    // Livraisons
    getAllLivraisons();
    loadLivraisonStats();

    loadTop10();

    // Client evolution 
    loadClientStats();

    // Vente evolution
    loadVenteStats();
    getAllVentes();

    // Achats
    loadachatsStats();

},[]);

const montantTotalPaye = depensesCategorie.reduce(
      (total, vente) => total + Number(vente.montant || 0),
      0
);



return (

<div>    


    

    <div className="cards">        


        <DashboardCard

                title="Commandes"

                value={commandes.length}

                icon={<ShoppingCart size={32}/>}

                color="#524c49"

                trend={commandesStats.evolution}

                subtitle="depuis le mois dernier"

                link="/commandes"

                montantCourant={commandesStats.mois_courant}

                moisDernier={commandesStats.mois_precedent}

        />

        <DashboardCard

                title="Ventes"

                value={ventes.length}

                icon={<ShoppingCart size={32}/>}

                color="#db4b12"

                trend={venteStats.evolution}

                subtitle="depuis le mois dernier"

                link="/ventes"

                montantCourant={venteStats.mois_courant}

                moisDernier={venteStats.mois_precedent}

        />
        <DashboardCard

                title="Achats"

                value={achats.length}

                icon={<Handshake size={32}/>}

                color="#11a30c"

                trend={achatsStats.evolution}

                subtitle="depuis le mois dernier"

                link="/achats"

                montantCourant={achatsStats.mois_courant}

                moisDernier={achatsStats.mois_precedent}

        />
        
    </div>
    <div className="cards">
        <DashboardCard

                title="Productions"

                value={Allproductions.length}

                icon={<Factory size={32}/>}

                color="#230da0"

                trend={productionStats.evolution}

                subtitle="depuis le mois dernier"

                link="/productions"

                montantCourant={productionStats.mois_courant}

                moisDernier={productionStats.mois_precedent}

        />     

        <DashboardCard

                title="Dépenses"

                value={depenses.length}

                icon={<HandCoins size={42}/>}

                color="#f11a0a"

                trend={depenseStats.evolution}

                subtitle="depuis le mois dernier"

                link="/depenses"

                montantCourant={depenseStats.mois_courant}

                moisDernier={depenseStats.mois_precedent}

        />        
    </div>

    <div className="cards">
        <DashboardCard

                title="Clients"

                value={NbreClient}

                icon={<Users size={32}/>}

                color="#0f46bd"

                trend={clientStats.evolution}

                subtitle="depuis le mois dernier"

                link="/clients"

        />
        <DashboardCard

                title="Fournisseurs"

                value={NbreFournisseur}

                icon={<Users size={32}/>}

                color="#0d0b88"

                trend={fournisseurStats.evolution}

                subtitle="depuis le mois dernier"

                link="/fournisseurs"

        />
    </div>

    
    <br/>

    <div className="cards">

        <DashboardCard

                title="Livraisons"

                value={NbrLivraison}

                icon={<Truck size={32}/>}

                color="#1b17f3"

                trend={livraisonsStats.evolution}

                subtitle="depuis le mois dernier"

                link="/livraisons"

                montantCourant={livraisonsStats.mois_courant}

                moisDernier={livraisonsStats.mois_precedent}

        />
    </div>

    <div className="cards">
        <div className="card">            

            <ChiffreAffaireMensuelGlobalChart
                Data={financeMois}
            />
        </div>  
        <div className="card">            

            <ChiffreAffaireMensuelBySiteChart
                Data={prodVenteMois}
            />

        </div> 
    </div>
    

    <div className="cards">
        <div className="card">            

            <TopProduitsChart
                data={datatop10}
            />

        </div>  
        <div className="card">            

            <DepensesChart
                ChartData={depensesCategorie}
                MontantData={montantTotalPaye}
            />

        </div>         
    </div>

    {/*<div className="cards">
        <div className="card">            

            <ProductionMensuelSiteChart
                ChartData={prodMois}
            />

        </div>  
    </div>*/}

</div>

)

}


export default Dashboard;