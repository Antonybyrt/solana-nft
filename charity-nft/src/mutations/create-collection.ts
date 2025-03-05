import { type Adapter } from '@solana/wallet-adapter-base';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createNft, fetchDigitalAsset, mplTokenMetadata, type DigitalAsset } from '@metaplex-foundation/mpl-token-metadata'
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { generateSigner, createGenericFile, percentAmount } from '@metaplex-foundation/umi';
import { saveCollection } from './register-collection';
import { baseUMI } from '../queries/index';

const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // On retire le préfixe data:*/*;base64,
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });

export async function createCollectionOrMintNFT(
  walletAdapter: Adapter, 
  name: string, 
  symbol: string, 
  imageFile: File,
  sellerFeeBasisPercentage?: number, 
  collection?: DigitalAsset, 
  description?: string
): Promise<DigitalAsset> {
  console.log("Creating NFT Collection");

  const connection = new Connection(clusterApiUrl('devnet'));

  // Connect the RPC endpoint, use the MPL token metadata plugin, and use the connected wallet adapter
  const umi = baseUMI.use(walletAdapterIdentity(walletAdapter))

  // Generate a signer (eddsa key pair) for the NFT collection
  const collectionMint = generateSigner(umi);

  // Upload the image to the irys uploader
  const imageBase64 = convertFileToBase64(imageFile);
  const imageRes = await fetch('/api/upload-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBuffer: imageBase64, imageName: imageFile.name }),
  });
  const imageData = await imageRes.json();
  if (!imageData.success) throw new Error(imageData.error);

  // If a collection address is provided, use it to mint an NFT on the given collection
  let uri = imageData.imageURI;
  if (collection) {
    const jsonRes = await fetch('/api/upload-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        symbol,
        description,
        image: uri,
      }),
    });
    const jsonData = await jsonRes.json();
    if (!jsonData.success) throw new Error(jsonData.error);
    uri = jsonData.jsonURI;
  }

  // Build the transaction to create the NFT collection or mint an NFT
  const transaction = await createNft(umi, {
    mint: collectionMint,
    name: collection ? collection.metadata.name : name,
    symbol: collection ? collection.metadata.symbol : symbol,
    uri: uri,
    sellerFeeBasisPoints: collection ? percentAmount(collection.metadata.sellerFeeBasisPoints) : sellerFeeBasisPercentage ? percentAmount(sellerFeeBasisPercentage) : percentAmount(5),
    isCollection: !collection, // True if creating a collection, false if minting an NFT
    collection: collection ? {
      key: collection.publicKey,
      verified: false
    } : null
  })

  await transaction.sendAndConfirm(umi);

  const digitalAsset = await fetchDigitalAsset(umi, collectionMint.publicKey);

  if (!collection) {
    saveCollection(digitalAsset.publicKey);
  }

  console.log("Created collection or minted NFT: ", digitalAsset);

  return digitalAsset
}
