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


function DepensesChart({ ChartData }) {

    console.log("ChartData in chart : ", ChartData); // Log the ChartData to check its value

    // Ensure ChartData is an array, default to empty array if not
    const data = Array.isArray(ChartData) ? ChartData : [];  



return (

    <div className="chart-card">


        <h2 className="titre_graphe">
            Dépenses par catégories
        </h2>



        <div
            style={{
            width:"100%",
            height:300
            }}
        >


            <ResponsiveContainer>


                <BarChart data={data}>


                    <CartesianGrid strokeDasharray="3 3" />


                    <XAxis dataKey="categorie"
                        tickFormatter={(value, index) =>
                                `${value} ${data[index].categorie}`
                            }
                        angle={-25}
                            textAnchor="end"
                            height={80}
                            tickFormatter={(nom)=>
                                nom.length>12
                                ? nom.substring(0,12)+"..."
                                : nom
                            }/>

                    <YAxis
                        datakey="montant"
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)} M`}
                    />


                    <Tooltip  formatter={(value)=>

                    new Intl.NumberFormat("fr-FR").format(value)+" FG"

                    }/>

                    {/* Légende automatique */}
                    <Legend
                    verticalAlign="bottom"
                    height={40}
                    />

                    
                    <Bar 
                        dataKey="montant"
                        name="montant"
                        stroke="#2563eb"
                        fill="#f15517"
                        strokeWidth={3}
                        dot={{r:5}} 
                    />   



                </BarChart>



        </ResponsiveContainer>


    </div>


</div>

)

}


export default DepensesChart;