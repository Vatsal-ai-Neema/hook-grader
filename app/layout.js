import "./globals.css";

export const metadata = {
  title: "LinkedIn Hook Grader | Myntmore",
  description: "Score the first two lines of your LinkedIn post and get 3 sharper rewrites.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
