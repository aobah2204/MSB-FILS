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
        getPrestationsVehicule(data);
        getDepensesVehicule(data);
        getEncaissementsVehicule(data);
        
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

    // Get prestations vehicules
    const [prestations, setPrestations] = useState([]);
    async function getPrestationsVehicule(vehicule){

        const { data } = await supabase
            .from("prestations")            
            .select("*")
            .eq("vehicule_id",vehicule?.id);

        if (!data) return alert("Aucune prestation effectuée");
        setPrestations(data);
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

    // Get encaissements véhicules
    const [encaissements, setEncaissements] = useState([]);
    async function getEncaissementsVehicule(vehicule){

        const { data } = await supabase
            .from("encaissements")            
            .select("*")
            .eq("vehicule_id",vehicule.id);

        if (!data) return alert("Aucun encaissement effectué");
        setEncaissements(data);
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

                <div className="card" style={{width:"100%", textAlign:"left"}}>

                    <h3>
                        Statistiques
                    </h3>

                    <p>
                        Total livraisons : {livraisons.length} :  {new Intl.NumberFormat("fr-FR").format(livraisons.reduce((acc, livraison) => acc + livraison.montant, 0))} FG
                    </p>

                    <p>
                        Total prestations : {prestations.length} :  {new Intl.NumberFormat("fr-FR").format(prestations.reduce((acc, prestation) => acc + prestation.montant, 0))} FG
                    </p>    

                    <p>
                        Total dépenses : {depenses.length} :  {new Intl.NumberFormat("fr-FR").format(depenses.reduce((acc, depense) => acc + depense.montant, 0))} FG
                    </p>

                    <p>
                        Total encaissements : {encaissements.length} ,  {new Intl.NumberFormat("fr-FR").format(encaissements.reduce((acc, encaissement) => acc + encaissement.montant, 0))} FG
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

                <div className="table-container card" >
                    <h3>Total des prestations</h3>
                    <table className="data-table">
                        <thead className="headerTable">

                        <tr className="header_Table">
                            <th>Reférence</th>
                            <th>Date</th>
                            <th>Adresse</th> 
                            <th>Montant</th>
                        </tr>

                        </thead>


                        <tbody>

                        {prestations.map((prestation, index) => (

                            <tr key={index}>

                            <td>{prestation.reference}</td>


                            <td>{prestation?.date_prestation.split('T')[0]}</td>

                            <td>{prestation.addresse}</td>

                            <td>{new Intl.NumberFormat("fr-FR").format(prestation.montant) || 0} FG</td>  

                        </tr>

                        ))
                        }

                    </tbody>
                    </table>
                </div>
            </div>
            <div className="cards">   
                <div className="table-container card">
                    <h3>Total des dépenses</h3>
                    <table className="data-table">
                        <thead className="header_Table">
                            <tr>
                            <th>Date</th>
                            <th>Référence</th>
                            <th>catégorie</th>
                            <th>Libellé</th>                            
                            <th>Montant total</th>
                            <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depenses.map((Depense) => (
                            <tr key={Depense.id}>
                                <td>{formatDate(Depense.date_depense) || "—"}</td>
                                <td>{Depense.reference || "—"}</td>
                                <td>{Depense.categorie}</td>
                                <td>{Depense.libelle}</td>
                                <td>{new Intl.NumberFormat("fr-FR").format(Depense.montant) || 0 } FG</td>
                                <td>{Depense.statut || "—"}</td>                            
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div> 
                
                <div className="table-container card">
                    <h3>Total des encaissements</h3>
                    <table className="data-table">
                        <thead className="header_Table">
                            <tr>
                                <th>Date</th>
                                <th>Référence</th>
                                <th>catégorie</th>
                                <th>Libellé</th>                            
                                <th>Montant total</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {encaissements.map((Encaissement) => (
                            <tr key={Encaissement.id}>
                                <td>{formatDate(Encaissement.date_encaissement) || "—"}</td>
                                <td>{Encaissement.reference || "—"}</td>
                                <td>{Encaissement.categorie}</td>
                                <td>{Encaissement.libelle}</td>
                                <td>{new Intl.NumberFormat("fr-FR").format(Encaissement.montant) || 0 } FG</td>
                                <td>{Encaissement.statut || "—"}</td>                            
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