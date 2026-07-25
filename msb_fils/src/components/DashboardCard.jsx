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


import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { NavLink } from "react-router-dom";

function DashboardCard({
    title,
    value,
    subtitle = "",
    icon,
    color = "#2563eb",
    trend = 0,
    suffix = "",
    link = "",
    montantCourant = "",
    moisDernier = ""
}) {

    const positive = Number(trend) >= 0;

    const content = (

        <div
            className="dashboard-card"
            style={{
                borderTop: `5px solid ${color}`
            }}
        >

            <div className="dashboard-card-header">

                <div
                    className="dashboard-icon"
                    style={{
                        background: `${color}20`,
                        color: color
                    }}
                >
                    {icon}
                </div>
                
                <div>

                    <h4 className="dashboard-title">
                        {title}
                    </h4>

                    <h2 className="dashboard-value">
                        {typeof value === "number"
                            ? new Intl.NumberFormat("fr-FR").format(value)
                            : value}
                        {" "}
                        {suffix}
                    </h2>

                </div>

            </div>

            <div>
                {moisDernier && <div className="dashboard-subtitle">Mois dernier <p className="dashboard-montantdernier">{new Intl.NumberFormat("fr-FR").format(moisDernier)} gnf</p></div>}
                {montantCourant && <div className="dashboard-title">Mois courant <p className="dashboard-montantcourant"> {new Intl.NumberFormat("fr-FR").format(montantCourant)} gnf</p></div>}
                
            </div>

            <div className="dashboard-footer">

                <div
                    className={
                        positive
                            ? "dashboard-trend positive"
                            : "dashboard-trend negative"
                    }
                >

                    {

                        positive

                            ?

                            <ArrowUpRight size={18}/>

                            :

                            <ArrowDownRight size={18}/>

                    }

                    {Math.abs(trend)} %

                </div>

                <span className="dashboard-subtitle">

                    {subtitle}

                </span>

            </div>

        </div>

    );

    if(link){

        return (

            <NavLink
                to={link}
                style={{textDecoration:"none"}}
            >
                {content}
            </NavLink>

        );

    }

    return content;

}

export default DashboardCard;
