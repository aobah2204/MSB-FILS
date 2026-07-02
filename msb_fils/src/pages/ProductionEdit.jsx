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



function ProductionEdit(){


const {id} = useParams();

const navigate = useNavigate();



const [produit,setProduct] = useState({

    reference:"",
    nom:"",
    categorie:"",
    description:"",
    marque:"",
    unite:"",

    prixAchat:"",
    prixVente:"",
    tva:"20",

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

    codeBarre:"",
    actif:true

});

const [loading,setLoading] = useState(true);

// Select Product
async function getProduct(id){

    const table = "products";
    const { data } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .maybeSingle();
    
    setProduct(data);
    setLoading(false);
}

useEffect(()=>{
    // simulation chargement API
    getProduct(id);
    
},[id]);

    async function UpdateProduct(Product){

        setProduct(Product);

        const table = "products";

        if (!Product) return;

        const { error } = await supabase
        .from(table)
        .update({
            reference: Product.reference,
            nom: Product.nom,
            categorie: Product.categorie,
            description: Product.description,
            marque: Product.marque,
            unite: Product.unite,
            prixAchat: Product.prixAchat,
            prixVente: Product.prixVente,
            tva:Product.tva,
            stock: Product.stock,
            stockMin: Product.stockMin,
            poids: Product.poids,
            unite_poids: Product.unite_poids,
            longueur: Product.longueur,
            unite_longueur: Product.unite_longueur,
            largeur: Product.largeur,
            unite_largeur: Product.unite_largeur,
            hauteur: Product.hauteur,
            unite_hauteur: Product.unite_hauteur,
            codeBarre: Product.codeBarre,
            actif: Product.actif
        })
        // IMPORTANT :
        .eq("id", Product.id);

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/produits");
    }



function handleChange(e){

    setProduct({

        ...produit,

        [e.target.name]:
        e.target.value

    });

}


function enregistrer(e){

    e.preventDefault();

    console.log(produit);

    // Update Product
    UpdateProduct(produit);

    alert("Produit modifié");

    navigate("/produits");

}


return (

    <div className="product-page">

        <h1>
            Modifier Product
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
                        value={produit.reference || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        Code barre
                    </label>

                    <input
                        name="codeBarre"
                        value={produit.codeBarre || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        Nom produit
                    </label>

                    <input
                    name="nom"
                    value={produit.nom || ""}
                    onChange={handleChange}
                    />

                </div>

                <div>
                    <label>
                        Catégorie
                    </label>

                    <input
                        name="categorie"
                        value={produit.categorie || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        Marque
                    </label>

                    <input
                        name="marque"
                        value={produit.marque || ""}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        Unité
                    </label>

                    <select
                        name="unite"
                        value={produit.unite || ""}
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
        <input 
            name="description"
            value={produit.description || ""}
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
                    value={produit.prixAchat || ""}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Prix vente
                </label>

                <input

                    type="number"

                    name="prixVente"
                    value={produit.prixVente || ""}
                    onChange={handleChange}
                />

            </div>

            <div>
                <label>
                    TVA %
                </label>

                <input

                    type="number"

                    name="tva"

                    value={produit.tva}

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
                    value={produit.stock || ""}

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
                    value={produit.stockMin || ""}

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
                    value={produit.poids || ""}
                    onChange={handleChange}
                />
            
                <select
                    name="unite_poids"
                    value="Unité de mésure"
                    value={produit.unite_poids || ""}
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
                    value={produit.longueur || ""}
                    onChange={handleChange}
                />
                <select
                    name="unite_longueur"
                    value="Unité de mésure"
                    value={produit.unite_longueur}
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
                    value={produit.largeur}
                    onChange={handleChange}
                />

                <select
                    name="unite_largeur"
                    value={produit.unite_largeur}
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
                    value={produit.hauteur}
                    onChange={handleChange}
                />

                <select
                    name="unite_hauteur"
                    value="Unité de mésure"
                    value={produit.unite_hauteur}
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
                checked={produit.actif}
                onChange={handleChange}
            />            
            Produit actif
        </label>

        <button>
            Modifier produit
        </button>

    </form>



    </div>

)}


export default ProductionEdit;