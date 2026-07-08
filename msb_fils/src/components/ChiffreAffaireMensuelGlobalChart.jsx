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
            Chiffre d'affaire GLOBAL
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
                            />

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
                        fill="#b14119"
                        strokeWidth={3}
                        dot={{r:5}} 
                    /> 

                    <Bar 
                        dataKey="cout_production"
                        name="Coût production"
                        stroke="#2563eb"
                        fill="#f37244"
                        strokeWidth={3}
                        dot={{r:5}} 
                    /> 

                    <Bar 
                        dataKey="depenses"
                        name="Dépenses"
                        stroke="#2563eb"
                        fill="#ac0513"
                        strokeWidth={3}
                        dot={{r:5}} 
                    />  

                    <Bar 
                        dataKey="benefice"
                        name="Bénéfice"
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