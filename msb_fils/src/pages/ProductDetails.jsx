import {
useParams
} from "react-router-dom";

import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import '../CSS/ProductDetails.css'
import ProductionChart from '../components/ProductionChart'
import { NavLink } from "react-router-dom";



function ProductDetails(){


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


    async function getProduct(){

        const { data } = await supabase
            .from("products")
            .select("*")
            .eq("id",id)            
            .maybeSingle();

        if (!data) return alert("Aucun Produit");

        setProduct(data);
        console.log(data);
        
    }


    // s'exécute une seule fois au chargement
    useEffect(() => {

        getProduct();

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
                    </p>

                </div>

                <div className="card">

                    <h3>
                        Dimensions
                    </h3>

                    <div>
                        <label>Poids</label>
                        <p>
                            {product?.poids} {product?.unite_poids}
                        </p>
                    </div>

                    <div>
                        <label>Longueur</label>
                        <p>
                            {product?.longueur} {product?.unite_longueur}
                        </p>
                    </div>

                    <div>
                        <label>Largeur</label>
                        <p>
                            {product?.largeur} {product?.unite_largeur}
                        </p>
                    </div>

                    <div>
                        <label>Hauteur</label>
                        <p>
                            {product?.hauteur} {product?.unite_hauteur}
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


export default ProductDetails;