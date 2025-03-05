import type { NextApiRequest, NextApiResponse } from 'next';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { createGenericFile } from '@metaplex-foundation/umi';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

interface UploadImageRequest {
  imageBuffer: string; // image encodée en base64
  imageName: string;
}

interface ApiResponse {
  success: boolean;
  imageURI?: string;
  error?: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }

  try {
    const { imageBuffer, imageName } = req.body as UploadImageRequest;
    if (!imageBuffer || !imageName) {
      return res.status(400).json({ success: false, error: 'Paramètres manquants' });
    }

    // Décodage de l'image (base64 => ArrayBuffer)
    const buffer = Buffer.from(imageBuffer, 'base64');
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    const connection = new Connection(clusterApiUrl('devnet'));
    const umi = createUmi(connection.rpcEndpoint)
      .use(mplTokenMetadata())
      .use(irysUploader());

    const file = createGenericFile(new Uint8Array(arrayBuffer), imageName, { contentType: 'image/jpeg' });
    const [imageURI] = await umi.uploader.upload([file]);

    return res.status(200).json({ success: true, imageURI });
  } catch (error: any) {
    console.error('Erreur upload image:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default handler;
