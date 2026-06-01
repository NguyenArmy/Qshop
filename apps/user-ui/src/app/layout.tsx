import Header from '../shared/widgets/header';
import './global.css';

export const metadata = {
  title: 'Qshop',
  description: 'Eshop ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <Header/>
      <body>{children}</body>
    </html>
  )
}
