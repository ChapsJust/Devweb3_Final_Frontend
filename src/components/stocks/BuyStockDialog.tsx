import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Stock, userApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface BuyStockDialogProps {
  stock: Stock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function BuyStockDialog({ stock, open, onOpenChange, onSuccess }: BuyStockDialogProps) {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!stock || !user) return null;

  const totalPrice = (stock.unitPrice ?? 0) * quantity;
  const maxQuantity = stock.quantity ?? 0;

  const handleBuy = async () => {
    if (quantity < 1 || quantity > maxQuantity) {
      setError(`Quantité invalide (1-${maxQuantity})`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedUser = await userApi.buyStock(stock._id, quantity);

      // Mettre à jour le user dans localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      onOpenChange(false);
      setQuantity(1);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'achat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Acheter {stock.stockName}</DialogTitle>
          <DialogDescription>Symbole: {stock.stockShortName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantité</Label>
            <Input id="quantity" type="number" min={1} max={maxQuantity} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} disabled={loading} />
            <p className="text-xs text-gray-500">Disponible: {maxQuantity}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Prix unitaire:</span>
              <span className="font-medium">${stock.unitPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleBuy} disabled={loading || quantity < 1 || quantity > maxQuantity}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Achat en cours...
              </>
            ) : (
              "Confirmer l'achat"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
