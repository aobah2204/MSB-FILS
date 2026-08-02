import "./Header.css";
import {
    useAuth
} from "../context/AuthContext";

import {
 User,
 LogOut
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import "../CSS/Notification.css";
import { supabase } from "../supabase";


function Header(){

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

    function Notification({ notifications = [] }) {

        const [open, setOpen] = useState(false);

        const unread = notifications.filter(n => !n.lu).length;

        return (

            <div className="notification-container">

                <button
                    className="notification-button"
                    onClick={() => setOpen(!open)}
                >

                    <Bell size={24} />

                    {unread > 0 && (

                        <span className="notification-badge">

                            {unread > 99 ? "99+" : unread}

                        </span>

                    )}

                </button>

                {open && (

                    <div className="notification-menu">

                        <h4>Notifications</h4>

                        {

                            notifications.length === 0 ?

                            <p className="empty">

                                Aucune notification

                            </p>

                            :

                            notifications.map(notif => (

                                <div
                                    key={notif.id}
                                    className={`notification-item ${notif.lu ? "" : "unread"}`}
                                >

                                    <div className="notification-title">

                                        {notif.titre}

                                    </div>

                                    <div className="notification-message">

                                        {notif.message}

                                    </div>

                                    <div className="notification-date">

                                        {new Date(notif.created_at).toLocaleString("fr-FR")}

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )}

            </div>

        );

    }

    async function loadNotifications() {

        const { data } = await supabase
            .from("notifications")
            .select("*")
            .order("created_at", { ascending: false });

        setNotifications(data || []);
    }

    useEffect(() => {
    loadNotifications();
}, []);

return (

<header className="header">


    <div>
        <h4 className="profile_user_header"><User size={25}/> {user?.fullname} </h4>
        <p>{user?.role}</p>
    </div>

    {/*<div>
        <h2>        
            MSB & FILS Portail
        </h2>
    </div>*/}
            

    <div className="header-actions">


        <div className="notification">
            <Notification notifications={notifications} />
        </div>
        {/*<button className="profile" type="button" onClick={() => navigate("/")}>Accueil</button>*/}
        <button className="profileExit" onClick={logout}>
            <LogOut />
        </button>

    </div>


</header>

)

}


export default Header;