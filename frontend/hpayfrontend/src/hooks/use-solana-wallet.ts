/**
 * Minimal Solana wallet hook using browser-injected providers.
 * Supports Phantom (window.solana) and Solflare (window.solflare).
 * No npm wallet adapter packages required — wallets inject their own APIs.
 */
import { useState, useEffect, useCallback } from 'react';

export type WalletName = 'Phantom' | 'Solflare';

export interface DetectedWallet {
  name: WalletName;
  icon: string;
  provider: SolanaProvider;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  publicKey: { toBase58(): string } | null;
  isConnected: boolean;
  connect(): Promise<{ publicKey: { toBase58(): string } }>;
  disconnect(): Promise<void>;
  on(event: string, handler: () => void): void;
  off(event: string, handler: () => void): void;
  /** Sign a transaction object and return the signed version. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signTransaction(transaction: any): Promise<any>;
  /** Sign and immediately send a transaction. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signAndSendTransaction?(transaction: any): Promise<{ signature: string }>;
}

const PHANTOM_ICON =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiB2aWV3Qm94PSIwIDAgMTA4IDEwOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjEwOCIgaGVpZ2h0PSIxMDgiIHJ4PSIyNiIgZmlsbD0iIzUxMkRBOCIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOTYuMDU1IDU1LjIzNkM5Mi4zNDUgNzYuNDg0IDczLjUyNCA5My4zNiA1MC45MTQgOTMuMzZDMjYuOTQ0IDkzLjM2IDcuNjIgNzQuMzYgNy4wNCA1MC41MjVDNi40NTMgMjYuMzI3IDI2LjUgNi41IDUwLjkxNCA2LjVDNzMuNTI0IDYuNSA5Mi4zNDUgMjMuMzc2IDk2LjA1NSA0NC42MjRIMTAxQzk3LjIzMyAxOS41NzQgNzYuMjMzIDAgNTAuOTE0IDBDMjMuMDkgMCA1LjM4OSAxOS4wOTkgNS4zODkgNTBDNS4zODkgODAuOTAxIDIzLjA5IDEwMCA1MC45MTQgMTAwQzc2LjIzMyAxMDAgOTcuMjMzIDgwLjQyNiAxMDEgNTUuMjM2SDk2LjA1NVoiIGZpbGw9IndoaXRlIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03Ny4wNzUgNDQuNzM2QzgxLjE1NSA0NC43MzYgODQuNDYzIDQ4LjA0NCA4NC40NjMgNTIuMTI0Qzg0LjQ2MyA1Ni4yMDQgODEuMTU1IDU5LjUxMiA3Ny4wNzUgNTkuNTEyQzcyLjk5NSA1OS41MTIgNjkuNjg3IDU2LjIwNCA2OS42ODcgNTIuMTI0QzY5LjY4NyA0OC4wNDQgNzIuOTk1IDQ0LjczNiA3Ny4wNzUgNDQuNzM2WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=';

const SOLFLARE_ICON =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIHJ4PSIyMCIgZmlsbD0iI0ZDMTcxNyIvPjxwYXRoIGQ9Ik0xMDcuNDkzIDQzLjI5OEw2Ni4wMDMgMjAuMjM4QzY0Ljc2MSAxOS41MjkgNjMuMjM5IDE5LjUyOSA2MS45OTcgMjAuMjM4TDIwLjUwNyA0My4yOThDMTkuMjY1IDQ0LjAwNyAxOC41MDQgNDUuMzIyIDE4LjUwNCA0Ni43NDFWODEuMjU5QzE4LjUwNCA4Mi42NzggMTkuMjY1IDgzLjk5MyAyMC41MDcgODQuNzAyTDYxLjk5NyAxMDcuNzYyQzYzLjIzOSAxMDguNDcxIDY0Ljc2MSAxMDguNDcxIDY2LjAwMyAxMDcuNzYyTDEwNy40OTMgODQuNzAyQzEwOC43MzUgODMuOTkzIDEwOS40OTYgODIuNjc4IDEwOS40OTYgODEuMjU5VjQ2Ljc0MUMxMDkuNDk2IDQ1LjMyMiAxMDguNzM1IDQ0LjAwNyAxMDcuNDkzIDQzLjI5OFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+';

function getDetectedWallets(): DetectedWallet[] {
  const detected: DetectedWallet[] = [];
  const win = window as unknown as Record<string, unknown>;

  if (win.solana && (win.solana as SolanaProvider).isPhantom) {
    detected.push({ name: 'Phantom', icon: PHANTOM_ICON, provider: win.solana as SolanaProvider });
  }
  if (win.solflare && (win.solflare as SolanaProvider).isSolflare) {
    detected.push({ name: 'Solflare', icon: SOLFLARE_ICON, provider: win.solflare as SolanaProvider });
  }
  // Fallback: show Phantom as installable
  if (detected.length === 0) {
    detected.push({ name: 'Phantom', icon: PHANTOM_ICON, provider: null as unknown as SolanaProvider });
  }
  return detected;
}

export function useSolanaWallet() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<SolanaProvider | null>(null);
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>([]);

  useEffect(() => {
    setDetectedWallets(getDetectedWallets());
  }, []);

  const connect = useCallback(async (wallet: DetectedWallet) => {
    if (!wallet.provider) {
      window.open('https://phantom.app', '_blank');
      return;
    }
    try {
      const resp = await wallet.provider.connect();
      setPublicKey(resp.publicKey.toBase58());
      setConnected(true);
      setActiveProvider(wallet.provider);

      const handleDisconnect = () => {
        setConnected(false);
        setPublicKey(null);
        setActiveProvider(null);
      };
      wallet.provider.on('disconnect', handleDisconnect);
    } catch {
      // user rejected
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (activeProvider) {
      try {
        await activeProvider.disconnect();
      } catch {
        // ignore
      }
    }
    setConnected(false);
    setPublicKey(null);
    setActiveProvider(null);
  }, [activeProvider]);

  /**
   * Sign a transaction using the active wallet provider.
   * Returns the signed transaction object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signTransaction = useCallback(async (transaction: any): Promise<any> => {
    if (!activeProvider) throw new Error('No wallet connected');
    return activeProvider.signTransaction(transaction);
  }, [activeProvider]);

  return { connected, publicKey, activeProvider, detectedWallets, connect, disconnect, signTransaction };
}
