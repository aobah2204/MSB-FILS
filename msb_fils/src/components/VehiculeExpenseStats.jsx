import {
TrendingUp,
TrendingDown,
Fuel,
Wrench,
Shield,
CircleDollarSign
} from "lucide-react";

const icons={

Carburant:<Fuel size={18}/>,

Réparation:<Wrench size={18}/>,

Assurance:<Shield size={18}/>

};

export default function VehicleExpenseStats({

categories=[],

evolution=[]

}){

return(

<div className="vehicle-card">

<h2 className="profile">

🚚 Dépenses des véhicules

</h2>

{

evolution.map(vehicle=>{

const total=vehicle.mois_courant;

const cats=categories.filter(

c=>c.id===vehicle.id

);

const max=Math.max(

...cats.map(c=>Number(c.montant_total)),

1

);

return(

<div

className="vehicle-item"

key={vehicle.id}

>

<div className="vehicle-header">

<div>

<h3>

{vehicle.immatriculation}

</h3>

<span>

{vehicle.marque} {vehicle.modele}

</span>

</div>

<div className={

vehicle.evolution>=0

?

"trend positive"

:

"trend negative"

}>

{

vehicle.evolution>=0

?

<TrendingUp/>

:

<TrendingDown/>

}

{vehicle.evolution} %

</div>

</div>

{

cats.map(cat=>(

<div key={cat.categorie}>

<div className="cat-line">

<div>

{

icons[cat.categorie]

??

<CircleDollarSign size={18}/>

}

{cat.categorie}

</div>

<div>

{

new Intl.NumberFormat("fr-FR")

.format(cat.montant_total)

} GNF

</div>

</div>

<div className="progress">

<div

className="fill"

style={{

width:`${cat.montant_total/max*100}%`

}}

>

</div>

</div>

</div>

))

}

<div className="resume">

<div>

Ce mois

<strong>

{

new Intl.NumberFormat("fr-FR")

.format(vehicle.mois_courant)

} GNF

</strong>

</div>

<div>

Mois précédent

<strong>

{

new Intl.NumberFormat("fr-FR")

.format(vehicle.mois_precedent)

} GNF

</strong>

</div>

</div>

</div>

)

})

}

</div>

)

}