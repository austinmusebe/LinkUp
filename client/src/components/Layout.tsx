interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="App">
      <main>{children}</main>
    </div>
  );
}

export default Layout;
