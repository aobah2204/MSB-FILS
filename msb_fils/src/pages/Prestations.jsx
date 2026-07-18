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

const prestation = {
    reference:"",
    prestataire_id:"",
    vehicule_id:"",
    date_Prestation:"",
    statut:"",
    adresse_Prestation:"",
    montant:""    
}

function Prestations() {

    // Connected user 
    const { user } = useAuth();

    // List Prestations
    const [prestationsList, setPrestationsList] = useState([]);

    // Produit selectionner
    const [Prestation, setPrestation] = useState(prestation);

    const tablePrestation = "prestations";

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

        chargerPrestations();
        loadData();

    }, []);

    async function chargerPrestations() {

        try {
            await getAllPrestations();
        } catch (error) {
            console.error("Erreur lors du chargement des Prestations :", error);
        }
    }

    async function getAllPrestations(){

        const { data } = await supabase
            .from(tablePrestation)
            .select("*");

        if (!data) return alert("Aucune Prestation");

        setPrestationsList(data);
    }
    

    async function DeletePrestation(Prestation){

        if(confirm("Supprimer cette matière première ?")){
            await supabase
            .from(tablePrestation)
            .delete()
            .eq("id", Prestation.id);

            // Mettre à jour la liste des Prestations après la suppression
            await getAllPrestations();
            setPrestation(null);
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

            <h1>Liste des Prestations</h1>

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
            <section>
                <div>  
                    <NavLink to="/prestations/nouveau">
                        <button className="profile"><Package size={20}/>  Nouvelle Prestation</button>
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

                    {prestationsList.map((Prestation, index) => (

                        <tr key={index}>

                        <td>{Prestation.reference}</td>

                        <td>{Prestation.vente_id || "--"}</td>

                        <td>{Prestation.vehicule_id || "--"}</td>

                        <td>{Prestation?.date_Prestation.split('T')[0]}</td>

                        <td>{Prestation.addresse}</td>

                        <td>{new Intl.NumberFormat("fr-FR").format(Prestation.montant) || 0} FG</td>
                        
                        
                        <td>
                            <NavLink to={`/prestations/details/${Prestation.id}`}>
                                <button className="profileView"><Eye size={20} /></button>
                            </NavLink>
                            {
                            ["Administrateur","Responsable de production", "Magasinier"]
                            .includes(user?.role)
                            &&
                            <NavLink to={`/prestations/modifier/${Prestation.id}`}>
                                <button className="profileEdit"><Pencil size={20} /></button>
                            </NavLink>
                            }

                            {
                            ["Administrateur","Responsable de production", "Magasinier"]
                            .includes(user?.role)
                            &&                             
                             <button className="profileSupp" onClick={() => DeletePrestation(Prestation)}> <Trash2 size={20} /></button>
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

export default Prestations;