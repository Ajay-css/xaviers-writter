import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import loginImg from "../assets/login.webp"

export default function Login() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/auth/login`,
        formData
      )

      if (data.success) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate("/dashboard")
      } else {
        setError(data.message)
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 overflow-hidden font-sans">

      {/* Main Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100 grid lg:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE - IMAGE SECTION */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-12 relative">

          <img
            src={loginImg}
            alt="Login Illustration"
            className="w-full max-w-md object-contain"
          />

        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">

          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-medium text-gray-900">
                Sign in
              </h1>
              <p className="text-sm text-gray-500 mt-2 font-medium">
                Enter your credentials to continue
              </p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-5 text-sm font-medium text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600 font-medium block mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium text-gray-900"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-600 font-medium">
                    Password
                  </label>
                  <Link to="#" className="text-sm text-blue-600 font-medium hover:underline">
                    Forgot?
                  </Link>
                </div>

                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? "Signing in..." : (
                  <>
                    Continue
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

            </form>

            {/* Footer */}
            <p className="text-sm text-gray-500 font-medium mt-8 text-center">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">
                Create one
              </Link>
            </p>

          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}} />

    </div>
  )
}