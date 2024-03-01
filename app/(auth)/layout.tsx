const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="flex-center min-h-screen">
        {children}
      </div>
    )
  }
  
  export default Layout