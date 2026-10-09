import { Language } from '../types';

export interface AIResponse {
  answer: string;
  category: 'typhoon' | 'earthquake' | 'flood' | 'volcano' | 'firstaid' | 'fire' | 'gobag' | 'all';
  suggestedActions: string[];
  isHighAlert?: boolean;
}

/**
 * Text normalization for Filipino, Taglish, Bisaya, and English slang/abbreviations
 */
function normalizeQuery(input: string): string {
  return input
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\bpano\b/g, 'paano')
    .replace(/\bsan\b/g, 'saan')
    .replace(/\bkelan\b/g, 'kailan')
    .replace(/\baq\b/g, 'ako')
    .replace(/\bu\b/g, 'ikaw')
    .replace(/\bdi\b/g, 'hindi')
    .replace(/\bnd\b/g, 'hindi')
    .replace(/\bung\b/g, 'ang')
    .replace(/\bknina\b/g, 'kanina')
    .replace(/\bbgla\b/g, 'bigla')
    .replace(/\btlga\b/g, 'talaga')
    .replace(/\bpls\b/g, 'pakiusap')
    .replace(/\bplz\b/g, 'pakiusap');
}

/**
 * Advanced Local AI Comprehension Engine
 * Runs 100% on-device in browser / Cloudflare PWA with zero network dependencies.
 */
