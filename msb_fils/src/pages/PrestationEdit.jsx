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



function PrestationEdit(){


    const {id} = useParams();

    const navigate = useNavigate();

    const [ventes, setVentes] = useState([]);
    const [vehicules, setVehicules] = useState([]);
    const [prestataires, setPrestataires] = useState([]);

    async function loadData() {
        const [{ data: ventesData }, { data: vehiculesData }, { data: prestasData }] = await Promise.all([
        supabase.from("ventes").select("*").order("date_vente", { ascending: false }),
        supabase.from("vehicules").select("id, marque, immatriculation, chauffeur"),
        supabase.from("utilisateurs").select("*"),
        ]);

        setVentes(ventesData || []);
        setVehicules(vehiculesData || []);
        setPrestataires(prestasData || []);
    }



    const [Prestation,setPrestation] = useState({

        reference:"",
            vente_id: "",
            vehicule_id: "",
            prestataire_id: "",
            date_prestation: "",
            statut: "",
            montant: "",
            adresse: "",
            description: ""
    });


    const [loading,setLoading] = useState(true);

    // Select Prestation
    async function getPrestation(id){

        const table = "prestations";
        const { data } = await supabase
            .from(table)
            .select("*")
            .eq("id", id)
            .maybeSingle();
        
        setPrestation(data);
        setLoading(false);
    }


useEffect(()=>{
    // simulation chargement API
    getPrestation(id);
    loadData();

},[id]);

    async function UpdatePrestation(Prestation){

        setPrestation(Prestation);

        const table = "prestations";

        if (!Prestation) return;

        const { error } = await supabase
        .from(table)
        .update({
            reference: Prestation.reference,
            vente_id: Prestation.vente_id,
            prestataire_id: Prestation.prestataire_id,
            type: Prestation.type,
            description: Prestation.description,
            date_prestation: Prestation.date_prestation,
            statut: Prestation.statut
        })
        // IMPORTANT :
        .eq("id", Prestation.id);

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/Prestations");
    }



    function handleChange(e){

        setPrestation({

            ...Prestation,

            [e.target.name]:
            e.target.value

        });

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

    {/** Get all prestataires */}
    const [prestataire,setPrestataire] = useState(null);
    function onChangePrestataire(e){

        const selected = prestataires.find(

            f => f.id == e.target.value

        );
        setPrestataire(selected);
    }

    async function getClient(id){
         const { client } = await supabase.from("clients").select("*").eq("id", id);
         return client;
    }


function enregistrer(e){

    e.preventDefault();

    console.log(Prestation);

    // Update Prestation
    UpdatePrestation(Prestation);

    alert("Prestation modifié");

    navigate("/Prestations");

}


return (

    <div className="product-page">

        <h1>
            Modifier Prestation
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
                        value={Prestation?.reference || ""}
                        onChange={handleChange}
                    />
                </div>
                

                <div>
                    <label>
                        Vente
                    </label>
                    <select
                        value={Prestation?.vente_id}
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

                {/*
                <div>
                    <label>
                        Véhicule
                    </label>
                    <select
                        value={Prestation?.vehicule_id}
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
                */}
                <div>
                    <label>
                        Prestataire
                    </label>
                    <select
                        value={Prestation?.prestataire_id}
                        name="prestataire_id"
                        onChange={onChangePrestataire}
                    >
                        <option value="">
                        -- selectionner le prestataire --
                        </option>
                        {
                            prestataires.map((prestataire)=>(

                                <option
                                    key={prestataire.id}
                                    value={prestataire.id}
                                >
                                    {prestataire?.fullname} {prestataire?.adresse} - {prestataire?.telephone}
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
                    value={Prestation?.description}
                        type="text"
                        name="description"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                        Adresse
                    </label>

                    <input
                        type="text"
                        name="adresse"
                        value={Prestation?.adresse}
                        onChange={handleChange}
                    />
                </div>


                <div>
                    <label>
                        Date Prestation
                    </label>

                    <input
                        type="date"
                        name="date_prestation"
                        value={Prestation?.date_prestation.split('T')[0]}
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
                        value={Prestation?.montant}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>
                            Statut
                        </label>
                        <select
                            value={Prestation?.statut}
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
                                Effectuée
                            </option>
                            <option>
                                Annulée
                            </option>

                        </select>     
                </div>
            </div>

        <div>
            <button className="profile">
                Modifier
            </button>
        </div>

    </form>



    </div>

)}


export default PrestationEdit;