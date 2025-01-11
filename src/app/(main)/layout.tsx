export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex h-[100%] w-[100%] flex-col items-center">{children}</main>;
}
