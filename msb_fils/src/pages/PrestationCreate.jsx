import { useState, useEffect } from "react";

import "../CSS/ProductCreate.css";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import Prestations from "./Prestations";

    


function PrestationCreate(){

    const navigate = useNavigate();

    const [ventes, setVentes] = useState([]);
    //const [vehicules, setVehicules] = useState([]);
    const [prestataires, setPrestataires] = useState([]);

    async function loadData() {
        const [{ data: ventesData }, { data: prestatairesData }] = await Promise.all([
        supabase.from("ventes").select("*").order("date_vente", { ascending: false }),
        //supabase.from("vehicules").select("id, marque, immatriculation, chauffeur"),
        supabase.from("utilisateurs").select("id, fullname, adresse, telephone").eq("role", "Prestataire"),
        ]);

        setVentes(ventesData || []);
        //setVehicules(vehiculesData || []);
        setPrestataires(prestatairesData || []);
    }



    const [Prestation,setPrestation] = useState({

        reference:"",
        vente_id: "",
        //vehicule_id: "",
        prestataire_id: "",
        date_Prestation: "",
        statut: "",
        montant: "",
        addresse: "",
        libelle: ""

    });



    function handleChange(e){


        const {name,value,type,checked}=e.target;

        setPrestation({

            ...Prestation,

            [name]:
            type==="checkbox"
            ? checked
            : value

        });
    }




    async function handleSubmit(e){

        e.preventDefault();

        console.log(Prestation);

        // API Supabase ici
        const table = "prestations";

        /* Set vehicule
        if (vehicule) {
            Prestation.vehicule_id = vehicule.id;
        }else{
            alert("Veuillez selectionnez un véhicule");
        }*/

        // set vente id
        if(vente){
            Prestation.vente_id = vente.id;
        }else{
            alert("Veuillez selectionnez une vente");
        }

        // set prestataire id
        if(prestataire){
            Prestation.prestataire_id = prestataire.id;
        }else{
            alert("Veuillez selectionnez un prestataire");
        }
        
        const { error } = await supabase.from(table).insert(Prestation);
        
        if(!error){
            alert("Prestation enregistré");
        }else{
            alert("Prestation non enregistré : " + error.message);
        }

        navigate("/Prestations");
    }

    {/** Get all vehicules 
    const [vehicule,setVehicule] = useState(null);
    function onChangeVehicule(e){

        const selected = vehicules.find(

            f => f.id == e.target.value

        );
        setVehicule(selected);
    }*/}


    {/** Get all ventes */}
    const [vente,setVente] = useState(null);
    function onChangeVente(e){

        const selected = ventes.find(

            f => f.id == e.target.value

        );
        setVente(selected);
    }

    {/** Get all prestations */}
    const [prestataire,setPrestataire] = useState(null);
    function onChangePrestataire(e){

        const selected = prestataires.find(

            f => f.id == e.target.value

        );
        setPrestataire(selected);
    }

    async function getClient(id){
         const { client } = await supabase.from("clients").select("*").eq("id", id);
         return client;
    }


useEffect(()=>{
    loadData();
},[])

return (

<div className="product-page">


    <h1 className="titre">
        Création Prestation
    </h1>



    <form
    className="product-form"
    onSubmit={handleSubmit}
    >

        <div className="grid">

            <div>
                <label>
                    Référence
                </label>

                <input
                    name="reference"
                    onChange={handleChange}
                />
            </div>
            

            <div>
                <label>
                    Vente
                </label>
                <select
                    value={vente?.id}
                    name="vente_id"
                    onChange={onChangeVente}
                >
                    <option value="">
                    -- selectionner la vente --
                    </option>
                    {
                        ventes.map((vente)=>(

                            <option
                                key={vente.id}
                                value={vente.id}
                            >
                                {vente?.description} - {vente?.date_vente} : {getClient(vente?.client_id).nom} {getClient(vente?.client_id).prenom}
                            </option>
                        ))
                    }


                </select>
            </div>

           {/*
            <div>
                <label>
                    Véhicule
                </label>
                <select
                    value={vehicule?.id}
                    name="vehicule_id"
                    onChange={onChangeVehicule}
                >
                    <option value="">
                    -- selectionner le véhicule --
                    </option>
                    {
                        vehicules.map((vehicule)=>(

                            <option
                                key={vehicule.id}
                                value={vehicule.id}
                            >
                                {vehicule?.immatriculation} {vehicule?.marque} - {vehicule?.chauffeur}
                            </option>
                        ))
                    }


                </select>
            </div> 
            */}

            <div>
                <label>
                    Préstataire
                </label>
                <select
                    value={prestataire?.id}
                    name="prestataire_id"
                    onChange={onChangePrestataire}
                >
                    <option value="">
                    -- selectionner le préstataire --
                    </option>
                    {
                        prestataires.map((presta)=>(

                            <option
                                key={presta.id}
                                value={presta.id}
                            >
                                {presta?.fullname} {presta?.adresse} - {presta?.telephone}
                            </option>
                        ))
                    }


                </select>
            </div>     

            <div>
                <label>
                    Type de préstation
                </label>
                <select
                    name="type"
                    onChange={handleChange}
                > 
                    <option>
                        ---Choisir---
                    </option>
                    <option>
                        Livraison
                    </option>
                    <option>
                        Conseils
                    </option>
                    <option>
                        Support
                    </option>
                    <option>
                        Logistiques
                    </option>
                    <option>
                        Autres
                    </option>                

                </select>

                
            </div>
            <div>
                <label>
                    Description
                </label>

                <input
                    type="text"
                    name="libelle"
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Adresse de préstation
                </label>

                <input
                    type="text"
                    name="addresse"
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>
                    Date Prestation
                </label>

                <input
                    type="date"
                    name="date_Prestation"
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Montant
                </label>

                <input
                    type="number"
                    name="montant"
                    onChange={handleChange}
                />
            </div>

            <div>
            <label>
                    Statut
                </label>
                <select
                    value={Prestation?.statut}
                    name="statut"
                    onChange={handleChange}
                >
                    <option value="">
                    -- sélectionner le statut --
                    </option> 

                    <option>
                        En cours
                    </option>
                    <option>
                        Livré
                    </option>

                </select>     
        </div>

        </div>  

        

        <div>
            <button className="profile">
                Créer
            </button>
        </div>

    </form>
</div>
)}


export default PrestationCreate;