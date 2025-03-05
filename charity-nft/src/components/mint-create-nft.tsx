import React, { useState } from 'react';
import { Wallet } from '@solana/wallet-adapter-react';
import { createCollectionOrMintNFT } from '@/mutations/create-collection';
import type { DigitalAsset } from '@metaplex-foundation/mpl-token-metadata';

interface CreateOrMintComponentProps {
  wallet: Wallet;
  collection?: DigitalAsset;
}

const CreateOrMintComponent: React.FC<CreateOrMintComponentProps> = (
  params: CreateOrMintComponentProps
) => {
  const { wallet, collection } = params;
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
    <div>
      <h2>{!collection ? "Créer une Collection" : "Minter un NFT"}</h2>
      <form onSubmit={handleSubmit}>
        <>
          <div>
            <label>Nom :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Symbole :</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Image :</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required />
          </div>
          </>
        {!collection ? (
          <>
            <div>
              <label>Seller Fee (%) :</label>
              <input
                type="number"
                value={sellerFeeBasisPercentage}
                onChange={(e) => setSellerFee(Number(e.target.value))}
                required
              />
            </div>
          </>
        ) : (
          <>
              <div>
                <label>Description :</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
          </>
        )}
        
        
        <button type="submit" disabled={loading}>
          {!collection ? "Créer la Collection" : "Minter le NFT"}
        </button>
      </form>
    </div>
  );
};

export default CreateOrMintComponent;
