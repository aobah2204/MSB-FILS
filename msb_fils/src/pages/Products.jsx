import {
 LayoutDashboard,
 Users,
 FileText,
 Settings,
 UserPlus,
 UserPen,
 UserRoundX,
 Pencil,
 Trash2,
 Package,
 Eye
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { supabase } from "../supabase.js";
import { useState, useEffect } from 'react'
import "../CSS/Products.css";
import { useAuth } from "../context/AuthContext";

const Product = {
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
}

function Products() {

    // Connected user 
    const { user } = useAuth();

    // List Produits
    const [productsList, setProductList] = useState([]);

    // Produit selectionner
    const [product, setProduct] = useState(Product);

    const tableProduct = "products";

    // s'exécute une seule fois au chargement
    useEffect(() => {

        chargerProducts();

    }, []);

    async function chargerProducts() {

        try {
            await getAllProducts();
        } catch (error) {
            console.error("Erreur lors du chargement des produits :", error);
        }
    }

    async function getAllProducts(){

        const { data } = await supabase
            .from(tableProduct)
            .select("*");

        if (!data) return alert("Aucun produits");

        setProductList(data);
    }
    

    async function DeleteProduct(Product){

        await supabase
          .from(tableProduct)
          .delete()
          .eq("id", Product.id);

        // Mettre à jour la liste des Products après la suppression
        await getAllProducts();
        setProduct(null);
    }


    return (
        <div>

            {
            ["Administrateur","Responsable de production"]
            .includes(user?.role)
            &&
            <section>
                <div>  
                    <NavLink to="/produits/nouveau">
                        <button className="profile"><Package size={20}/>  Nouveau Produit</button>
                    </NavLink>                        
                </div>            
            </section>
            }

            <h2>Liste des Produits</h2>

            <div className="table-container">
                <table>
                    <thead className="headerTable">

                    <tr className="header_Table">
                        <th>Reférence</th>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Prix Achat</th>
                        <th>Prix Vente</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>

                    </thead>


                    <tbody>

                    {productsList.map((produit, index) => (

                        <tr key={index}>

                        <td>{produit.reference}</td>

                        <td>{produit.nom}</td>

                        <td>{produit.categorie}</td>

                        <td>{produit.prixAchat}</td>

                        <td>{produit.prixVente}</td>

                        <td>{produit.actif}</td>
                        
                        <td>
                            <NavLink to={`/produits/details/${produit.id}`}>
                                <button className="profile"><Eye size={20} /></button>
                            </NavLink>
                            {
                            ["Administrateur","Responsable de production"]
                            .includes(user?.role)
                            &&
                            <NavLink to={`/produits/modifier/${produit.id}`}>
                                <button className="profile"><Pencil size={20} /></button>
                            </NavLink>
                            }

                            {
                            ["Administrateur","Responsable de production"]
                            .includes(user?.role)
                            &&                             
                             <button className="profileSupp" onClick={() => DeleteProduct(produit)}> <Trash2 size={20} /></button>
                            }
                        </td>
                        

                    </tr>

                    ))
                    }

                </tbody>
                </table>
            </div>

            

        
            


    </div> );
}

export default Products;