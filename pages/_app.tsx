import "@/styles/main.scss";
import Layout from "@/components/Layout";
import AuthContext from "@/components/AuthContext";
import SubsContext from "@/components/SubsContext";

function App({ Component, pageProps }) {
  return (
    <AuthContext>
      <SubsContext>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SubsContext>
    </AuthContext>
  );
}

export default App;
