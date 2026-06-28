import { useState } from "react";

import "../CSS/ProductCreate.css";
import { supabase } from "../supabase";


function ProductCreate(){


const [product,setProduct] = useState({

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
    longueur:"",
    largeur:"",
    hauteur:"",

    codeBarre:"",
    actif:true

});



function handleChange(e){


    const {name,value,type,checked}=e.target;

    setProduct({

        ...product,

        [name]:
        type==="checkbox"
        ? checked
        : value

    });
}




async function handleSubmit(e){

    e.preventDefault();

    console.log(product);

    // API Supabase ici
    const table = "products";
    
    const { error } = await supabase.from(table).insert(product);
    
    if(!error){
        alert("Produit enregistré");
    }else{
        alert("Produit non enregistré : ", error.message);
    }

    navigate("/produits");
}




return (

<div className="product-page">


    <h1 className="titre">
        Création produit
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
                    Code barre
                </label>

                <input
                    name="codeBarre"
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Nom produit
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
        </div>

        <label>
            Description
        </label>
        <textarea 
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

            <div>
                <label>
                    Prix vente
                </label>

                <input

                    type="number"

                    name="prixVente"

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

                    value={product.tva}

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


            <input
                placeholder="Poids"
                name="poids"
                onChange={handleChange}
            />


            <input
                placeholder="Longueur"
                name="longueur"
                onChange={handleChange}
            />


            <input
                placeholder="Largeur"
                name="largeur"
                onChange={handleChange}
            />


            <input
                placeholder="Hauteur"
                name="hauteur"
                onChange={handleChange}
            />


        </div>


        <label className="checkbox">


            <input

                type="checkbox"

                name="actif"

                checked={product.actif}

                onChange={handleChange}

            />
            Produit actif
        </label>




        <button>
            Créer produit
        </button>

    </form>
</div>
)}


export default ProductCreate;