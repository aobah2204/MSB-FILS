import {
    Eye,
    Pencil,
    Trash2,
    Calendar,
    DollarSign
} from "lucide-react";


export default function CardList({

    data=[],

    title,

    subtitle,

    amount,

    date,

    actions={}

}){

return(

<div className="card-list">

{

data.map(item=>(

<div

className="erp-card"

key={item.id}

>

<div className="card-header">

<div>

<h3>

{title(item)}

</h3>

<p>

{subtitle(item)}

</p>

</div>

</div>

<div className="card-body">

<div className="card-row">

<DollarSign size={16}/>

<strong>

{

new Intl.NumberFormat("fr-FR")

.format(amount(item))

}

GNF

</strong>

</div>

<div className="card-row">

<Calendar size={16}/>

<span>

{date(item)}

</span>

</div>

</div>

<div className="card-footer">

{actions.view &&

<button onClick={()=>actions.view(item)}>

<Eye size={18}/>

</button>

}

{actions.edit &&

<button onClick={()=>actions.edit(item)}>

<Pencil size={18}/>

</button>

}

{actions.delete &&

<button onClick={()=>actions.delete(item)}>

<Trash2 size={18}/>

</button>

}

</div>

</div>

))

}

</div>

)

}