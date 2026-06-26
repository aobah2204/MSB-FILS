import "./Dashboard.css";


function Dashboard(){

return (

<div>

    <h1>
        Bienvenue 👋
    </h1>


    <div className="cards">


        <div className="card">
            <h3>Clients</h3>
            <p>245</p>
        </div>


        <div className="card">
            <h3>Factures</h3>
            <p>120</p>
        </div>


        <div className="card">
            <h3>CA</h3>
            <p>45 000 €</p>
        </div>


    </div>


</div>

)

}


export default Dashboard;