import React from 'react';
import { ArrowLeft, Trophy, Medal, Award, Star } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  level: string;
  difficulty: string;
  date: string;
}

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  // Mock leaderboard data - in a real app this would come from a backend
  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, playerName: "TowerMaster", score: 125000, level: "Desert Maze", difficulty: "Hard", date: "2024-01-15" },
    { rank: 2, playerName: "DefenseKing", score: 98500, level: "Mountain Pass", difficulty: "Hard", date: "2024-01-14" },
    { rank: 3, playerName: "StrategyPro", score: 87200, level: "Desert Maze", difficulty: "Medium", date: "2024-01-13" },
    { rank: 4, playerName: "TowerLord", score: 76800, level: "Forest Path", difficulty: "Hard", date: "2024-01-12" },
    { rank: 5, playerName: "Guardian", score: 65400, level: "Mountain Pass", difficulty: "Medium", date: "2024-01-11" },
    { rank: 6, playerName: "Defender", score: 54200, level: "Forest Path", difficulty: "Medium", date: "2024-01-10" },
    { rank: 7, playerName: "TowerFan", score: 43100, level: "Desert Maze", difficulty: "Easy", date: "2024-01-09" },
    { rank: 8, playerName: "Strategist", score: 38900, level: "Mountain Pass", difficulty: "Easy", date: "2024-01-08" },
    { rank: 9, playerName: "NewPlayer", score: 32500, level: "Forest Path", difficulty: "Easy", date: "2024-01-07" },
    { rank: 10, playerName: "Beginner", score: 28700, level: "Forest Path", difficulty: "Easy", date: "2024-01-06" }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-400" />;
      default: return <Star className="w-5 h-5 text-blue-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900';
      case 'Medium': return 'text-yellow-400 bg-yellow-900';
      case 'Hard': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const formatScore = (score: number) => {
    return score.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-orange-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Menu
          </button>
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-400" />
            Leaderboard
          </h1>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4">
            <h2 className="text-white text-xl font-bold text-center">Top Defenders</h2>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {leaderboardData.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                    entry.rank <= 3 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 border border-yellow-500' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full">
                    {entry.rank <= 3 ? getRankIcon(entry.rank) : (
                      <span className="text-white font-bold">#{entry.rank}</span>
                    )}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-bold text-lg">{entry.playerName}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(entry.difficulty)}`}>
                        {entry.difficulty}
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm">
                      {entry.level} • {entry.date}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold text-xl">
                      {formatScore(entry.score)}
                    </div>
                    <div className="text-gray-400 text-sm">points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-white font-bold text-lg mb-4">How Scoring Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-green-400 font-bold mb-2">Base Points</div>
              <div className="text-gray-300">Earn points for each enemy defeated</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-yellow-400 font-bold mb-2">Difficulty Bonus</div>
              <div className="text-gray-300">Higher difficulty = more points</div>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <div className="text-blue-400 font-bold mb-2">Completion Bonus</div>
              <div className="text-gray-300">Bonus for completing all waves</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};