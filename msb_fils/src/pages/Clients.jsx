import {
 LayoutDashboard,
 Users,
 FileText,
 Settings,
 UserPlus
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

    const [clientsList, setClientList] = useState([]);

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

    const table = "clients";

    const { data } = await supabase
        .from(table)
        .select("*");

    if (!data) return alert("Aucun clients");

    setClientList(data);
    }

    return (
        <div>

            <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <NavLink to="/clientCreate" className="flex items-center justify-center gap-2 text-blue-500 hover:text-blue-700">
                        <UserPlus size={20}/>
                        Nouveau client
                    </NavLink>
                </div>
            
            </section>


            <h2>Liste des clients</h2>

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

                    <td> <button> Modifier  </button> <button className="suppButton"> Supprimer  </button></td>

                    </tr>

                ))
                }


                </tbody>


            </table>

        
            


    </div> );

}

export default Clients;