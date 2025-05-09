import React from 'react';
import place from "../assets/placeholder.jpg"
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Header</h1>
      </header>

      <main className="container mx-auto px-4 min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-between">
        <section className="lg:w-1/2 pt-16 lg:pt-0 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Welcome to Our Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Start connecting and chatting with people right now.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Link  to={"/video"} className="bg-blue-600 hover:bg-blue-700 py-4 px-8 text-lg text-white font-semibold rounded-md">
              Start
            </Link >
            <Link to={"/lead"} className="border border-gray-700 hover:bg-gray-800 py-4 px-8 text-lg text-white font-semibold rounded-md">
              Leaderboard
            </Link>
          </div>
        </section>

        <section className="lg:w-1/2 mt-12 lg:mt-0 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20"></div>
            <div className="bg-gradient-to-br from-gray-900 to-black p-2 border border-gray-800 rounded-lg relative z-10">
              <div className="rounded-md overflow-hidden aspect-video">
                <img
                  src={place}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
