import {
    useParams,
    useNavigate
} from "react-router-dom";

import { useState, useEffect } from "react";
import { supabase } from "../supabase";


function VehicleEdit(){


    const [vehicule,setVehicule]=useState({
    
            marque:"",
            modele:"",
            immatriculation:"",
            annee:"",
            chauffeur:"",
            kilometrage:"",
            carburant:"Diesel",
            user_id: 0,
    
    });
    
    const [chauffeur,setChauffeur] = useState(null);
    
    const [chauffeurs, setAllChauffeur] = useState([]);

    const {id}=useParams();

    const navigate=useNavigate();

        function change(e){
    
            setVehicule({
    
                ...vehicule,
    
                [e.target.name]:
                e.target.value
    
            });
    
        }
    
        function onChange(e){
    
    
            const selected = chauffeurs.find(
    
                ch => ch.id == e.target.value
    
            );
    
            console.log(selected);
    
            setChauffeur(selected);
        }
    
        async function getAllChauffeur(){
    
            const { data } = await supabase
                    .from("utilisateurs")            
                    .select("*")
                    .eq("role","Chauffeur");
    
            if (!data) return alert("Aucun chauffeurs");
    
            console.log(data);
            // Alimentation de la liste des chauffeurs
            setAllChauffeur(data);
        }
    
        async function save(e){
    
            e.preventDefault();
    
    
            
            const table = "vehicules";
    
            // set chauffeur id
            vehicule.user_id = chauffeur.id;
            vehicule.chauffeur = chauffeur.fullname;
    
            console.log(vehicule);
    
            
            const { error } = await supabase.from(table).update(vehicule)
            // IMPORTANT :
            .eq("id", vehicule.id);
            
            if(!error){
                alert("Véhicule modifié");
            }else{
                alert("Véhicule non modifié : " + error.message);
            }
            
            navigate("/vehicules");
    
        }
    
        function setUserId(e){
    
            e.preventDefault();
    
            console.log(e);
    
            if(chauffeur){
                setChauffeur(e.target.value);
            }
        }

        async function getVehicule(id){

            const { data } = await supabase
                    .from("vehicules")            
                    .select("*")
                    .eq("id",id);
    
            if (!data) return alert("Aucun vehicule");
    
            console.log(data);

            setVehicule(data);
        }

        useEffect(()=>{

            getAllChauffeur();
            getVehicule(id);
            
        },[id]);

    return (

        <div>


            <h1>
                Modifier véhicule {id}
            </h1>

            <form onSubmit={save}>

                <input
                    name="marque"
                    value={vehicule.marque || ""}
                    onChange={change}
                />

                <input
                    name="modele"
                    value={vehicule.modele || ""}
                    onChange={change}
                />

                <input
                    name="immatriculation"
                    value={vehicule.immatriculation || ""}
                    onChange={change}
                />

                <input
                    name="annee"
                    value={vehicule.annee || ""}
                    onChange={change}
                />

                <select
                    value={chauffeur?.id}
                    name="chauffeur"
                    onChange={onChange}
                >
                    <option value="">
                    -- Choisir un chauffeur --
                    </option>
                    {
                        chauffeurs.map((c)=>(

                            <option
                                key={c.id}
                                value={c.id}
                            >
                                {c.fullname}
                            </option>
                        ))
                    }


                </select>


                <input
                    name="kilometrage"
                    type="int"
                    value={vehicule.kilometrage || ""}
                    onChange={change}
                />

                <select
                    name="carburant"
                    value={vehicule.carburant}
                    onChange={change}
                >

                    <option>
                    Diesel
                    </option>

                    <option>
                    Essence
                    </option>

                    <option>
                    Electrique
                    </option>

                </select>
                <br/>
                <button>
                    Enregistrer
                </button>
            </form>

            


        </div>

    )

}


export default VehicleEdit;