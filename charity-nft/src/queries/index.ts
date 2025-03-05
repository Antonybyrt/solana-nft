import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection } from "@solana/web3.js";

export const baseUMI = createUmi((new Connection(clusterApiUrl('devnet'), "confirmed")).rpcEndpoint).use(mplTokenMetadata())
