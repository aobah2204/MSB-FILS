import { useState, useEffect } from "react";

import "../CSS/ProductCreate.css";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

    


function LivraisonCreate(){

    const navigate = useNavigate();

    const [ventes, setVentes] = useState([]);
    const [vehicules, setVehicules] = useState([]);

    async function loadData() {
        const [{ data: ventesData }, { data: vehiculesData }] = await Promise.all([
        supabase.from("ventes").select("*").order("date_vente", { ascending: false }),
        supabase.from("vehicules").select("id, marque, immatriculation, chauffeur"),
        ]);

        setVentes(ventesData || []);
        setVehicules(vehiculesData || []);
    }



    const [Livraison,setLivraison] = useState({

        reference:"",
        vente_id: "",
        vehicule_id: "",
        date_livraison: "",
        statut: "",
        montant: "",
        addresse: "",
        libelle: ""

    });



    function handleChange(e){


        const {name,value,type,checked}=e.target;

        setLivraison({

            ...Livraison,

            [name]:
            type==="checkbox"
            ? checked
            : value

        });
    }




    async function handleSubmit(e){

        e.preventDefault();

        console.log(Livraison);

        // API Supabase ici
        const table = "livraisons";

        // Set vehicule
        if (vehicule) {
            Livraison.vehicule_id = vehicule.id;
        }else{
            alert("Veuillez selectionnez un véhicule");
        }

        // set vente id
        if(vente){
            Livraison.vente_id = vente.id;
        }else{
            alert("Veuillez selectionnez une vente");
        }
        
        const { error } = await supabase.from(table).insert(Livraison);
        
        if(!error){
            alert("Livraison enregistré");
        }else{
            alert("Livraison non enregistré : " + error.message);
        }

        navigate("/livraisons");
    }

    {/** Get all vehicules */}
    const [vehicule,setVehicule] = useState(null);
    function onChangeVehicule(e){

        const selected = vehicules.find(

            f => f.id == e.target.value

        );
        setVehicule(selected);
    }


    {/** Get all ventes */}
    const [vente,setVente] = useState(null);
    function onChangeVente(e){

        const selected = ventes.find(

            f => f.id == e.target.value

        );
        setVente(selected);
    }

    async function getClient(id){
         const { client } = await supabase.from("clients").select("*").eq("id", id);
         return client;
    }


useEffect(()=>{
    loadData();
},[])

return (

<div className="product-page">


    <h1 className="titre">
        Création Livraison
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
                    Vente
                </label>
                <select
                    value={vente?.id}
                    name="vente_id"
                    onChange={onChangeVente}
                >
                    <option value="">
                    -- selectionner la vente --
                    </option>
                    {
                        ventes.map((vente)=>(

                            <option
                                key={vente.id}
                                value={vente.id}
                            >
                                {vente?.description} - {vente?.date_vente} : {getClient(vente?.client_id).nom} {getClient(vente?.client_id).prenom}
                            </option>
                        ))
                    }


                </select>
            </div>


            <div>
                <label>
                    Véhicule
                </label>
                <select
                    value={vehicule?.id}
                    name="vehicule_id"
                    onChange={onChangeVehicule}
                >
                    <option value="">
                    -- selectionner le véhicule --
                    </option>
                    {
                        vehicules.map((vehicule)=>(

                            <option
                                key={vehicule.id}
                                value={vehicule.id}
                            >
                                {vehicule?.immatriculation} {vehicule?.marque} - {vehicule?.chauffeur}
                            </option>
                        ))
                    }


                </select>
            </div> 


            <div>
                <label>
                    Description
                </label>

                <input
                    type="text"
                    name="libelle"
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Adresse
                </label>

                <input
                    type="text"
                    name="addresse"
                    onChange={handleChange}
                />
            </div>


            <div>
                <label>
                    Date livraison
                </label>

                <input
                    type="date"
                    name="date_livraison"
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>
                    Montant
                </label>

                <input
                    type="number"
                    name="montant"
                    onChange={handleChange}
                />
            </div>

            <div>
            <label>
                    Statut
                </label>
                <select
                    value={Livraison?.statut}
                    name="statut"
                    onChange={handleChange}
                >
                    <option value="">
                    -- sélectionner le statut --
                    </option> 

                    <option>
                        En cours
                    </option>
                    <option>
                        Livré
                    </option>

                </select>     
        </div>

        </div>  

        

        <div>
            <button className="profile">
                Créer
            </button>
        </div>

    </form>
</div>
)}


export default LivraisonCreate;