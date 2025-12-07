import EnvUtils from "@/utils/envUtils";

const API_URL = EnvUtils.getApiUrl();

export interface Stock {
  _id: string;
  stockName: string;
  stockShortName: string;
  quantity: number;
  unitPrice: number;
  isAvailable?: boolean;
  tags?: string[];
  buyAt?: Date;
  lastUpdatedAt?: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  stocks?: Stock[];
}

export const userApi = {
  async buyStock(stockId: string, quantity: number): Promise<User> {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/api/users/buystock`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stockId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Erreur lors de l'achat" }));
      throw new Error(error.error || "Erreur lors de l'achat");
    }

    const data = await response.json();
    return data.user;
  },
};

export const stockApi = {
  async getAll(): Promise<Stock[]> {
    console.log("API_URL:", API_URL);
    const response = await fetch(`${API_URL}/api/stock/all`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des stocks");
    }
    const data = await response.json();
    return data.stocks;
  },

  async getById(id: string): Promise<Stock> {
    const response = await fetch(`${API_URL}/api/stock/${id}`);
    if (!response.ok) {
      throw new Error("Stock non trouvé");
    }
    const data = await response.json();
    return data.stock;
  },
};
