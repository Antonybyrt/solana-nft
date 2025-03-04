import Link from 'next/link';
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">Charity NFT</p>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <p className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">Dashboard</p>
          </Link>
          <WalletMultiButtonDynamic />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
