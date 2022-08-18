import Head from 'next/head'
import LoginForm from '@/components/loginForm';

export default function Login() {
    return (
        <div className='bg-blue-200 h-screen'>
            <Head>
                <title>Log In Template</title>
                <meta name="description" content="login" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className='main'>
                <h1 className='text-7xl text-green-400 text-center py-10'>
                    Log In Template
                </h1>
                <div className="form-wrapper flex justify-center">
                    <LoginForm />
                </div>
            </main>
        </div>
    )
}
