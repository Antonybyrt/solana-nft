import type { NextPage } from 'next';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';

const Home: NextPage = () => {
  const { connected, publicKey, wallet, signTransaction, signAllTransactions } = useWallet();
  const [nfts, setNfts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftSymbol, setNftSymbol] = useState('');

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  const fetchNFTs = async () => {
    if (publicKey) {
      try {
        const metaplex = Metaplex.make(connection);
        const nftList = await metaplex.nfts().findAllByOwner({ owner: publicKey });
        console.log(nftList);
        setNfts(nftList);
      } catch (error) {
        console.error('Erreur fetchNFTs:', error);
      }
    }
  };

  useEffect(() => {
    if (connected) {
      fetchNFTs();
    }
  }, [connected, publicKey]);

  const uploadMetadata = async (metadata: object): Promise<string> => {
    const response = await fetch('/api/generateMetadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
    });
    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload des metadata');
    }
    const data = await response.json();
    return data.url;
  };
  

  const handleCreateNFT = async () => {
    if (!publicKey || !wallet) return;
    try {
      const metadata = {
        name: nftName,
        description: nftDescription,
        symbol: nftSymbol
      };
  
      const metadataUri = await uploadMetadata(metadata);
  
      const walletAdapter = { publicKey, signTransaction, signAllTransactions };
      const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
  
      const { nft } = await metaplex.nfts().create({
        uri: metadataUri,
        name: nftName,
        symbol: nftSymbol,
        sellerFeeBasisPoints: 500,
      });
  
      alert(`NFT créé avec succès ! Adresse : ${nft.address.toBase58()}`);

      setNftName('');
      setNftDescription('');
      setShowModal(false);
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
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700"
            >
              Créer un NFT
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
              <h2 className="text-xl font-bold mb-4">Créer un NFT</h2>
              <input
                type="text"
                placeholder="Nom du NFT"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                className="mb-3 w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Symbole du NFT"
                value={nftSymbol}
                onChange={(e) => setNftSymbol(e.target.value)}
                className="mb-3 w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description du NFT"
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
                className="mb-3 w-full p-2 border rounded"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateNFT}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {nfts.length > 0 ? (
            nfts.map((nft, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 shadow rounded p-4">
                <h2 className="text-xl font-semibold">{nft.symbol ? nft.symbol : nft.name}</h2>
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
