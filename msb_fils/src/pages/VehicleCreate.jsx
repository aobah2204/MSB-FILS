import {
    useState, useEffect
} from "react";

import { supabase } from "../supabase";
import {
    useNavigate
} from "react-router-dom";

import '../CSS/ProductCreate.css'

function VehicleCreate(){


    const [vehicle,setVehicle]=useState({

        marque:"",
        modele:"",
        immatriculation:"",
        annee:"",
        chauffeur:"",
        kilometrage:"",
        carburant:"Diesel",
        user_id: 0,

    });

    const [chauffeur,setChauffeur] = useState(null);

    const [chauffeurs, setAllChauffeur] = useState([]);

    const navigate = useNavigate();


    function change(e){

        setVehicle({

            ...vehicle,

            [e.target.name]:
            e.target.value

        });

    }

    function onChange(e){


        const selected = chauffeurs.find(

            ch => ch.id == e.target.value

        );

        console.log(selected);

        setChauffeur(selected);
    }

    async function getAllChauffeur(){

        const { data } = await supabase
                .from("utilisateurs")            
                .select("*")
                .eq("role","Chauffeur");

        if (!data) return alert("Aucun chauffeurs");

        console.log(data);
        // Alimentation de la liste des chauffeurs
        setAllChauffeur(data);
    }

    async function save(e){

        e.preventDefault();


        
        const table = "vehicules";

        // set chauffeur id
        vehicle.user_id = chauffeur.id;
        vehicle.chauffeur = chauffeur.fullname;

        console.log(vehicle);

        
        const { error } = await supabase.from(table).insert(vehicle);
        
        if(!error){
            alert("Véhicule enregistré");
        }else{
            alert("Véhicule non enregistré : " + error.message);
        }
        
        navigate("/vehicules");

    }

    function setUserId(e){

        e.preventDefault();

        console.log(e);

        if(chauffeur){
            setChauffeur(e.target.value);
        }
    }


// s'exécute une seule fois au chargement
useEffect(() => {

    getAllChauffeur();

}, []);


return (

    <div className="product_page">


        <h1 className="product_title">
        Nouveau véhicule
        </h1>

        <form  className="product_form" onSubmit={save}>

            <div className="grid">

                <input
                    name="marque"
                    placeholder="Marque"
                    onChange={change}
                />

                <input
                    name="modele"
                    placeholder="Modèle"
                    onChange={change}
                />

                <input
                    name="immatriculation"
                    placeholder="Immatriculation"
                    onChange={change}
                />

                <input
                    name="annee"
                    placeholder="Année"
                    onChange={change}
                />

                <select
                    value={chauffeur?.id}
                    name="chauffeur"
                    onChange={onChange}
                >
                    <option value="">
                    -- Choisir un chauffeur --
                    </option>
                    {
                        chauffeurs.map((c)=>(

                            <option
                                key={c.id}
                                value={c.id}
                            >
                                {c.fullname}
                            </option>
                        ))
                    }


                </select>


                <input
                    name="kilometrage"
                    type="int"
                    placeholder="Kilométrage"
                    onChange={change}
                />

                <select
                    name="carburant"
                    onChange={change}
                >

                    <option>
                    Diesel
                    </option>

                    <option>
                    Essence
                    </option>

                    <option>
                    Electrique
                    </option>

                </select>

            </div>
            
            <br/>

            <div>

                <button className="profile" >
                    Enregistrer
                </button>

            </div>
            
        </form>


    </div>

)

}


export default VehicleCreate;