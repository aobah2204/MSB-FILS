import {
 useState, useEffect
} from "react";

import {
 useNavigate
} from "react-router-dom";

import {
 Factory,
 Pencil,
 Trash2,
 Eye
} from "lucide-react";


import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";


function ProductionSites(){

    // Connected user 
    const { user } = useAuth();


    const navigate = useNavigate();



    const [sites,setSites]=useState([]);
    const [site,setSite]=useState({

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




    function supprimer(id){


        if(confirm("Supprimer ce site ?")){

            setSites(
            sites.filter(
            s=>s.id!==id
            )
            );

        }

    }


    // s'exécute une seule fois au chargement
    useEffect(() => {    
        chargerSites();    
    }, []);
    
    async function chargerSites() {
    
        try {
            await getAllSites();
        } catch (error) {
            console.error("Erreur lors du chargement des Sites : ", error);
        }
    }
    
    async function getAllSites(){
    
        const { data } = await supabase
            .from("siteproduction")
            .select("*");
    
        if (!data) return alert("Aucun site de production");
    
        setSites(data);
    }
        
    
    async function DeleteSite(id){
    
        if(confirm("Supprimer ce site ?")){
            await supabase
            .from("siteproduction")
            .delete()
            .eq("id", id);
        }
    
        // Mettre à jour la liste des site après la suppression
        await getAllSites();
        setSite(null);
    }



return (

<div>

    {
    ["Administrateur"]
    .includes(user?.role)
    &&

    <button className="profile"
        onClick={()=>
        navigate("/production-sites/nouveau")
        }>
        <Factory /> Ajouter un site
    </button>
    }

    <h2>
        Sites de production
    </h2>



    <table className="data-table">
        <thead>
            <tr className="header_Table">

                <th>Nom</th>
                <th>Adresse</th>
                <th>Responsable</th>
                <th>Capacité</th>
                <th>Actions</th>

            </tr>
        </thead>

        <tbody>
            {
                sites.map(site=>(


                <tr key={site.id}>


                <td>
                {site.nom}
                </td>


                <td>
                {site.adresse}
                </td>


                <td>
                {site.responsable}
                </td>


                <td>
                {site.capacite}
                </td>



                <td>


                <button className="profile"
                    onClick={()=>
                    navigate(`/production-sites/${site.id}`)
                    }
                    >
                    <Eye /> 
                </button>



                {
                ["Administrateur"]
                .includes(user?.role)
                &&
                <button className="profile">

                <Pencil />

                </button>
                }


                {
                ["Administrateur"]
                .includes(user?.role)
                &&
                <button className="profile"

                    onClick={()=>
                    DeleteSite(site.id)
                    }

                    >

                    <Trash2 />

                </button>
                }



                </td>


                </tr>


                ))

            }
        </tbody>

    </table>
</div>

)}


export default ProductionSites;