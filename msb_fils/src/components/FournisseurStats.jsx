import { Trophy, ShoppingCart, Receipt } from "lucide-react";

function FournisseurStats({ data = [] }) {

    if (!data.length) {
        return (
            <div className="client-stats-card">
                <h2 className="profile">🏆 Top Fournisseurs</h2>
                <p>Aucune donnée.</p>
            </div>
        );
    }

    const maxCA = Math.max(
        ...data.map(c => Number(c.chiffre_affaires || 0))
    );

    return (

        <div className="client-stats-card">

            <div className="client-header">

                <Trophy size={24} color="#f59e0b"/>

                <h2>Top 10 des Fournisseurs</h2>

            </div>

            {

                data.map((client,index)=>{

                    const pourcentage =
                        maxCA === 0
                            ? 0
                            : (client.chiffre_affaires/maxCA)*100;

                    return(

                        <div
                            key={client.id}
                            className="client-item"
                        >

                            <div className="client-top">

                                <div className="client-avatar">

                                    {
                                        client.societe
                                            ? client.societe[0]
                                            : client.nom[0]
                                    }

                                </div>

                                <div className="client-info">

                                    <h4>

                                        {index+1}. {

                                            client.societe - client.nom - client.prenom ||

                                            `${client.nom} ${client.prenom} - ${client.societe}`

                                        }

                                    </h4>

                                    <span>

                                        {client.nb_achats} achats
                                
                                    </span>

                                </div>

                                <div className="client-ca">

                                    {

                                        new Intl.NumberFormat("fr-FR")
                                        .format(client.chiffre_affaires)

                                    } GNF

                                    

                                </div>

                            </div>

                            <div className="progress">

                                <div

                                    className="progress-fill"

                                    style={{
                                        width:`${pourcentage}%`
                                    }}

                                />

                            </div>

                        </div>

                    )

                })

            }

        </div>

    )

}

export default FournisseurStats;