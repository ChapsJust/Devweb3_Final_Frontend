import type { Stock } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { FormattedMessage, FormattedNumber } from "react-intl";

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
    <Card className="hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{stock.stockShortName}</h3>
            <p className="text-sm text-muted-foreground">{stock.stockName}</p>
          </div>
          <Badge variant={stock.isAvailable ? "default" : "destructive"} className="gap-1">
            {stock.isAvailable ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {stock.isAvailable ? <FormattedMessage id="stock.available" defaultMessage="Disponible" /> : <FormattedMessage id="stock.unavailable" defaultMessage="Indisponible" />}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">
            <FormattedNumber value={unitPrice} style="currency" currency="USD" />
          </span>
          <span className="text-sm text-muted-foreground">
            <FormattedMessage id="stock.quantity" defaultMessage="Quantité: {quantity}" values={{ quantity: stock.quantity ?? 0 }} />
          </span>
        </div>

        {stock.tags && stock.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {stock.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>
        {isLoggedIn ? (
          <Button className="w-full" onClick={() => onBuy?.(stock)} disabled={!stock.isAvailable || stock.quantity === 0}>
            {stock.isAvailable && stock.quantity > 0 ? <FormattedMessage id="stock.buy" defaultMessage="Acheter" /> : <FormattedMessage id="stock.unavailable" defaultMessage="Indisponible" />}
          </Button>
        ) : (
          <p className="w-full text-center text-sm text-muted-foreground">
            <FormattedMessage id="stock.loginToBuy" defaultMessage="Connectez-vous pour acheter" />
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
