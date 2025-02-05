"use client";

const AboutPage = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-10 max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-6">
            Welcome to Distribute Aid Needs Assessment Survey!
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Distribute Aid is dedicated to assessing and addressing the needs of
            communities worldwide. By completing surveys, you contribute valuable
            insights that help optimize the distribution of essential resources
            such as water, food, shelter, and hygiene supplies.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            If you would like an account to participate in our surveys, please
            contact us at{" "}
            <a
              href="mailto:hello@distributeaid.org"
              className="text-blue-500 font-medium hover:underline"
            >
              hello@distributeaid.org
            </a>
            .
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  };

  export default AboutPage;
