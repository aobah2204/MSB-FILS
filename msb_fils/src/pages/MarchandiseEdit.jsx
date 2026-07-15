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



function MarchandiseEdit(){


const {id} = useParams();

const navigate = useNavigate();



const [Marchandise,setMarchandise] = useState({

    reference:"",
    nom:"",
    categorie:"",
    description:"",
    unite:"",

    fournisseur:"",
    
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
    epaisseur:"",
    unite_epaisseur:"",
    diametre:"",
    unite_diametre:"",

    actif:true

});

const [fournisseur,setFournisseur] = useState(null);

const [fournisseurs, setAllFournisseurs] = useState([]);

const [loading,setLoading] = useState(true);

// Select Marchandise
async function getMarchandise(id){

    const table = "marchandises";
    const { data } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .maybeSingle();
    
    setMarchandise(data);
    setLoading(false);
    console.log("marchandise : ", data);
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
    // simulation chargement API
    getMarchandise(id);
    getAllFournisseurs();

},[id]);

    async function UpdateMarchandise(Marchandise){

        setMarchandise(Marchandise);

        const table = "marchandises";

        if (!Marchandise) return;

        const { error } = await supabase
        .from(table)
        .update({
            reference: Marchandise.reference,
            nom: Marchandise.nom,
            categorie: Marchandise.categorie,
            description: Marchandise.description,
            unite: Marchandise.unite,
            prixAchat: Marchandise.prixAchat,            
            stock: Marchandise.stock,
            stockMin: Marchandise.stockMin,
            poids: Marchandise.poids,
            unite_poids: Marchandise.unite_poids,
            longueur: Marchandise.longueur,
            unite_longueur: Marchandise.unite_longueur,
            largeur: Marchandise.largeur,
            unite_largeur: Marchandise.unite_largeur,
            hauteur: Marchandise.hauteur,
            unite_hauteur: Marchandise.unite_hauteur,
            epaisseur:Marchandise.epaisseur,
            unite_epaisseur:Marchandise.unite_epaisseur,
            diametre:Marchandise.diametre,
            unite_diametre:Marchandise.unite_diametre,
            actif: Marchandise.actif
        })
        // IMPORTANT :
        .eq("id", Marchandise.id);

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/marchandises");
    }



function handleChange(e){

    setMarchandise({

        ...Marchandise,

        [e.target.name]:
        e.target.value

    });

}

    function onChange(e){


        const selected = fournisseurs.find(

            f => f.id == e.target.value

        );

        console.log(selected);

        setFournisseur(selected);
    }


function enregistrer(e){

    e.preventDefault();

    console.log(Marchandise);

    // Update Marchandise
    UpdateMarchandise(Marchandise);

    alert("Marchandise modifié");

    navigate("/marchandises");

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
                        value={Marchandise.reference || ""}
                        onChange={handleChange}
                    />
                </div>
                

                <div>
                    <label>
                        Nom Matière Première
                    </label>

                    <input
                    name="nom"
                    value={Marchandise.nom || ""}
                    onChange={handleChange}
                    />

                </div>

                <div>
                    <label>
                        Catégorie
                    </label>

                    <input
                        name="categorie"
                        value={Marchandise.categorie || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        Unité
                    </label>

                    <select
                        name="unite"
                        value={Marchandise.unite || ""}
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
                        value={Marchandise?.id_fournisseur || ""}
                        name="fournisseur"
                        onChange={onChange}
                    >                        
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

        <div>
            <label>
                Description
            </label>
            <input 
                name="description"
                value={Marchandise.description || ""}
                onChange={handleChange}
            />
        </div>

        {/*
        <div className="grid">

            <div>
                <label>
                    Prix achat
                </label>

                <input
                    type="number"
                    name="prixAchat"
                    value={Marchandise.prixAchat || ""}
                    onChange={handleChange}
                />
            </div>

        </div>
        */}

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
                    value={Marchandise.stock || ""}

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
                    value={Marchandise.stockMin || ""}

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
                    value={Marchandise.poids || ""}
                    onChange={handleChange}
                />
            
                <select
                    name="unite_poids"
                    value="Unité de mésure"
                    value={Marchandise.unite_poids || ""}
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
                    value={Marchandise.longueur || ""}
                    onChange={handleChange}
                />
                <select
                    name="unite_longueur"
                    value="Unité de mésure"
                    value={Marchandise.unite_longueur}
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
                    value={Marchandise.largeur}
                    onChange={handleChange}
                />

                <select
                    name="unite_largeur"
                    value={Marchandise.unite_largeur}
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
                    value={Marchandise.hauteur}
                    onChange={handleChange}
                />

                <select
                    name="unite_hauteur"
                    value="Unité de mésure"
                    value={Marchandise.unite_hauteur}
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
                    placeholder="épaisseur"
                    name="epaisseur"
                    value={Marchandise.epaisseur}
                    onChange={handleChange}
                />

                <select
                    name="unite_epaisseur"
                    value="Unité de mésure"
                    value={Marchandise.unite_epaisseur}
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
                    placeholder="Diamètre"
                    name="diametre"
                    value={Marchandise.diametre}
                    onChange={handleChange}
                />

                <select
                    name="unite_diametre"
                    value="Unité de mésure"
                    value={Marchandise.unite_diametre}
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
                checked={Marchandise.actif}
                onChange={handleChange}
            />            
            Marchandise actif
        </label>

        <div>
            <button className="profile">
                Modifier
            </button>
        </div>

    </form>



    </div>

)}


export default MarchandiseEdit;