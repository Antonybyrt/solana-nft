import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const metadata = req.body;

    // Définir le chemin du dossier public/metadata
    const publicFolderPath = path.join(process.cwd(), 'public', 'metadata');
    // Créer le dossier s'il n'existe pas
    await fs.mkdir(publicFolderPath, { recursive: true });

    // Générer un nom de fichier unique (par exemple avec le timestamp)
    const fileName = `metadata-${Date.now()}.json`;
    const filePath = path.join(publicFolderPath, fileName);

    // Écrire le fichier JSON
    await fs.writeFile(filePath, JSON.stringify(metadata, null, 2));

    // Construire l'URL (en supposant que le dossier public est servi à la racine)
    // Remarque : req.headers.origin peut ne pas être disponible en production,
    // vous pouvez construire l'URL en fonction de votre configuration.
    const metadataUrl = `${req.headers.origin || ''}/metadata/${fileName}`;

    res.status(200).json({ url: metadataUrl });
  } catch (error) {
    console.error("Erreur lors de la génération du fichier JSON :", error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}
