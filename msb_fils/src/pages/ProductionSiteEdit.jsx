import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";

function ProductionSiteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [site, setSite] = useState({
    nom: "",
    adresse: "",
    responsable: "",
    telephone: "",
    capacite: "",
    surface: "",
    equipements: "",
    statut: true,
    resp_id: 0,
  });

  const [listResp, setListResp] = useState([]);

  function change(e) {
    const { name, value, type, checked } = e.target;
    setSite((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function onChange(e) {
    const selected = listResp.find((item) => String(item.id) === String(e.target.value));

    if (!selected) return;

    setSite((prev) => ({
      ...prev,
      resp_id: selected.id,
      responsable: selected.fullname,
    }));
  }

  async function getAllResponsable() {
    const { data: allResp, error: err } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("role", "Responsable de production");

    if (err) {
      alert("Erreur lors du chargement des responsables");
      return;
    }

    setListResp(allResp || []);
  }

  async function getSite() {
    const { data, error } = await supabase
      .from("siteproduction")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      alert("Erreur lors du chargement du site : " + error.message);
      return;
    }

    if (!data) {
      alert("Aucun site trouvé");
      navigate("/production-sites");
      return;
    }

    setSite({
      ...data,
      statut: data.statut ?? true,
      resp_id: data.resp_id ?? 0,
    });
  }

  async function save(e) {
    e.preventDefault();

    const payload = {
      ...site,
      resp_id: site.resp_id ?? 0,
      responsable: site.responsable || "",
    };

    const { error } = await supabase
      .from("siteproduction")
      .update(payload)
      .eq("id", id);

    if (!error) {
      alert("Site modifié");
      navigate("/production-sites");
    } else {
      alert("Site non modifié : " + error.message);
    }
  }

  useEffect(() => {
    getAllResponsable();
  }, []);

  useEffect(() => {
    if (id) {
      getSite();
    }
  }, [id]);

  return (
    <div className="product_page">
      <h1>Modifier le site de production</h1>

      <form className="product_form" onSubmit={save}>
        <div className="grid">
          <input
            name="nom"
            placeholder="Nom du site"
            value={site.nom || ""}
            onChange={change}
          />

          <input
            name="adresse"
            placeholder="Adresse"
            value={site.adresse || ""}
            onChange={change}
          />

          <select
            value={site.resp_id || ""}
            name="responsable"
            onChange={onChange}
          >
            <option value="">-- Choisir un responsable --</option>
            {listResp.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullname}
              </option>
            ))}
          </select>

          <input
            name="telephone"
            placeholder="Téléphone"
            value={site.telephone || ""}
            onChange={change}
          />

          <input
            name="capacite"
            placeholder="Capacité production"
            value={site.capacite || ""}
            onChange={change}
          />

          <input
            name="surface"
            placeholder="Surface m²"
            value={site.surface || ""}
            onChange={change}
          />

          <textarea
            name="equipements"
            placeholder="Equipements"
            value={site.equipements || ""}
            onChange={change}
          />

          <label className="checkbox">
            <input
              type="checkbox"
              name="statut"
              checked={Boolean(site.statut)}
              onChange={change}
            />
            Site actif
          </label>
        </div>

        <br />

        <button className="profile" type="submit">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

export default ProductionSiteEdit;
