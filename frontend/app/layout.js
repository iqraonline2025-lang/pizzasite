import "./globals.css";
import { CartProvider } from "../context/cartContext"; // Add this import
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">
        {/* Wrap everything in the CartProvider */}
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}