import { TrendingUp, Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StockList from "@/components/stocks/StockList";
import BuyStockDialog from "@/components/stocks/BuyStockDialog";
import { useAuth } from "@/context/AuthContext";
import { type Stock } from "@/services/api";
import { useState } from "react";
import { useStocks } from "@/context/StockContext";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const { refreshStocks } = useStocks();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBuy = (stock: Stock) => {
    setSelectedStock(stock);
    setDialogOpen(true);
  };

  const handleBuySuccess = () => {
    refreshStocks();
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Gérez vos investissements
          <span className="text-green-600"> simplement</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Suivez vos actions en temps réel, achetez et vendez facilement, et gardez un œil sur votre portfolio.</p>
        {!isLoggedIn && (
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Commencer gratuitement</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Se connecter
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-lg border bg-white shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Suivi en temps réel</h3>
          <p className="text-gray-600">Consultez les cours des actions et suivez leur évolution.</p>
        </div>

        <div className="text-center p-6 rounded-lg border bg-white shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
            <Wallet className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Achat simplifié</h3>
          <p className="text-gray-600">Achetez des actions en quelques clics depuis votre compte.</p>
        </div>

        <div className="text-center p-6 rounded-lg border bg-white shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Sécurisé</h3>
          <p className="text-gray-600">Vos données sont protégées avec une authentification sécurisée.</p>
        </div>
      </section>

      {/* Stocks Section */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">Actions disponibles</h2>
        <StockList isLoggedIn={isLoggedIn} onBuy={handleBuy} />
      </section>

      {/* Buy Stock Dialog */}
      <BuyStockDialog stock={selectedStock} open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={handleBuySuccess} />
    </div>
  );
}
