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
import ClientStats from "../components/ClientStats.jsx";
import FournisseurStats from "../components/FournisseurStats.jsx";
import { ShoppingCart, User2, Factory, HandCoins, Users, Handshake, Truck, BadgeSwissFranc,
    Receipt,
    TrendingUp,
    Wallet, TrendingDown
 } from "lucide-react";

import DepensesChart from "../components/DepensesChart.jsx";
import FinanceCards from "../components/FinanceCards.jsx";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
    LineChart, 
    Line
} from "recharts";

import { Wrench } from "lucide-react";

import Achats from "./Achats.jsx";
import VehicleExpenseStats from "../components/VehiculeExpenseStats.jsx";

function VehicleTotalsCard({
    title,
    items = [],
    icon,
    color = "#2563eb",
    suffix = "FG"
}) {
    return (
        <div className="card">
            <div className="dashboard-card-header">
                <div
                    className="dashboard-icon"
                    style={{
                        background: `${color}20`,
                        color: color
                    }}
                >
                    {icon}
                </div>

                <div>
                    <h4 className="dashboard-title">{title}</h4>
                </div>
            </div>

            <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                {items.length === 0 ? (
                    <span className="dashboard-subtitle">Aucune donnée disponible</span>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 12,
                                padding: "10px 12px",
                                borderRadius: 10,
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0"
                            }}
                        >
                            <div style={{ minWidth: 0 }}>
                                <strong style={{ display: "block", fontSize: 14 }}>
                                    {item.immatriculation || "Véhicule"}
                                </strong>
                                <span style={{ fontSize: 12, color: "#64748b" }}>
                                    {item.marque || ""} {item.modele || ""}
                                </span>
                            </div>
                            <span style={{ fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
                                {new Intl.NumberFormat("fr-FR").format(Number(item.total || 0))} {suffix}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

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
const [vehicleLivraisonsStats, setVehicleLivraisonsStats] = useState([]);
const [vehiclePrestationsStats, setVehiclePrestationsStats] = useState([]);
const [vehicleEncaissementsStats, setVehicleEncaissementsStats] = useState([]);

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
const [showVehicleExpenseStats, setShowVehicleExpenseStats] = useState(true);
const [showVehicleLivraisonStats, setShowVehicleLivraisonStats] = useState(true);
const [showVehiclePrestationStats, setShowVehiclePrestationStats] = useState(true);
const [showVehicleEncaissementStats, setShowVehicleEncaissementStats] = useState(true);


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
const [clientsDetailsStats, setClientsDetailsStats] = useState({});
const [top10clientsDetailsStats, settop10ClientsDetailsStats] = useState({});

async function loadClientStats() {

    const { data } = await supabase
        .from("vw_dashboard_clients_evolution")
        .select("*")
        .single();

    setClientStats(data);

    const { data: clientsDetailsData } = await supabase
        .from("vw_dashboard_clients")
        .select("*");

    setClientsDetailsStats(clientsDetailsData);

    const { data: top10clientsDetailsData } = await supabase
        .from("vw_dashboard_top10_clients")
        .select("*");

    settop10ClientsDetailsStats(top10clientsDetailsData);

}

// Fournisseur evolution 
const [fournisseurStats, setFournisseurStats] = useState({});
const [top10fournisseurStats, settop10FournisseurStats] = useState({});
async function loadFournisseurStats() {

    const { data } = await supabase
        .from("vw_dashboard_fournisseurs_evolution")
        .select("*")
        .single();

    setFournisseurStats(data);

    const { data: top10F } = await supabase
        .from("vw_dashboard_top10_fournisseurs")
        .select("*");

    settop10FournisseurStats(top10F);

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

// Prestation evolution 
const [PrestationsStats, setPrestationsStats] = useState({});
const [Prestations, setPrestations] = useState({});
async function loadPrestationStats() {

    const { data } = await supabase
        .from("vw_dashboard_prestations_evolution")
        .select("*")
        .single();

    setPrestationsStats(data);

    const { data: dataP } = await supabase
        .from("prestations")
        .select("*");

    setPrestations(dataP);

}

// Issa distribution evolution 
const [IssaVentessStats, setIssaVentesStats] = useState({});
const [IssaAchatsStats, setIssaAchatsStats] = useState({});
const [IssaVentess, setIssaVentes] = useState({});
const [IssaAchats, setIssaAchats] = useState({});

async function loadIssaVentesStats() {

    const { data } = await supabase
        .from("vw_dashboard_issaventes_evolution")
        .select("*")
        .single();

    setIssaVentesStats(data);

    const { data: issaVD } = await supabase
        .from("issaventes")
        .select("*");

    setIssaVentes(issaVD);

    const { data: issaAD } = await supabase
        .from("vw_dashboard_issaachats_evolution")
        .select("*")
        .single();

    setIssaAchatsStats(issaAD);

    const { data: issaA } = await supabase
        .from("issaachats")
        .select("*");

    setIssaAchats(issaA);

}

// Depenses vehicules
const [vehiculesDepCategoriesStat , setvehiculesDepCategoriesStat] = useState([]);
const [vehiculesDepEvolutionStat , setvehiculesDepEvolutionStat] = useState([]);
async function loadvehiculesDepStat() {

    const { data } = await supabase
        .from("vw_dashboard_depenses_vehicules_evolution")
        .select("*");

    setvehiculesDepEvolutionStat(data);

    const { data: dataC } = await supabase
        .from("vw_dashboard_depenses_vehicules_categories")
        .select("*");

    setvehiculesDepCategoriesStat(dataC);
}

async function loadVehicleActivityTotals() {
    const [{ data: vehiculesData }, { data: livraisonsData }, { data: prestationsData }, { data: encaissementsData }] = await Promise.all([
        supabase.from("vehicules").select("id, immatriculation, marque, modele"),
        supabase.from("livraisons").select("id, vehicule_id, montant"),
        supabase.from("prestations").select("id, vehicule_id, montant"),
        supabase.from("encaissements").select("id, vehicule_id, montant")
    ]);

    const vehicles = vehiculesData || [];

    const buildVehicleTotals = (rows = []) =>
        vehicles
            .map((vehicle) => ({
                id: vehicle.id,
                immatriculation: vehicle.immatriculation,
                marque: vehicle.marque,
                modele: vehicle.modele,
                total: (rows || [])
                    .filter((row) => Number(row.vehicule_id) === Number(vehicle.id))
                    .reduce((sum, row) => sum + Number(row.montant || 0), 0)
            }))
            .sort((a, b) => Number(b.total) - Number(a.total));

    setVehicleLivraisonsStats(buildVehicleTotals(livraisonsData || []));
    setVehiclePrestationsStats(buildVehicleTotals(prestationsData || []));
    setVehicleEncaissementsStats(buildVehicleTotals(encaissementsData || []));
}


// Encaissements evolution
const [encaissementsStats, setEncaissementsStats] = useState({});
const [encaissements, setEncaissements] = useState([]);

async function loadEncaissementsStats() {

    const { data } = await supabase
        .from("vw_dashboard_encaissements_evolution")
        .select("*")        
        .single();

    setEncaissementsStats(data);

    const { data: dataE } = await supabase
        .from("encaissements")
        .select("*");

    setEncaissements(dataE);
}

// Finance evolution
const [financeKpi, setFinanceKpi] = useState([]);

async function loadFinanceKpi() {

    const { data, error } = await supabase
        .from("vw_dashboard_finance_kpi")
        .select("*");

    if (!error) {
        setFinanceKpi(data);
    }
}

// Benefice
const [beneficeStats, setBeneficeStats] = useState([]);

async function loadBeneficeStats() {

    const { data, error } = await supabase
        .from("vw_rapport_mensuel")
        .select("*");

    if (!error) {
        setBeneficeStats(data);
    }
}

useEffect(()=>{
    getAllClients();  
    getAllProducts(); 
    getAllMarchandises(); 

    // Vehicules
    loadvehiculesDepStat();
    getAllVehicules();
    loadVehicleActivityTotals();
    
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

    // Prestation 
    loadPrestationStats();

    loadTop10();

    // Client evolution 
    loadClientStats();

    // Vente evolution
    loadVenteStats();
    getAllVentes();

    // Achats
    loadachatsStats();

    // Issa Distribution
    loadIssaVentesStats();

    // Encaissements
    loadEncaissementsStats();

    // Finance evolution
    loadFinanceKpi();
    loadBeneficeStats();

},[]);

const montantTotalPaye = depensesCategorie.reduce(
      (total, vente) => total + Number(vente.montant || 0),
      0
);

return (

<div>       
    <h2 className="profile-msb">MSB & FILS</h2>
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

                icon={<BadgeSwissFranc size={32}/>}

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

                icon={<ShoppingCart size={32}/>}

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

        <DashboardCard

                title="Encaissements"

                value={encaissements.length}

                icon={<Receipt size={42}/>}

                color="#f11a0a"

                trend={encaissementsStats.evolution}

                subtitle="depuis le mois dernier"

                link="/encaissements"

                montantCourant={encaissementsStats.mois_courant}

                moisDernier={encaissementsStats.mois_precedent}

        />   

    </div>
    <div className="cards">
        {/*<FinanceCards data={financeKpi} />*/}
        <DashboardCard

                title="Bénéfice"

                //value={encaissements.length}

                icon={ ( (encaissementsStats?.mois_courant + venteStats?.mois_courant + PrestationsStats?.mois_courant + livraisonsStats?.mois_courant) - (productionStats?.mois_courant + depenseStats?.mois_courant + achatsStats?.mois_courant) ) > ( (encaissementsStats?.mois_precedent + venteStats?.mois_precedent + PrestationsStats?.mois_precedent + livraisonsStats?.mois_precedent) - (productionStats?.mois_precedent + depenseStats?.mois_precedent + achatsStats?.mois_precedent) ) ? <TrendingUp size={42} style={{ color: 'green' }}/> : <TrendingDown size={42} style={{ color: 'red' }} /> }

                color="#f11a0a"

                trend={( (encaissementsStats?.mois_precedent + venteStats?.mois_precedent + PrestationsStats?.mois_precedent + livraisonsStats?.mois_precedent) - (productionStats?.mois_precedent + depenseStats?.mois_precedent + achatsStats?.mois_precedent) )/ ( (encaissementsStats?.mois_courant + venteStats?.mois_courant + PrestationsStats?.mois_courant + livraisonsStats?.mois_courant) - (productionStats?.mois_courant + depenseStats?.mois_courant + achatsStats?.mois_courant) ) || 0}

                subtitle="depuis le mois dernier"

                //link="/encaissements"

                montantCourant={( (encaissementsStats?.mois_courant + venteStats?.mois_courant + PrestationsStats?.mois_courant + livraisonsStats?.mois_courant) - (productionStats?.mois_courant + depenseStats?.mois_courant + achatsStats?.mois_courant) ) || 0}

                moisDernier={ ( (encaissementsStats?.mois_precedent + venteStats?.mois_precedent + PrestationsStats?.mois_precedent + livraisonsStats?.mois_precedent) - (productionStats?.mois_precedent + depenseStats?.mois_precedent + achatsStats?.mois_precedent) ) || 0}

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
        <DashboardCard

                title="Prestations "

                value={Prestations.length}

                icon={<Truck size={32}/>}

                color="#ebcd27"

                trend={PrestationsStats.evolution}

                subtitle="depuis le mois dernier"

                link="/prestations"

                montantCourant={PrestationsStats.mois_courant}

                moisDernier={PrestationsStats.mois_precedent}

        />
    </div>

    <br/>
    <h2 className="profileIssa">Issa Distribution</h2>
    <div className="cards"> 
        <DashboardCard

                title="Achats"

                value={IssaAchats.length}

                icon={<ShoppingCart size={32}/>}

                color="#524c49"

                trend={IssaAchatsStats.evolution}

                subtitle="depuis le mois dernier"

                link="/issaachats"

                montantCourant={IssaAchatsStats.mois_courant}

                moisDernier={IssaAchatsStats.mois_precedent}

        />

        <DashboardCard

                title="Ventes"

                value={IssaVentess.length}

                icon={<BadgeSwissFranc size={32}/>}

                color="#db4b12"

                trend={IssaVentessStats.evolution}

                subtitle="depuis le mois dernier"

                link="/issaventes"

                montantCourant={IssaVentessStats.mois_courant}

                moisDernier={IssaVentessStats.mois_precedent}

        />
    </div>

    <br/>
    <h2 className="profileStat">Statistiques & Graphes</h2>

    
    <div className="cards">

        <ClientStats
            data={top10clientsDetailsStats}
        />
        <FournisseurStats
            data={top10fournisseurStats}
        />

        
    </div>

    <div className="dashboard-section">
        <div className="dashboard-section-header">
            <h2 className="profileStat">Dépenses véhicules</h2>
            <button
                type="button"
                className="dashboard-toggle-btn"
                onClick={() => setShowVehicleExpenseStats(!showVehicleExpenseStats)}
            >
                {showVehicleExpenseStats ? "Masquer" : "Afficher"}
            </button>
        </div>

        {showVehicleExpenseStats && (
            <div className="cards">
                <VehicleExpenseStats
                    categories={vehiculesDepCategoriesStat}
                    evolution={vehiculesDepEvolutionStat}
                />
            </div>
        )}
    </div>

    <div className="dashboard-section">
        <div className="dashboard-section-header">
            <h2 className="profileStat">Activité par véhicule</h2>
        </div>

        <div className="cards">
            <div className="dashboard-toggle-card">
                <div className="dashboard-section-header compact">
                    <h3>Livraisons</h3>
                    <button
                        type="button"
                        className="dashboard-toggle-btn"
                        onClick={() => setShowVehicleLivraisonStats(!showVehicleLivraisonStats)}
                    >
                        {showVehicleLivraisonStats ? "Masquer" : "Afficher"}
                    </button>
                </div>

                {showVehicleLivraisonStats && (
                    <VehicleTotalsCard
                        title="Livraisons par véhicule"
                        items={vehicleLivraisonsStats}
                        icon={<Truck size={32} />}
                        color="#1b17f3"
                    />
                )}
            </div>

            <div className="dashboard-toggle-card">
                <div className="dashboard-section-header compact">
                    <h3>Prestations</h3>
                    <button
                        type="button"
                        className="dashboard-toggle-btn"
                        onClick={() => setShowVehiclePrestationStats(!showVehiclePrestationStats)}
                    >
                        {showVehiclePrestationStats ? "Masquer" : "Afficher"}
                    </button>
                </div>

                {showVehiclePrestationStats && (
                    <VehicleTotalsCard
                        title="Prestations par véhicule"
                        items={vehiclePrestationsStats}
                        icon={<Wrench size={32} />}
                        color="#ebcd27"
                    />
                )}
            </div>

            <div className="dashboard-toggle-card">
                <div className="dashboard-section-header compact">
                    <h3>Encaissements</h3>
                    <button
                        type="button"
                        className="dashboard-toggle-btn"
                        onClick={() => setShowVehicleEncaissementStats(!showVehicleEncaissementStats)}
                    >
                        {showVehicleEncaissementStats ? "Masquer" : "Afficher"}
                    </button>
                </div>

                {showVehicleEncaissementStats && (
                    <VehicleTotalsCard
                        title="Encaissements par véhicule"
                        items={vehicleEncaissementsStats}
                        icon={<Receipt size={32} />}
                        color="#16a34a"
                    />
                )}
            </div>
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