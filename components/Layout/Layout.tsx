import Header from '../Header'
import Footer from '../Footer'

function Layout({ children }: { children : React.ReactNode }){

    return (
      <>
        <Header/>
            <div className="page-container pt-[80px] lg:pt-[130px]">
              { children }
            </div>
        <Footer/>
      </>
    )
}


export default Layout
