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


function VenteSiteChart({ ProduitsVendu }) {

    console.log("ChartData in chart : ", ProduitsVendu); // Log the ChartData to check its value

    // Ensure ChartData is an array, default to empty array if not
    const data = Array.isArray(ProduitsVendu) ? ProduitsVendu : []; 



return (

    <div className="chart-card">


        <h2 className="titre_graphe">
            Evolution vente
        </h2>



        <div
            style={{
            width:"100%",
            height:300
            }}
        >


            <ResponsiveContainer>


            <BarChart data={data}/>


            <CartesianGrid strokeDasharray="3 3" />


            <XAxis dataKey="date" />


            <YAxis />


        <Tooltip />

        {/* Légende automatique */}
        <Legend
        verticalAlign="bottom"
        height={40}
        />

        <BarChart data={data}>
            <XAxis dataKey="site" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar
                dataKey="quantite_vendue"
                fill="#3b82f6"
                name="Produits vendus"
            />
        </BarChart>

        


        </ResponsiveContainer>


    </div>


</div>

)

}


export default VenteSiteChart;