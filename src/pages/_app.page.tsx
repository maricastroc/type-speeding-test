import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Sora, Roboto_Mono } from 'next/font/google';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${sora.className} ${robotoMono.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}
