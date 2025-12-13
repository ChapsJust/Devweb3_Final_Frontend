import { useStocks } from "@/context/StockContext";
import { type Stock } from "@/services/api";
import StockCard from "./StockCard";
import { Loader2 } from "lucide-react";
import { FormattedMessage } from "react-intl";

interface StockListProps {
  isLoggedIn?: boolean;
  onBuy?: (stock: Stock) => void;
}

export default function StockList({ isLoggedIn = false, onBuy }: StockListProps) {
  const { stocks, loading, error } = useStocks();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          <FormattedMessage id="stockList.loading" defaultMessage="Chargement des stocks..." />
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!stocks || stocks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          <FormattedMessage id="stockList.empty" defaultMessage="Aucun stock disponible" />
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stocks.map((stock) => (
        <StockCard key={stock._id} stock={stock} isLoggedIn={isLoggedIn} onBuy={onBuy} />
      ))}
    </div>
  );
}
