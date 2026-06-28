import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

import "../CSS/Auth.css";


function Login(){

const navigate = useNavigate();


const [form,setForm] = useState({
    email:"",
    password:""
});

const [user,setUser] = useState({
    email:"",
    phone:"",
    role:"",
    fullname: "",
    address: "",
    password: ""
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
        .eq("password", form.password)
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

function gotoInscription(){
    navigate("/register");
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

                name="password"

                type="password"

                placeholder="Mot de pass"

                onChange={handleChange}

            />



            <button>
                Se connecter
            </button>



            <p>

                Pas de compte ?

                <Link to="/register">
                    Créer un compte
                </Link>

            </p>


        </form>


    </div>

)}


export default Login;