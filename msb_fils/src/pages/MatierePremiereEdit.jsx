import {
    useState,
    useEffect
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";


import "../CSS/ProductCreate.css";
import { supabase } from "../supabase.js";



function MatierePremiereEdit(){


const {id} = useParams();

const navigate = useNavigate();



const [MatierePremiere,setMatierePremiere] = useState({

    reference:"",
    nom:"",
    categorie:"",
    description:"",
    marque:"",
    unite:"",

    prixAchat:"",
    
    stock:"",
    stockMin:"",

    poids:"",
    unite_poids: "",
    longueur:"",
    unite_longueur: "",
    largeur:"",
    unite_largeur: "",
    hauteur:"",
    unite_hauteur: "",

    actif:true

});

const [loading,setLoading] = useState(true);

// Select MatierePremiere
async function getMatierePremiere(id){

    const table = "matierespremieres";
    const { data } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .maybeSingle();
    
    setMatierePremiere(data);
    setLoading(false);
}

useEffect(()=>{
    // simulation chargement API
    getMatierePremiere(id);
    
},[id]);

    async function UpdateMatierePremiere(MatierePremiere){

        setMatierePremiere(MatierePremiere);

        const table = "matieresPremieres";

        if (!MatierePremiere) return;

        const { error } = await supabase
        .from(table)
        .update({
            reference: MatierePremiere.reference,
            nom: MatierePremiere.nom,
            categorie: MatierePremiere.categorie,
            description: MatierePremiere.description,
            marque: MatierePremiere.marque,
            unite: MatierePremiere.unite,
            prixAchat: MatierePremiere.prixAchat,            
            stock: MatierePremiere.stock,
            stockMin: MatierePremiere.stockMin,
            poids: MatierePremiere.poids,
            unite_poids: MatierePremiere.unite_poids,
            longueur: MatierePremiere.longueur,
            unite_longueur: MatierePremiere.unite_longueur,
            largeur: MatierePremiere.largeur,
            unite_largeur: MatierePremiere.unite_largeur,
            hauteur: MatierePremiere.hauteur,
            unite_hauteur: MatierePremiere.unite_hauteur,
            actif: MatierePremiere.actif
        })
        // IMPORTANT :
        .eq("id", MatierePremiere.id);

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/matierespremieres");
    }



function handleChange(e){

    setMatierePremiere({

        ...MatierePremiere,

        [e.target.name]:
        e.target.value

    });

}


function enregistrer(e){

    e.preventDefault();

    console.log(MatierePremiere);

    // Update MatierePremiere
    UpdateMatierePremiere(MatierePremiere);

    alert("MatierePremiere modifié");

    navigate("/matierepremieres");

}


return (

    <div className="product-page">

        <h1>
            Modifier Matière
        </h1>

        <form
            className="product-form"
            onSubmit={enregistrer}
            >

            <div className="grid">

                <div>
                    <label>
                        Référence
                    </label>

                    <input
                        name="reference"
                        value={MatierePremiere.reference || ""}
                        onChange={handleChange}
                    />
                </div>
                

                <div>
                    <label>
                        Nom Matière Première
                    </label>

                    <input
                    name="nom"
                    value={MatierePremiere.nom || ""}
                    onChange={handleChange}
                    />

                </div>

                <div>
                    <label>
                        Catégorie
                    </label>

                    <input
                        name="categorie"
                        value={MatierePremiere.categorie || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        Marque
                    </label>

                    <input
                        name="marque"
                        value={MatierePremiere.marque || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        Unité
                    </label>

                    <select
                        name="unite"
                        value={MatierePremiere.unite || ""}
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
            </div>

        <label>
            Description
        </label>
        <textarea 
            name="description"
            value={MatierePremiere.description || ""}
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
                    value={MatierePremiere.prixAchat || ""}
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
                    value={MatierePremiere.stock || ""}

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
                    value={MatierePremiere.stockMin || ""}

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
                    value={MatierePremiere.poids || ""}
                    onChange={handleChange}
                />
            
                <select
                    name="unite_poids"
                    value="Unité de mésure"
                    value={MatierePremiere.unite_poids || ""}
                    onChange={handleChange}
                >
                    <option value="">
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
                    value={MatierePremiere.longueur || ""}
                    onChange={handleChange}
                />
                <select
                    name="unite_longueur"
                    value="Unité de mésure"
                    value={MatierePremiere.unite_longueur}
                    onChange={handleChange}
                >
                    <option value="">
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
                    value={MatierePremiere.largeur}
                    onChange={handleChange}
                />

                <select
                    name="unite_largeur"
                    value={MatierePremiere.unite_largeur}
                    onChange={handleChange}
                >
                    <option value="">
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
                    value={MatierePremiere.hauteur}
                    onChange={handleChange}
                />

                <select
                    name="unite_hauteur"
                    value="Unité de mésure"
                    value={MatierePremiere.unite_hauteur}
                    onChange={handleChange}
                >
                    <option value="">
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
            MatierePremiere actif
        </label>

        <div>
            <button className="profile">
                Modifier Matière Première
            </button>
        </div>

    </form>



    </div>

)}


export default MatierePremiereEdit;