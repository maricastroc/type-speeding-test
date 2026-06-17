import { ConfigProvider } from '@/features/settings/context/ConfigContext';
import { SoundProvider } from '@/features/sound/context/SoundContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Sora, Roboto_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={`${sora.className} ${robotoMono.variable}`}>
        <ConfigProvider>
          <SoundProvider>
            <Component {...pageProps} />
          </SoundProvider>
        </ConfigProvider>
      </main>
    </SessionProvider>
  );
}
