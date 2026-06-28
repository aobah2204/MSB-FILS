import {
    useState, useEffect
} from "react";

import {
 Truck,
 Pencil,
 Trash2,
 FileText
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";


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
            <h1>
                Véhicules
            </h1>

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
            <button
                onClick={()=>navigate("/vehicules/nouveau")}
            >
                <Truck size={25}/> Ajouter un véhicule
            </button>
            }



            <table>

                <thead>
                    <tr>
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
                                {v.kilometrage}
                            </td>

                            {
                            ["Administrateur","Responsable de production"]
                            .includes(user?.role)
                            &&
                            <td>
                                <button
                                    onClick={()=>
                                        navigate(`/vehicules/${v.id}`)
                                    }
                                >
                                    <FileText />
                                </button>
                                    
                                <button
                                    onClick={()=>
                                    navigate(`/vehicules/modifier/${v.id}`)
                                    }
                                >
                                    <Pencil />
                                </button>

                                <button
                                    onClick={()=>
                                    DeleteVehicule(v)
                                    }

                                    >
                                    <Trash2 />
                                </button>
                            </td>
                            }
                        </tr>
                    ))
                    }
                </tbody>
            </table>


        </div>

    )


}


export default Vehicles;