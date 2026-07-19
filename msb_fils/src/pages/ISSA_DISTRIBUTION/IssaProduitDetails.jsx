import {
useParams
} from "react-router-dom";

import { supabase } from "../../supabase";
import { useState, useEffect } from "react";
import ProductionChart from '../../components/ProductionChart'
import { NavLink } from "react-router-dom";



function IssaProduitDetails(){


    const {id} = useParams();

    const [product, setProduct] = useState({
        
        reference:"",
        nom:"",
        categorie:"",
        description:"",
        marque:"",
        unite:"",

        prixAchat:"",
        prixVente:"",
        tva:"20",

        actif:true

    });


    async function getProduct(){

        const { data } = await supabase
            .from("issaproducts")
            .select("*")
            .eq("id",id)            
            .maybeSingle();

        if (!data) return alert("Aucun Produit");

        console.log(" ---------Produit :",data);

        setProduct(data);
        
    }   


    // s'exécute une seule fois au chargement
    useEffect(() => {

        getProduct();
        //getNbrProductionsBySite();

    }, []);

    return (

        <div>

            <h1>
                Fiche Produit #{id}
            </h1>

            <div className="cards">

                <div className="card">

                    <h3>
                        Informations
                    </h3>

                    <p>
                        {product?.nom}
                    </p>


                    <p>
                        {product?.reference}
                    </p>


                    <p>
                        Description : {product.description} 
                        <br/>
                        Prix d'achat : {new Intl.NumberFormat("fr-FR").format(product.prixAchat) }  GNF                      
                    </p>

                </div>

            </div>

        </div>

    )

}


export default IssaProduitDetails;