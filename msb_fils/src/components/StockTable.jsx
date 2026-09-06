import { useEffect, useState } from "react";
import { Save, Search, RefreshCw } from "lucide-react";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

const stockRoles = ["Administrateur", "Responsable de production", "Magasinier"];

function StockTable({ table, title, itemLabel, companyName, entryTable, entryKey, exitTable, exitKey }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [highStockOnly, setHighStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const canManageStock = stockRoles.includes(user?.role);

  async function loadItems() {
    setLoading(true);
    const [{ data, error }, { data: entries, error: entriesError }, { data: exits, error: exitsError }] = await Promise.all([
      supabase.from(table).select("id, reference, nom, categorie, unite, actif").order("nom", { ascending: true }),
      supabase.from(entryTable).select(`${entryKey}, quantite`),
      supabase.from(exitTable).select(`${exitKey}, quantite`),
    ]);

    if (error || entriesError || exitsError) {
      const message = error?.message || entriesError?.message || exitsError?.message;
      alert(`Erreur lors du calcul des stocks : ${message}`);
      setItems([]);
    } else {
      const entryTotals = (entries || []).reduce((totals, line) => {
        const id = String(line[entryKey]);
        totals[id] = (totals[id] || 0) + Number(line.quantite || 0);
        return totals;
      }, {});
      const exitTotals = (exits || []).reduce((totals, line) => {
        const id = String(line[exitKey]);
        totals[id] = (totals[id] || 0) + Number(line.quantite || 0);
        return totals;
      }, {});

      setItems((data || []).map((item) => ({
        ...item,
        stock: (entryTotals[String(item.id)] || 0) - (exitTotals[String(item.id)] || 0),
      })));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, [table, entryTable, entryKey, exitTable, exitKey]);

  function updateItem(id, field, value) {
    setItems((currentItems) => currentItems.map((item) => (
      item.id === id ? { ...item, [field]: value } : item
    )));
  }

  async function saveStock(item) {
    setSavingId(item.id);
    const { error } = await supabase
      .from(table)
      .update({ stockMin: Number(item.stockMin) || 0 })
      .eq("id", item.id);

    if (error) {
      alert(`Stock non enregistré : ${error.message}`);
    }
    setSavingId(null);
  }

  const normalizedSearch = search.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesSearch = [item.reference, item.nom, item.categorie]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    const stock = Number(item.stock) || 0;
    const minimum = Number(item.stockMin) || 0;
    return matchesSearch && (!lowStockOnly || stock <= minimum) && (!highStockOnly || stock > minimum);
  });

  return (
    <div className="product-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1>{title}</h1>
          <p>Stock calculé à partir des entrées et sorties {companyName}</p>
        </div>
        <button className="profile" type="button" onClick={loadItems} disabled={loading} title="Actualiser les stocks">
          <RefreshCw size={18} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1 1 320px" }}>
          <Search size={18} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Rechercher un ${itemLabel.toLowerCase()}...`}
            aria-label={`Rechercher un ${itemLabel.toLowerCase()}`}
          />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(event) => setLowStockOnly(event.target.checked)}
          />
          Stock faible uniquement
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            checked={highStockOnly}
            onChange={(event) => setHighStockOnly(event.target.checked)}
          />
          Disponible uniquement
        </label>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead className="headerTable">
            <tr style={{ color: "black" }}>
              <th>Référence</th>
              <th>{itemLabel}</th>
              <th>Catégorie</th>
              <th>Unité</th>
              <th>Stock disponible</th>
              <th>Seuil minimum</th>
              <th>État</th>
              {canManageStock && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={canManageStock ? 8 : 7}>Chargement...</td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan={canManageStock ? 8 : 7}>Aucun stock trouvé.</td></tr>
            ) : (
              filteredItems.map((item) => {
                const stock = Number(item.stock) || 0;
                const minimum = Number(item.stockMin) || 0;
                const isLow = stock <= minimum;

                return (
                  <tr key={item.id}>
                    <td>{item.reference || "—"}</td>
                    <td>{item.nom || "—"}</td>
                    <td>{item.categorie || "—"}</td>
                    <td>{item.unite || "—"}</td>
                    <td>
                      {stock}
                    </td>
                    <td>
                      {canManageStock ? (
                        <input
                          type="number"
                          min="0"
                          value={item.stockMin ?? 0}
                          onChange={(event) => updateItem(item.id, "stockMin", event.target.value)}
                          aria-label={`Seuil minimum de ${item.nom}`}
                        />
                      ) : minimum}
                    </td>
                    <td style={{ color: isLow ? "#b42318" : "#18794e", fontWeight: 600 }}>
                      {isLow ? "Stock faible" : "Disponible"}
                    </td>
                    {canManageStock && (
                      <td>
                        <button
                          className="profile"
                          type="button"
                          onClick={() => saveStock(item)}
                          disabled={savingId === item.id}
                          title="Enregistrer le stock"
                        >
                          <Save size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockTable;
