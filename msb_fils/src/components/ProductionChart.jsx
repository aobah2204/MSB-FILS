import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import '../CSS/ProductionChart.css'


function ProductionChart(){


const data = [

{
 mois:"Jan",
 actuel:1200,
 moisDernier:950,
 anneeDerniere:800
},

{
 mois:"Fev",
 actuel:1500,
 moisDernier:1300,
 anneeDerniere:1100
},

{
 mois:"Mar",
 actuel:1800,
 moisDernier:1600,
 anneeDerniere:1400
},

{
 mois:"Avr",
 actuel:2200,
 moisDernier:1900,
 anneeDerniere:1700
}

];



return (

    <div className="chart-card">


        <h2 className="titre_graphe">
            Evolution production
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

        {/* Légende automatique */}
        <Legend
        verticalAlign="bottom"
        height={40}
        />

        <Line

            type="monotone"

            dataKey="actuel"

            name="Cette année"

            stroke="#2563eb"

            strokeWidth={3}

            dot={{r:5}}

        />



        <Line

            type="monotone"

            dataKey="moisDernier"

            name="Mois dernier"

            stroke="#16a34a"

            strokeWidth={2}

            dot={{r:5}}

        />



        <Line

            type="monotone"

            dataKey="anneeDerniere"

            name="Même mois année dernière"

            stroke="#f97316"

            strokeWidth={3}

            dot={{r:5}}

        />



        </LineChart>


        </ResponsiveContainer>


    </div>


</div>

)

}


export default ProductionChart;