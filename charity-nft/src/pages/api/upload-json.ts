import type { NextApiRequest, NextApiResponse } from 'next';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

interface UploadJsonRequest {
  name: string;
  symbol: string;
  description?: string;
  image: string;
}

interface ApiResponse {
  success: boolean;
  jsonURI?: string;
  error?: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }

  try {
    const { name, symbol, description, image } = req.body as UploadJsonRequest;
    if (!name || !symbol || !image) {
      return res.status(400).json({ success: false, error: 'Paramètres manquants' });
    }

    const connection = new Connection(clusterApiUrl('devnet'));
    const umi = createUmi(connection.rpcEndpoint)
      .use(mplTokenMetadata())
      .use(irysUploader());

    const jsonURI = await umi.uploader.uploadJson({
      name,
      symbol,
      description,
      image,
    });

    return res.status(200).json({ success: true, jsonURI });
  } catch (error: any) {
    console.error('Erreur upload JSON:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default handler;
