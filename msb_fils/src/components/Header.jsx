import "./Header.css";
import {
    useAuth
} from "../context/AuthContext";

import {
 User,
 LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import "../CSS/Notification.css";
import { supabase } from "../supabase";


function Header(){

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [rawNotifications, setRawNotifications] = useState([]);
    const [readNotificationIds, setReadNotificationIds] = useState([]);

    const normalizeReadIds = (ids) => {
        return Array.isArray(ids) ? ids.map(id => String(id)) : [];
    };

    const applyReadState = (notifs, ids) => {
        const readSet = new Set(normalizeReadIds(ids));
        return notifs.map(n => ({
            ...n,
            lu: n.lu || readSet.has(String(n.id))
        }));
    };

    const notifications = applyReadState(rawNotifications, readNotificationIds);

    function Notification({ notifications = [], onItemClick }) {

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
                                    onClick={async () => {
                                        if (typeof onItemClick === "function") {
                                            await onItemClick(notif);
                                        }
                                        setOpen(false);
                                    }}
                                    style={{ cursor: "pointer" }}
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

    function getLocalStorageKey() {
        return `notifications_read_${user?.id || "anonymous"}`;
    }

    function loadReadNotificationIds() {
        try {
            const key = getLocalStorageKey();
            const stored = window.localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setReadNotificationIds(parsed);
                }
            }
        } catch (err) {
            console.error("Erreur lecture localStorage notifications lu :", err);
        }
    }

    function saveReadNotificationIds(ids) {
        try {
            const key = getLocalStorageKey();
            window.localStorage.setItem(key, JSON.stringify(ids));
        } catch (err) {
            console.error("Erreur écriture localStorage notifications lu :", err);
        }
    }

    async function loadNotifications() {

        const { data } = await supabase
            .from("notifications")
            .select("*")
            .order("created_at", { ascending: false });

        setRawNotifications(data || []);
    }

    async function handleNotificationClick(notif) {
        try {
            if (!readNotificationIds.includes(notif.id)) {
                const nextIds = [...readNotificationIds, String(notif.id)];
                setReadNotificationIds(nextIds);
                saveReadNotificationIds(nextIds);
            }

            if (notif.lien) {
                navigate(notif.lien);
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadReadNotificationIds();
        loadNotifications();
    }, [user?.id]);

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
            <Notification notifications={notifications} onItemClick={handleNotificationClick} />
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