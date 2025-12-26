import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-[0px_4px_10px_rgba(0,0,0,0.05)] h-[70px] flex items-center transition-colors duration-300 dark:bg-gray-900 dark:shadow-gray-800">
      <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* Logo - Matching the Clean aesthetic */}
        <Link to="/" className="flex items-center gap-2 group text-decoration-none">
          <div className="w-8 h-8 bg-[teal] rounded-[10px] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            V
          </div>
          <span className="text-xl font-extrabold text-black dark:text-white font-sans tracking-tight">
            VideoVault
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          
          {/* Theme Toggle (Simplified) */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-[#747474] hover:text-[teal] hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
               // Moon Icon
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-011.33-4.968 8.258 8.258 0 009.75 9.75 9.75 9.75 0 002.422 4.252z" />
               </svg>
            ) : (
              // Sun Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-black dark:text-white capitalize font-sans">{user.username}</div>
                <div className="text-[10px] text-[#747474] dark:text-gray-400 font-bold uppercase tracking-wider">
                  {user.role}
                </div>
              </div>
              
              {/* Logout Button - Teal Style */}
              <button 
                onClick={logout}
                className="py-[8px] px-[20px] rounded-[20px] bg-[teal] text-white font-bold text-[14px] shadow-[0px_3px_8px_rgba(0,0,0,0.24)] hover:shadow-none active:shadow-none transition-shadow"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* Login Link - Gray Text */}
              <Link to="/login" className="text-[13px] font-bold text-[#747474] hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors font-sans">
                Log in
              </Link>
              
              {/* Register Button - Teal Pill Style */}
              <Link to="/register" className="py-[8px] px-[20px] rounded-[20px] bg-[teal] text-white font-bold text-[14px] shadow-[0px_3px_8px_rgba(0,0,0,0.24)] hover:shadow-none active:shadow-none transition-shadow decoration-none">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;