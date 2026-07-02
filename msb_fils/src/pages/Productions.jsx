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

const Production = {
    reference:"",
    nom:"",
    categorie:"",
    description:"",
    marque:"",
    unite:"",

    prixAchat:"",
    prixVente:"",
    tva:"20",

    stock:"",
    stockMin:"",

    poids:"",
    longueur:"",
    largeur:"",
    hauteur:"",

    codeBarre:"",
    actif:true
}

function Productions() {

    // Connected user 
    const { user } = useAuth();

    // List Produits
    const [productionsList, setProductionsList] = useState([]);

    // Produit selectionner
    const [production, setProduction] = useState(Production);

    const tableProduction = "productions";

    // s'exécute une seule fois au chargement
    useEffect(() => {

        chargerProductions();

    }, []);

    async function chargerProductions() {

        try {
            await getAllProductions();
        } catch (error) {
            console.error("Erreur lors du chargement des productions :", error);
        }
    }

    async function getAllProductions(){

        const { data } = await supabase
            .from(tableProduction)
            .select("*");

        if (!data) return alert("Aucune productions");

        setProductionsList(data);
    }
    

    async function DeleteProduction(Production){

        if(confirm("Supprimer cette production ?")){
            await supabase
            .from(tableProduction)
            .delete()
            .eq("id", Production.id);

            // Mettre à jour la liste des Productions après la suppression
            await getAllProductions();
            setProduction(null);
        }
    }


    return (
        <div>

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
            <section>
                <div>  
                    <NavLink to="/productions/nouveau">
                        <button className="profile"><Package size={20}/>  Nouvelle Production</button>
                    </NavLink>                        
                </div>            
            </section>
            }

            <h2>Liste des Productions</h2>

            <div className="table-container">
                <table className="data-table">
                    <thead className="headerTable">

                    <tr className="header_Table">
                        <th>Reférence</th>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Prix Achat</th>
                        <th>Prix Vente</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>

                    </thead>


                    <tbody>

                    {productionsList.map((production, index) => (

                        <tr key={index}>

                        <td>{production.reference}</td>

                        <td>{production.nom}</td>

                        <td>{production.categorie}</td>

                        <td>{production.prixAchat}</td>

                        <td>{production.prixVente}</td>

                        <td>{production.actif}</td>
                        
                        <td>
                            <NavLink to={`/productions/details/${production.id}`}>
                                <button className="profile"><Eye size={20} /></button>
                            </NavLink>
                            {
                            ["Administrateur","Responsable de production"]
                            .includes(user?.role)
                            &&
                            <NavLink to={`/productions/modifier/${production.id}`}>
                                <button className="profile"><Pencil size={20} /></button>
                            </NavLink>
                            }

                            {
                            ["Administrateur","Responsable de production"]
                            .includes(user?.role)
                            &&                             
                             <button className="profileSupp" onClick={() => DeleteProduction(production)}> <Trash2 size={20} /></button>
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

export default Productions;