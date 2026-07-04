import {
 LayoutDashboard,
 Users,
 FileText,
 Settings,
 UserPlus,
 UserPen,
 UserRoundX,
 Eye
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useState, useEffect } from 'react'
import "../CSS/Clients.css";
import { useAuth } from "../context/AuthContext";

const Client = {
  nom: "",
  prenom: "",
  adresse: "",
  telephone: "",
  email: "",
  societe: ""
};




function Clients() {

    // Connected user
    const { user } = useAuth();

    // List clients
    const [clientsList, setClientList] = useState([]);

    // Client selectionner
    const [client, setClient] = useState(Client);

    const tableClients = "clients";

    // s'exécute une seule fois au chargement
    useEffect(() => {

        chargerClients();

    }, []);

    async function chargerClients() {

        try {
            await getAllClients();
        } catch (error) {
            console.error("Erreur lors du chargement des clients :", error);
        }
    }

    async function getAllClients(){

        const { data } = await supabase
            .from(tableClients)
            .select("*");

        if (!data) return alert("Aucun clients");

        setClientList(data);
    }
    

    async function DeleteClient(Client){

        if(confirm("Supprimer ce client ?")){
            await supabase
            .from(tableClients)
            .delete()
            .eq("id", Client.id);

            // Mettre à jour la liste des clients après la suppression
            await getAllClients();
            setClient(null);
        }
    }

    return (
        <div className="product-page">

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
                <section>
                    <div>  
                        <NavLink to="/clientCreate">
                            <button className="profile"><UserPlus size={20}/>  Nouveau client</button>
                        </NavLink>                        
                    </div>            
                </section>
            }

            <h2>Liste des clients</h2>

            <div className="table-container">
                <table className="data-table">
                    <thead className="headerTable">

                    <tr className="header_Table_clients">
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Société</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>

                    </thead>


                    <tbody>

                        {clientsList.map((client, index) => (

                            <tr key={index}>

                            <td>{client.nom}</td>

                            <td>{client.prenom}</td>

                            <td>{client.societe}</td>

                            <td>{client.telephone}</td>

                            <td>{client.email}</td>

                            {
                                ["Administrateur","Responsable de production"]
                                .includes(user?.role)
                                &&
                                <td>
                                    <NavLink to={`/clients/details/${client.id}`}>
                                        <button className="profile"><Eye size={20} /></button>
                                    </NavLink>
                                    
                                    <NavLink to={`/clients/modifier/${client.id}`}>
                                        <button className="profile"><UserPen size={20} /></button>
                                    </NavLink>
                                    
                                    <button className="profileSupp" onClick={() => DeleteClient(client)}> <UserRoundX size={20} /></button>
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

export default Clients;