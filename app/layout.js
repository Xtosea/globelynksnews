import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton"; // import it

export const metadata = {
  title: "Globelynks News And Entertainment",
  description: "News & Articles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black transition-colors duration-300 dark:bg-gray-900 dark:text-white">
        <Navbar />
        <main className="min-h-screen max-w-4xl mx-auto px-4">
          {/* BackButton will now appear on all pages except homepage */}
          <BackButton />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}