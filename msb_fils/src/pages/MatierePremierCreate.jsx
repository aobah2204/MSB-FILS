import { useState, useEffect } from "react";

import "../CSS/ProductCreate.css";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

    


function MatierePremiereCreate(){

    const navigate = useNavigate();


const [MatierePremiere,setMatierePremiere] = useState({

    reference:"",
    nom:"",
    categorie:"",
    description:"",
    marque:"",
    unite:"",

    fournisseur: "",
    id_fournisseur: 0,

    prixAchat:"",
    
    stock:"",
    stockMin:"",

    poids:"",
    unite_poids:"",
    longueur:"",
    unite_longueur:"",
    largeur:"",
    unite_largeur:"",
    hauteur:"",
    unite_hauteur:"",

    actif:true

});



function handleChange(e){


    const {name,value,type,checked}=e.target;

    setMatierePremiere({

        ...MatierePremiere,

        [name]:
        type==="checkbox"
        ? checked
        : value

    });
}




async function handleSubmit(e){

    e.preventDefault();

    console.log(MatierePremiere);

    // API Supabase ici
    const table = "matierespremieres";

    // Set fournisseur ID if selected
    if (fournisseur) {
        MatierePremiere.id_fournisseur = fournisseur.id;
        MatierePremiere.fournisseur = fournisseur.nom + " " + fournisseur.prenom;
    }
    
    const { error } = await supabase.from(table).insert(MatierePremiere);
    
    if(!error){
        alert("Matière enregistré");
    }else{
        alert("Matière non enregistré : " + error.message);
    }

    navigate("/matierespremieres");
}

    const [fournisseur,setFournisseur] = useState(null);

    const [fournisseurs, setAllFournisseurs] = useState([]);


    function onChange(e){


        const selected = fournisseurs.find(

            f => f.id == e.target.value

        );

        console.log(selected);

        setFournisseur(selected);
    }

    async function getAllFournisseurs(){

        const { data } = await supabase
                .from("fournisseurs")            
                .select("*");

        if (!data) return alert("Aucun fournisseur");

        console.log(data);
        // Alimentation de la liste des fournisseurs
        setAllFournisseurs(data);
    }

useEffect(()=>{
    getAllFournisseurs();
},[])

return (

<div className="product-page">


    <h1 className="titre">
        Création Matière
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
                    Nom Matière
                </label>

                <input
                name="nom"
                onChange={handleChange}
                />

            </div>

            <div>
                <label>
                    Catégorie
                </label>

                <input
                    name="categorie"
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Marque
                </label>

                <input
                    name="marque"
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Unité
                </label>

                <select
                name="unite"
                onChange={handleChange}
                >

                    <option>
                        Pièce
                    </option>

                    <option>
                        Kg
                    </option>

                    <option>
                        Litre
                    </option>

                    <option>
                        Mètre
                    </option>

                    <option>
                        Mètre cube
                    </option>

                    <option>
                        Tonne
                    </option>

                </select>


            </div>

            <div>
                <label>
                    Fournisseur
                </label>
                <select
                    value={fournisseur?.id}
                    name="fournisseur"
                    onChange={onChange}
                >
                    <option value="">
                    -- Choisir un fournisseur --
                    </option>
                    {
                        fournisseurs.map((c)=>(

                            <option
                                key={c.id}
                                value={c.id}
                            >
                                {c.nom} - {c.prenom}
                            </option>
                        ))
                    }


                </select>
            </div>

        </div>

        <label>
            Description
        </label>
        <input 
            name="description"
            onChange={handleChange}
        />

        <div className="grid">

            <div>
                <label>
                    Prix achat
                </label>

                <input
                    type="number"
                    name="prixAchat"
                    onChange={handleChange}
                />
            </div>

        </div>

        <h3>
            Stock
        </h3>

        <div className="grid">

            <div>
                <label>
                Stock initial
                </label>

                <input

                type="number"

                name="stock"

                onChange={handleChange}

                />
            </div>

            <div>
                <label>
                    Seuil alerte
                </label>

                <input

                type="number"

                name="stockMin"

                onChange={handleChange}

                />
            </div>


        </div>

        <h3>
            Dimensions
        </h3>

        <div className="grid">

            <div className="grid">
                <input
                    placeholder="Poids"
                    name="poids"
                    onChange={handleChange}
                />
            
                <select
                    name="unite_poids"
                    onChange={handleChange}
                >
                    <option>
                    -- Choisir l'unité --
                    </option>
                    <option>
                        gramme
                    </option>

                    <option>
                        Kilogramme
                    </option>

                    <option>
                        tonne
                    </option>

                </select>
            </div>



            <div className="grid">
                <input
                    placeholder="Longueur"
                    name="longueur"
                    onChange={handleChange}
                />
                <select
                    name="unite_longueur"
                    onChange={handleChange}
                >
                    <option>
                    -- Choisir l'unité --
                    </option>
                    
                    <option>
                        millimètre
                    </option>

                    <option>
                        centimètre
                    </option>

                    <option>
                        décimètre
                    </option>

                    <option>
                        mètre
                    </option>

                    <option>
                        Kilomètre
                    </option>

                </select>
            </div>
            

            <div className="grid">

                <input
                    placeholder="Largeur"
                    name="largeur"
                    onChange={handleChange}
                />

                <select
                    name="unite_largeur"
                    onChange={handleChange}
                >
                    <option>
                    -- Choisir l'unité --
                    </option>
                    
                    <option>
                        millimètre
                    </option>

                    <option>
                        centimètre
                    </option>

                    <option>
                        décimètre
                    </option>

                    <option>
                        mètre
                    </option>

                    <option>
                        Kilomètre
                    </option>

                </select>
            </div>
            

            <div className="grid">

                <input
                    placeholder="Hauteur"
                    name="hauteur"
                    onChange={handleChange}
                />

                <select
                    name="unite_hauteur"
                    onChange={handleChange}
                >
                    <option>
                    -- Choisir l'unité --
                    </option>
                    
                    <option>
                        millimètre
                    </option>

                    <option>
                        centimètre
                    </option>

                    <option>
                        décimètre
                    </option>

                    <option>
                        mètre
                    </option>

                    <option>
                        Kilomètre
                    </option>

                </select>
            </div>

        </div>


        <label className="checkbox">


            <input

                type="checkbox"

                name="actif"

                checked={MatierePremiere.actif}

                onChange={handleChange}

            />
            Matière active
        </label>

        <div>
            <button className="profile">
                Créer Matière
            </button>
        </div>

    </form>
</div>
)}


export default MatierePremiereCreate;