import { useState } from "react";

import { supabase } from "../../supabase";


function IssaProduitCreate(){


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
    const table = "issaproducts";
    
    const { error } = await supabase.from(table).insert(product);
    
    if(!error){
        alert("Produit enregistré");
    }else{
        alert("Produit non enregistré : " + error.message);
    }

    navigate("/issaproduits");
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

                    <option>
                        Pièce
                    </option>

                    <option>
                        Sac
                    </option>

                    <option>
                        Carton
                    </option>

                    <option>
                        Fût
                    </option>
                    
                    <option>
                        Conteneur
                    </option>

                </select>


            </div>
        </div>

        <div>
            <label>
                Description
            </label>
            <input 
                name="description"
                onChange={handleChange}
            />
        </div>

        
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
        


        <label className="checkbox">


            <input

                type="checkbox"

                name="actif"

                checked={product.actif}

                onChange={handleChange}

            />
            Produit actif
        </label>



        <div>
            <button className="profile">
                Créer produit
            </button>
        </div>

        
    </form>
</div>
)}


export default IssaProduitCreate;