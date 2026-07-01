import {
useState,
useEffect
} from "react";

import {
useParams,
useNavigate
} from "react-router-dom";


import "../CSS/ClientCreate.css";
import { supabase } from "../supabase.js";



function ClientEdit(){


const {id} = useParams();

const navigate = useNavigate();



const [client,setClient] = useState({

    nom:"",
    prenom:"",
    societe:"",
    telephone:"",
    adresse:"",
    email:""

});

const [loading,setLoading] = useState(true);

// Select Client
async function getClient(id){

    const table = "clients";
    const { data } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .maybeSingle();
    
    setClient(data);
    setLoading(false);
}

useEffect(()=>{
    // simulation chargement API
    getClient(id);
},[id]);

async function UpdateClient(Client){

    setClient(Client);

    const table = "clients";

    if (!client) return;

    const { error } = await supabase
        .from(table)
        .update({
            nom: client.nom,
            prenom: client.prenom,
            adresse: client.adresse,
            telephone: client.telephone,
            email: client.email,
            societe: client.societe
    })
    // IMPORTANT :
    .eq("id", client.id);

    if (error) {
        alert(error.message);
        return;
    }
    
    navigate("/clients");
}



function handleChange(e){


setClient({

...client,

[e.target.name]:
e.target.value

});


}





function enregistrer(e){


    e.preventDefault();


    console.log(client);

    // Update client
    UpdateClient(client);

    alert("Client modifié");

    navigate("/clients");

}





return (

    <div className="product-page">


        <h1>
        Modifier client
        </h1>



        <form className="client-form" onSubmit={enregistrer}>

            <label>
                Nom
            </label>

            <input
                name="nom"
                value={client.nom || ""}
                onChange={handleChange}
            />

            <label>
                Prénom
            </label>

            <input

                name="prenom"
                value={client.prenom || ""}
                onChange={handleChange}
            />

            <label>
                Société
            </label>

            <input
                name="societe"
                value={client.societe || ""}
                onChange={handleChange}
            />



            <label>
                Téléphone
            </label>

            <input
                name="telephone"
                value={client.telephone || ""}
                onChange={handleChange}
            />




            <label>
             Adresse
            </label>

            <input
                name="adresse"
                value={client.adresse || ""}
                onChange={handleChange}
            />



            <label>
                Email
            </label>

            <input
                name="email"
                value={client.email || ""}
                onChange={handleChange}
            />



            <div>
                <button className="profile" type="submit" onClick={enregistrer}>
                    Enregistrer
                </button>
            </div>

        </form>



    </div>

    )

}


export default ClientEdit;