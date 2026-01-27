import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Heart, MessageCircle, Plus, Search } from 'lucide-react';

// Demo data
const challenges = [
  {
    id: '1',
    name: '30-Day Protein Challenge',
    participants: 234,
    progress: 65,
    daysLeft: 12,
    image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Summer Shred 2024',
    participants: 1250,
    progress: 40,
    daysLeft: 45,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
  },
];

const friends = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    streak: 23,
    status: 'online',
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    streak: 15,
    status: 'offline',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    streak: 45,
    status: 'online',
  },
];

const feed = [
  {
    id: '1',
    user: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    action: 'completed a 7-day streak!',
    time: '2h ago',
    likes: 12,
    type: 'achievement',
  },
  {
    id: '2',
    user: 'Mike Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    action: 'shared a healthy recipe',
    time: '4h ago',
    likes: 8,
    type: 'recipe',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  },
];

export function GroupsPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'friends'>('feed');

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-text-primary">Community</h1>
        <p className="text-text-secondary">Stay motivated together</p>
      </header>

      {/* Tabs */}
      <div className="px-6 py-3">
        <div className="flex gap-2 bg-surface rounded-xl p-1">
          {(['feed', 'challenges', 'friends'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-tertiary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'feed' && (
        <div className="px-6 space-y-4">
          {feed.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border border-border"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={item.avatar}
                  alt={item.user}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-text-primary">{item.user}</p>
                  <p className="text-sm text-text-tertiary">{item.time}</p>
                </div>
                {item.type === 'achievement' && (
                  <Trophy size={20} className="text-carbs" />
                )}
              </div>
              <p className="text-text-secondary mb-3">{item.action}</p>
              {item.image && (
                <img
                  src={item.image}
                  alt="Shared content"
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              )}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-text-tertiary hover:text-protein transition-colors">
                  <Heart size={18} />
                  <span className="text-sm">{item.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-text-tertiary hover:text-accent transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-sm">Comment</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="px-6 space-y-4">
          {/* Join Challenge Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-surface rounded-xl flex items-center justify-center gap-2 text-text-secondary"
          >
            <Plus size={20} />
            <span className="font-medium">Browse Challenges</span>
          </motion.button>

          {/* Active Challenges */}
          <h3 className="font-semibold text-text-primary">Active Challenges</h3>
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl overflow-hidden border border-border"
            >
              <div className="h-24 relative">
                <img
                  src={challenge.image}
                  alt={challenge.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h4 className="font-semibold text-white">{challenge.name}</h4>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-text-secondary text-sm">
                    <Users size={14} />
                    <span>{challenge.participants} participants</span>
                  </div>
                  <span className="text-sm text-text-tertiary">
                    {challenge.daysLeft} days left
                  </span>
                </div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
                <p className="text-sm text-text-tertiary mt-2">
                  {challenge.progress}% complete
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="px-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              type="text"
              placeholder="Search friends..."
              className="w-full pl-12 pr-4 py-3 bg-surface rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Add Friends Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-accent text-white rounded-xl flex items-center justify-center gap-2 font-semibold"
          >
            <Plus size={20} />
            <span>Invite Friends</span>
          </motion.button>

          {/* Friends List */}
          <h3 className="font-semibold text-text-primary">Your Friends</h3>
          {friends.map((friend) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 border border-border flex items-center gap-4"
            >
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    friend.status === 'online' ? 'bg-success' : 'bg-text-tertiary'
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text-primary">{friend.name}</p>
                <div className="flex items-center gap-1 text-sm text-text-tertiary">
                  <span>🔥</span>
                  <span>{friend.streak} day streak</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-surface rounded-lg text-sm font-medium text-text-secondary">
                View
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
