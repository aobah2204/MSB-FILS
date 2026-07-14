import {
 LayoutDashboard,
 Users,
 FileText,
 Settings,
 UserPlus,
 UserPen,
 UserRoundX,
 Pencil,
 Trash2,
 Package,
 Eye
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useState, useEffect } from 'react'
import "../CSS/Products.css";
import { useAuth } from "../context/AuthContext";

const livraison = {
    reference:"",
    vente_id:"",
    vehicule_id:"",
    date_livraison:"",
    statut:"",
    adresse_livraison:"",
    montant:""    
}

function Livraisons() {

    // Connected user 
    const { user } = useAuth();

    // List Livraisons
    const [LivraisonsList, setLivraisonsList] = useState([]);

    // Produit selectionner
    const [Livraison, setLivraison] = useState(livraison);

    const tableLivraison = "livraisons";

    // load data
    const [ventes, setVentes] = useState([]);
    const [vehicules, setVehicules] = useState([]);

    async function loadData() {
        const [{ data: ventesData }, { data: vehiculesData }] = await Promise.all([
        supabase.from("ventes").select("*").order("date_vente", { ascending: false }),
        supabase.from("vehicules").select("id, marque, immatriculation, chauffeur"),
        ]);

        setVentes(ventesData || []);
        setVehicules(vehiculesData || []);
    }

    // s'exécute une seule fois au chargement
    useEffect(() => {

        chargerLivraisons();
        loadData();

    }, []);

    async function chargerLivraisons() {

        try {
            await getAllLivraisons();
        } catch (error) {
            console.error("Erreur lors du chargement des Livraisons :", error);
        }
    }

    async function getAllLivraisons(){

        const { data } = await supabase
            .from(tableLivraison)
            .select("*");

        if (!data) return alert("Aucune Livraison");

        setLivraisonsList(data);
    }
    

    async function DeleteLivraison(Livraison){

        if(confirm("Supprimer cette matière première ?")){
            await supabase
            .from(tableLivraison)
            .delete()
            .eq("id", Livraison.id);

            // Mettre à jour la liste des Livraisons après la suppression
            await getAllLivraisons();
            setLivraison(null);
        }
    }

    const [vente, setVente] = useState();
    function getVenteInfo(id){
        const selectedVente = ventes.find((p) => String(p.id) === String(id));
        setVente(selectedVente);
        return vente?.description;
    }

    const [vehicule, setVehicule] = useState();
    async function getVehiculeInfo(id){
        const selectedV = vehicules.find((p) => String(p.id) === String(id));
        setVehicule(selectedV);
    }


    return (
        <div className="product-page">

            <h1>Liste des Livraisons</h1>

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
            <section>
                <div>  
                    <NavLink to="/livraisons/nouveau">
                        <button className="profile"><Package size={20}/>  Nouvelle Livraison</button>
                    </NavLink>                        
                </div>            
            </section>
            }

            <br/>

            <div className="table-container">
                <table className="data-table">
                    <thead className="headerTable">

                    <tr className="header_Table">
                        <th>Reférence</th>
                        <th>Vente info</th>
                        <th>Véhicule</th>
                        <th>Date</th>
                        <th>Adresse</th> 
                        <th>Montant</th>
                        <th>Actions</th>
                    </tr>

                    </thead>


                    <tbody>

                    {LivraisonsList.map((livraison, index) => (

                        <tr key={index}>

                        <td>{livraison.reference}</td>

                        <td>{livraison.vente_id || "--"}</td>

                        <td>{livraison.vehicule_id || "--"}</td>

                        <td>{livraison?.date_livraison.split('T')[0]}</td>

                        <td>{livraison.addresse}</td>

                        <td>{new Intl.NumberFormat("fr-FR").format(livraison.montant) || 0} FG</td>
                        
                        
                        <td>
                            <NavLink to={`/Livraisons/details/${livraison.id}`}>
                                <button className="profileView"><Eye size={20} /></button>
                            </NavLink>
                            {
                            ["Administrateur","Responsable de production", "Magasinier"]
                            .includes(user?.role)
                            &&
                            <NavLink to={`/livraisons/modifier/${livraison.id}`}>
                                <button className="profileEdit"><Pencil size={20} /></button>
                            </NavLink>
                            }

                            {
                            ["Administrateur","Responsable de production", "Magasinier"]
                            .includes(user?.role)
                            &&                             
                             <button className="profileSupp" onClick={() => DeleteLivraison(livraison)}> <Trash2 size={20} /></button>
                            }
                        </td>
                        

                    </tr>

                    ))
                    }

                </tbody>
                </table>
            </div> 

    </div> );
}

export default Livraisons;