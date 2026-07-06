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



function LivraisonEdit(){


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


    const [loading,setLoading] = useState(true);

    // Select Livraison
    async function getLivraison(id){

        const table = "livraisons";
        const { data } = await supabase
            .from(table)
            .select("*")
            .eq("id", id)
            .maybeSingle();
        
        setLivraison(data);
        setLoading(false);
    }


useEffect(()=>{
    // simulation chargement API
    getLivraison(id);
    loadData();

},[id]);

    async function UpdateLivraison(Livraison){

        setLivraison(Livraison);

        const table = "livraisons";

        if (!Livraison) return;

        const { error } = await supabase
        .from(table)
        .update({
            reference: Livraison.reference,
            nom: Livraison.nom,
            categorie: Livraison.categorie,
            description: Livraison.description,
            unite: Livraison.unite,
            prixAchat: Livraison.prixAchat,            
            stock: Livraison.stock,
            stockMin: Livraison.stockMin,
            poids: Livraison.poids,
            unite_poids: Livraison.unite_poids,
            longueur: Livraison.longueur,
            unite_longueur: Livraison.unite_longueur,
            largeur: Livraison.largeur,
            unite_largeur: Livraison.unite_largeur,
            hauteur: Livraison.hauteur,
            unite_hauteur: Livraison.unite_hauteur,
            actif: Livraison.actif
        })
        // IMPORTANT :
        .eq("id", Livraison.id);

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/livraisons");
    }



    function handleChange(e){

        setLivraison({

            ...Livraison,

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

    console.log(Livraison);

    // Update Livraison
    UpdateLivraison(Livraison);

    alert("Livraison modifié");

    navigate("/livraisons");

}


return (

    <div className="product-page">

        <h1>
            Modifier Livraison
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
                        value={Livraison?.reference || ""}
                        onChange={handleChange}
                    />
                </div>
                

                <div>
                    <label>
                        Vente
                    </label>
                    <select
                        value={Livraison?.vente_id}
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
                        value={Livraison?.vehicule_id}
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
                    value={Livraison?.libelle}
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
                        value={Livraison.addresse}
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
                        value={Livraison.date_livraison.split('T')[0]}
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
                        value={Livraison?.montant}
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
                Modifier
            </button>
        </div>

    </form>



    </div>

)}


export default LivraisonEdit;