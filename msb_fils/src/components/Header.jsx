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


    <div>
        <h2 className="profile">
            {user?.fullname} 
        </h2>
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