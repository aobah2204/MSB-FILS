import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import '../CSS/ProductionChart.css'


function AchatChart(){


const data = [

{
 mois:"Jan",
 actuel:200,
 moisDernier:950,
 anneeDerniere:800
},

{
 mois:"Fev",
 actuel:500,
 moisDernier:300,
 anneeDerniere:100
},

{
 mois:"Mar",
 actuel:100,
 moisDernier:600,
 anneeDerniere:800
},

{
 mois:"Avr",
 actuel:200,
 moisDernier:900,
 anneeDerniere:1700
}

];



return (

    <div className="chart-card">


        <h2 className="titre_graphe">
            Evolution achat matières premières
        </h2>



        <div
            style={{
            width:"100%",
            height:300
            }}
        >


            <ResponsiveContainer>


            <LineChart data={data}>


            <CartesianGrid strokeDasharray="3 3" />


            <XAxis dataKey="mois" />


            <YAxis />


        <Tooltip />



        <Line

            type="monotone"

            dataKey="actuel"

            name="Cette année"

            strokeWidth={3}

        />



        <Line

            type="monotone"

            dataKey="moisDernier"

            name="Mois dernier"

            strokeWidth={2}

        />



        <Line

            type="monotone"

            dataKey="anneeDerniere"

            name="Même mois année dernière"

            strokeWidth={2}

        />



        </LineChart>


        </ResponsiveContainer>


    </div>


</div>

)

}


export default AchatChart;