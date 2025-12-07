import type { Stock } from "@/services/api";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockCardProps {
  stock: Stock;
  onBuy?: (stock: Stock) => void;
  isLoggedIn?: boolean;
}

export default function StockCard({ stock, onBuy, isLoggedIn = false }: StockCardProps) {
  if (!stock) {
    return null;
  }

  const unitPrice = stock.unitPrice ?? 0;

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{stock.stockShortName}</h3>
          <p className="text-sm text-gray-500">{stock.stockName}</p>
        </div>
        <span className={`flex items-center gap-1 text-sm font-medium ${stock.isAvailable ? "text-green-600" : "text-red-600"}`}>
          {stock.isAvailable ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {stock.isAvailable ? "Disponible" : "Indisponible"}
        </span>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="text-2xl font-bold">${unitPrice.toFixed(2)}</span>
        <span className="text-sm text-gray-500">Quantité: {stock.quantity ?? 0}</span>
      </div>

      {stock.tags && stock.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {stock.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {isLoggedIn ? (
        <Button className="w-full" onClick={() => onBuy?.(stock)} disabled={!stock.isAvailable || stock.quantity === 0}>
          {stock.isAvailable && stock.quantity > 0 ? "Acheter" : "Indisponible"}
        </Button>
      ) : (
        <p className="text-center text-sm text-gray-500">Connectez-vous pour acheter</p>
      )}
    </div>
  );
}
