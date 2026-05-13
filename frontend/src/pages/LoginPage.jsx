import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Eye, EyeOff, Loader } from "lucide-react";
import { useAuthStore } from "../context/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(form.email, form.password);

    if (result?.success) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error(result?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 border rounded-2xl p-8 shadow-sm">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-10 h-10 mx-auto snapgram-gradient rounded-xl flex items-center justify-center">
              <Camera size={22} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mt-2">Snapgram</h1>
            <p className="text-gray-500 text-sm mt-2">
              Sign in to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="input-field"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="input-field pr-10"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Forgot */}
          <div className="text-center mt-4 text-sm">
            <Link to="/forgot-password" className="text-blue-500">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Signup */}
        <div className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}