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


    <div className="profile_user">
        <h3>
            {user?.fullname} 
        </h3>
        <p>{user?.role}</p>
    </div>
            

    <div className="header-actions">


        <div className="notification">
        🔔
        </div>
        <button className="profile" onClick={logout}>
            <LogOut />
        </button>

    </div>


</header>

)

}


export default Header;