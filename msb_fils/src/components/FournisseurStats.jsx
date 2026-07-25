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
        ...data.map(c => Number(c.montant_total || 0))
    );

    return (

        <div className="client-stats-card">

            <div className="client-header">

                <p className="profile"> 🏆Top 10 des Fournisseurs</p>

            </div>

            {

                data.map((client,index)=>{

                    const pourcentage =
                        maxCA === 0
                            ? 0
                            : (client.montant_total/maxCA)*100;

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

                                        {client.nb_achats} achats --  {client.nb_depenses} dépenses
                                
                                    </span>

                                </div>

                                <div className="client-ca">

                                    {

                                        new Intl.NumberFormat("fr-FR")
                                        .format(client.montant_total)

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