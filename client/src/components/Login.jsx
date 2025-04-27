import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { showLogin, setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);
  const [mode, setMode] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.body.style.overflow = showLogin ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        mode === "Login" ? "/api/user/login" : "/api/user/register";
      const payload =
        mode === "Login" ? { email, password } : { name, email, password };

      console.log("POST →", `${backendUrl}${endpoint}`, payload);
      const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);
      console.log("← response:", data);

      
      const successFlag = data.success ?? data.sucess;
      if (successFlag) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message);
    }
  };

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center backdrop-blur-sm">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          {mode}
        </h2>

        {mode !== "Login" && (
          <div className="mb-4 border px-6 py-2 flex items-center gap-2 rounded-full">
            <img src={assets.profile_icon} alt="profile" width={23} />
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="outline-none text-sm w-full"
            />
          </div>
        )}

        <div className="mb-4 border px-6 py-2 flex items-center gap-2 rounded-full">
          <img src={assets.email_icon} alt="email" />
          <input
            id="auth-email"
            type="email"
            autoComplete="username"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="outline-none text-sm w-full"
          />
        </div>

        <div className="mb-6 border px-6 py-2 flex items-center gap-2 rounded-full">
          <img src={assets.lock_icon} alt="lock" />
          <input
            id="auth-password"
            type="password"
            autoComplete={
              mode === "Login" ? "current-password" : "new-password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="outline-none text-sm w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition"
        >
          {mode === "Login" ? "Login" : "Create Account"}
        </button>

        <p
          className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => setMode(mode === "Login" ? "Sign Up" : "Login")}
        >
          {mode === "Login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </p>

        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt="close"
          className="absolute top-5 right-5 cursor-pointer"
        />
      </motion.form>
    </div>
  );
};

export default Login;
