import { PublicKey, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { fetchDigitalAsset, fetchAllDigitalAssetByOwner, mplTokenMetadata, DigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { baseUMI } from '../queries/index';


export const fetchAllCollectionOrNft = async (publicKey: PublicKey) => {
    try {
      const platformCollection = await fetchDigitalAsset(baseUMI, publicKey);
      console.log("platformCollection", platformCollection);
      const collections = fetchAllDigitalAssetByOwner(baseUMI, platformCollection.publicKey);
      return collections;
    } catch (error) {
      console.error("Erreur fetchAllCollectionOrNft:", error);
    }
};

export const fetchNFT = async (publicKey: PublicKey): Promise<DigitalAsset | undefined> => {
  try {
    const nft = await fetchDigitalAsset(baseUMI, publicKey);
    return nft;
  } catch (error) {
    console.error("Erreur fetchNFT:", error);
  }
};

export interface Collection extends DigitalAsset {
  nfts?: DigitalAsset[];
}


export const fetchCollections = async (): Promise<Collection[]> => {
  const rawCollections = await fetchAllCollectionOrNft(publicKey("Ht9ytBdAPj9B67TnoKTtwhzj8hu6WpZvezciaXeDCfwf"));
  if (!rawCollections) return [];
  const collections: Collection[] = await Promise.all(rawCollections.map(async (collection) => {
    let nfts = await fetchAllCollectionOrNft(collection.publicKey);
    return { ...collection, nfts };
  }));
  return collections;
};
