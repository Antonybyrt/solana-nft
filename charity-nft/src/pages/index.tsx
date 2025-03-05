import type { NextPage } from 'next';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import { fetchCollections, Collection } from '@/queries/fetch-collections';
import Modal from '@/components/modal';
import CreateOrMintComponent from '@/components/mint-create-nft';
import { DigitalAsset } from '@metaplex-foundation/mpl-token-metadata';

const Home: NextPage = () => {
  const { connected, publicKey, wallet } = useWallet();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadCollections = async () => {
    if (connected && publicKey) {
      setIsLoading(true);
      try {
        const collectionsData = await fetchCollections();
        setCollections(collectionsData);
      } catch (error) {
        console.error("Erreur lors du chargement des collections:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadCollections();
  }, [connected, publicKey]);

  const handleCollectionClick = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Reload collections to show new ones
    loadCollections();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Plateforme NFT de Charité</h1>
        
        {!connected && (
          <div className="mb-4">
            
          </div>
        )}
        
        {connected && (
          <>
            {selectedCollection ? (
              // Showing NFTs of selected collection
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    Collection: {selectedCollection.metadata?.name}
                  </h2>
                  <button
                    onClick={handleBackToCollections}
                    className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                  >
                    ← Retour aux collections
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedCollection.nfts && selectedCollection.nfts.length > 0 ? (
                    // Display NFTs in the collection
                    selectedCollection.nfts.map((nft: DigitalAsset, index: number) => (
                      <div key={index} className="bg-white dark:bg-gray-800 shadow rounded p-4">
                        <h2 className="text-xl font-semibold">{nft.metadata.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{nft.metadata.symbol}</p>
                        <button className="mt-4 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700">
                          Acheter ce NFT
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Aucun NFT dans cette collection</p>
                  )}
                  
                  {/* Add NFT creation card at the end */}
                  <div className="bg-white dark:bg-gray-800 shadow rounded p-4 flex flex-col items-center justify-center min-h-[200px]">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Créer un NFT
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Showing list of collections
              <div>
                <h2 className="text-2xl font-semibold mb-4">Collections</h2>
                
                {isLoading ? (
                  <p>Chargement des collections...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {collections.length > 0 ? (
                      collections.map((collection, index) => (
                        <div 
                          key={index} 
                          className="bg-white dark:bg-gray-800 shadow rounded p-4 cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => handleCollectionClick(collection)}
                        >
                          <h3 className="text-xl font-semibold">{collection.metadata.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{collection.metadata.symbol}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {collection.nfts?.length || 0} NFT(s)
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Aucune collection trouvée.</p>
                    )}
                    
                    {/* Add collection creation card at the end */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded p-4 flex flex-col items-center justify-center min-h-[200px]">
                      <button
                        onClick={() => setModalOpen(true)}
                        className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Créer une collection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {wallet && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <CreateOrMintComponent 
              wallet={wallet} 
              collection={selectedCollection || undefined}
            />
          </Modal>
        )}
      </main>
    </div>
  );
};

export default Home;
