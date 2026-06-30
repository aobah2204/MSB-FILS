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
import "../CSS/Salaries.css";
import { useAuth } from "../context/AuthContext";

const Salarie = {
  nom: "",
  prenom: "",
  adresse: "",
  telephone: "",
  email: "",
  role: ""
};




function Salaries() {

    // Connected user
    const { user } = useAuth();

    // List Salaries
    const [SalariesList, setSalarieList] = useState([]);

    // Salarie selectionner
    const [salarie, setSalarie] = useState(Salarie);

    const tableSalaries = "utilisateurs";

    // s'exécute une seule fois au chargement
    useEffect(() => {

        chargerSalaries();

    }, []);

    async function chargerSalaries() {

        try {
            await getAllSalaries();
        } catch (error) {
            console.error("Erreur lors du chargement des Salaries :", error);
        }
    }

    async function getAllSalaries(){

        const { data } = await supabase
            .from(tableSalaries)
            .select("*");

        if (!data) return alert("Aucun Salaries");

        setSalarieList(data);
    }
    

    async function DeleteSalarie(Salarie){

        await supabase
          .from(tableSalaries)
          .delete()
          .eq("id", Salarie.id);

        // Mettre à jour la liste des Salaries après la suppression
        await getAllSalaries();
        setSalarie(null);
    }

    return (
        <div>

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
                <section>
                    <div>  
                        <NavLink to="/salaries/nouveau">
                            <button className="profile"><UserPlus size={20}/>  Nouveau salarié</button>
                        </NavLink>                        
                    </div>            
                </section>
            }

            <h2>Liste des Salariés</h2>

            <div className="table-container">
                <table className="data-table">
                    <thead className="headerTable">

                    <tr className="header_Table">
                        <th>Nom et Prénom</th>
                        <th>Rôle</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>

                    </thead>


                    <tbody>

                        {SalariesList.map((salarie, index) => (

                            <tr key={index}>

                            <td>{salarie.fullname}</td>


                            <td>{salarie.role}</td>

                            <td>{salarie.telephone}</td>

                            <td>{salarie.email}</td>

                            {
                                ["Administrateur"]
                                .includes(user?.role)
                                &&
                                <td>                                
                                    <NavLink to={`/Salaries/modifier/${salarie.id}`}>
                                        <button className="profile"><UserPen size={20} /></button>
                                    </NavLink>
                                    
                                    <button className="profileSupp" onClick={() => DeleteSalarie(salarie)}> <UserRoundX size={20} /></button>
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

export default Salaries;