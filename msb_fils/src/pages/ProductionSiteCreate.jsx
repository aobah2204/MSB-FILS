import {
 useState, useEffect
} from "react";

import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";



function ProductionSiteCreate(){

    const navigate = useNavigate();

    const [site,setSite]=useState({

        nom:"",
        adresse:"",
        responsable:"",
        telephone:"",
        capacite:"",
        surface:"",
        equipements:"",
        statut:true,
        resp_id: 0

    });

    const [userResp,setUserResp] = useState({
        email:"",
        phone:"",
        role:"",
        fullname: "",
        address: "",
        password: ""
    });

    const [listResp, setListResp] = useState([]);



    function change(e){

        setSite({

        ...site,

        [e.target.name]:
        e.target.value

        });


    }

    function onChange(e){


        const selected = listResp.find(

            ch => ch.id == e.target.value

        );

        console.log(selected);

        setUserResp(selected);
    }



    async function save(e){

        e.preventDefault();

        console.log(site);

        const table = "siteproduction";

        // set site responsable
        site.resp_id = userResp.id;
        site.responsable = userResp.fullname;

        console.log(site);

            
        const { error } = await supabase.from(table).insert(site);
            
        if(!error){
            alert("Site enregistré");
        }else{
            alert("Site non enregistré : " + error.message);
        }
            
        navigate("/production-sites");

    }

    async function getAllResponsable(){

        const { data: allResp, error: err } = await supabase
            .from("utilisateurs")
            .select("*")
            .eq("role", "Responsable de production");

        if(err){
            alert("Erreur lors du chargement des responsables");
        }else{
            setListResp(allResp);
        }

    }


// s'exécute une seule fois au chargement
useEffect(() => {

    getAllResponsable();

}, []);


return (

<div className="product_page" >


    <h1>
        Nouveau site de production
    </h1>



    <form className="product_form" 
        onSubmit={save}
        >


        <div className="grid">

            <input

                name="nom"

                placeholder="Nom du site"

                onChange={change}

            />

            <input

                name="adresse"

                placeholder="Adresse"

                onChange={change}

            />

            <select
                value={userResp?.id}
                name="responsable"
                onChange={onChange}
                >
                    <option value="">
                        -- Choisir un responsable --
                    </option>
                    {
                        listResp.map((c)=>(

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

                name="telephone"

                placeholder="Téléphone"

                onChange={change}

            />

            <input

                name="capacite"

                placeholder="Capacité production"

                onChange={change}

            />

            <input

                name="surface"

                placeholder="Surface m²"

                onChange={change}

            />

            <textarea

                name="equipements"

                placeholder="Equipements"

                onChange={change}

            />

            <label className="checkbox">


                <input

                    type="checkbox"

                    name="statut"

                    checked={site.statut}

                    onChange={change}

                />
                Site actif
            </label>            

        </div>    

    <br/>

    

        <div className="grid">
            <button className="profile">
                Enregistrer
            </button>
            <button className="profile_back" type="button" onClick={() => navigate("/production-sites")}>
                Annuler
            </button>           
        </div> 



    </form>


</div>

)

}


export default ProductionSiteCreate;