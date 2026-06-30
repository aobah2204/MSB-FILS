import {
 LayoutDashboard,
 Users,
 FileText,
 Settings,
 UserPlus,
 UserPen,
 UserRoundX
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useState, useEffect } from 'react'
import "../CSS/Clients.css";
import { useAuth } from "../context/AuthContext.jsx";

const Fournisseur = {
  nom: "",
  prenom: "",
  adresse: "",
  telephone: "",
  email: "",
  societe: ""
};




function Fournisseurs() {

    // Connected user
    const { user } = useAuth();

    // List Fournisseurs
    const [FournisseursList, setFournisseurList] = useState([]);

    // Fournisseur selectionner
    const [fournisseur, setFournisseur] = useState(Fournisseur);

    const tableFournisseurs = "fournisseurs";

    // s'exécute une seule fois au chargement
    useEffect(() => {

        chargerFournisseurs();

    }, []);

    async function chargerFournisseurs() {

        try {
            await getAllFournisseurs();
        } catch (error) {
            console.error("Erreur lors du chargement des Fournisseurs :", error);
        }
    }

    async function getAllFournisseurs(){

        const { data } = await supabase
            .from(tableFournisseurs)
            .select("*");

        if (!data) return alert("Aucun Fournisseurs");

        setFournisseurList(data);
    }
    

    async function DeleteFournisseur(Fournisseur){

        await supabase
          .from(tableFournisseurs)
          .delete()
          .eq("id", Fournisseur.id);

        // Mettre à jour la liste des Fournisseurs après la suppression
        await getAllFournisseurs();
        setFournisseur(null);
    }

    return (
        <div>

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
                <section>
                    <div>  
                        <NavLink to="/fournisseurs/nouveau">
                            <button className="profile"><UserPlus size={20}/>  Nouveau Fournisseur</button>
                        </NavLink>                        
                    </div>            
                </section>
            }

            <h2>Liste des Fournisseurs</h2>

            <div className="table-container">
                <table className="data-table">
                    <thead className="headerTable">

                    <tr className="header_Table">
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Société</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>

                    </thead>


                    <tbody>

                        {FournisseursList.map((Fournisseur, index) => (

                            <tr key={index}>

                            <td>{Fournisseur.nom}</td>

                            <td>{Fournisseur.prenom}</td>

                            <td>{Fournisseur.societe}</td>

                            <td>{Fournisseur.telephone}</td>

                            <td>{Fournisseur.email}</td>

                            {
                                ["Administrateur","Responsable de production"]
                                .includes(user?.role)
                                &&
                                <td>                                
                                    <NavLink to={`/fournisseurs/modifier/${Fournisseur.id}`}>
                                        <button className="profile"><UserPen size={20} /></button>
                                    </NavLink>
                                    
                                    <button className="profileSupp" onClick={() => DeleteFournisseur(Fournisseur)}> <UserRoundX size={20} /></button>
                                </td>
                            }
                        </tr>

                        ))
                        }

                    </tbody>
                </table>
            </div>

            

        
            


    </div> );

}

export default Fournisseurs;