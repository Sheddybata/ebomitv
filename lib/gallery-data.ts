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
    id: "yt-podcast-in-his-presence-2025-11-30",
    title: "Podcast",
    description: "In His Presence",
    thumbnail: "/category url/30 november/inhispresence.jpg",
    videoUrl: "https://www.youtube.com/embed/D6whOm4JVYk",
    category: "podcast",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "30th November 2025",
  },
  {
    id: "yt-podcast-in-his-presence-2025-11-29",
    title: "Podcast",
    description: "In His Presence",
    thumbnail: "/category url/30 november/inhispresence.jpg",
    videoUrl: "https://www.youtube.com/embed/NbNKbqr8L0A",
    category: "podcast",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "29th November 2025",
  },
  {
    id: "yt-prayer-rally-2025-12-08",
    title: "Prayer Rally",
    description:
      "In this live session, we pray for: National peace and security, Good governance and godly leadership, Economic breakthrough and stability, Revival, righteousness, and unity in the church and the next generation.",
    thumbnail: "/category url/30 november/rally.jpg",
    videoUrl: "https://www.youtube.com/embed/rBSEZbrNnjs",
    category: "sermon",
    preacher: "Ebomi / IBBN",
    date: "8th December 2025",
  },
  {
    id: "yt-fire-altar-day5-eve-2025-11-28",
    title: "Fire on the Altar: Rekindling the Family Altar Day 5 Evening",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God's presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/575219012_18335549380236031_7017089753673696221_n.jpg",
    videoUrl: "https://www.youtube.com/embed/pbX5jdNCbnQ",
    category: "sermon",
    preacher: "Ebomi",
    date: "28th November 2025",
  },
  {
    id: "yt-fire-altar-day5-eve-2025-11-28-alt2",
    title: "Fire on the Altar: Rekindling the Family Altar Day 5 Evening",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God's presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/584345645_18335433409236031_8392011934521030632_n.jpg",
    videoUrl: "https://www.youtube.com/embed/5AEK3TgXxm0",
    category: "sermon",
    preacher: "Ebomi",
    date: "28th November 2025",
  },
  {
    id: "yt-fire-altar-day5-morn-2025-11-28",
    title: "Fire on the Altar: Rekindling the Family Altar Day 5 Morning Session",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God's presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/584934838_18335655343236031_7625530837930270098_n.jpg",
    videoUrl: "https://www.youtube.com/embed/6yhonqBBIHc",
    category: "sermon",
    preacher: "Ebomi",
    date: "28th November 2025",
  },
  {
    id: "yt-fire-altar-day4-morn-2025-11-27",
    title: "Fire on the Altar: Rekindling the Family Altar Day 4 Morning Session",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God's presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/584934838_18335655343236031_7625530837930270098_n.jpg",
    videoUrl: "https://www.youtube.com/embed/Zq1n4OCcedw",
    category: "sermon",
    preacher: "Ebomi",
    date: "27th November 2025",
  },
  {
    id: "yt-fire-altar-day4-morn-2025-11-27-alt2",
    title: "Fire on the Altar: Rekindling the Family Altar Day 4 Morning Session",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God's presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/584934838_18335655343236031_7625530837930270098_n.jpg",
    videoUrl: "https://www.youtube.com/embed/HeS7k-ByvFI",
    category: "sermon",
    preacher: "Ebomi",
    date: "27th November 2025",
  },
  {
    id: "yt-fire-altar-day4-eve-2025-11-27",
    title: "Fire on the Altar: Rekindling the Family Altar Day 4 Evening Session",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God's presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/587315483_18335655346236031_8238553589214334149_n.jpg",
    videoUrl: "https://www.youtube.com/embed/PuZhw2zz_Qo",
    category: "sermon",
    preacher: "Ebomi",
    date: "27th November 2025",
  },
  {
    id: "yt-fire-altar-day3-morn-2025-11-26",
    title: "Fire on the Altar: Rekindling the Family Altar Day 3 Morning Session",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God's presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/587315483_18335655346236031_8238553589214334149_n.jpg",
    videoUrl: "https://www.youtube.com/embed/oXAkWe8ekxc",
    category: "sermon",
    preacher: "Ebomi",
    date: "26th November 2025",
  },
  {
    id: "yt-fire-altar-day3-eve-2025-11-26",
    title: "Fire on the Altar: Rekindling the Family Altar Day 3 Evening Session",
    description:
      "This is more than a service; it is a spiritual awakening. As we gather before God, expect a fresh release of His fire to consume everything that weakens families and ignite everything that strengthens them. Through worship, prayer, and the ministry of the Word, you will be equipped to cultivate a home filled with God's presence, peace, and supernatural covering. Whether you are believing for restoration, deeper intimacy with God, healing in your family, or a fresh atmosphere of devotion, this livestream will stir your spirit and shift your home. Prepare your heart—the altar is being rebuilt, and the fire of God is falling again.",
    thumbnail: "/category url/fireonthealter/587315483_18335655346236031_8238553589214334149_n.jpg",
    videoUrl: "https://www.youtube.com/embed/EnT00DyLgS8",
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
  // YouTube Videos
  {
    id: "yt-ultimate-youth-conference-award-2024-10-15",
    title: "EBOMI ULTIMATE YOUTH CONFERENCE 2024 / AWARD & RECOGNITION",
    description: "EBOMI ULTIMATE YOUTH CONFERENCE 2024 / AWARD & RECOGNITION",
    thumbnail: "/category url/youtube/EBOMI ULTIMATE YOUTH CONFERENCE 2024 AWARD RECOGNITION.png",
    videoUrl: "https://www.youtube.com/embed/Nqtl25qJfo8",
    category: "sermon",
    preacher: "Ebomi",
    date: "15th October 2024",
  },
  {
    id: "yt-powerful-praise-session-magnifiers",
    title: "Powerful Praise Session by EBOMI Magnifiers with Prophet Isa El-Buba",
    description: "Powerful Praise Session by EBOMI Magnifiers with Prophet Isa El-Buba",
    thumbnail: "/category url/youtube/Powerful Praise Session by EBOMI Magnifiers with Prophet Isa ElBuba.png",
    videoUrl: "https://www.youtube.com/embed/ABHJlHnMwdY",
    category: "praise",
    preacher: "Prophet Dr. Isa El-Buba EBOMI Magnifiers",
    date: "15th January 2022",
  },
  {
    id: "yt-ultimate-youth-fellowship-valentine-2024",
    title: "EBOMI ULTIMATE YOUTH FELLOWSHIP SPECIAL VALENTINE PROGRAM",
    description: "EBOMI ULTIMATE YOUTH FELLOWSHIP SPECIAL VALENTINE PROGRAM",
    thumbnail: "/category url/youtube/EBOMI ULTIMATE YOUTH FELLOWSHIP SPECIAL VALENTINE PROGRAM.png",
    videoUrl: "https://www.youtube.com/embed/kC_C--2QmaQ",
    category: "sermon",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "14th February 2024",
  },
  {
    id: "yt-ultimate-youth-conference-2024",
    title: "EBOMI ULTIMATE YOUTH CONFERENCE 2024",
    description: "EBOMI ULTIMATE YOUTH CONFERENCE 2024",
    thumbnail: "/category url/youtube/EBOMI ULTIMATE YOUTH CONFERENCE 2024.png",
    videoUrl: "https://www.youtube.com/embed/pDMAPsDQ4A4",
    category: "sermon",
    preacher: "EBOMI",
    date: "1st August 2024",
  },
  {
    id: "yt-my-god-never-fails",
    title: "My God never fails",
    description: "My God never fails",
    thumbnail: "/category url/youtube/my God never fails.png",
    videoUrl: "https://www.youtube.com/embed/9WVp6xdaEVQ",
    category: "praise",
    preacher: "Prophet Dr. Isa El-Buba EBOMI Magnifiers",
    date: "10th March 2022",
  },
  {
    id: "yt-dealing-demon-financial-breakthrough",
    title: "Dealing with the demon of financial breakthrough",
    description: "Dealing with the demon of financial breakthrough",
    thumbnail: "/category url/youtube/Dealing with the demon of financial breakthrough.png",
    videoUrl: "https://www.youtube.com/embed/t9kh1c_MRxg",
    category: "sermon",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "20th April 2022",
  },
  {
    id: "yt-power-of-thoughts",
    title: "The Power of Thoughts",
    description: "The Power of Thoughts",
    thumbnail: "/category url/youtube/The Power of Thoughts.png",
    videoUrl: "https://www.youtube.com/embed/vbLh-ax5KWE",
    category: "podcast",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "5th May 2022",
  },
  {
    id: "yt-promoting-christian-values-marketplace",
    title: "PROMOTING CHRISTIAN VALUES IN THE MARKET PLACE",
    description: "PROMOTING CHRISTIAN VALUES IN THE MARKET PLACE",
    thumbnail: "/category url/youtube/PROMOTING CHRISTIAN VALUES IN THE MARKET PLACE.png",
    videoUrl: "https://www.youtube.com/embed/ht43sUkJpO4",
    category: "podcast",
    preacher: "DR JONATHAN ONIGBINDE",
    date: "15th August 2025",
  },
  {
    id: "yt-humility",
    title: "Humility",
    description: "Humility",
    thumbnail: "/category url/youtube/Humility.png",
    videoUrl: "https://www.youtube.com/embed/73Vf6V0lVOc",
    category: "sermon",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "15th January 2016",
  },
  {
    id: "yt-word-of-god-final-authority",
    title: "The Word Of God Is Final Authority",
    description: "The Word Of God Is Final Authority",
    thumbnail: "/category url/youtube/The Word Of God Is Final Authority.png",
    videoUrl: "https://www.youtube.com/embed/E9AncEjODDk",
    category: "sermon",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "10th March 2013",
  },
  {
    id: "yt-government-terrorism-response",
    title: "How should the government respond to terrorism",
    description: "How should the government respond to terrorism",
    thumbnail: "/category url/youtube/my God never fails.png",
    videoUrl: "https://www.youtube.com/embed/VqO1INv9XOk",
    category: "podcast",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "15th November 2024",
  },
  {
    id: "yt-message-all-nigerians",
    title: "Message for all Nigerians",
    description: "Message for all Nigerians",
    thumbnail: "/category url/youtube/Message for all Nigerians.png",
    videoUrl: "https://www.youtube.com/embed/XsWXq2uqKAg",
    category: "podcast",
    preacher: "Prophet Dr. Isa El-Buba",
    date: "15th October 2024",
  },
  {
    id: "yt-powerful-interview-2026",
    title: "Powerful Interview",
    description: "James Aladiran speaks with Prophet Isa El-Buba as he shares his life-changing testimony of encountering Jesus as a former jihadist.",
    thumbnail: "/category url/interviews/image.jpg",
    videoUrl: "https://www.youtube.com/embed/2oo8tvizyZA?si=jKpqsqoj3f4e3Us8",
    category: "podcast",
    guest: "James Aladiran & Prophet Isa El-Buba",
    date: "2026",
    featured: true,
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

