import {
    ArrowUp,
    ArrowDown,
    ShoppingCart,
    Wallet,
    Receipt,
    TrendingUp
} from "lucide-react";

import "../CSS/FinanceCards.css";

const icons={

    Ventes:<ShoppingCart size={28}/>,

    Encaissements:<Wallet size={28}/>,

    "Dépenses":<Receipt size={28}/>,

    "Bénéfice":<TrendingUp size={28}/>

};

export default function FinanceCards({data=[]}){

return(

<div className="finance-grid">
    {
    data.map(card=>(
    <div
        key={card.indicateur}
        className="finance-card"
    >

    <div className="finance-icon">
        {icons[card.indicateur]}
    </div>

    <div className="finance-body">
        <h4>
            {card.indicateur}
        </h4>
    <h2>    {new Intl.NumberFormat("fr-FR").format(card.courant)} GNF   </h2>
    <p>
        Mois précédent: <strong>{new Intl.NumberFormat("fr-FR").format(card.precedent)} GNF</strong>
    </p>

    </div>
    <div  className={card.evolution >= 0 ? "finance-trend positive" : "finance-trend negative" }>
        { card.evolution >= 0 ? <ArrowUp size={18}/> : <ArrowDown size={18}/> } {card.evolution} %
    </div>
</div>

))

}

</div>

)

}