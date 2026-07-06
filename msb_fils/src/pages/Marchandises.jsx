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

const Marchandise = {
    reference:"",
    nom:"",
    categorie:"",
    description:"",
    unite:"",

    prixAchat:"",

    stock:"",
    stockMin:"",

    poids:"",
    longueur:"",
    largeur:"",
    hauteur:"",

    actif:true
}

function Marchandises() {

    // Connected user 
    const { user } = useAuth();

    // List Marchandises
    const [marchandisesList, setMarchandisesList] = useState([]);

    // Produit selectionner
    const [marchandise, setmarchandise] = useState(Marchandise);

    const tableMarchandise = "marchandises";

    // s'exécute une seule fois au chargement
    useEffect(() => {

        chargerMarchandises();

    }, []);

    async function chargerMarchandises() {

        try {
            await getAllMarchandises();
        } catch (error) {
            console.error("Erreur lors du chargement des marchandises :", error);
        }
    }

    async function getAllMarchandises(){

        const { data } = await supabase
            .from(tableMarchandise)
            .select("*");

        if (!data) return alert("Aucune Marchandise");

        setMarchandisesList(data);
    }
    

    async function DeleteMarchandise(Marchandise){

        if(confirm("Supprimer cette matière première ?")){
            await supabase
            .from(tableMarchandise)
            .delete()
            .eq("id", Marchandise.id);

            // Mettre à jour la liste des Marchandises après la suppression
            await getAllMarchandises();
            setMarchandise(null);
        }
    }


    return (
        <div className="product-page">

            <h1>Liste des marchandises</h1>

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
            <section>
                <div>  
                    <NavLink to="/marchandises/nouveau">
                        <button className="profile"><Package size={20}/>  Nouvelle marchandise</button>
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
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Description</th>
                        <th>Prix Achat</th> 
                        <th>Actions</th>
                    </tr>

                    </thead>


                    <tbody>

                    {marchandisesList.map((produit, index) => (

                        <tr key={index}>

                        <td>{produit.reference}</td>

                        <td>{produit.nom}</td>

                        <td>{produit.categorie}</td>

                        <td>{produit?.description}</td>

                        <td>{new Intl.NumberFormat("fr-FR").format(produit.prixAchat) || 0} FG</td>
                        
                        
                        <td>
                            <NavLink to={`/marchandises/details/${produit.id}`}>
                                <button className="profile"><Eye size={20} /></button>
                            </NavLink>
                            {
                            ["Administrateur","Responsable de production", "Magasinier"]
                            .includes(user?.role)
                            &&
                            <NavLink to={`/marchandises/modifier/${produit.id}`}>
                                <button className="profile"><Pencil size={20} /></button>
                            </NavLink>
                            }

                            {
                            ["Administrateur","Responsable de production", "Magasinier"]
                            .includes(user?.role)
                            &&                             
                             <button className="profileSupp" onClick={() => DeleteMarchandise(produit)}> <Trash2 size={20} /></button>
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

export default Marchandises;