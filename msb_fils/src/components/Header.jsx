import "./Header.css";
import {
    useAuth
} from "../context/AuthContext";

import {
 User,
 LogOut
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function Header(){

    const { user, logout } = useAuth();
    const navigate = useNavigate();

return (

<header className="header">


    <div>
        <h4 className="profile_user">
            {user?.fullname} 
        </h4>
        <p>{user?.role}</p>
    </div>

    <div>
        <h2>        
            MSB & FILS Portail
        </h2>
    </div>
            

    <div className="header-actions">


        <div className="notification">
        🔔
        </div>
        <button className="profile" type="button" onClick={() => navigate("/")}>Accueil</button>
        <button className="profile" onClick={logout}>
            <LogOut />
        </button>

    </div>


</header>

)

}


export default Header;