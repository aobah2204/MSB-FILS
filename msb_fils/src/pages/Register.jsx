import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

import "../CSS/Auth.css";


function Register(){


const navigate = useNavigate();


const [user,setUser]=useState({

    fullname:"",
    telephone: "",
    email:"",
    role: "Administrateur",
});



function handleChange(e){

    setUser({

        ...user,

        [e.target.name]:
        e.target.value

    });

}



async function handleSubmit(e){

    e.preventDefault();

    /*
    supabase.auth.signUp()
    */

    console.log(user);
    
    
    const table = "utilisateurs";
    
    const { error } = await supabase.from(table).insert(user);
    
    if(!error){
        alert("Compte créé");
        navigate("/login");
    }else{

        alert("Compte non créé : " + error.message);
    }
    
    

}




return (

    <div className="auth-page">


        <form
            className="auth-card"
            onSubmit={handleSubmit}
        >


            <h1>
                Inscription
            </h1>

            <input

                name="fullname"

                placeholder="Nom et Prénom"

                onChange={handleChange}

            />

            <input

                name="telephone"

                placeholder="Numéro de téléphone"

                value={user.phone}

                onChange={handleChange}

            />

            <input

                name="email"

                type="email"

                placeholder="Email"

                value={user.email}

                onChange={handleChange}

            />

            <select
                name="role"
                value={user.role}
                onChange={handleChange}
                >

                    <option>
                        Administrateur
                    </option>

                    <option>
                        Responsable de production
                    </option>

                    <option>
                        Magasinier
                    </option>

                    <option>
                        Commercial
                    </option>

                    <option>
                        Comptable
                    </option>

                    <option>
                        Chauffeur
                    </option>

            </select>            

            <button>
                Créer un compte
            </button>

        </form>


    </div>

)}


export default Register;