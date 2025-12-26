import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://video-assignment.onrender.com/api/auth/login", { username, password });
      login({ _id: data._id, username: data.username, role: data.role }, data.token);
      navigate("/"); 
    } catch (error) { alert("Invalid Credentials"); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-[350px] bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-[10px] px-[30px] py-[20px] box-border">
          
          <h2 className="text-center text-[28px] font-extrabold my-[30px] text-black font-sans leading-tight">
            Welcome back
          </h2>
          
          <form className="flex flex-col gap-[18px] w-full mb-[15px]" onSubmit={handleLogin}>
            
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-[20px] border border-[#c0c0c0] px-[15px] py-[12px] outline-none text-black placeholder-gray-500 focus:border-[teal] transition-colors"
            />
            
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[20px] border border-[#c0c0c0] px-[15px] py-[12px] outline-none text-black placeholder-gray-500 focus:border-[teal] transition-colors"
            />
            
            <div className="text-right m-0">
              <span className="text-[11px] font-bold text-[#747474] hover:text-black cursor-pointer underline decoration-[#747474]">
                Forgot Password?
              </span>
            </div>
            
            <button className="w-full py-[10px] px-[15px] rounded-[20px] bg-[teal] text-white font-bold text-[16px] shadow-[0px_3px_8px_rgba(0,0,0,0.24)] hover:shadow-none active:shadow-none transition-shadow cursor-pointer border-none outline-none">
              Log in
            </button>
          </form>
          
          <div className="text-center mt-[20px] mb-[10px]">
             <span className="text-[12px] text-[#747474] font-sans">
               Don't have an account? 
             </span>
             <Link to="/register" className="ml-[5px] text-[12px] font-extrabold text-[teal] underline decoration-[teal] cursor-pointer font-sans">
               Sign up
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;