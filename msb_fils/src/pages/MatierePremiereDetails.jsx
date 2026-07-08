import {
useParams
} from "react-router-dom";

import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import '../CSS/ProductDetails.css'
import ProductionChart from '../components/ProductionChart'
import { NavLink } from "react-router-dom";



function MatierePremiereDetails(){


    const {id} = useParams();

    const [MatierePremiere, setMatierePremiere] = useState({
        
        reference:"",
        nom:"",
        categorie:"",
        description:"",
        marque:"",
        unite:"",

        fournisseur:"",
        fournisseur_id:"",

        stock:"",
        stockMin:"",

        poids:"",
        unite_poids: "",
        longueur:"",
        unite_longueur: "",
        largeur:"",
        unite_largeur: "",
        hauteur:"",
        unite_hauteur: "",

        codeBarre:"",
        actif:true

    });


    async function getMatierePremiere(){

        const { data } = await supabase
            .from("matierespremieres")
            .select("*")
            .eq("id",id)            
            .maybeSingle();

        if (!data) return alert("Aucune matière");

        setMatierePremiere(data);
        console.log(data);
        
    }


    // s'exécute une seule fois au chargement
    useEffect(() => {

        getMatierePremiere();

    }, []);

    return (

        <div>

            <h1>
                Fiche matière #{id}
            </h1>

            <div className="cards">

                <div className="card">

                    <h3>
                        Informations
                    </h3>

                    <p>
                        {MatierePremiere?.nom}
                    </p>


                    <p>
                        {MatierePremiere?.reference}
                    </p>


                    <p>
                        Description : {MatierePremiere.description}
                    </p>

                    <p>
                        Fournisseur : {MatierePremiere.fournisseur}
                    </p>

                </div>

                

            </div>

            

        </div>

    )

}


export default MatierePremiereDetails;