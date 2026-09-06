import StockTable from "../../components/StockTable";

function IssaStockMarchandises() {
  return (
    <StockTable
      table="marchandises"
      title="Stock Issa Distribution - marchandises"
      itemLabel="Marchandise"
      companyName="Issa Distribution"
      entryTable="issaachatsmarchandises"
      entryKey="marchandise_id"
      exitTable="issaventemarchandises"
      exitKey="marchandise_id"
    />
  );
}

export default IssaStockMarchandises;
