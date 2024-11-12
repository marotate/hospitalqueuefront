import '../app/globals.css';  // Adjust the import path to where your global.css is
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