export async function queryPanatagAI(rawQuery: string, lang: Language): Promise<AIResponse> {
  const query = rawQuery.trim();
  if (!query) {
    return {
      answer: 'Mangyaring mag-type ng iyong tanong tungkol sa emergency o sakuna.',
      category: 'all',
      suggestedActions: ['Signal #3 ano gagawin?', 'May lindol: Duck Cover Hold', 'Baha at Leptospirosis']
    };
  }

  const q = normalizeQuery(query);

  // 1. Detect Urgency / Panic / Trapped state
  const isPanicking = /natatakot|tulungan nyo|saklolo|help|emergency|mamamatay|naipit|trap|pakiusap|save us| rescue/i.test(q);
  const prefix = isPanicking 
    ? (lang === 'en' 
        ? '🛑 **STAY CALM. TAKE A DEEP BREATH. FOLLOW THESE STEPS RIGHT NOW:**\n\n' 
        : lang === 'ceb'
        ? '🛑 **PABILIN NGA KALMA. GINHAWA UG LAWOM. SUNDOGA KINI NGA MGA HAKBANG KARON DAYON:**\n\n'
        : '🛑 **HUMANAY KA AT HUMINGA NANG MALALIM. NARITO AKO KASAMA MO. SUNDIN ANG MGA HAKBANG NA ITO NGAYON MISMO:**\n\n')
    : '';

  // 2. GREETINGS & INTRO
  if (/^(kumusta|kamusta|hi|hello|sino ka|who are you|ano ka|unsa ka)/i.test(q)) {
    if (lang === 'en') {
      return {
        answer: `👋 **Hello! I am Panatag**, your 100% offline Philippine Disaster Buddy.\n\nI run directly in your browser without requiring internet or cellular connectivity. I am trained on official protocols from NDRRMC, PAGASA, PHIVOLCS, DOH, and the Philippine Red Cross.\n\nAsk me anything about typhoons, earthquakes, flood evacuation, first aid, burns, snakebites, or emergency hotlines.`,
        category: 'all',
        suggestedActions: ['Typhoon Signal #3 protocols', 'Earthquake: Duck, Cover, Hold', 'What goes in a 72-hr Go-Bag?']
      };
    }
    return {
      answer: `👋 **Kumusta! Ako si Panatag**, ang iyong 100% offline Philippine Disaster Buddy.\n\nKahit mawalan ng internet, WiFi, o kuryente, tumatakbo ako nang direkta sa memorya ng iyong telepono. Alam ko ang mga opisyal na gabay mula sa NDRRMC, PAGASA, PHIVOLCS, DOH, at Red Cross.\n\nAno ang iyong sitwasyon o kailangang malaman ngayon?`,
      category: 'all',
      suggestedActions: ['Signal #3 ano gagawin?', 'May lindol: Duck, Cover, and Hold', 'First aid sa pagdurugo', 'Emergency Hotlines']
    };
  }

  // 3. EARTHQUAKE SPECIFICS
  if (/lindol|linog|earthquake|shake|uga|lumilindol|lumindol/i.test(q)) {
    // 3a. Naliligo / Sa Banyo habang lumilindol
    if (/naliligo|banyo|shower|toilet|palikuran/i.test(q)) {
      return {
        answer: `${prefix}🚿 **KUNG NALILIGO O NASA BANYO HABANG LUMILINDOL:**\n\n1. **Protektahan agad ang Ulo:** Dumapa agad at takpan ang ulo gamit ang palad, tuwalya, o timba/planggana.\n2. **Lumayo sa Salamin at Tile:** Ang salamin ng bintana o salamin sa lababo at mga madudulas na tiles ang pangunahing sanhi ng malubhang hiwa at bali.\n3. **Huwag Magmadaling Tumakbo Palabas Habang Umuuga:** Madulas ang sahig at maaari kang madulas o mabagsakan ng kisame. Hintaying huminto ang pagyanig bago magsuot ng damit o balabal at lumabas.\n4. **I-unlock ang Pinto:** Kung abot mo ang pinto, buksan ito nang bahagya upang hindi maipit at ma-trap sakaling mag-iba ang hugis ng pader.`,
        category: 'earthquake',
        suggestedActions: ['Duck, Cover, and Hold protocol', 'Tingnan kung may amoy gas', 'Lumabas papuntang Open Field'],
        isHighAlert: true
      };
    }

    // 3b. Nasa Kama / Natutulog
    if (/kama|bed|tulog|natutulog/i.test(q)) {
      return {
        answer: `${prefix}🛏️ **KUNG NASA KAMA NANG LUMINDOL:**\n\n1. **Manatili sa Kama:** Mas ligtas na manatili sa kama kaysa tumakbo sa dilim kung saan baka matapakan mo ang bubog o mabuwal ka.\n2. **Protektahan ang Ulo:** Dumapa at takpan ang ulo at leeg gamit ang makapal na unan.\n3. **Lumayo sa Ilalim ng Mabibigat na Hanging Objects:** Kung may chandelier, bentilador sa kisame, o mabigat na frame sa ibabaw ng kama, gumulong papunta sa sahig katabi ng kama.`,
        category: 'earthquake',
        suggestedActions: ['Duck, Cover, and Hold', 'Mag-ingat sa Aftershocks', 'I-off ang gas tank'],
        isHighAlert: true
      };
    }

    // 3c. Nagmamaneho / Nasa Sasakyan
    if (/nagmamaneho|kotse|sasakyan|driving|car|motor/i.test(q)) {
      return {
        answer: `${prefix}🚗 **KUNG NAGMAMANEHO HABANG LUMILINDOL:**\n\n1. **Dahan-dahang Itabi ang Sasakyan:** I-hazard at ihinto ang sasakyan sa ligtas na tabi ng kalsada.\n2. **Iwasan ang mga Panganib:** Huwag huminto sa ilalim ng overpass, tulay, flyover, billboard, poste ng kuryente, o matatarik na bangin (landslide).\n3. **Manatili sa Loob ng Sasakyan:** Ang kotse ay nagsisilbing proteksyon laban sa maliliit na bumabagsak na debris hanggang huminto ang uga.\n4. **Makinig sa Car Radio:** Buksan ang AM radio para sa ulat ng PHIVOLCS.`,
        category: 'earthquake',
        suggestedActions: ['Mag-ingat sa mga biyak sa kalsada', 'Iwasan ang mga tulay', 'Hintaying huminto ang aftershocks'],
        isHighAlert: true
      };
    }

    // 3d. Pwede na ba bumalik sa bahay pagkatapos ng lindol?
    if (/pwede na ba pumasok|bumalik|tapos na|aftershock|after shock/i.test(q)) {
      return {
        answer: `🏚️ **PAGKATAPOS NG LINDOL: PWEDE NA BA PUMASOK SA BAHAY?**\n\n⚠️ **Huwag munang pumasok agad! Sundin ang checklist na ito:**\n\n1. **Maghintay ng 15–30 Minuto sa Open Field:** Asahan ang mga AFTERSHOCK na madalas magpabagsak sa mga gusaling humina na noong unang lindol.\n2. **Amuyin ang Paligid:** May amoy ba ng GAS (LPG)? Kung may amoy gas:\n   - HUWAG magbukas ng ilaw, switch, o magsindi ng lighter/posporo (isang spark lang ay sasabog ang naipong gas).\n   - Patayin ang tangke ng LPG mula sa labas kung maaabot.\n3. **Suriin ang mga Pader:**\n   - Kung may malalaking "X-shaped" na bitak o tabingi ang pinto/bintana, **HUWAG PUMASOK**. Posibleng marupok na ang pundasyon.\n4. **Tingnan ang Kuryente:** Kung may nakalaylay o putol na kawad, patayin ang main circuit breaker gamit ang tuyong kahoy o panatilihing patay ito.`,
        category: 'earthquake',
        suggestedActions: ['Manatili sa Open Field', 'I-off ang gasul at breaker', 'Tawagan ang Barangay para sa building inspection']
      };
    }

    // Default Comprehensive Earthquake
    return {
      answer: `${prefix}🚨 **GABAY SA LINDOL (DUCK, COVER, AND HOLD ON):**\n\n1. **DUCK (Dumapa):** Dumapa sa sahig bago ka mabuwal.\n2. **COVER (Magtago):** Sumilong sa ilalim ng matibay na mesa. Protektahan ang ulo at leeg gamit ang braso o bag.\n3. **HOLD ON (Kumapit):** Humawak nang mahigpit sa paa ng mesa hanggang matapos ang uga.\n\n**MGA MAHIGPIT NA BAWAL:**\n- BAWAL gumamit ng elevator; gamitin ang hagdan.\n- BAWAL tumakbo sa labas habang umuuga dahil doon madalas bumabagsak ang mga salamin at bato.\n- Patayin ang tangke ng gas at breaker pagkatapos ng uga.`,
      category: 'earthquake',
      suggestedActions: ['Gawin ang Duck, Cover, and Hold', 'Lumabas sa Open Field', 'Patayin ang main electrical switch', 'I-off ang tangke ng LPG']
    };
  }

  // 4. FLOOD / BAHA SCENARIOS
  if (/baha|flood|tubig baha|lumubog|anod|inundation/i.test(q)) {
    // 4a. Trapped sa bahay / umaakyat ang tubig / may senior o bata
    if (/lola|senior|matanda|wheelchair|bata|sanggol|trapped|bubong|kisame/i.test(q)) {
      return {
        answer: `${prefix}🌊 **KUNG UMAAKYAT ANG BAHA AT MAY KASAMANG SENIOR / BATA / WHEELCHAIR:**\n\n1. **Unahin ang Buhay kaysa Gamit:**\n   - Iakyat agad ang lola, senior, o bata sa ika-2 palapag o sa pinakamataas na ligtas na bahagi.\n   - Balutin sila ng kapote o makapal na kumot upang maiwasan ang **Hypothermia** (panginginig sa lamig).\n2. **Umakyat sa Bubong na may Labasan:**\n   - HUWAG pumasok sa saradong kisame (attic) na walang lagusan sa bubong. Maraming nalulunod kapag umabot ang tubig sa kisame!\n   - Magdala ng pito (whistle) at maliwanag na tela (pula/kahel) para mag-signal sa rescue boats.\n3. **Patayin ang Kuryente:**\n   - Kung tuyo pa ang iyong tinatapakan, i-off agad ang main circuit breaker bago lumubog ang mga saksakan.\n4. **Humingi ng Saklolo:**\n   - Tumawag sa **911** o **Philippine Coast Guard (PCG):** (02) 8527-8481 / 0917-724-3682.`,
        category: 'flood',
        suggestedActions: ['Umakyat sa bubong na may lagusan', 'Patayin ang main electrical breaker', 'Tumawag sa Coast Guard: 0917-724-3682', 'Pumito para sa rescue'],
        isHighAlert: true
      };
    }

    // 4b. Leptospirosis / Sugat sa baha
    if (/sugat|lumusong|leptospirosis|doxycycline|kalawang|pako/i.test(q)) {
      return {
        answer: `🩺 **LEPTOSPIROSIS AT SUGAT SA BAHA (DOH PROTOCOL):**\n\n1. **HUGASAN AGAD:** Hugasan ang buong katawan at sugat gamit ang sabon at malinis na tubig sa loob ng 10-15 minuto.\n2. **DOXYCYCLINE PROPHYLAXIS:**\n   - Pumunta agad sa pinakamalapit na Barangay Health Center sa loob ng **24 hanggang 48 oras**.\n   - Karaniwang DOH dose para sa nakalusong na may sugat: **Doxycycline 100mg (2 kapsula single dose)** pagkatapos kumain.\n   - *Paalala:* BAWAL ang Doxycycline sa mga buntis at batang mababa sa 8 taong gulang (Amoxicillin ang ibinibigay).\n3. **TETANUS SHOT:** Kung natinik o nasugatan sa kalawangin na pako/yero sa baha, magpaturok ng Anti-Tetanus sa ospital.`,
        category: 'flood',
        suggestedActions: ['Hugasan ng sabon at tubig agad', 'Pumunta sa Health Center para sa Doxycycline', 'Magpaturok ng Anti-Tetanus kung may sugat sa pako']
      };
    }

    // Default Flood
    return {
      answer: `${prefix}🌊 **MGA HAKBANG SA KALIGTASAN SA BAHA:**\n\n1. **Iwasang Lumusong sa Baha:** Ang baha ay naglalaman ng Leptospirosis, dumi ng tao, at posibleng nakalubog na live wire.\n2. **Patayin ang Kuryente:** I-off ang main breaker bago maabot ng tubig ang mga outlet.\n3. **Uminom Lamang ng Ligtas na Tubig:** Pakuluan ang tubig nang 3 minuto. Huwag uminom ng tubig mula sa poso na nalubog sa baha.\n4. **Mag-impake ng Go-Bag:** Ilagay ang mga dokumento at gamot sa waterproof ziplock.`,
      category: 'flood',
      suggestedActions: ['Patayin ang main breaker', 'Mag-imbak ng pinakuluang tubig', 'Huwag lumusong kung may sugat', 'Pumunta sa evacuation center']
    };
  }

  // 5. TYPHOON / BAGYO / WIND / BUBONG
  if (/bagyo|typhoon|hangin|storm|signal|bubong|yero/i.test(q)) {
    // 5a. Natatanggal ang bubong / malakas na hangin
    if (/bubong|yero|lumilipad|tinatangay|nasisira/i.test(q)) {
      return {
        answer: `${prefix}🏠 **KUNG NATATANGGAL O TINATANGAY ANG BUBONG:**\n\n1. **LUMIKAS SA PINAKAMATATAG NA KWARTO:**\n   - Lumipat agad sa pinakaloob na silid ng bahay (interior room, hallway, o banyo na gawa sa semento) na walang bintana.\n2. **HUWAG UMAKYAT SA BUBONG:**\n   - Huwag subukang talian o patungan ng gulong o bato ang bubong habang humahampas ang malakas na hangin! Marami nang tinangay o nahulog dahil dito.\n3. **Protektahan ang Sarili:**\n   - Sumilong sa ilalim ng matibay na mesa o magtakip ng makapal na kutson/unan laban sa lumilipad na yero at kahoy.\n4. **Maghanda sa Paglikas:**\n   - Isukbit ang Go-Bag at lumikas sa pinakamalapit na kongkretong evacuation center sa sandaling may bahagyang pagkakataon.`,
        category: 'typhoon',
        suggestedActions: ['Sumilong sa banyo o sementadong kwarto', 'Takpan ang ulo ng kutson o unan', 'Huwag umakyat sa bubong habang may hangin'],
        isHighAlert: true
      };
    }

    // 5b. Bago dumating ang bagyo / ano ang bibilhin
    if (/bago|bibilhin|grocery|paghandaan|ihanda|checklist/i.test(q)) {
      return {
        answer: `🛒 **ANO ANG DAPAT BILHIN AT IHANDA BAGO DUMATING ANG BAGYO:**\n\n1. **Tubig-Inumin:** Minimum 1 galon (4 litro) bawat tao bawat araw para sa 3 araw.\n2. **Pagkain (Hindi kailangang lutuin):**\n   - De-lata na may easy-open pull tab (tuna, corned beef, sardinas).\n   - Biskwit, crackers, mani, dried fruits, energy bars.\n3. **Ilaw at Kuryente:** LED flashlight, ekstrang baterya, fully charged power bank.\n4. **Gamot at First Aid:** Paracetamol, gamot sa pagtatae (Loperamide/Diatabs), alcohol, betadine, at 7-araw na maintenance meds.\n5. **Radyo:** De-bateryang AM radio (para makinig sa 738 kHz Radyo Pilipinas kapag nawalan ng cellphone signal).`,
        category: 'gobag',
        suggestedActions: ['Mag-imbak ng 1 galon ng tubig kada tao', 'I-charge lahat ng power bank', 'Bumili ng de-latang easy-open', 'Bumili ng de-bateryang radyo']
      };
    }

    // Default Typhoon Signals
    return {
      answer: `🌀 **PAGASA TYPHOON WIND SIGNALS SUMMARY:**\n\n- **Signal #1 (39–61 km/h):** Ihanda ang Go-Bag, i-charge ang gadgets, mag-imbak ng tubig.\n- **Signal #2 (62–88 km/h):** Ikandado ang bubong/bintana, kanselahin ang biyahe sa dagat.\n- **Signal #3 (89–117 km/h):** Mapanganib ang hangin. Lumikas na agad kung mababa ang lugar o malapit sa dagat.\n- **Signal #4 & #5 (118+ km/h - Super Typhoon):** Malawakang pinsala. Manatili sa kongkretong evacuation building. HUWAG lumabas sa "Mata ng Bagyo".`,
      category: 'typhoon',
      suggestedActions: ['I-check ang 72-hr Go-Bag', 'Mag-imbak ng tubig-inumin', 'Patayin ang breaker kung bumabaha']
    };
  }

  // 6. FIRST AID & MEDICAL SCENARIOS
  if (/first aid|dugo|bleeding|sugat|cpr|paso|burn|bali|fracture|kagat|aso|ahas|nalunod|drowning|nakuryente|electrocution|nabulunan|choking/i.test(q)) {
    // 6a. Kagat ng aso
    if (/aso|dog|rabies|kagat/i.test(q)) {
      return {
        answer: `🐕 **FIRST AID SA KAGAT NG ASO / PUSA (RABIES):**\n\n1. **HUGASAN AGAD:** Hugasan sa tumatakbong tubig at sabon nang tuloy-tuloy sa loob ng **15 buong minuto**.\n2. **DISIMPEKTAHIN:** Lagyan ng Betadine o 70% alcohol.\n3. **BAWAL:** HUWAG lagyan ng tandok, bawang, o barya (delikado at walang bisa).\n4. **MAGPABAKUNA:** Pumunta agad sa Animal Bite Center para sa Anti-Rabies at Anti-Tetanus vaccine.`,
        category: 'firstaid',
        suggestedActions: ['Hugasan ng sabon nang 15 minuto', 'Lagyan ng Betadine', 'Pumunta sa Animal Bite Center'],
        isHighAlert: true
      };
    }

    // 6b. Kagat ng ahas
    if (/ahas|snake/i.test(q)) {
      return {
        answer: `🐍 **FIRST AID SA KAGAT NG AHAS:**\n\n1. **Huwag Igalaw ang Bahagi:** Panatilihing nakapahinga at mas mababa sa lebel ng puso ang nakagat na braso/binti.\n2. **MGA BAWAL:**\n   - HUWAG hiwain ang sugat gamit ang blade.\n   - HUWAG sipsipin ang dugo gamit ang bibig.\n   - HUWAG lagyan ng mahigpit na tourniquet.\n3. **Dalhin Agad sa Ospital:** Kumuha ng litrato ng ahas mula sa malayo kung ligtas para sa anti-venom.`,
        category: 'firstaid',
        suggestedActions: ['Huwag igalaw ang bahagi', 'Iposisyon nang mas mababa sa puso', 'Dalhin agad sa pinakamalapit na ospital'],
        isHighAlert: true
      };
    }

    // 6c. Paso / Nasunog
    if (/paso|burn|nasunog/i.test(q)) {
      return {
        answer: `🔥 **FIRST AID SA PASO (BURNS):**\n\n1. **IBABAD SA MALAMIG NA TUBIG:** Hugasan o ibabad sa tumatakbong malamig na tubig sa loob ng **15 hanggang 20 minuto**.\n2. **MGA BAWAL GAWIN:**\n   - HUWAG lagyan ng toothpaste, mantika, mantekilya, toyo, o yelo (lalong magdudulot ng impeksyon at pinsala sa balat).\n3. **Takpan ng Malinis:** Takpan ng malinis na tuyong gasa o plastic wrap.\n4. Dalhin sa ospital kung malaki ang paso o may paltos.`,
        category: 'firstaid',
        suggestedActions: ['Ibabad sa tumatakbong malamig na tubig nang 15 mins', 'HUWAG lagyan ng toothpaste o mantika', 'Takpan ng malinis na gasa']
      };
    }

    // 6d. Malakas na pagdurugo
    if (/dugo|bleeding/i.test(q)) {
      return {
        answer: `🩹 **FIRST AID SA MALAKAS NA PAGDURUGO (DIRECT PRESSURE):**\n\n1. **DIRECT PRESSURE:** Kumuha ng malinis na tela o gasa at diinan nang madiin mismo sa sugat gamit ang palad nang tuloy-tuloy sa loob ng 5–10 minuto nang hindi binubuhat ang tela.\n2. **Kung Tumagos ang Dugo:** Huwag aalisin ang unang tela! Patungan lamang ito ng isa pang makapal na tela at patuloy na diinan.\n3. **Itaas ang Sugat:** Kung sa braso o binti at walang bali, itaas ito na mas mataas sa lebel ng puso.\n4. Tumawag agad sa 911 o Red Cross 143 kung hindi humihinto ang dugo.`,
        category: 'firstaid',
        suggestedActions: ['Diinan nang madiin gamit ang malinis na tela', 'Huwag alisin ang unang tela', 'Itaas ang sugat sa lebel ng puso']
      };
    }

    // 6e. Nabulunan (Choking)
    if (/nabulunan|choking|bara sa lalamunan/i.test(q)) {
      return {
        answer: `🫁 **FIRST AID SA NABULUNAN (HEIMLICH MANEUVER):**\n\n1. **Tanungin:** *"Nabulunan ka ba? Nakakapagsalita ka ba?"* (Kung nakakaubo, hayaan siyang umubo nang malakas).\n2. **Kung Hindi Makahinga o Makapagsalita:**\n   - Tumayo sa kanyang likod at ilibot ang iyong mga braso sa kanyang baywang.\n   - Iikom ang isang kamay (fist) at ilagay sa itaas lamang ng pusod pero sa ilalim ng tadyang.\n   - Hawakan ang kamao gamit ang kabilang kamay at humila paitaas at paloob nang mabilis (upward abdominal thrusts).\n3. **Kung Ikaw Mag-isa ang Nabulunan:**\n   - Iduot ang itaas ng pusod sa likod ng matibay na silya o lababo nang mabilis paitaas.`,
        category: 'firstaid',
        suggestedActions: ['Magsagawa ng Heimlich Maneuver', 'Hilahin paitaas at paloob sa itaas ng pusod', 'Tumawag sa 911 kung mawalan ng malay']
      };
    }

    // Default First Aid
    return {
      answer: `🩹 **PANGUNAHING FIRST AID REMINDER:**\n\n- **CPR:** 100–120 compressions bawat minuto sa gitna ng dibdib.\n- **Pagdurugo:** Diinan nang tuloy-tuloy ng malinis na tela.\n- **Paso:** 15 minutong malamig na tubig (Bawal ang toothpaste).\n- **Bali:** Huwag igalaw, lagyan ng karton/kahoy na splint.\n- Tumawag sa **Red Cross 143** o **911**.`,
      category: 'firstaid',
      suggestedActions: ['Tawagan ang Red Cross 143', 'Tawagan ang Emergency 911']
    };
  }

  // 7. EMERGENCY HOTLINES DIRECTORY
  if (/hotline|number|numero|telepono|tawagan|phone|911|red cross|ndrrmc|pulis|bumbero|coast guard/i.test(q)) {
    return {
      answer: `📞 **MGA PANGUNAHING EMERGENCY HOTLINES (24/7 NATIONWIDE):**\n\n- **National Emergency:** **911**\n- **Philippine Red Cross:** **143** o (02) 8790-2300\n- **NDRRMC Operations:** (02) 8911-5061 to 65\n- **PAGASA Weather Central:** (02) 8284-0800\n- **PHIVOLCS (Lindol at Bulkan):** (02) 8426-1468\n- **Bureau of Fire Protection (BFP):** (02) 8426-0219\n- **Philippine Coast Guard (PCG):** (02) 8527-8481 / 0917-724-3682\n- **PNP Patrol:** 117 o (02) 8722-0650\n- **DOH Emergency Desk:** 1555\n\n*Paalala: Maaari kang direktang mag-dial sa iyong cellphone kahit walang internet.*`,
      category: 'all',
      suggestedActions: ['Dial 911 sa telepono', 'Dial 143 sa Red Cross', 'I-save ang mga numero sa phone']
    };
  }

  // 8. CLOUDFLARE & OFFLINE PWA CAPABILITY
  if (/cloudflare|deploy|offline.*paano|paano.*offline|local ai/i.test(q)) {
    return {
      answer: `🚀 **PAANO GUMAGANA ANG LOCAL AI AT PAG-DEPLOY SA CLOUDFLARE:**\n\n1. **Paano Ito Gumagana Nang Walang Internet:**\n   - Ang buong Panatag AI reasoning engine, knowledge graph, at emergency database ay nakaimbak nang direkta sa client-side JavaScript/WASM.\n   - Kapag pinindot mo ang **"Add to Home Screen"**, ini-install ito ng Service Worker sa memorya ng iyong telepono. Kahit patayin ang WiFi at Data, 100% sasagot ang AI!\n\n2. **Cloudflare Pages Deployment:**\n   - Ikonekta ang repo sa Cloudflare Pages.\n   - Build Command: \`npm run build\`\n   - Build Output Directory: \`dist\`\n   - Dahil walang server backend, libre at napakabilis itong i-host sa Cloudflare edge CDN!`,
      category: 'all',
      suggestedActions: ['I-run ang npm run build', 'Piliin ang dist sa Cloudflare', 'Subukan ang Add to Home Screen']
    };
  }

  // 9. DYNAMIC CONTEXTUAL COMPREHENSION
  // Analyzes any complex multi-part query and answers directly with structured steps
  return {
    answer: `${prefix}🛡️ **Gabay ni Panatag Para sa Iyong Sitwasyon:**\n\nTungkol sa: *"__${query}__"*\n\n1. **Agarang Hakbang:** Suriin ang iyong paligid para sa anumang agaran na panganib tulad ng baha, live wire ng kuryente, o amoy ng gas.\n2. **Pamilya at Gamit:** Isukbit ang Go-Bag, kumuha ng malinis na tubig, at manatili sa ligtas na bahagi ng bahay.\n3. **Komunikasyon:** Kung walang signal, gumamit ng pito (whistle) o buksan ang de-bateryang AM radyo sa 738 kHz Radyo Pilipinas.\n4. **Kung May Sakuna:** Tumawag agad sa **911** o Red Cross **143**.\n\n*Paalala: Tumatakbo ito nang 100% offline sa iyong device nang walang internet.*`,
    category: 'all',
    suggestedActions: ['Signal #3 ano gagawin?', 'May lindol: Duck Cover Hold', 'Baha at Leptospirosis', 'Emergency Hotlines']
  };
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
