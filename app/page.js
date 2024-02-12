"use client";
import React from "react";
import Image from "next/image";
import ChatUI from "@/components/chat";
import ProductForm from "@/components/product";
import { UserAuth } from "./context/AuthContext";
import { AuthContextProvider } from "./context/AuthContext";
import { PrismaClient } from '@prisma/client';
import Products from "@/components/Products";
// const prisma = new PrismaClient();


// const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjeGluaWN1cnpub3dqa2hjdXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyMTgxMTQsImV4cCI6MjAyMjc5NDExNH0.hungTY7PjCtM_U29q9L_qFeXo8Y30AgAGHA3_vuRv5s'
// const SUPABASE_URL = 'https://fcxinicurznowjkhcuvd.supabase.co'

// const supabase = createClient(SUPABASE_URL,SUPABASE_KEY);

const HomePage = () => {


	// const [user, setUser] = useState(null);

	// useEffect(() => {

	//   // Set up a listener for auth changes right after component mounts
	//   const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
	//     setUser(session?.user || null);
	//   });

	//   // Check the current session synchronously and set the user (alternative approach if available)
	//   const currentSession = supabase.auth.session;
	//   setUser(currentSession?.user || null);

	//   // Cleanup the listener on component unmount

	// }, []);

	// const loginWithGoogle = async () => {
	//   try {
	//     await supabase.auth.signInWithOAuth({
	//       provider: 'google',
	//     });
	//   } catch (error) {
	//     alert(error.error_description || error.message);
	//   }
	// };

	// const logOut = async () => {
	//   const { error } = await supabase.auth.signOut()
	//   if(error) {
	//     console.log(error);
	//   } else {
	//     console.log("User Logged Out Succesfully !")
	//   }
	// };
	const { user, loginWithGoogle, logOut } = UserAuth();
	

	const handleLogout = async () => {
		try {
			await logOut();
		} catch (error) {
			console.log(error);
		}
	};

	if (user) {
		// Display user's name and avatar if login is successful
		return (
			<div>
				<h1>Posts</h1>
				<div>
					<p>Welcome, {user.user_metadata.full_name}!</p>
					<Image
						width={50}
						height={50}
						src={user.user_metadata.picture}
						alt="User avatar"
					/>
				</div>
				<button onClick={handleLogout}>LogOut</button>
				<ChatUI />
				<ProductForm />
				<Products />
				{/* {products.map(product => (
          <ChatWithSeller key={product.id} productId={product.id} />
        ))}			 */}
		</div>
		);
	}

	// If not logged in, show the login button
	return (
		<div>
			<h1>Posts</h1>
			<button onClick={loginWithGoogle}>Sign in with Google</button>
		</div>
	);
};

const Home = () => {
	return (
		<AuthContextProvider>
			<HomePage />
		</AuthContextProvider>
	);
};

export default Home;
