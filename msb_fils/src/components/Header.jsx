import "./Header.css";


function Header(){

return (

<header className="header">


    <div className="profile">

        <h2>
            Tableau de bord
        </h2>

    </div>



    <div className="header-actions">


        <div className="notification">
        🔔
        </div>


        <div className="profile_admin">

            <span className="profile-name">
            Admin
            </span>

        </div>


    </div>


</header>

)

}


export default Header;