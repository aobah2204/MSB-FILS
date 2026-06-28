import "./Header.css";
import {
    useAuth
} from "../context/AuthContext";

import {
 User,
 LogOut
} from "lucide-react";

function Header(){

    const { user, logout } = useAuth();

return (

<header className="header">


    <div className="profile">

        <h2>
            <User /> {user?.fullname} 
        </h2>      

    </div>

    <div className="header-actions">


        <div className="notification">
        🔔
        </div>
        <button onClick={logout}>
            <LogOut />
        </button>

    </div>


</header>

)

}


export default Header;