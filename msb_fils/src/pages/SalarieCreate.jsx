import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

import "../CSS/Auth.css";


function SalarieCreate(){


const navigate = useNavigate();


const [user,setUser]=useState({

    fullname:"",
    telephone: "",
    email:"",
    role: "Administrateur",
    adresse: "",
    password: ""
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
        navigate("/salaries");
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


            <h2>
                Inscription salarié
            </h2>

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

            <input

                name="adresse"

                type="adress"

                placeholder="Adresse"

                value={user.adresse}

                onChange={handleChange}

            />

            <input

                name="password"

                type="password"

                placeholder="Mot de pass"

                value={user.password}

                onChange={handleChange}

            />

            <select
                name="role"
                value={user.role}
                onChange={handleChange}
                >

                    <option>
                        Superviseur
                    </option>
                    
                    <option>
                        Administrateur
                    </option>

                    <option>
                        Coordinateur
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

                    <option>
                        Prestataire
                    </option>


            </select>  

            <div>
                <button>
                    Créer un compte
                </button>            
            </div> 
        </form>


    </div>

)}


export default SalarieCreate;