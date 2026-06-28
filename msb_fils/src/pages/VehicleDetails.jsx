import {
useParams
} from "react-router-dom";

import { supabase } from "../supabase";
import { useState, useEffect } from "react";

function VehicleDetails(){


    const {id} = useParams();

    const [vehicule, setVehicule] = useState({
        marque:"",
        modele:"",
        immatriculation:"",
        annee:"",
        chauffeur:"",
        kilometrage:"",
        carburant:"",

    });

    const [chauffeur, setChauffeur] = useState({
        fullname:"",
        telephone: "",
        email:"",
        role: "",
        adresse: "",
    });

    async function getVehicule(){

        const { data } = await supabase
            .from("vehicules")
            .select("*")
            .eq("id",id)            
            .maybeSingle();

        if (!data) return alert("Aucun véhicule");

        setVehicule(data);
        console.log(data);

        getChauffeur(data);
        
    }

    async function getChauffeur(vehicule){

        const { data } = await supabase
            .from("utilisateurs")            
            .select("*")
            .eq("id",vehicule.user_id)
            .maybeSingle();

        if (!data) return alert("Aucun chauffeur");

        setChauffeur(data);
        console.log(chauffeur);

    }

    // s'exécute une seule fois au chargement
    useEffect(() => {

        getVehicule();

    }, []);

    return (

        <div>

            <h1>
                Fiche véhicule #{id}
            </h1>

            <div className="card">

            <h3>
                Informations
            </h3>

            <p>
                {vehicule?.marque}
            </p>


            <p>
                {vehicule?.immatriculation}
            </p>


            <p>
                Kilométrage : {vehicule.kilometrage} km
            </p>


        </div>



        <div className="card">


            <h3>
                Chauffeur
            </h3>


            <p>
                {chauffeur?.fullname}
            </p>


        </div>




        <div className="card">


            <h3>
                Maintenance
            </h3>


            <ul>

                <li>
                    Vidange - 80000 km
                </li>

                <li>
                    Pneus - 75000 km
                </li>

            </ul>


        </div>




        <div className="card">


            <h3>
                Consommation
            </h3>


            <p>
                Diesel : 9.5 L / 100 km
            </p>


            <p>
                Dernier plein : 15/06/2026
            </p>


            </div>


        </div>

    )

}


export default VehicleDetails;