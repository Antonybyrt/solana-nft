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
    <div>
      <h2>Créer une Collection</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Symbole :</label>
          <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
        </div>
        <div>
          <label>Seller Fee (%) :</label>
          <input
            type="number"
            value={sellerFee}
            onChange={(e) => setSellerFee(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Image :</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Création en cours..." : "Créer la Collection"}
        </button>
      </form>
    </div>
  );
};

export default CreateCollectionComponent;
