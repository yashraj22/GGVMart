'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js"
import Image from 'next/image';

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjeGluaWN1cnpub3dqa2hjdXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyMTgxMTQsImV4cCI6MjAyMjc5NDExNH0.hungTY7PjCtM_U29q9L_qFeXo8Y30AgAGHA3_vuRv5s'
const SUPABASE_URL = 'https://fcxinicurznowjkhcuvd.supabase.co'

const supabase = createClient(SUPABASE_URL,SUPABASE_KEY);

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    // Set up a listener for auth changes right after component mounts
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    // Check the current session synchronously and set the user (alternative approach if available)
    const currentSession = supabase.auth.session;
    setUser(currentSession?.user || null);

    // Cleanup the listener on component unmount
  
  }, []);

  const loginWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  if (user) {

    console.log(user);
    // Display user's name and avatar if login is successful
    return (
      <div>
        <h1>Posts</h1>
        <div>
          <p>Welcome, {user.user_metadata.full_name}!</p>
          <Image width={50} height={50} src={user.user_metadata.picture} alt="User avatar" />
        </div>
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

export default Home;