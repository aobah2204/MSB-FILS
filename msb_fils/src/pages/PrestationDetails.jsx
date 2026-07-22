import {
useParams
} from "react-router-dom";

import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import '../CSS/ProductDetails.css'
import ProductionChart from '../components/ProductionChart'
import { NavLink } from "react-router-dom";



function PrestationDetails(){


    const {id} = useParams();

    const [Prestation, setPrestation] = useState({
        
        reference:"",
        vente_id: "",
        vehicule_id: "",
        prestataire_id: "",
        date_prestation: "",
        statut: "",
        montant: "",
        addresse: "",
        description: ""

    });


    async function getPrestation(){

        const { data } = await supabase
            .from("prestations")
            .select("*")
            .eq("id",id)            
            .maybeSingle();

        if (!data) return alert("Aucune Prestation");

        //getVenteInfo(data?.vente_id);
        getVehiculeInfo(data?.vehicule_id);
        //getPrestaInfo(data?.prestataire_id);
        setPrestation(data);        
    }

    const [vente , setVente] = useState();
    const [vehicule, setVehicule] = useState();
    const [lignes, setLignes] = useState([]);
    const [prestataire, setPrestataire] = useState();


    async function loadData(id) {
        const [{ data: vehiculesData }] = await Promise.all([
        //supabase.from("ventes").select("*").order("date_vente", { ascending: false }),
        supabase.from("vehicules").select("id, marque, immatriculation, chauffeur"),
        //supabase.from("venteproduits").select("id, produit_id, quantite, montant_ligne"),
        ]);

        //setVentes(ventesData || []);
        setVehicules(vehiculesData || []);
        //setLignes(lignesData || []);
    }

    async function getVenteInfo(id){

        const { data } = await supabase
            .from("ventes")
            .select("*")
            .eq("id",id)            
            .maybeSingle();

        //if (!data) return alert("Aucune vente correspondante à la Prestation", id);
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

        if (!data) return alert("Aucune vehicule correspondante à la Prestation", Prestation?.vehicule_id);
        setVehicule(data);
    }

    async function getPrestaInfo(id){

        const { data } = await supabase
            .from("utilisateurs")
            .select("*")
            .eq("id",id)            
            .maybeSingle();

        if (!data) return alert("Aucune prestataire correspondante à la Prestation", Prestation?.prestataire_id);
        setPrestataire(data);
    }


    // s'exécute une seule fois au chargement
    useEffect(() => {

        getPrestation();        

    }, [id]);

    return (

        <div>

            <h1>
                Fiche Prestation #{id}
            </h1>

            <div className="cards">

                <div className="card">

                    <h3>
                        Prestation
                    </h3>

                    <p>
                        {Prestation?.reference}
                    </p>


                    <p>
                        {Prestation?.description}
                    </p>


                    <p>
                        Date : {Prestation.date_prestation.split('T')[0]}
                    </p>

                    <p>
                        Adresse : {Prestation.adresse}
                    </p>

                    <p>
                        Status : {Prestation.statut}
                    </p>

                </div>

                
                <div className="card">

                    <h3>
                        Montants
                    </h3>

                    <div>
                        <label>Cout de la livraison</label>
                        <p>
                            {new Intl.NumberFormat("fr-FR").format(Prestation?.montant) } GNF
                        </p>
                    </div>

                    <div>
                        <label>Coût du carburant</label>
                        <p>
                            {new Intl.NumberFormat("fr-FR").format(Prestation?.montant_carburant) } GNF
                        </p>
                    </div>                                      

                </div>

                <div className="card">

                    <h3>
                        Véhicule
                    </h3>

                    <div>
                        <label>Immatriculation</label>
                        <p>
                            {vehicule?.reference}
                        </p>
                    </div>
                    
                    <div>
                        <label>Chauffeur</label>
                        <p>
                            {vehicule?.chauffeur}
                        </p>
                    </div>

                    <div>
                        <label>Prime voyage</label>
                        <p>
                            {new Intl.NumberFormat("fr-FR").format(Prestation?.prime_voyage) } GNF
                        </p>
                    </div>                                 

                </div>
                

            </div>

        </div>

    )

}


export default PrestationDetails;