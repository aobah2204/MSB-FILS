import StockTable from "../components/StockTable";

function StockProduits() {
  return (
    <StockTable
      table="products"
      title="Stock des produits"
      itemLabel="Produit"
      companyName="MSB"
      entryTable="productions"
      entryKey="produit_id"
      exitTable="venteproduits"
      exitKey="produit_id"
    />
  );
}

export default StockProduits;
