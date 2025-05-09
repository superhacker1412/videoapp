import React from 'react'

const LeaderBoard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
          <header className="p-4 border-b border-gray-800">
            <h1 className="text-2xl font-bold">Leaderboard</h1>
          </header>
    
          <div className="container mx-auto px-4 py-24">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
              <p className="text-gray-400">View the top scores and ranks</p>
            </div>
    
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg overflow-hidden border border-gray-700">
                <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-700 bg-gray-900">
                  <div className="col-span-2 font-semibold">Rank</div>
                  <div className="col-span-6 font-semibold">User</div>
                  <div className="col-span-4 text-right font-semibold">Score</div>
                </div>
    
                <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-700 bg-gray-800 bg-opacity-30">
                  <div className="col-span-2">🥇</div>
                  <div className="col-span-6">User Name</div>
                  <div className="col-span-4 text-right font-mono">1000</div>
                </div>
    
                <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-700 bg-gray-800 bg-opacity-30">
                  <div className="col-span-2">🥈</div>
                  <div className="col-span-6">Another User</div>
                  <div className="col-span-4 text-right font-mono">900</div>
                </div>
    
                <div className="grid grid-cols-12 py-3 px-4 border-b border-gray-700 bg-gray-800 bg-opacity-30">
                  <div className="col-span-2">🥉</div>
                  <div className="col-span-6">Yet Another User</div>
                  <div className="col-span-4 text-right font-mono">800</div>
                </div>
              </div>
    
              <div className="mt-6 text-center">
                <button className="bg-primary hover:bg-primary/90 py-3 px-6 text-lg text-white rounded">
                  Start Match
                </button>
              </div>
            </div>
          </div>
        </div>
      );
}

export default LeaderBoard