import "./globals.css";
import Providers from "./Providers";


export const metadata = {
  title: "Product Manager",
  description: "Manage products easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
