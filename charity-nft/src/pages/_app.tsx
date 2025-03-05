'use client';

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

// Styles par défaut du wallet adapter (fourni par @solana/wallet-adapter-react-ui)
import '@solana/wallet-adapter-react-ui/styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  const endpoint = useMemo(() => "https://api.devnet.solana.com", ['devnet']);

  // Configure les wallets que tu souhaites utiliser (ici Phantom)
  const wallets = useMemo(() => [new PhantomWalletAdapter()], ['devnet']);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
