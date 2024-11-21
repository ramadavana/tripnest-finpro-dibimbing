export default function HelpCenter() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-5xl px-6 mx-auto">
        {/* Header */}
        <h1 className="mb-6 text-4xl font-bold text-center text-[#f96d00]">Help Center</h1>
        <p className="mb-12 text-lg text-center text-gray-700">
          Need help? Contact our customer service or leave your feedback below!
        </p>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
          <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
            <ion-icon name="call" class="text-[#f96d00] text-4xl mr-4"></ion-icon>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-600">+1 800 123 456</p>
            </div>
          </div>
          <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
            <ion-icon name="mail" class="text-[#f96d00] text-4xl mr-4"></ion-icon>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">support@tripnest.com</p>
            </div>
          </div>
          <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
            <ion-icon name="mail-open" class="text-[#f96d00] text-4xl mr-4"></ion-icon>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Fax</h3>
              <p className="text-gray-600">+1 800 654 321</p>
            </div>
          </div>
          <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
            <ion-icon name="location" class="text-[#f96d00] text-4xl mr-4"></ion-icon>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Address</h3>
              <p className="text-gray-600">
                123 Explorer Street, Wanderlust City, Travelonia 45678
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold text-[#f96d00]">Feedback Form</h2>
          <p className="mb-6 text-gray-700">
            We value your feedback! Let us know how we can improve TripNest.
          </p>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#f96d00] focus:border-[#f96d00]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#f96d00] focus:border-[#f96d00]"
                placeholder="Your email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Your Feedback
              </label>
              <textarea
                id="message"
                rows="4"
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#f96d00] focus:border-[#f96d00]"
                placeholder="Write your feedback here..."></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-[#f96d00] rounded-md shadow hover:bg-[#A03D00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f96d00]">
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Decorative SVG */}
        <div className="mt-12 text-center">
          <p className="mt-4 text-gray-600">Helping you explore the world with ease!</p>
        </div>
      </div>
    </section>
  );
}
