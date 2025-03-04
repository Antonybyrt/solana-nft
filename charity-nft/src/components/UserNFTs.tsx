import { useEffect, useState } from "react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";

const UserNFTs = () => {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchNFTs = async () => {
      if (publicKey) {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const metaplex = Metaplex.make(connection);
        // Récupérer les NFTs du wallet
        const nftList = await metaplex.nfts().findAllByOwner({ owner: publicKey });
        setNfts(nftList);
      }
    };
    fetchNFTs();
  }, [publicKey]);
  
  return (
    <div>
      <h2>Mes NFTs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nfts.map((nft, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 shadow rounded p-4">
            <h3 className="text-lg font-bold">{nft.name}</h3>
            <p>{nft.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserNFTs;
