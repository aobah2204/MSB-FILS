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



function FournisseurEdit(){


const {id} = useParams();

const navigate = useNavigate();



const [Fournisseur,setFournisseur] = useState({

    nom:"",
    prenom:"",
    societe:"",
    telephone:"",
    adresse:"",
    email:""

});

const [loading,setLoading] = useState(true);

// Select Fournisseur
async function getFournisseur(id){

    const table = "fournisseurs";
    const { data } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .maybeSingle();
    
    setFournisseur(data);
    setLoading(false);
}

useEffect(()=>{
    // simulation chargement API
    getFournisseur(id);
},[id]);

async function UpdateFournisseur(Fournisseur){

    setFournisseur(Fournisseur);

    const table = "fournisseurs";

    if (!Fournisseur) return;

    const { error } = await supabase
        .from(table)
        .update({
            nom: Fournisseur.nom,
            prenom: Fournisseur.prenom,
            adresse: Fournisseur.adresse,
            telephone: Fournisseur.telephone,
            email: Fournisseur.email,
            societe: Fournisseur.societe
    })
    // IMPORTANT :
    .eq("id", Fournisseur.id);

    if (error) {
        alert(error.message);
        return;
    }
    
    navigate("/Fournisseurs");
}



function handleChange(e){


setFournisseur({

    ...Fournisseur,

    [e.target.name]:
    e.target.value

    });


}





function enregistrer(e){


    e.preventDefault();


    console.log(Fournisseur);

    // Update Fournisseur
    UpdateFournisseur(Fournisseur);

    alert("Fournisseur modifié");

    navigate("/Fournisseurs");

}





return (

    <div className="client-page">


        <h1>
        Modifier Fournisseur
        </h1>



        <form className="client-form" onSubmit={enregistrer}>

            <label>
                Nom
            </label>

            <input
                name="nom"
                value={Fournisseur.nom || ""}
                onChange={handleChange}
            />

            <label>
                Prénom
            </label>

            <input

                name="prenom"
                value={Fournisseur.prenom || ""}
                onChange={handleChange}
            />

            <label>
                Société
            </label>

            <input
                name="societe"
                value={Fournisseur.societe || ""}
                onChange={handleChange}
            />



            <label>
                Téléphone
            </label>

            <input
                name="telephone"
                value={Fournisseur.telephone || ""}
                onChange={handleChange}
            />




            <label>
             Adresse
            </label>

            <textarea
                name="adresse"
                value={Fournisseur.adresse || ""}
                onChange={handleChange}
            />



            <label>
                Email
            </label>

            <input
                name="email"
                value={Fournisseur.email || ""}
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


export default FournisseurEdit;