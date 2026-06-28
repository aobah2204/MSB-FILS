import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

import "../CSS/Auth.css";


function Login(){

const navigate = useNavigate();


const [form,setForm] = useState({
    email:"",
    phone:""
});

const [user,setUser] = useState({
    email:"",
    phone:"",
    role:"",
    fullname: ""
});


function handleChange(e){

    setForm({
    ...form,
    [e.target.name]:e.target.value
    });

}

const { login } = useAuth();

async function handleSubmit(e){

    e.preventDefault();


    /*
    Ici on mettra :
    supabase.auth.signInWithPassword()
    */

    const { data: user, error: err } = await supabase
        .from("utilisateurs")
        .select("*")
        .eq("email", form.email)
        .eq("telephone", form.phone)
        .maybeSingle();

    if(err){
        alert("Echec connexion");
    }else{

        localStorage.setItem(
        "auth",
        "true"
        );

        console.log(user);

        setUser(user);
        login(user);

        navigate("/");
    }

    


}



return (

    <div className="auth-page">


        <form 
        className="auth-card"
        onSubmit={handleSubmit}
        >


            <h1>
                Connexion
            </h1>



            <input

                name="email"

                type="email"

                placeholder="Email"

                onChange={handleChange}

            />

            <input

                name="phone"

                type="text"

                placeholder="Téléphone"

                onChange={handleChange}

            />



            <button>
                Se connecter
            </button>



            <p>

                Pas de compte ?

                <a href="/register">
                Créer un compte
                </a>

            </p>


        </form>


    </div>

)}


export default Login;