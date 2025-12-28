"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";

interface Sermon {
  id: number;
  title: string;
  preacher: string;
  date: string;
  thumbnail: string;
}

const mockSermons: Sermon[] = [
  {
    id: 1,
    title: "Walking in Faith",
    preacher: "Pastor John Smith",
    date: "March 15, 2024",
    thumbnail: "/api/placeholder/400/225",
  },
  {
    id: 2,
    title: "The Power of Prayer",
    preacher: "Pastor Sarah Johnson",
    date: "March 8, 2024",
    thumbnail: "/api/placeholder/400/225",
  },
  {
    id: 3,
    title: "Finding Hope in Darkness",
    preacher: "Pastor Michael Brown",
    date: "March 1, 2024",
    thumbnail: "/api/placeholder/400/225",
  },
  {
    id: 4,
    title: "Living with Purpose",
    preacher: "Pastor Emily Davis",
    date: "February 23, 2024",
    thumbnail: "/api/placeholder/400/225",
  },
  {
    id: 5,
    title: "The Gift of Grace",
    preacher: "Pastor David Wilson",
    date: "February 16, 2024",
    thumbnail: "/api/placeholder/400/225",
  },
  {
    id: 6,
    title: "Building Community",
    preacher: "Pastor Lisa Anderson",
    date: "February 9, 2024",
    thumbnail: "/api/placeholder/400/225",
  },
];

export default function SermonGrid() {
  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
          Recent Sermons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSermons.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <motion.div
      className="group relative bg-foreground/5 rounded-lg overflow-hidden border border-foreground/10 cursor-pointer"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-background to-foreground/10">
        {/* Placeholder for thumbnail image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-ministry-red/20 to-ministry-gold/20" />
        </div>

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 border-2 border-ministry-gold/0 group-hover:border-ministry-gold/60 transition-all duration-300 rounded-lg" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-ministry-gold transition-colors">
          {sermon.title}
        </h3>
        <p className="text-sm text-ministry-gold mb-1 font-medium">{sermon.preacher}</p>
        <p className="text-xs text-foreground/50 uppercase font-bold tracking-widest">{sermon.date}</p>
      </div>
    </motion.div>
  );
}

