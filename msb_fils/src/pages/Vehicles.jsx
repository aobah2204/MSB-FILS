import {
    useState, useEffect
} from "react";

import {
 Truck,
 Pencil,
 Trash2,
 FileText,
 Eye
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import '../CSS/Vehicule.css';
import "../CSS/Clients.css";
import { NavLink } from "react-router-dom";


function Vehicles(){


    // Connected user 
    const { user } = useAuth();

    const navigate = useNavigate();


    const [vehicle,setVehicle]=useState(
    {
        id:0,
        marque:"",
        modele:"",
        immatriculation:"",
        chauffeur:"",
        kilometrage:0,
        etat:"Disponible"
    });

    const [vehicles,setVehicles]=useState([]);



    function supprimer(id){

        if(confirm("Supprimer ce véhicule ?")){
            setVehicles(
                vehicles.filter(v=>v.id!==id)
            )
        }
    }

    // s'exécute une seule fois au chargement
    useEffect(() => {
    
        chargerVehicules();
    
    }, []);
    
    async function chargerVehicules() {
    
        try {
            await getAllVehicules();
        } catch (error) {
            console.error("Erreur lors du chargement des véhicules : ", error);
        }
    }
    
    async function getAllVehicules(){
    
        const { data } = await supabase
            .from("vehicules")
            .select("*");
    
        if (!data) return alert("Aucun produits");
    
        setVehicles(data);
    }
        
    
    async function DeleteVehicule(Vehicule){
    
        if(confirm("Supprimer ce véhicule ?")){
            await supabase
            .from("vehicules")
            .delete()
            .eq("id", Vehicule.id);
        }
    
        // Mettre à jour la liste des Véhicules après la suppression
        await getAllVehicules();
        setVehicle(null);
    }
    



    return (

        <div>            

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
            <section>
                    <div>  
                        <NavLink to="/vehicules/nouveau">
                            <button className="profile"><Truck size={20}/>  Ajouter un véhicule </button>
                        </NavLink>                        
                    </div>            
            </section>
            
            }
            <h2>
                Liste des Véhicules
            </h2>

            <div className="table-container">

            <table className="data-table">

                <thead>
                    <tr className="header_Table">
                        <th>Véhicule</th>
                        <th>Immatriculation</th>
                        <th>Chauffeur</th>
                        <th>KM</th>
                        <th>Actions</th>
                    </tr>
                </thead>


                <tbody>
                    {
                        vehicles.map(v=>(

                        <tr key={v.id}>
                            <td>
                                {v.marque} {v.modele}
                            </td>

                            <td>
                                {v.immatriculation}
                            </td>

                            <td>
                                {v.chauffeur}
                            </td>

                            <td>
                                {new Intl.NumberFormat("fr-FR").format(v.kilometrage)} 
                            </td>

                            
                            <td>
                                <button className="profile" 
                                    onClick={()=>
                                        navigate(`/vehicules/${v.id}`)
                                    }
                                >
                                    <Eye />
                                </button>
                                
                                {
                                ["Administrateur","Responsable de production"]
                                .includes(user?.role)
                                &&
                                    <button className="profile" 
                                        onClick={()=>
                                        navigate(`/vehicules/modifier/${v.id}`)
                                        }
                                    >
                                        <Pencil />
                                    </button>
                                }

                                {
                                ["Administrateur","Responsable de production"]
                                .includes(user?.role)
                                &&
                                    <button className="profileSupp" 
                                        onClick={()=>
                                        DeleteVehicule(v)
                                        }

                                        >
                                        <Trash2 />
                                    </button>
                                }
                            </td>
                            
                        </tr>
                    ))
                    }
                </tbody>
                </table>
            </div>

            


        </div>

    )


}


export default Vehicles;