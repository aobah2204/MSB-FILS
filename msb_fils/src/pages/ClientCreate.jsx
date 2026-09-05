import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../CSS/ClientCreate.css";
import { supabase } from "../supabase.js";
import { useAuth } from "../context/AuthContext";
import { notify } from "../utils/notifications.js";

function ClientCreate(e) {

const navigate = useNavigate();
const location = useLocation();
const { user } = useAuth();

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

async function createNotification(titre, message, type, lien, user) {

    const { error: notificationError } = await supabase.from("notifications")
          .insert({
              titre: titre,
    
              message: message,
    
              type:type,
    
              utilisateur_id:null,
    
              lien:lien,
    
              auteur_id:user?.id
          });
    
        if(notificationError){
            alert("Notification non enregistrée : " + notificationError.message);
        }
};

async function handleSubmit(e){

    e.preventDefault();


    console.log(client);


    const table = "clients";

    const { data: createdClient, error } = await supabase
        .from(table)
        .insert(client)
        .select("id")
        .single();

    if(!error && createdClient){
        alert("Client enregistré");
    }else{
        alert("Client non enregistré");
        return;
    }

    createNotification("Nouveau client", `Le client ${client.nom} ${client.prenom} a été enregistré.`, "client", `/clients`, user);
    notify.success("Client enregistré avec succès !");

    const returnTo = location.state?.returnTo || "/clients";
    navigate(returnTo, {
        state: {
            createdClientId: createdClient.id,
            saleState: location.state?.saleState,
        },
    });

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