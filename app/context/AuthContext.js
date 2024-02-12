"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const AuthContext = createContext();
console.log(SUPABASE_URL, SUPABASE_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const loginWithGoogle = async () => {
		try {
			await supabase.auth.signInWithOAuth({
				provider: "google",
			});
		} catch (error) {
			alert(error.error_description || error.message);
		}
	};

	const logOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log(error);
		} else {
			console.log("User Logged Out Succesfully !");
		}
	};

	useEffect(() => {
		// Set up a listener for auth changes right after component mounts
		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setUser(session?.user || null);
			},
		);

		// Check the current session synchronously and set the user (alternative approach if available)
		const currentSession = supabase.auth.session;
		setUser(currentSession?.user || null);
		// Cleanup the listener on component unmount
	}, []);

	return (
		<AuthContext.Provider value={{ user, loginWithGoogle, logOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
