export type VideoCategory = "praise" | "podcast" | "interview" | "testimony" | "sermon" | "all" | "featured";

import { type LocalizedText } from "./types";

export interface GalleryVideo {
  id: string;
  title: string;
  titleLocalized?: LocalizedText;
  description?: string;
  descriptionLocalized?: LocalizedText;
  thumbnail: string;
  videoUrl: string;
  category: VideoCategory;
  duration?: string; // e.g., "45:30"
  preacher?: string; // For sermons
  preacherLocalized?: LocalizedText;
  guest?: string; // For interviews
  guestLocalized?: LocalizedText;
  date: string; // e.g., "March 15, 2024"
  dateLocalized?: LocalizedText;
  views?: number;
  featured?: boolean;
  // Facebook compliance fields
  facebookVideoId?: string; // Store original Facebook video ID
  isOwnedContent?: boolean; // Mark if content is owned by the page
}

export const CATEGORIES: {
  value: VideoCategory;
  label: string;
  image: string;
  icon?: string;
}[] = [
  { value: "all", label: "All Videos", image: "/categories/allvideos.png" },
  { value: "featured", label: "Featured", image: "/categories/featured.jpg" },
  { value: "sermon", label: "Sermon", image: "/categories/sermon.png" },
  { value: "praise", label: "Praise & Worship", image: "/categories/praiseandworship.png" },
  { value: "podcast", label: "Podcast", image: "/categories/podcast.png" },
  { value: "interview", label: "Interviews", image: "/categories/interviews.jpg" },
  { value: "testimony", label: "Testimonies", image: "/categories/testimonies.jpg" },
];

// Actual gallery data (all user-provided videos)
export const GALLERY_VIDEOS: GalleryVideo[] = [
  {
    id: "fb-monday-service-2025-12-08",
    title: "Monday Service",
    description: "SPECIAL MONDAY SERVICE",
    thumbnail: "/category url/8 decemebr/582105767_18336895864236031_5775913771036425509_n.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F25555566980751626%2F&show_text=false&width=560&t=0",
    category: "sermon",
    preacher: "Ebomi Ministries",
    date: "8th December 2025",
  },
  {
    id: "fb-monday-service-2025-12-01",
    title: "Monday Service",
    description: "SPECIAL COMMUNION MONDAY SERVICE",
    thumbnail: "/category url/1 decemeber/589444530_1256964569796903_6463098502096097266_n.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F1857788471766301%2F&show_text=false&width=560&t=0",
    category: "sermon",
    preacher: "Ebomi Ministries",
    date: "1st December 2025",
  },
  {
    id: "fb-podcast-2025-11-30",
    title: "Podcast",
    description: "In His Presence",
    thumbnail: "/category url/30 november/inhispresence.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F1277454510809318%2F&show_text=false&width=560&t=0",
    category: "podcast",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "30th November 2025",
  },
  {
    id: "fb-podcast-2025-11-29",
    title: "Podcast",
    description: "In His Presence",
    thumbnail: "/category url/30 november/inhispresence.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F1285265876692224%2F&show_text=false&width=560&t=0",
    category: "podcast",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "29th November 2025",
  },
  {
    id: "fb-prayer-rally-2025-12-08",
    title: "Prayer Rally",
    description:
      "In this live session, we pray for: National peace and security, Good governance and godly leadership, Economic breakthrough and stability, Revival, righteousness, and unity in the church and the next generation.",
    thumbnail: "/category url/30 november/rally.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F822586290569006%2F&show_text=false&width=560&t=0",
    category: "sermon",
    preacher: "Ebomi / IBBN",
    date: "8th December 2025",
  },
  {
    id: "fb-fire-altar-day5-eve-2025-11-28",
    title: "Fire on the Altar: Rekindling the Family Altar Day 5 Evening",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God’s presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/575219012_18335549380236031_7017089753673696221_n.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F1815207659200339%2F&show_text=false&width=560&t=0",
    category: "sermon",
    preacher: "Ebomi",
    date: "28th November 2025",
  },
  {
    id: "fb-fire-altar-day5-eve-2025-11-28-alt2",
    title: "Fire on the Altar: Rekindling the Family Altar Day 5 Evening",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God’s presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/584345645_18335433409236031_8392011934521030632_n.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F1476627106901153%2F&show_text=false&width=560&t=0",
    category: "sermon",
    preacher: "Ebomi",
    date: "28th November 2025",
  },
  {
    id: "fb-fire-altar-day5-morn-2025-11-28",
    title: "Fire on the Altar: Rekindling the Family Altar Day 5 Morning Session",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God’s presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/584934838_18335655343236031_7625530837930270098_n.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F1408842573911222%2F&show_text=false&width=560&t=0",
    category: "sermon",
    preacher: "Ebomi",
    date: "28th November 2025",
  },
  {
    id: "fb-fire-altar-day3-eve-2025-11-26",
    title: "Fire on the Altar: Rekindling the Family Altar Day 3 Evening Session",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God’s presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/587315483_18335655346236031_8238553589214334149_n.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F2046953532756418%2F&show_text=false&width=560&t=0",
    category: "sermon",
    preacher: "Ebomi",
    date: "26th November 2025",
  },
  {
    id: "fb-worship-know-tomorrow-2025-06-25",
    title: "I Know Who Tomorrow",
    description: "Worship with God",
    thumbnail: "/category url/25 june/587538189_18335755024236031_7112958508705750848_n.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fweb.facebook.com%2Freel%2F692447416930524%2F&show_text=false&width=357&t=0",
    category: "praise",
    preacher: "Prophet Isa El-Buba & Deborah El-buba",
    date: "25th June 2025",
  },
  {
    id: "fb-sermon-prayers-nation-2025-06-25",
    title: "Prayers for our dear nation",
    description: "Worship with God",
    thumbnail: "/category url/25 june/prayerfornattion.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F1228099118517727%2F&show_text=false&width=357&t=0",
    category: "sermon",
    preacher: "Prophet Isa El-Buba",
    date: "25th June 2025",
  },
  {
    id: "fb-worship-holds-tomorrow-2025-06-25",
    title: "He holds your tomorrow in His hands",
    description: "Worship with God",
    thumbnail: "/category url/25 june/586964865_18335755051236031_1708911344589220763_n.jpg",
    videoUrl:
      "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fweb.facebook.com%2Felb.isaelbuba%2Fvideos%2F624598553346728%2F&show_text=false&width=357&t=0",
    category: "praise",
    preacher: "Prophet Isa El-Buba & Deborah El-buba",
    date: "25th June 2025",
  },
];

export function getFeaturedVideos(): GalleryVideo[] {
  return GALLERY_VIDEOS.filter((video) => video.featured);
}

export function getVideosByCategory(category: VideoCategory): GalleryVideo[] {
  if (category === "all") return GALLERY_VIDEOS;
  if (category === "featured") return getFeaturedVideos();
  return GALLERY_VIDEOS.filter((video) => video.category === category);
}

export function searchVideos(query: string): GalleryVideo[] {
  const q = query.toLowerCase();
  return GALLERY_VIDEOS.filter((video) => {
    const haystack = [
      video.title,
      video.description,
      video.preacher,
      video.guest,
      video.date,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

