import {
useState,
useEffect
} from "react";

import {
useParams,
useNavigate
} from "react-router-dom";


import "../CSS/ClientCreate.css";
import { supabase } from "../supabase.js";



function SalarieEdit(){


const {id} = useParams();

const navigate = useNavigate();



const [Salarie,setSalarie] = useState({

    fullname:"",
    role:"",
    telephone:"",
    adresse:"",
    email:""
});

const [loading,setLoading] = useState(true);

// Select Salarie
async function getSalarie(id){

    const table = "utilisateurs";
    const { data } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .maybeSingle();
    
    setSalarie(data);
    setLoading(false);
}

useEffect(()=>{
    // simulation chargement API
    getSalarie(id);
},[id]);

async function UpdateSalarie(Salarie){

    setSalarie(Salarie);

    const table = "utilisateurs";

    if (!Salarie) return;

    const { error } = await supabase
        .from(table)
        .update({
            fullname: Salarie.fullname,
            adresse: Salarie.adresse,
            telephone: Salarie.telephone,
            email: Salarie.email,
            role: Salarie.role
    })
    // IMPORTANT :
    .eq("id", Salarie.id);

    if (error) {
        alert(error.message);
        return;
    }
    
    navigate("/salaries");
}



function handleChange(e){


setSalarie({

    ...Salarie,

    [e.target.name]:
    e.target.value

    });
}





function enregistrer(e){


    e.preventDefault();


    console.log(Salarie);

    // Update Salarie
    UpdateSalarie(Salarie);

    alert("Salarie modifié");

    navigate("/salaries");

}





return (

    <div className="client-page">


        <h1>
            Modifier Salarie
        </h1>



        <form className="product-form" onSubmit={enregistrer}>

            <label>
                Nom
            </label>

            <input
                name="fullname"
                value={Salarie.fullname || ""}
                onChange={handleChange}
            />
            

            <label>
                Rôle
            </label>

            <input
                name="role"
                value={Salarie.role || ""}
                onChange={handleChange}
            />

            <label>
                Téléphone
            </label>

            <input
                name="telephone"
                value={Salarie.telephone || ""}
                onChange={handleChange}
            />

            <label>
                Adresse
            </label>

            <textarea
                name="adresse"
                value={Salarie.adresse || ""}
                onChange={handleChange}
            />

            <label>
                Email
            </label>

            <input
                name="email"
                value={Salarie.email || ""}
                onChange={handleChange}
            />

            <div>
                <button className="profile" type="submit" onClick={enregistrer}>
                    Enregistrer
                </button>
            </div>           

        </form>
    </div>

    )

}

export default SalarieEdit;