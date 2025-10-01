import SearchCommand from '@/components/SearchCommand';
import { searchStocks } from '@/lib/actions/finnhub.actions';

export default async function SearchPage() {
  const initialStocks = await searchStocks();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-gray-100">Search Stocks</h1>
      <p className="mt-2 text-gray-400">Find stocks by symbol or company name.</p>

      <div className="mt-6">
        <SearchCommand renderAs="text" label="Search" initialStocks={initialStocks} />
      </div>
    </div>
  );
}
