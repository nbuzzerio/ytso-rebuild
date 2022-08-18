import '@/styles/main.scss'
import Layout from '@/components/Layout'
import AuthContext from '@/components/AuthContext'

function App({ Component, pageProps }) {

  return (
    <AuthContext>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthContext>

  )
}

export default App
