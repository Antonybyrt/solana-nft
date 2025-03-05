import { PublicKey, publicKey } from "@metaplex-foundation/umi";

export const saveCollection = async (address: string) => {
  const res = await fetch('/api/saveCollection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
  return res.json();
};

export const fetchCollections = async (): Promise<PublicKey[]> => {
  const res = await fetch('/api/saveCollection');
  const data = await res.json();
  return data.collections.map((collection: string) => publicKey(collection));
};

