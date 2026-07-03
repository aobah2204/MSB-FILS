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

    console.log("ChartData:", ChartData); // Log the ChartData to check its value

    const data = [];

    if(ChartData.length > 0 && Array.isArray(ChartData.date) && Array.isArray(ChartData.quantite)) {
        for (let i = 0; i < ChartData.date.length; i++) {
            data.push({
                mois: ChartData.date[i],
                quantite: ChartData.quantite[i]
            });
        }
    }
    else{
        data.push(

        {
        mois:"Jan",
        quantite:0,
        },

        {
        mois:"Fev",
        quantite:0,
        },

        {
        mois:"Mar",
        quantite:0,
        },

        {
        mois:"Avr",
        quantite:0,
        },

        {
        mois:"Mai",
        quantite:0,
        },

        {
        mois:"Juin",
        quantite:0,
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