export default function Contact() {
  return (
    <>

      <section className="relative bg-white py-24 px-6 md:px-16 overflow-hidden">

        {/* Subtle Gradient Accent */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-blue-50 via-white to-cyan-50 -z-10"></div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT CONTENT */}
          <div>
            <span className="inline-block px-4 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-full">
              Contact Us
            </span>

            <h1 className="mt-6 text-4xl md:text-5xl font-semibold text-gray-900 leading-tight">
              Let’s Build Something
              <span className="block text-blue-600">
                Exceptional Together
              </span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-lg">
              Have a project in mind? Ajay Technologies specializes in building
              modern websites, scalable applications and powerful digital
              platforms tailored to your business needs.
            </p>

            <div className="mt-10 space-y-4 text-gray-700">
              <p><strong>Email:</strong> needfs245@gmail.com</p>
              <p><strong>Location:</strong> Tamil Nadu, India</p>
              <p><strong>Response Time:</strong> Within 24 Hours</p>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-xl">

            <form className="space-y-6">

              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Anderson"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@company.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Your Description
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Briefly describe your suggestion related ...."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-300 shadow-md"
              >
                Request Consultation
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your information is secure and will never be shared.
              </p>

            </form>
          </div>
        </div>
      </section>
    </>
  );
}
