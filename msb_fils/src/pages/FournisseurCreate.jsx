import React, { useEffect, useState } from "react";
import "../CSS/ClientCreate.css";
import { supabase } from "../supabase.js";
import { useNavigate } from "react-router-dom";

function FournisseurCreate(e) {

const navigate = useNavigate();

const [fournisseur,setFournisseur] = useState({

    nom:"",
    prenom:"",
    societe:"",
    telephone:"",
    adresse:"",
    email:""

});


function handleChange(e){

    setFournisseur({
    ...fournisseur,
    [e.target.name]: e.target.value
    });

}



async function handleSubmit(e){

    e.preventDefault();


    console.log(fournisseur);


    const table = "fournisseurs";

    const { error } = await supabase.from(table).insert(fournisseur);

    if(!error){
        alert("Fournisseur enregistré");
    }else{
        alert("Fournisseur non enregistré");
    }

    navigate("/fournisseurs");

}



return (
    <div className="product-page">

        <h1>
            Inscription Fournisseur
        </h1>

        <form 
        className="client-form"
        onSubmit={handleSubmit}
        >
            <label>
                Nom
            </label>

            <input
                name="nom"
                value={fournisseur.nom}
                onChange={handleChange}
            />

            <label>
                Prénom
            </label>

            <input
                name="prenom"
                value={fournisseur.prenom}
                onChange={handleChange}
            />

            <label>
                Nom société
            </label>

            <input
                name="societe"
                value={fournisseur.societe}
                onChange={handleChange}
            />

            <label>
                Téléphone
            </label>

            <input
                name="telephone"
                value={fournisseur.telephone}
                onChange={handleChange}
            />

            <label>
                Adresse
            </label>

            <input
                name="adresse"
                value={fournisseur.adresse}
                onChange={handleChange}
            />

            <label>
                Email
            </label>

            <input
                type="email"
                name="email"
                value={fournisseur.email}
                onChange={handleChange}
            />

            <div>
                <button className="profile">
                    Créer le Fournisseur
                </button>
            </div>
            
        </form>

    </div>
)}


export default FournisseurCreate;