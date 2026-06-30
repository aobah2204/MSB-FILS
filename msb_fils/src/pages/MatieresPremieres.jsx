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

const matierePremiere = {
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

function MatieresPremieres() {

    // Connected user 
    const { user } = useAuth();

    // List matierespremieres
    const [MatieresPremieresList, setMatieresPremiereList] = useState([]);

    // Produit selectionner
    const [MatierePremiere, setMatierePremiere] = useState(matierePremiere);

    const tableMatieresPremiere = "matierespremieres";

    // s'exécute une seule fois au chargement
    useEffect(() => {

        chargerMatieresPremieres();

    }, []);

    async function chargerMatieresPremieres() {

        try {
            await getAllMatieresPremieres();
        } catch (error) {
            console.error("Erreur lors du chargement des matières :", error);
        }
    }

    async function getAllMatieresPremieres(){

        const { data } = await supabase
            .from(tableMatieresPremiere)
            .select("*");

        if (!data) return alert("Aucune matière");

        setMatieresPremiereList(data);
    }
    

    async function DeleteMatierePremiere(MatierePremiere){

        await supabase
          .from(tableMatieresPremiere)
          .delete()
          .eq("id", MatierePremiere.id);

        // Mettre à jour la liste des MatieresPremieres après la suppression
        await getAllMatieresPremieres();
        setMatierePremiere(null);
    }


    return (
        <div>

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
            <section>
                <div>  
                    <NavLink to="/matierespremieres/nouveau">
                        <button className="profile"><Package size={20}/>  Nouvelle matière</button>
                    </NavLink>                        
                </div>            
            </section>
            }

            <h2>Liste des matières premières</h2>

            <div className="table-container">
                <table className="data-table">
                    <thead className="headerTable">

                    <tr className="header_Table">
                        <th>Reférence</th>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Prix Achat</th>                        
                        <th>Actions</th>
                    </tr>

                    </thead>


                    <tbody>

                    {MatieresPremieresList.map((produit, index) => (

                        <tr key={index}>

                        <td>{produit.reference}</td>

                        <td>{produit.nom}</td>

                        <td>{produit.categorie}</td>

                        <td>{produit.prixAchat}</td>
                        
                        
                        <td>
                            <NavLink to={`/matierespremieres/details/${produit.id}`}>
                                <button className="profile"><Eye size={20} /></button>
                            </NavLink>
                            {
                            ["Administrateur","Responsable de production"]
                            .includes(user?.role)
                            &&
                            <NavLink to={`/matierespremieres/modifier/${produit.id}`}>
                                <button className="profile"><Pencil size={20} /></button>
                            </NavLink>
                            }

                            {
                            ["Administrateur","Responsable de production"]
                            .includes(user?.role)
                            &&                             
                             <button className="profileSupp" onClick={() => DeleteMatierePremiere(produit)}> <Trash2 size={20} /></button>
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

export default MatieresPremieres;