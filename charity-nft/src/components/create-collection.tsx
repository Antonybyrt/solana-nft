import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createCollectionOrMintNFT } from '@/mutations/create-collection';

const CreateCollectionComponent: React.FC = () => {
  const { publicKey, wallet } = useWallet();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [sellerFee, setSellerFee] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !wallet) {
      alert("Wallet non connecté");
      return;
    }
    if (!file) {
      alert("Veuillez sélectionner un fichier image");
      return;
    }
    setLoading(true);
    try {
      const collection = await createCollectionOrMintNFT(
        wallet.adapter,
        name,
        symbol,
        file,
        sellerFee
      );
      alert(`Collection créée avec succès ! Adresse : ${collection.publicKey.toString()}`);
    } catch (error) {
      console.error("Erreur lors de la création de la collection:", error);
      alert("Erreur lors de la création de la collection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Créer une Collection
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-gray-300 mb-1">Seller Fee (%) :</label>
          <input
            type="number"
            value={sellerFee}
            onChange={(e) => setSellerFee(Number(e.target.value))}
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
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? "Création en cours..." : "Créer la Collection"}
        </button>
      </form>
    </div>
  );
};

export default CreateCollectionComponent;
