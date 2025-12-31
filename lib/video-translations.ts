import { type LanguageCode } from "./i18n/messages";

/**
 * Common video title and description translations
 * This allows videos to be language-responsive without manually adding
 * titleLocalized/descriptionLocalized to each video
 */
const videoTranslations: Record<string, Record<LanguageCode, string>> = {
  // Common titles
  "Monday Service": {
    en: "Monday Service",
    es: "Servicio del Lunes",
    fr: "Service du Lundi",
    pt: "Serviço de Segunda-feira",
    de: "Montagsdienst",
    ar: "خدمة الاثنين",
    zh: "周一礼拜",
    hi: "सोमवार सेवा",
    ha: "Hidima ta Litinin",
    ig: "Ọrụ Mọnde",
    yo: "Ìjọsìn Òṣèlú",
  },
  "Podcast": {
    en: "Podcast",
    es: "Podcast",
    fr: "Podcast",
    pt: "Podcast",
    de: "Podcast",
    ar: "بودكاست",
    zh: "播客",
    hi: "पॉडकास्ट",
    ha: "Podcast",
    ig: "Podcast",
    yo: "Pọ́díkàsì",
  },
  "Prayer Rally": {
    en: "Prayer Rally",
    es: "Reunión de Oración",
    fr: "Rassemblement de Prière",
    pt: "Reunião de Oração",
    de: "Gebetsversammlung",
    ar: "تجمع الصلاة",
    zh: "祷告聚会",
    hi: "प्रार्थना रैली",
    ha: "Taron Addu'a",
    ig: "Nzukọ Ekpere",
    yo: "Ìpàdé Àdúrà",
  },
  "In His Presence": {
    en: "In His Presence",
    es: "En Su Presencia",
    fr: "En Sa Présence",
    pt: "Em Sua Presença",
    de: "In Seiner Gegenwart",
    ar: "في حضرته",
    zh: "在他的同在",
    hi: "उसकी उपस्थिति में",
    ha: "A Gaban Sa",
    ig: "N'ihu Ya",
    yo: "Níwájú Rẹ̀",
  },
  "SPECIAL MONDAY SERVICE": {
    en: "SPECIAL MONDAY SERVICE",
    es: "SERVICIO ESPECIAL DEL LUNES",
    fr: "SERVICE SPÉCIAL DU LUNDI",
    pt: "SERVIÇO ESPECIAL DE SEGUNDA-FEIRA",
    de: "BESONDERER MONTAGSDIENST",
    ar: "خدمة الاثنين الخاصة",
    zh: "特别周一礼拜",
    hi: "विशेष सोमवार सेवा",
    ha: "HIDIMA TA LITININ TA MUSAMMAN",
    ig: "ỌRỤ MỌNDE PỤRỤ ICHE",
    yo: "ÌJỌSÌN ÒṢÈLÚ PÀTÀKÌ",
  },
  "SPECIAL COMMUNION MONDAY SERVICE": {
    en: "SPECIAL COMMUNION MONDAY SERVICE",
    es: "SERVICIO ESPECIAL DE COMUNIÓN DEL LUNES",
    fr: "SERVICE SPÉCIAL DE COMMUNION DU LUNDI",
    pt: "SERVIÇO ESPECIAL DE COMUNHÃO DE SEGUNDA-FEIRA",
    de: "BESONDERER ABENDMAHLSDIENST AM MONTAG",
    ar: "خدمة الشركة الخاصة يوم الاثنين",
    zh: "特别圣餐周一礼拜",
    hi: "विशेष संगति सोमवार सेवा",
    ha: "HIDIMA TA LITININ TA MUSAMMAN TA HADUWA",
    ig: "ỌRỤ MỌNDE PỤRỤ ICHE NKE NKEKỌRỤTA",
    yo: "ÌJỌSÌN ÒṢÈLÚ PÀTÀKÌ ÌJỌSÌN",
  },
  "Fire on the Altar": {
    en: "Fire on the Altar",
    es: "Fuego en el Altar",
    fr: "Feu sur l'Autel",
    pt: "Fogo no Altar",
    de: "Feuer auf dem Altar",
    ar: "نار على المذبح",
    zh: "祭坛上的火",
    hi: "वेदी पर आग",
    ha: "Wuta akan Bagadi",
    ig: "Ọkụ n'elu Ebe Ichuaja",
    yo: "Iná lórí Pẹpẹ",
  },
  "EBOMI ULTIMATE YOUTH CONFERENCE": {
    en: "EBOMI ULTIMATE YOUTH CONFERENCE",
    es: "CONFERENCIA JUVENIL ÚLTIMA DE EBOMI",
    fr: "CONFÉRENCE JEUNESSE ULTIME EBOMI",
    pt: "CONFERÊNCIA JUVENIL ULTIMATE EBOMI",
    de: "EBOMI ULTIMATIVE JUGENDKONFERENZ",
    ar: "مؤتمر الشباب النهائي إيبومي",
    zh: "EBOMI 终极青年大会",
    hi: "EBOMI अंतिम युवा सम्मेलन",
    ha: "TARON MATASA NA EBOMI",
    ig: "Nzukọ Ndị Ntorobịa EBOMI",
    yo: "ÌPÀDÉ ỌDỌ EBOMI",
  },
  "Powerful Praise Session": {
    en: "Powerful Praise Session",
    es: "Sesión de Alabanza Poderosa",
    fr: "Session de Louange Puissante",
    pt: "Sessão de Louvor Poderosa",
    de: "Mächtige Lobpreis-Session",
    ar: "جلسة تسبيح قوية",
    zh: "有力的赞美会",
    hi: "शक्तिशाली स्तुति सत्र",
    ha: "Zama Yabo Mai Ƙarfi",
    ig: "Oge Otuto Dị Ike",
    yo: "Ìgbà Ìyìn Alágbára",
  },
  "My God never fails": {
    en: "My God never fails",
    es: "Mi Dios nunca falla",
    fr: "Mon Dieu ne faillit jamais",
    pt: "Meu Deus nunca falha",
    de: "Mein Gott versagt nie",
    ar: "إلهي لا يفشل أبداً",
    zh: "我的神永不失败",
    hi: "मेरा भगवान कभी असफल नहीं होता",
    ha: "Allah na ba ya kasawa",
    ig: "Chineke m anaghị ada",
    yo: "Ọlọrun mi kò ní ṣubú",
  },
  "Dealing with the demon of financial breakthrough": {
    en: "Dealing with the demon of financial breakthrough",
    es: "Lidiando con el demonio del avance financiero",
    fr: "Faire face au démon de la percée financière",
    pt: "Lidando com o demônio do avanço financeiro",
    de: "Umgang mit dem Dämon des finanziellen Durchbruchs",
    ar: "التعامل مع شيطان الاختراق المالي",
    zh: "对付财务突破的恶魔",
    hi: "वित्तीय सफलता के दानव से निपटना",
    ha: "Yaki da aljanin samun nasara ta kudi",
    ig: "Ime ihe banyere mmụọ ọjọọ nke ọganihu ego",
    yo: "Díje pẹ̀lú ẹ̀dá ìwà-ìbíjẹ́ ìdàgbà-sókè owó",
  },
  "The Power of Thoughts": {
    en: "The Power of Thoughts",
    es: "El Poder de los Pensamientos",
    fr: "Le Pouvoir des Pensées",
    pt: "O Poder dos Pensamentos",
    de: "Die Kraft der Gedanken",
    ar: "قوة الأفكار",
    zh: "思想的力量",
    hi: "विचारों की शक्ति",
    ha: "Ƙarfin Tunani",
    ig: "Ike nke Echiche",
    yo: "Agbára Ìrònú",
  },
  "PROMOTING CHRISTIAN VALUES IN THE MARKET PLACE": {
    en: "PROMOTING CHRISTIAN VALUES IN THE MARKET PLACE",
    es: "PROMOVIENDO VALORES CRISTIANOS EN EL MERCADO",
    fr: "PROMOUVOIR LES VALEURS CHRÉTIENNES SUR LE MARCHÉ",
    pt: "PROMOVENDO VALORES CRISTÃOS NO MERCADO",
    de: "FÖRDERUNG CHRISTLICHER WERTE AUF DEM MARKT",
    ar: "تعزيز القيم المسيحية في السوق",
    zh: "在市场中推广基督教价值观",
    hi: "बाजार में ईसाई मूल्यों को बढ़ावा देना",
    ha: "ƘARFAFAR DARAJAR KIRISTA A KASUWA",
    ig: "ỊKWADỌ ỤKPỤRỤ NDỊ KRAỊST N'AHỊA",
    yo: "ÌGBÉGA ÀÀMÌ KRISTẸNI NÍNÚ ỌJÀ",
  },
  "Humility": {
    en: "Humility",
    es: "Humildad",
    fr: "Humilité",
    pt: "Humildade",
    de: "Demut",
    ar: "التواضع",
    zh: "谦卑",
    hi: "विनम्रता",
    ha: "Tawali'u",
    ig: "Nkwanye Ùgwù",
    yo: "Ìrẹ̀lẹ̀",
  },
  "The Word Of God Is Final Authority": {
    en: "The Word Of God Is Final Authority",
    es: "La Palabra de Dios Es la Autoridad Final",
    fr: "La Parole de Dieu Est l'Autorité Finale",
    pt: "A Palavra de Deus É a Autoridade Final",
    de: "Das Wort Gottes Ist die Letzte Autorität",
    ar: "كلمة الله هي السلطة النهائية",
    zh: "神的话是最终权威",
    hi: "भगवान का वचन अंतिम अधिकार है",
    ha: "Kalmar Allah Ita Ce Iko Na Ƙarshe",
    ig: "Okwu Chineke Bụ Iké Ikpeazụ",
    yo: "Ọ̀rọ̀ Ọlọ́run Jẹ́ Àṣẹ́ Ìpẹ̀yìn",
  },
  "How should the government respond to terrorism": {
    en: "How should the government respond to terrorism",
    es: "Cómo debe responder el gobierno al terrorismo",
    fr: "Comment le gouvernement devrait-il répondre au terrorisme",
    pt: "Como o governo deve responder ao terrorismo",
    de: "Wie sollte die Regierung auf Terrorismus reagieren",
    ar: "كيف يجب على الحكومة الرد على الإرهاب",
    zh: "政府应如何应对恐怖主义",
    hi: "सरकार को आतंकवाद पर कैसे प्रतिक्रिया देनी चाहिए",
    ha: "Yaya ya kamata gwamnati ta mayar da martani ga ta'addanci",
    ig: "Kedu ka gọọmentị kwesịrị ịzaghachi na iyi egwu",
    yo: "Báwo ni ijọba ṣe yẹ kó dahun ìbẹ̀rù",
  },
  "Message for all Nigerians": {
    en: "Message for all Nigerians",
    es: "Mensaje para todos los nigerianos",
    fr: "Message pour tous les Nigérians",
    pt: "Mensagem para todos os nigerianos",
    de: "Botschaft für alle Nigerianer",
    ar: "رسالة لجميع النيجيريين",
    zh: "给所有尼日利亚人的信息",
    hi: "सभी नाइजीरियाई लोगों के लिए संदेश",
    ha: "Saƙo ga duk Najeriyawa",
    ig: "Ozi maka ndị Naijiria niile",
    yo: "Ìfiránsẹ́ fún gbogbo àwọn ọmọ Nàìjíríà",
  },
};

/**
 * Translates a video title or description if a translation exists
 * Falls back to the original text if no translation is found
 */
export function translateVideoText(
  text: string | undefined,
  language: LanguageCode
): string {
  if (!text) return "";
  
  // Try exact match first
  const exactMatch = videoTranslations[text];
  if (exactMatch && exactMatch[language]) {
    return exactMatch[language];
  }
  
  // Try case-insensitive match
  const caseInsensitiveMatch = videoTranslations[text.toUpperCase()];
  if (caseInsensitiveMatch && caseInsensitiveMatch[language]) {
    return caseInsensitiveMatch[language];
  }
  
  // Try finding partial matches for common patterns
  for (const [key, translations] of Object.entries(videoTranslations)) {
    if (text.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(text.toLowerCase())) {
      if (translations[language]) {
        return translations[language];
      }
    }
  }
  
  // Fallback to original text
  return text;
}

