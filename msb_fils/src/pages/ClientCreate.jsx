import React, { useEffect, useState } from "react";
import "../CSS/ClientCreate.css";
import { supabase } from "../supabase.js";

function ClientCreate(e) {


const [client,setClient] = useState({

    nom:"",
    prenom:"",
    societe:"",
    telephone:"",
    adresse:"",
    email:""

});


function handleChange(e){

    setClient({
    ...client,
    [e.target.name]: e.target.value
    });

}



async function handleSubmit(e){

    e.preventDefault();


    console.log(client);


    const table = "clients";

    const { error } = await supabase.from(table).insert(client);

    if(!error){
        alert("Client enregistré");
    }else{
        alert("Client non enregistré");
    }

    navigate("/clients");

}



return (
    <div className="product-page">

        <h1>
            Inscription Client
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
                value={client.nom}
                onChange={handleChange}
            />

            <label>
                Prénom
            </label>

            <input
                name="prenom"
                value={client.prenom}
                onChange={handleChange}
            />

            <label>
                Nom société
            </label>

            <input
                name="societe"
                value={client.societe}
                onChange={handleChange}
            />

            <label>
                Téléphone
            </label>

            <input
                name="telephone"
                value={client.telephone}
                onChange={handleChange}
            />

            <label>
                Adresse
            </label>

            <input
                name="adresse"
                value={client.adresse}
                onChange={handleChange}
            />

            <label>
                Email
            </label>

            <input
                type="email"
                name="email"
                value={client.email}
                onChange={handleChange}
            />

            <div>
                <button className="profile">
                    Créer le client
                </button>
            </div>
        </form>

    </div>
)}


export default ClientCreate;