import { useEffect, useState } from "react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";

const RewardBalance = () => {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  // Remplacez par l'adresse de mint de votre token de récompense
  const rewardMint = new PublicKey("Ht9ytBdAPj9B67TnoKTtwhzj8hu6WpZvezciaXeDCfwf");

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });
        // Chercher l'account associé au token de récompense
        const rewardAccount = accounts.value.find((accountInfo) => {
          return accountInfo.account.data.parsed.info.mint === rewardMint.toBase58();
        });
        if (rewardAccount) {
          const amount = rewardAccount.account.data.parsed.info.tokenAmount.uiAmount;
          setBalance(amount);
        } else {
          setBalance(0);
        }
      }
    };

    fetchBalance();
  }, [publicKey, rewardMint]);

  return (
    <div>
      <h2>Solde de tokens de récompense : {balance !== null ? balance : "Chargement..."}</h2>
    </div>
  );
};

export default RewardBalance;
