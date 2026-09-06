import StockTable from "../components/StockTable";

function StockMarchandises() {
  return (
    <StockTable
      table="marchandises"
      title="Stock des marchandises"
      itemLabel="Marchandise"
      companyName="MSB"
      entryTable="achatmarchandises"
      entryKey="marchandise_id"
      exitTable="ventemarchandises"
      exitKey="marchandise_id"
    />
  );
}

export default StockMarchandises;
