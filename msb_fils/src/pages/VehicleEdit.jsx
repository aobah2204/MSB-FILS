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
        user_id: 0
    
    });
    
    const [chauffeur,setChauffeur] = useState(null);
    
    const [chauffeurs, setAllChauffeur] = useState([]);

    const {id}=useParams();

    const navigate=useNavigate();

        function handleChange(e){


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
    
            //console.log(selected);    
            setChauffeur(selected);
            vehicule.user_id = selected.id;
            vehicule.chauffeur = selected.fullname;
        }
    
        async function getAllChauffeur(){
    
            const { data } = await supabase
                    .from("utilisateurs")            
                    .select("*")
                    .eq("role","Chauffeur");
    
            if (!data) return alert("Aucun chauffeurs");
    
            //console.log(data);
            // Alimentation de la liste des chauffeurs
            setAllChauffeur(data);
        }
    
        async function save(e){
    
            e.preventDefault();    
    
            
            const table = "vehicules";
    
            // set chauffeur id
            vehicule.user_id = chauffeur?.id;
            vehicule.chauffeur = chauffeur?.fullname;
    
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

        async function getVehicule(){

            const { data } = await supabase
                    .from("vehicules")            
                    .select("*")
                    .eq("id",id);
    
            if (!data) return alert("Aucun vehicule");
    

            setVehicule({
                marque: data[0].marque,
                modele: data[0].modele,
                immatriculation: data[0].immatriculation,
                annee: data[0].annee,
                chauffeur: data[0].chauffeur,
                kilometrage: data[0].kilometrage,   
                carburant: data[0].carburant,
                user_id: data[0].user_id, 
                id: data[0].id
            });

        }
useEffect(()=>{

    getAllChauffeur();
    getVehicule();
            
},[]);

return (

        <div className="product-page">
            
            <h1>
                Modifier véhicule {id}
            </h1>

            <form className="product_form" onSubmit={save}>

                <div className="grid">

                    <input
                        name="marque"
                        value={vehicule.marque || ""}
                        onChange={handleChange}
                    />

                    <input
                        name="modele"
                        value={vehicule.modele || ""}
                        onChange={handleChange}
                    />

                    <input
                        name="immatriculation"
                        value={vehicule.immatriculation || ""}
                        onChange={handleChange}
                    />

                    <input
                        name="annee"
                        value={vehicule.annee || ""}
                        onChange={handleChange}
                    />

                    <select
                        value={vehicule?.user_id || ""}
                        name="chauffeur"
                        onChange={onChange}
                    >
                        
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
                        onChange={handleChange}
                    />

                    <select
                        name="carburant"
                        value={vehicule.carburant}
                        onChange={handleChange}
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

                </div>                

                
                <br/>
                <button className="profile">
                    Enregistrer
                </button>
            </form>   
        </div>

    )

}


export default VehicleEdit;