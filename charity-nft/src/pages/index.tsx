import type { NextPage } from 'next';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';

interface NFT {
  name: string;
  description: string;
  image: string;
}

const Home: NextPage = () => {
  const { connected, publicKey, wallet, signTransaction, signAllTransactions } = useWallet();
  const [nfts, setNfts] = useState<any[]>([]);

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const fetchNFTs = async () => {
    if (publicKey) {
      try {
        const metaplex = Metaplex.make(connection);
        const nftList = await metaplex.nfts().findAllByOwner({ owner: publicKey });
        console.log(nftList)
        setNfts(nftList);
      } catch (error) {
        console.error("Erreur fetchNFTs:", error);
      }
    }
  };

  useEffect(() => {
    if (connected) {
      fetchNFTs();
    }
  }, [connected, publicKey]);

  const createNFT = async () => {
    if (!publicKey || !wallet) return;
    try {
      const walletAdapter = {
        publicKey,
        signTransaction,
        signAllTransactions,
      };
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
      const { nft } = await metaplex.nfts().create({
        uri: '/metadata.json', 
        name: 'NFT de Charité',
        sellerFeeBasisPoints: 500,
      });
      alert(`NFT créé avec succès ! Adresse : ${nft.address.toBase58()}`);
      fetchNFTs();
    } catch (error) {
      console.error("Erreur création NFT:", error);
      alert("Erreur lors de la création du NFT");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Plateforme NFT de Charité</h1>
        {!connected && (
          <div className="mb-4">
            <WalletMultiButton />
          </div>
        )}
        {connected && (
          <div className="mb-4">
            <button
              onClick={createNFT}
              className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700"
            >
              Créer un NFT
            </button>
          </div>
        )}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {nfts.length > 0 ? (
            nfts.map((nft, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 shadow rounded p-4">

                <h2 className="text-xl font-semibold">{nft.name}</h2>
                <p>{nft.name}</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700">
                  Acheter ce NFT
                </button>
              </div>
            ))
          ) : (
            <p>Aucun NFT à afficher</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
