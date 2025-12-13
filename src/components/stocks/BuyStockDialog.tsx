import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Stock, userApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { useLocale } from "@/context/LocaleContextType";

interface BuyStockDialogProps {
  stock: Stock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function BuyStockDialog({ stock, open, onOpenChange, onSuccess }: BuyStockDialogProps) {
  const { user } = useAuth();
  const { intl } = useLocale();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!stock || !user) return null;

  const totalPrice = (stock.unitPrice ?? 0) * quantity;
  const maxQuantity = stock.quantity ?? 0;

  const handleBuy = async () => {
    if (quantity < 1 || quantity > maxQuantity) {
      setError(intl.formatMessage({ id: "buyDialog.invalidQuantity", defaultMessage: "Quantité invalide (1-{max})" }, { max: maxQuantity }));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedUser = await userApi.buyStock(stock._id, quantity);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      onOpenChange(false);
      setQuantity(1);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : intl.formatMessage({ id: "buyDialog.error", defaultMessage: "Erreur lors de l'achat" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="buyDialog.title" defaultMessage="Acheter {name}" values={{ name: stock.stockName }} />
          </DialogTitle>
          <DialogDescription>
            <FormattedMessage id="buyDialog.symbol" defaultMessage="Symbole: {symbol}" values={{ symbol: stock.stockShortName }} />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">
              <FormattedMessage id="buyDialog.quantity" defaultMessage="Quantité" />
            </Label>
            <Input id="quantity" type="number" min={1} max={maxQuantity} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} disabled={loading} />
            <p className="text-xs text-muted-foreground">
              <FormattedMessage id="buyDialog.available" defaultMessage="Disponible: {quantity}" values={{ quantity: maxQuantity }} />
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>
                <FormattedMessage id="buyDialog.unitPrice" defaultMessage="Prix unitaire:" />
              </span>
              <span className="font-medium">
                <FormattedNumber value={stock.unitPrice ?? 0} style="currency" currency="USD" />
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>
                <FormattedMessage id="buyDialog.total" defaultMessage="Total:" />
              </span>
              <span className="text-primary">
                <FormattedNumber value={totalPrice} style="currency" currency="USD" />
              </span>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            <FormattedMessage id="buyDialog.cancel" defaultMessage="Annuler" />
          </Button>
          <Button onClick={handleBuy} disabled={loading || quantity < 1 || quantity > maxQuantity}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <FormattedMessage id="buyDialog.buying" defaultMessage="Achat en cours..." />
              </>
            ) : (
              <FormattedMessage id="buyDialog.confirm" defaultMessage="Confirmer l'achat" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
