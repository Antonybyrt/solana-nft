import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Définition du fichier où stocker les collections
const COLLECTIONS_FILE = path.join(process.cwd(), 'collections.json');

// Fonction pour charger les collections existantes
const loadCollections = (): string[] => {
  if (fs.existsSync(COLLECTIONS_FILE)) {
    return JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf-8'));
  }
  return [];
};

// Fonction pour enregistrer une nouvelle collection
const saveCollection = (address: string) => {
  const collections = loadCollections();
  if (!collections.includes(address)) {
    collections.push(address);
    fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));
  }
};

// API Handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address } = req.body;

    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Invalid address' });
    }

    saveCollection(address);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ collections: loadCollections() });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
