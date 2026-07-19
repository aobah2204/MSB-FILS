import {
    useState,
    useEffect
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";


import "../../CSS/ProductCreate.css";
import { supabase } from "../../supabase.js";



function IssaProduitEdit(){


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


export default IssaProduitEdit;