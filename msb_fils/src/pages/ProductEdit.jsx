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



function ProductEdit(){


const {id} = useParams();

const navigate = useNavigate();



const [Product,setProduct] = useState({

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

const [loading,setLoading] = useState(true);

// Select Product
async function getProduct(id){

    const table = "products";
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
            longueur: Product.longueur,
            largeur: Product.largeur,
            hauteur: Product.hauteur,
            codeBarre: Product.codeBarre,
            actif: Product.actif
        })
        // IMPORTANT :
        .eq("id", Product.id);

        if (error) {
            alert(error.message);
            return;
        }
    }



function handleChange(e){


setClient({

    ...Product,

    [e.target.name]:
    e.target.value

    });


}





function enregistrer(e){


    e.preventDefault();


    console.log(Product);

    // Update Product
    UpdateProduct(Product);

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

                    value={Product.tva}

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

                checked={Product.actif}

                onChange={handleChange}

            />
            Produit actif
        </label>




        <button>
            Modifier produit
        </button>

    </form>



    </div>

    )

}


export default ProductEdit;