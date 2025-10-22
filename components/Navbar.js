import { useSession, signIn, signOut } from "next-auth/react";
export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav>
            {session ? (
                <>
                    <span>Welcome, {session.user.name}</span>
                    <button onClick={() => signOut()}>Signout</button>
                </>
            ) :
                (
                    <button onClick={() => signIn()}>Sign In</button>
                )}
        </nav>
    )
}