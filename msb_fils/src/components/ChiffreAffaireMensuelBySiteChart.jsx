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


function ChiffreAffaireMensuelChart({ Data }) {

    //console.log("ChartData in chart : ", Data); // Log the ChartData to check its value

    // Ensure ChartData is an array, default to empty array if not
    const data = Array.isArray(Data) ? Data : []; 



return (

    <div className="chart-card">


        <h2 className="titre_graphe">
            Chiffre d'affaire mensuel par site
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


                    <XAxis dataKey="label"
                        tickFormatter={(value, index) =>
                                `${value} ${data[index].label}`
                            }
                        angle={-5}
                            textAnchor="end"
                            height={80}
                            tickFormatter={(nom)=>
                                nom.length>35
                                ? nom.substring(0,35)+"..."
                                : nom
                            }/>

                    <YAxis
                        datakey="chiffre_affaire"
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
                        dataKey="chiffre_affaire"
                        name="Chiffre d'affaire"
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
                        dataKey="marge_brute"
                        name="Marge brute"
                        stroke="#2563eb"
                        fill="#11b835"
                        strokeWidth={3}
                        dot={{r:5}} 
                    />                   



                </BarChart>



        </ResponsiveContainer>


    </div>


</div>

)

}


export default ChiffreAffaireMensuelChart;