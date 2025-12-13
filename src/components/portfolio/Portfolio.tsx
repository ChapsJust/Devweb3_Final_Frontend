import { useAuth } from "@/context/AuthContext";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { FormattedMessage, FormattedNumber, FormattedDate } from "react-intl";

export default function Portfolio() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">
          <FormattedMessage id="portfolio.loading" defaultMessage="Chargement du portfolio..." />
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          <FormattedMessage id="portfolio.loginRequired" defaultMessage="Veuillez vous connecter pour voir votre portfolio" />
        </p>
      </div>
    );
  }

  const userStocks = user.stocks || [];

  if (userStocks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          <FormattedMessage id="portfolio.empty" defaultMessage="Vous n'avez aucun stock dans votre portfolio" />
        </p>
        <p className="text-sm text-gray-400 mt-2">
          <FormattedMessage id="portfolio.emptyHint" defaultMessage="Visitez la page d'accueil pour acheter vos premiers stocks!" />
        </p>
      </div>
    );
  }

  const groupedStocks = userStocks.reduce((acc, stock) => {
    const stockId = stock._id;

    if (!stockId) return acc;

    if (acc[stockId]) {
      acc[stockId].quantity += stock.quantity;
      acc[stockId].totalValue += (stock.unitPrice || 0) * stock.quantity;
    } else {
      acc[stockId] = {
        ...stock,
        quantity: stock.quantity,
        totalValue: (stock.unitPrice || 0) * stock.quantity,
      };
    }

    return acc;
  }, {} as Record<string, (typeof userStocks)[0] & { totalValue: number }>);

  const stocksArray = Object.values(groupedStocks);

  const totalValue = stocksArray.reduce((sum, stock) => sum + stock.totalValue, 0);
  const totalActions = stocksArray.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div>
      {/* Résumé du portfolio */}
      <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 mb-1">
            <FormattedMessage id="portfolio.totalValue" defaultMessage="Valeur totale du portfolio" />
          </p>
          <p className="text-4xl font-bold text-green-600 mb-2">
            <FormattedNumber value={totalValue} style="currency" currency="USD" />
          </p>
          <p className="text-sm text-gray-500">
            <FormattedMessage
              id="portfolio.summary"
              defaultMessage="{stockCount, plural, one {# action différente} other {# actions différentes}} • {totalActions} actions totales"
              values={{ stockCount: stocksArray.length, totalActions }}
            />
          </p>
        </CardContent>
      </Card>

      {/* Liste des stocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocksArray.map((stock) => (
          <Card key={stock._id} className="hover:shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{stock.stockShortName || "N/A"}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{stock.stockName || <FormattedMessage id="portfolio.nameUnavailable" defaultMessage="Nom indisponible" />}</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  ×{stock.quantity}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      <FormattedNumber value={stock.unitPrice ?? 0} style="currency" currency="USD" />
                    </span>
                    <span className="text-sm text-gray-500">
                      <FormattedMessage id="portfolio.perShare" defaultMessage="/ action" />
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-green-600 font-semibold bg-green-50 px-3 py-2 rounded-lg">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-lg">
                    <FormattedNumber value={stock.totalValue} style="currency" currency="USD" />
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    <FormattedMessage id="portfolio.totalValueLabel" defaultMessage="valeur totale" />
                  </span>
                </div>

                {stock.buyAt && (
                  <p className="text-xs text-gray-400 pt-2 border-t">
                    <FormattedMessage id="portfolio.firstPurchase" defaultMessage="Premier achat:" /> <FormattedDate value={new Date(stock.buyAt)} year="numeric" month="long" day="2-digit" />
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
