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
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";


function ProductionSiteChart({ ChartData }) {

    console.log("ChartData in chart : ", ChartData); // Log the ChartData to check its value

    const data = [];

    if(ChartData.length > 0 ) {
        for (let i = 0; i < ChartData.length; i++) {
            console.log("ChartData.date[i]: ", ChartData.date[i]); // Log each date
            console.log("ChartData.quantite[i]: ", ChartData.quantite[i]); // Log each quantite
            data.push({
                date: ChartData.date[i],
                quantite: ChartData.quantite[i]
            });
        }
    }
    else{
        data.push(

        {
        date:"01/02/2026",
        quantite:2000,
        },

        {
        date:"06/02/2026",
        quantite:500,
        },

        {
        date:"01/03/2026",
        quantite:100,
        },

        {
        date:"01/04/2026",
        quantite:1000,
        },

        {
        date:"01/05/2026",
        quantite:500,
        },

        {
        date:"01/06/2026",
        quantite:1000,
        },


        );
    }



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


            <XAxis dataKey="date" />


            <YAxis />


        <Tooltip />

        {/* Légende automatique */}
        <Legend
        verticalAlign="bottom"
        height={40}
        />

        <Line

            type="monotone"

            dataKey="quantite"

            name="Cette année"

            stroke="#2563eb"

            strokeWidth={3}

            dot={{r:5}}

        />       



        </LineChart>


        </ResponsiveContainer>


    </div>


</div>

)

}


export default ProductionSiteChart;