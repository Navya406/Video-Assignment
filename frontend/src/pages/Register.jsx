import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Viewer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://video-assignment.onrender.com/api/auth/register", { username, password, role });
      alert("Success! Please Login.");
      navigate("/login");
    } catch (error) { alert("Registration Failed"); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-[350px] bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.35)] rounded-[10px] px-[30px] py-[20px] box-border">
          
          <h2 className="text-center text-[28px] font-extrabold my-[30px] text-black font-sans leading-tight">
            Create Account
          </h2>
          
          <form className="flex flex-col gap-[18px] w-full mb-[15px]" onSubmit={handleRegister}>
            
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-[20px] border border-[#c0c0c0] px-[15px] py-[12px] outline-none text-black placeholder-gray-500 focus:border-[teal] transition-colors"
            />
            
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-[20px] border border-[#c0c0c0] px-[15px] py-[12px] outline-none text-black placeholder-gray-500 focus:border-[teal] transition-colors"
            />

            <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-[20px] border border-[#c0c0c0] px-[15px] py-[12px] outline-none text-black focus:border-[teal] transition-colors cursor-pointer bg-white"
            >
                <option value="Viewer">Viewer (Read Only)</option>
                <option value="Editor">Editor (Upload Access)</option>
                <option value="Admin">Admin (Full Control)</option>
            </select>
            
            <button 
              disabled={loading}
              className="w-full py-[10px] px-[15px] rounded-[20px] bg-[teal] text-white font-bold text-[16px] shadow-[0px_3px_8px_rgba(0,0,0,0.24)] hover:shadow-none active:shadow-none transition-shadow cursor-pointer border-none outline-none mt-[10px] disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
          
          <div className="text-center mt-[15px] mb-[5px]">
             <span className="text-[12px] text-[#747474] font-sans">
               Already have an account? 
             </span>
             <Link to="/login" className="ml-[5px] text-[12px] font-extrabold text-[teal] underline decoration-[teal] cursor-pointer font-sans">
               Log in
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;