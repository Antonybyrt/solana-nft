import React, { useState } from 'react';
import { Wallet } from '@solana/wallet-adapter-react';
import { createCollectionOrMintNFT } from '@/mutations/create-collection';
import type { DigitalAsset } from '@metaplex-foundation/mpl-token-metadata';

interface CreateOrMintComponentProps {
  wallet: Wallet;
  collection?: DigitalAsset;
}

const CreateOrMintComponent: React.FC<CreateOrMintComponentProps> = ({
  wallet,
  collection,
}) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [sellerFeeBasisPercentage, setSellerFee] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez sélectionner un fichier image");
      return;
    }
    setLoading(true);
    try {
      const digitalAsset = await createCollectionOrMintNFT(
        wallet.adapter,
        name,
        symbol,
        file,
        sellerFeeBasisPercentage,
        collection,
        description
      );
      alert(`Opération réussie ! Adresse : ${digitalAsset.publicKey.toString()}`);
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
      alert("Erreur lors de l'opération");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {!collection ? "Créer une Collection" : "Minter un NFT"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section commune : Nom, Symbole et Image */}
        <div>
          <label className="block text-gray-300 mb-1">Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Symbole :</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Image :</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full text-gray-200"
          />
        </div>
        {/* Section spécifique selon l'opération */}
        {!collection ? (
          <div>
            <label className="block text-gray-300 mb-1">Seller Fee (%) :</label>
            <input
              type="number"
              value={sellerFeeBasisPercentage}
              onChange={(e) => setSellerFee(Number(e.target.value))}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-gray-300 mb-1">Description :</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading
            ? "Traitement en cours..."
            : !collection
            ? "Créer la Collection"
            : "Minter le NFT"}
        </button>
      </form>
    </div>
  );
};

export default CreateOrMintComponent;
