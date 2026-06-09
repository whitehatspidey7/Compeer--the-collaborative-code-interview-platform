"use client"

import {useState} from 'react';
import {signIn} from 'next-auth/react';



// this is the login via Github UI, now need to tell the route
export default function Login()
{
    const [isLoading,setIsloading] = useState(false);

    const handleLogin = async ()=>{

        setIsloading(true);

        await signIn("github",{callbackUrl: '/dashboard'});
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans p-4">
            {/* Login Card */}
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        
            {/* Logo / Branding */}
            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-mono tracking-tight text-blue-400 mb-2">
                 &lt;Compeer /&gt;
            </h1>
            <p className="text-slate-400 text-sm">
            Sign in to start your real-time collaborative coding session.
            </p>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2f363d] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors border border-slate-700"
        >
          {isLoading ? (
            <span className="animate-pulse">Connecting to GitHub...</span>
          ) : (
            <>
              {/* GitHub SVG Icon */}
              <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Continue with GitHub
            </>
          )}
        </button>

        {/* Security Note */}
        <p className="text-center text-xs text-slate-500 mt-6">
          By signing in, you agree to Compeer's Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
    );
}