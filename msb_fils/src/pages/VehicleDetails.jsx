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

        getChauffeur(data);
        getLivraisonsVehicule(data);
        getDepensesVehicule(data);
        
    }

    async function getChauffeur(vehicule){

        const { data } = await supabase
            .from("utilisateurs")            
            .select("*")
            .eq("id",vehicule.user_id)
            .maybeSingle();

        if (!data) return alert("Aucun chauffeur");

        setChauffeur(data);        
        //console.log(chauffeur);

    }

    // Get livraisons vehicules
    const [livraisons, setLivraisons] = useState([]);
    async function getLivraisonsVehicule(vehicule){

        const { data } = await supabase
            .from("livraisons")            
            .select("*")
            .eq("vehicule_id",vehicule?.id);

        if (!data) return alert("Aucune livraison effectuée");
        setLivraisons(data);
    }


    // Get depenses véhicules
    const [depenses, setDepenses] = useState([]);
    async function getDepensesVehicule(vehicule){

        const { data } = await supabase
            .from("depenses")            
            .select("*")
            .eq("vehicule_id",vehicule.id);

        if (!data) return alert("Aucune dépense effectuée");
        setDepenses(data);
    }

    function formatDate(value) {
        if (!value) return "—";

        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
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


            <div className="cards">

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

                    <p>
                        {chauffeur?.telephone}
                    </p>
                    <p>
                        {chauffeur?.adresse}
                    </p>


                </div>

            </div>

            <br/>
            
            <div className="cards">                
                <div className="table-container card" >
                    <h3>Total des livraisons</h3>
                    <table className="data-table">
                        <thead className="headerTable">

                        <tr className="header_Table">
                            <th>Reférence</th>
                            <th>Vente</th>
                            <th>Date</th>
                            <th>Adresse</th> 
                            <th>Montant</th>
                        </tr>

                        </thead>


                        <tbody>

                        {livraisons.map((livraison, index) => (

                            <tr key={index}>

                            <td>{livraison.reference}</td>

                            <td>{livraison.vente_id || "--"}</td>

                            <td>{livraison?.date_livraison.split('T')[0]}</td>

                            <td>{livraison.addresse}</td>

                            <td>{new Intl.NumberFormat("fr-FR").format(livraison.montant) || 0} FG</td>  

                        </tr>

                        ))
                        }

                    </tbody>
                    </table>
                </div>

                <div className="table-container card">
                    <h3>Total des dépenses</h3>
                    <table className="data-table">
                        <thead className="header_Table">
                            <tr>
                            <th>Référence</th>
                            <th>catégorie</th>
                            <th>Date</th>
                            <th>Montant total</th>
                            <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depenses.map((Depense) => (
                            <tr key={Depense.id}>
                                <td>{Depense.reference || "—"}</td>
                                <td>{Depense.categorie}</td>
                                <td>{formatDate(Depense.date_depense) || "—"}</td>
                                <td>{new Intl.NumberFormat("fr-FR").format(Depense.montant) || 0 } FG</td>
                                <td>{Depense.statut || "—"}</td>                            
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div> 
                

            </div>

            



        </div>

    )

}


export default VehicleDetails;