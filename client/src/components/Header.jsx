import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight } from "lucide-react"

const Header = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3 p-3 border-b bg-white shadow-sm">
      
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <ArrowLeft size={20} />
      </button>

      <button
        onClick={() => navigate(1)}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <ArrowRight size={20} />
      </button>

    </div>
  )
}

export default Header