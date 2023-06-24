import "@alttransfer/cross-chain-payment-react-sdk/index.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Donate Demo App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
