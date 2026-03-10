import React from "react";
import "../../styles/globals.css";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}