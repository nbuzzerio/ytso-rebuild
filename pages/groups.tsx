import Head from 'next/head'
import LoginForm from '@/components/loginForm';
import { useRouter } from "next/router"
import { useEffect } from 'react';
import { useAuth } from '@/components/AuthContext/AuthContext';

export default function Groups() {

    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!auth) router.push('/login')

        return () => { }
    }, [])


    return (
        <div className='bg-blue-200 h-screen'>
            <Head>
                <title>Groups Page Template</title>
                <meta name="description" content="login" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className='main'>
                <h1 className='text-7xl text-green-400 text-center py-10'>
                    Groups Page Template
                </h1>
                <div className="form-wrapper flex justify-center">
                    <LoginForm />
                </div>
            </main>
        </div>
    )
}
