import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Eye, EyeOff, Loader } from "lucide-react";
import { useAuthStore } from "../context/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(form.email, form.password);

    if (result.success) {
      toast.success("Login successful 🚀");
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">

      <div className="w-full max-w-sm">

        {/* CARD */}
        <div className="bg-white dark:bg-neutral-900 border rounded-2xl p-8 shadow-sm">

          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="w-10 h-10 mx-auto snapgram-gradient rounded-xl flex items-center justify-center">
              <Camera className="text-white" size={22} />
            </div>

            <h1 className="text-3xl font-bold mt-3 snapgram-gradient-text">
              Snapgram
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Welcome back 👋
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
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

            {/* PASSWORD */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* FORGOT */}
          <div className="mt-5 text-center text-sm">
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

        </div>

        {/* SIGNUP */}
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-semibold"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}