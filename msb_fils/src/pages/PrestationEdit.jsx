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

    async function loadData() {
        const [{ data: ventesData }, { data: vehiculesData }] = await Promise.all([
        supabase.from("ventes").select("*").order("date_vente", { ascending: false }),
        supabase.from("vehicules").select("id, marque, immatriculation, chauffeur"),
        ]);

        setVentes(ventesData || []);
        setVehicules(vehiculesData || []);
    }



    const [Prestation,setPrestation] = useState({

        reference:"",
            vente_id: "",
            vehicule_id: "",
            date_Prestation: "",
            statut: "",
            montant: "",
            addresse: "",
            libelle: ""
    });


    const [loading,setLoading] = useState(true);

    // Select Prestation
    async function getPrestation(id){

        const table = "Prestations";
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

        const table = "Prestations";

        if (!Prestation) return;

        const { error } = await supabase
        .from(table)
        .update({
            reference: Prestation.reference,
            nom: Prestation.nom,
            categorie: Prestation.categorie,
            description: Prestation.description,
            unite: Prestation.unite,
            prixAchat: Prestation.prixAchat,            
            stock: Prestation.stock,
            stockMin: Prestation.stockMin,
            poids: Prestation.poids,
            unite_poids: Prestation.unite_poids,
            longueur: Prestation.longueur,
            unite_longueur: Prestation.unite_longueur,
            largeur: Prestation.largeur,
            unite_largeur: Prestation.unite_largeur,
            hauteur: Prestation.hauteur,
            unite_hauteur: Prestation.unite_hauteur,
            actif: Prestation.actif
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


                <div>
                    <label>
                        Description
                    </label>

                    <input
                    value={Prestation?.libelle}
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
                        value={Prestation.addresse}
                        onChange={handleChange}
                    />
                </div>


                <div>
                    <label>
                        Date Prestation
                    </label>

                    <input
                        type="date"
                        name="date_Prestation"
                        value={Prestation.date_Prestation.split('T')[0]}
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
                                Livré
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