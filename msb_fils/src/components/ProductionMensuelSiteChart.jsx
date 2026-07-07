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


function ProductionMensuelSiteChart({ ChartData }) {

    console.log("ChartData in chart : ", ChartData); // Log the ChartData to check its value

    // Ensure ChartData is an array, default to empty array if not
    const data = Array.isArray(ChartData) ? ChartData : [];  



return (

    <div className="chart-card">


        <h2 className="titre_graphe">
            Production mensuelle
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


                    <XAxis dataKey="mois"
                        tickFormatter={(value, index) =>
                                `${value} ${data[index].mois}`
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
                        dataKey="cout_composants"
                        name="Coût matériel"
                        stroke="#2563eb"
                        fill="#584037"
                        strokeWidth={3}
                        dot={{r:5}} 
                    /> 

                    <Bar 
                        dataKey="cout_production"
                        name="Coût production"
                        stroke="#2563eb"
                        fill="#d85120"
                        strokeWidth={3}
                        dot={{r:5}} 
                    /> 

                    <Bar 
                        dataKey="cout_stockage"
                        name="Coût stockage"
                        stroke="#2563eb"
                        fill="#24a372"
                        strokeWidth={3}
                        dot={{r:5}} 
                    /> 

                    <Bar 
                        dataKey="cout_total"
                        name="Coût total production"
                        stroke="#2563eb"
                        fill="#e01638"
                        strokeWidth={3}
                        dot={{r:5}} 
                    />   



                </BarChart>



        </ResponsiveContainer>


    </div>


</div>

)

}


export default ProductionMensuelSiteChart;