import {
 useParams
} from "react-router-dom";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import ProductionSiteChart from '../components/ProductionSiteChart';


function ProductionSiteDetails(){


    const {id} = useParams();

    const [site, setSite] = useState({

        nom:"",
        adresse:"",
        responsable:"",
        telephone:"",
        capacite:"",
        surface:"",
        equipements:"",
        statut:true,
        resp_id: 0
    });

    const productionData = useState({
        date:"",
        quantite:0
    });

    const [productionSite, setProductionSite] = useState([]);
    const [nbreProductionSite, setNbreProductionSite] = useState(0);


    async function getSite(){

        const table = "siteproduction";
        const { data } = await supabase
            .from(table)
            .select("*")
            .eq("id", id)
            .maybeSingle();
            
        setSite(data);
    }

    async function getAllProductionSite(){

        const table = "productions";
        const { data } = await supabase
            .from(table)
            .select("*")
            .eq("site_id", id);

        if(data){
            setProductionSite({
                date: data.map((item) => item.dateproduction),
                quantite: data.map((item) => item.quantite)
            });
            setNbreProductionSite(data.length);
        }
    }

    useEffect(()=>{
    
        getSite(id);
        getAllProductionSite(id);
                
    },[id]);


    return (

        <div>


            <h1>
                Fiche site #{id}
            </h1>

            <div className="cards">
                <div className="card">


                <h3>
                    Informations générales
                </h3>


                <p>
                    {site.nom}
                </p>


                <p>
                    {site.adresse}
                </p>


                <p>
                    Responsable : {site.responsable}
                </p>

            </div>



            <div className="card">


                <h3>
                    Production
                </h3>


                <p>
                    Capacité : {site.capacite} unités/mois
                </p>


                <p>
                    Production actuelle :  {nbreProductionSite} unités/mois
                </p>


            </div>



            <div className="card">


                <h3>
                Equipements
                </h3>


                <ul>

                <li>
                Machine découpe
                </li>

                <li>
                Ligne assemblage
                </li>

                <li>
                Contrôle qualité
                </li>

                </ul>


            </div>           

            
        </div>  

        <div className="cards">

            <div className="card">


                <h3>
                    Statistiques
                </h3>


                <p>
                    Taux utilisation : {site.capacite > 0 ? (nbreProductionSite / site.capacite) * 100 : 0} %
                </p>

                <ProductionSiteChart ChartData={productionSite} />


            </div>     
        </div>

                



        </div>

    )

}


export default ProductionSiteDetails;