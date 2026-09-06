import StockTable from "../../components/StockTable";

function IssaStockProduits() {
  return (
    <StockTable
      table="products"
      title="Stock Issa Distribution - produits"
      itemLabel="Produit"
      companyName="Issa Distribution"
      entryTable="issaachatsproduits"
      entryKey="produit_id"
      exitTable="issaventeproduits"
      exitKey="produit_id"
    />
  );
}

export default IssaStockProduits;
