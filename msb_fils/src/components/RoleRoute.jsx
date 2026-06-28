import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function RoleRoute({
  children,
  roles
}) {


const { user } = useAuth();



if(!user){

    return (
    <Navigate to="/login"/>
    );

}



if(!roles.includes(user.role)){

    return (

        <div>

        <h2>
            Accès refusé
        </h2>


        <p>
            Vous n'avez pas les droits nécessaires.
        </p>


        </div>

    );

}



return children;


}


export default RoleRoute;