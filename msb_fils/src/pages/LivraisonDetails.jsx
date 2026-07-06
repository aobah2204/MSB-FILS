import {
useParams
} from "react-router-dom";

import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import '../CSS/ProductDetails.css'
import ProductionChart from '../components/ProductionChart'
import { NavLink } from "react-router-dom";



function LivraisonDetails(){


    const {id} = useParams();

    const [Livraison, setLivraison] = useState({
        
        reference:"",
        vente_id: "",
        vehicule_id: "",
        date_livraison: "",
        statut: "",
        montant: "",
        addresse: "",
        libelle: ""

    });


    async function getLivraison(){

        const { data } = await supabase
            .from("livraisons")
            .select("*")
            .eq("id",id)            
            .maybeSingle();

        if (!data) return alert("Aucune livraison");

        getVenteInfo(data?.vente_id);
        getVehiculeInfo(data?.vehicule_id);
        setLivraison(data);        
    }

    const [vente , setVente] = useState();
    const [vehicule, setVehicule] = useState();
    const [lignes, setLignes] = useState([]);

    async function loadData(id) {
        const [{ data: ventesData }, { data: vehiculesData } , { data: lignesData }] = await Promise.all([
        supabase.from("ventes").select("*").order("date_vente", { ascending: false }),
        supabase.from("vehicules").select("id, marque, immatriculation, chauffeur"),
        supabase.from("venteproduits").select("id, produit_id, quantite, montant_ligne"),
        ]);

        setVentes(ventesData || []);
        setVehicules(vehiculesData || []);
        setLignes(lignesData || []);
    }

    async function getVenteInfo(id){

        const { data } = await supabase
            .from("ventes")
            .select("*")
            .eq("id",id)            
            .maybeSingle();

        //if (!data) return alert("Aucune vente correspondante à la livraison", id);
        setVente(data);

        const { dataProduits } = await supabase
            .from("venteproduits")
            .select("*")
            .eq("id",id);

        //if (!dataProduits) return alert("Aucun produits associé à la vente", id);
        setLignes(dataProduits);
    }

    async function getVehiculeInfo(id){

        const { data } = await supabase
            .from("vehicules")
            .select("*")
            .eq("id",id)            
            .maybeSingle();

        if (!data) return alert("Aucune vehicule correspondante à la livraison", Livraison?.vehicule_id);
        setVehicule(data);
    }


    // s'exécute une seule fois au chargement
    useEffect(() => {

        getLivraison();        

    }, [id]);

    return (

        <div>

            <h1>
                Fiche livraison #{id}
            </h1>

            <div className="cards">

                <div className="card">

                    <h3>
                        Livraison
                    </h3>

                    <p>
                        {Livraison?.reference}
                    </p>


                    <p>
                        {Livraison?.libelle}
                    </p>


                    <p>
                        Date : {Livraison.date_livraison.split('T')[0]}
                    </p>

                    <p>
                        Adresse : {Livraison.addresse}
                    </p>

                </div>

                <div className="card">

                    <h3>
                        Véhicule
                    </h3>

                    <div>
                        <label>Immatriculation</label>
                        <p>
                            {vehicule?.immatriculation} {vehicule?.marque}
                        </p>
                    </div>

                    <div>
                        <label>Chauffeur</label>
                        <p>
                            {vehicule?.chauffeur} 
                        </p>
                    </div>                    

                </div>

                <div className="card">

                    <h3>
                        Vente
                    </h3>

                    <div>
                        <label>Réference</label>
                        <p>
                            {vente?.reference}
                        </p>
                    </div>
                    <div>
                        <label>Description</label>
                        <p>
                            {vente?.description}
                        </p>
                    </div>

                    <div>
                        <label>Date</label>
                        <p>
                            {vente?.date_vente.split('T')[0]} 
                        </p>
                    </div>

                                  

                </div>

            </div>

        </div>

    )

}


export default LivraisonDetails;