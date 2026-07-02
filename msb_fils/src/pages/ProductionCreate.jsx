import { useState, useEffect } from "react";

import "../CSS/ProductCreate.css";
import { supabase } from "../supabase";


function ProductionCreate(){


const [production,setProduction] = useState({

    site_id:"",    
    produit_id:"",
    typeproduction:"",    
    description:"",
    unite:"",
    quantité:"",
    cout_composants:"",
    cout_production:"",
    cout_stockage:"",
    cout_unitaire:"",
    cout_total:"",
    dateproduction:"",
    user_creation:"",
    user_modification:""   

});


const [produits,setProduits]=useState([]);
const [matieres,setMatieres]=useState([]);


const [materials,setMaterials]=useState([]);

async function getMateriels(){

    const { data } = await supabase
        .from("matierespremieres")
        .select("*");

    if (!data) return alert("Aucun materiel");

    setMatieres(data);
}

async function getProduits(){

    const { data } = await supabase
        .from("products")
        .select("*");
    if (!data) return alert("Aucun produit");

    setProduits(data);
}

const [IsAddedMateriel,setIsAddedMateriel]=useState(false);

const [CoutTotalMateriels,setCoutTotalMateriels]=useState(0);
const [CoutTotalProduction,setCoutTotalProduction]=useState(0);

function addMaterial(){

    setMaterials([

        ...materials,

        {
        matiere_id:"",
        quantite:""
        }

    ]);

    setIsAddedMateriel(true);

}


function updateMaterial(index,field,value){


    const copy=[...materials];


    copy[index][field]=value;


    setMaterials(copy);


}

async function addMaterielProduction(materielProduction){

    const { error } = await supabase
        .from("materielproduction")
        .insert(materielProduction);
    
    if (error) {
        alert(error.message);
        return;
    }
}



function save(e){

    e.preventDefault();



    


    //console.log(data);


}

useEffect(()=>{
    console.log("useEffect called");
    getMateriels();
    getProduits();
},[]);



return (

    <div className="product-page">




        <h1>
        Nouvelle production
        </h1>



        <form className="product-form" onSubmit={save}>


            <label>
            Type production
            </label>


            <select

                name="typeproduction"
                onChange={
                e=>setProduction({
                ...production,
                type:e.target.value
                })
                }

            >

            <option>
                Fabrication
            </option>

            <option>
                Transformation
            </option>

            <option>
                Assemblage
            </option>

            </select>



        <label>
            Produit réalisé
        </label>


        <select
    
            name="produit_id"
            onChange={
            e=>setProduction({
            ...production,
            produit_id:e.target.value
            })
            }

        >


        <option>
            Choisir
        </option>


        {
        produits.map(p=>(

        <option

        key={p.id}

        value={p.id}

        >

        {p.nom}

        </option>

        ))

        }


        </select>




        <label>
        Quantité produite
        </label>


        <input

        type="number"
        
        name="quantite"

        onChange={
        e=>setProduction({
        ...production,
        quantite:e.target.value
        })
        }

        />





        <h3>
        Matériaux utilisés
        </h3>



        {
        materials.map((m,index)=>(


        <div className="grid" key={index}>


        <select

            onChange={
                e=>
                updateMaterial(
                index,
                "matiere_id",
                e.target.value
                )
            }      

        >


        <option>
            Choisir matière
        </option>
            {
                matieres.map(x=>(

                <option

                    key={x.id}

                    value={x.id}

                >

                    {x.nom}

                </option>

                ))

            }


        </select>



        <input

            type="number"

            placeholder="Quantité"

            onChange={
            e=>
            updateMaterial(
            index,
            "quantite",
            e.target.value
            )
            }

        />



        </div>


        ))

        }



        <div>
            <button

            className="profile"

            type="button"

            onClick={addMaterial}

            >

            + Ajouter matière

            </button>
        </div>

        {
        IsAddedMateriel &&
        <div className="grid">
        <label>
            Coût total matière
        </label>
        <output>{CoutTotalMateriels}</output>

        <label>
            Coût production
        </label>
        <output>{CoutTotalProduction}</output>

        </div>

        }



        <br/>


        <div>
            <button className="profile">

                Enregistrer production

            </button>
        </div>



        </form>


    </div>

)

}


export default ProductionCreate;