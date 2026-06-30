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

        prixAchat:"",
        prixVente:"",
        tva:"20",

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

                </div>

                <div className="card">

                    <h3>
                        Dimensions
                    </h3>

                    <div>
                        <label>Poids</label>
                        <p>
                            {MatierePremiere?.poids} {MatierePremiere?.unite_poids}
                        </p>
                    </div>

                    <div>
                        <label>Longueur</label>
                        <p>
                            {MatierePremiere?.longueur} {MatierePremiere?.unite_longueur}
                        </p>
                    </div>

                    <div>
                        <label>Largeur</label>
                        <p>
                            {MatierePremiere?.largeur} {MatierePremiere?.unite_largeur}
                        </p>
                    </div>

                    <div>
                        <label>Hauteur</label>
                        <p>
                            {MatierePremiere?.hauteur} {MatierePremiere?.unite_hauteur}
                        </p>
                    </div>


                </div>

            </div>

            <div className="cards">

                <div className="card">


                    <h3>
                        Production
                    </h3>


                    <ul>

                        <li>
                            Matière première : 
                        </li>

                        <li>
                            Coût de production : 
                        </li>

                    </ul>


                </div> 

                <div className="card">

                    <h3>
                        Vente 
                    </h3>


                    <p>
                        Total : 
                    </p>


                    <p>
                        Coût de vente:
                    </p>


                </div>

            </div>

            <div className="cards">

                <div className="card">
                    <h3>
                        Production
                        </h3>
                        <ProductionChart />
                </div> 
            </div>

        </div>

    )

}


export default MatierePremiereDetails;