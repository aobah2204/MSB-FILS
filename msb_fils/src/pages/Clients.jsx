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

const Client = {
  nom: "",
  prenom: "",
  adresse: "",
  telephone: "",
  email: "",
  societe: ""
};




function Clients() {

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

        await supabase
          .from(tableClients)
          .delete()
          .eq("id", Client.id);

        // Mettre à jour la liste des clients après la suppression
        await getAllClients();
        setClient(null);
    }

    return (
        <div>

            <section>
                <div>  
                    <NavLink to="/clientCreate">
                        <button className="profile"><UserPlus size={20}/>  Nouveau client</button>
                    </NavLink>                        
                </div>            
            </section>

            <h2>Liste des clients</h2>

            <div className="table-container">
                <table>
                    <thead className="headerTable">

                    <tr>
                        <th className="ligneClient">Nom</th>
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

                        <td>
                            <NavLink to={`/clients/modifier/${client.id}`}>
                                <button className="profile"><UserPen size={20} /> Modifier</button>
                            </NavLink>
                             
                             <button className="profileSupp" onClick={() => DeleteClient(client)}> <UserRoundX size={20} /> Supprimer  </button>
                        </td>

                    </tr>

                    ))
                    }

                </tbody>
                </table>
            </div>

            

        
            


    </div> );

}

export default Clients;