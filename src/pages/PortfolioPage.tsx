import { useAuth } from "@/context/AuthContext";
import Portfolio from "@/components/portfolio/Portfolio";
import EnvUtils from "@/utils/envUtils";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";

const API_URL = EnvUtils.getApiUrl();

export default function PortfolioPage() {
  const { user, updateUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${API_URL}/api/users/${user._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            updateUser(data.user);
          }
        } catch (error) {
          console.error("Erreur lors du rechargement du portfolio:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        <FormattedMessage id="portfolio.title" defaultMessage="Mon Portfolio" />
      </h1>
      <Portfolio />
    </div>
  );
}
