import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from "recharts";

import '../CSS/ProductionChart.css'
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";


function ProductionSiteChart({ ChartData }) {

    console.log("ChartData in chart : ", ChartData); // Log the ChartData to check its value

    // Ensure ChartData is an array, default to empty array if not
    const data = Array.isArray(ChartData) ? ChartData : [];  



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


            <XAxis dataKey="date"/>


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

            name="Quantité produite"

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