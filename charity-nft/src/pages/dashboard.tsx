import type { NextPage } from 'next';
import Navbar from '../components/NavBar';
import { useWallet } from '@solana/wallet-adapter-react';
import RewardBalance from '../components/RewardBalance';
import UserNFTs from '../components/UserNFTs';

const Dashboard: NextPage = () => {
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Mon Dashboard</h1>
        {publicKey ? (
          <div>
            <p className="mb-4">Adresse publique : {publicKey.toBase58()}</p>
            <RewardBalance />
            <UserNFTs />
          </div>
        ) : (
          <p>Veuillez connecter votre wallet pour voir vos informations.</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
