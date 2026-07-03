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

        console.log(" ---------Produit :",data);

        setProduct(data);
        
    }

    const [nbrProduction, setNbrProduction] = useState(0);
    const [productions, setProductions] = useState([]);

    async function getNbrProductionsBySite(){

        const { data } = await supabase
            .from("productions")
            .select("*")
            .eq("produit_id",id);    
            
        console.log(" ---------Produit id :",id);
        console.log(" ---------Nbr Production :",data);
        setProductions(data);

        if (!data) return alert("Aucune Production");
        setNbrProduction(data.reduce((acc, curr) => acc + parseInt(curr.quantite), 0));
        
    }


    // s'exécute une seule fois au chargement
    useEffect(() => {

        getProduct();
        getNbrProductionsBySite();

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
                        <p>
                            Nombre de productions : {nbrProduction}
                        </p>
                </div> 
            </div>

        </div>

    )

}


export default ProductDetails;