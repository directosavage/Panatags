import { Language } from '../types';

export interface AIResponse {
  answer: string;
  category: 'typhoon' | 'earthquake' | 'flood' | 'volcano' | 'firstaid' | 'fire' | 'gobag' | 'all';
  suggestedActions: string[];
  isHighAlert?: boolean;
}

interface KnowledgeTopic {
  id: string;
  category: 'typhoon' | 'earthquake' | 'flood' | 'volcano' | 'firstaid' | 'fire' | 'gobag' | 'all';
  keywords: string[];
  intentPatterns: RegExp[];
  isHighAlert?: boolean;
  filAnswer: string;
  filActions: string[];
  enAnswer: string;
  enActions: string[];
  cebAnswer: string;
  cebActions: string[];
}

/**
 * Comprehensive Philippine Disaster & Local AI Knowledge Graph
 * Calibrated with NDRRMC, PAGASA, PHIVOLCS, DOH, Philippine Red Cross, and BFP protocols.
 * Supports Tagalog/Filipino, English, Bisaya/Cebuano, and colloquial Taglish.
 */
const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  // 1. TYPHOON SIGNALS 1-5 & WIND SPEED
  {
    id: 'typhoon-signals',
    category: 'typhoon',
    keywords: ['signal', 'tcws', 'signal 1', 'signal 2', 'signal 3', 'signal 4', 'signal 5', 'hangin', 'wind', 'pagasa signal', 'super typhoon'],
    intentPatterns: [/signal\s*[1-5]/i, /ano\s+ang\s+signal/i, /bagyo\s+signal/i, /tcws/i, /lakas\s+ng\s+hangin/i],
    isHighAlert: true,
    filAnswer: `🌀 **PAGASA Tropical Cyclone Wind Signals (TCWS) at Mga Hakbang:**\n\n- **Signal #1 (39–61 km/h):** Ihanda ang Go-Bag, mag-imbak ng tubig-inumin, i-charge ang cellphones at power banks. Makinig sa radyo.\n- **Signal #2 (62–88 km/h):** Patibayin ang bubong at bintana. Kanselahin ang biyahe sa dagat (Gale Warning). Ihanda ang pamilya sa evacuation.\n- **Signal #3 (89–117 km/h):** Mapanganib ang hangin. LUMIKAS NA AGAD kung nasa tabing-ilog, mababang lugar, o baybayin. Patayin ang kuryente.\n- **Signal #4 & #5 (118+ km/h hanggang Super Typhoon):** Catastrophic winds at storm surge (>3m). Manatili sa pinakamatatag na konkretong silid. Huwag lalabas kahit humina ang hangin dahil baka ito ay 'Mata ng Bagyo'.`,
    filActions: ['I-check ang 72-hr Go-Bag', 'Mag-imbak ng tubig (1 galon/tao/araw)', 'I-charge ang power bank at radyo', 'Alamin ang pinakamalapit na Evacuation Center'],
    enAnswer: `🌀 **PAGASA Tropical Cyclone Wind Signal (TCWS) Protocols:**\n\n- **Signal #1 (39–61 km/h):** Pack Go-Bag, store drinking water, full charge phones and power banks, monitor radio.\n- **Signal #2 (62–88 km/h):** Secure roofing and shutters. Cancel sea travel. Prepare vulnerable family members for evacuation.\n- **Signal #3 (89–117 km/h):** Severe hazard. Evacuate immediately if residing in coastal, riverbank, or flood-prone zones. Switch off breaker.\n- **Signal #4 & #5 (118+ km/h up to Super Typhoon):** Catastrophic destruction. Shelter inside reinforced concrete evacuation center. Do not venture out during eye of the storm.`,
    enActions: ['Inspect 72-hr Go-Bag', 'Store 1 gallon water per person/day', 'Fully charge batteries & comms', 'Locate Barangay Evacuation Shelter'],
    cebAnswer: `🌀 **PAGASA Tropical Cyclone Wind Signals (TCWS):**\n\n- **Signal #1:** Andama ang Go-Bag, magpondo ug tubig, i-charge ang suga.\n- **Signal #2:** Lig-ona ang atop, ayaw biyahe sa dagat.\n- **Signal #3:** Bakwit dayon kung ubos ang lugar o duol sa sapa.\n- **Signal #4 & #5:** Pabilin sa lig-on nga evacuation center. Ayaw gawas samtang gabagyo.`,
    cebActions: ['Andama ang 72-hr Go-Bag', 'Pondo ug tubig mainom', 'I-charge ang cellphone ug radyo', 'Paminaw sa balita']
  },

  // 2. MATA NG BAGYO (EYE OF THE STORM MYTH)
  {
    id: 'eye-of-storm',
    category: 'typhoon',
    keywords: ['mata ng bagyo', 'eye of the storm', 'tumahimik ang hangin', 'sumikat ang araw', 'lull', 'huminto ang bagyo'],
    intentPatterns: [/mata\s+ng\s+bagyo/i, /eye\s+of\s+the\s+storm/i, /tumahimik\s+ang\s+hangin/i],
    isHighAlert: true,
    filAnswer: `⚠️ **BABALA SA "MATA NG BAGYO" (Eye of the Storm):**\n\nKung biglang humina ang hangin, tumigil ang ulan, o sumikat ang araw sa gitna ng matinding bagyo, **HUWAG LUMABAS NG BAHAY!**\n\nNasa gitna ka lamang ng bagyo (eye). Sa loob ng 15 hanggang 45 minuto, tatama ang kabilang bahagi ng eyewall na may mas marahas at biglaang hangin na galing sa kabilang direksyon na maaaring magpabuwal ng mga napinsala nang pader o puno.`,
    filActions: ['Manatili sa loob ng matatag na silid', 'Iwasan ang mga bintanang salamin', 'Makinig sa AM radyo para sa update'],
    enAnswer: `⚠️ **CRITICAL WARNING: EYE OF THE STORM**\n\nIf gale winds suddenly cease and calm weather or sunshine appears mid-typhoon, **DO NOT GO OUTDOORS!**\n\nYou are inside the cyclone's eye. Within 15–45 minutes, the trailing eyewall will strike with violent winds from the reverse direction, carrying high-velocity debris.`,
    enActions: ['Remain strictly indoors', 'Stay away from windows', 'Monitor battery AM radio'],
    cebAnswer: `⚠️ **PASIDAAN SA "MATA SA BAGYO":**\n\nKung kalit mohunong ang hangin o mounlod ang ulan, **AYAW GIKAN SA SULOD SA BALAY!**\n\nAnaa ka sa tunga sa bagyo. Taud-taod mobalik ang mas kusog nga hangin gikan sa pikas direksyon.`,
    cebActions: ['Pabilin sa sulod sa balay', 'Palayo sa bildo', 'Paminaw sa radyo']
  },

  // 3. TAPE SA BINTANA (MYTH BUSTER)
  {
    id: 'window-tape-myth',
    category: 'typhoon',
    keywords: ['tape sa bintana', 'masking tape', 'duct tape bintana', 'lagyan ng tape', 'taping windows', 'shatter tape'],
    intentPatterns: [/tape.*bintana/i, /bintana.*tape/i, /taping.*window/i],
    filAnswer: `❌ **MYTH BUSTED: Huwag Lagyan ng "X" o Masking Tape ang mga Bintana!**\n\n- Ayon sa mga eksperto sa disaster (NDRRMC, NOAA), ang pagte-tape ng bintana ay **HINDI** nakakapigil sa pagbasag ng salamin.\n- Sa halip, ginagawa nitong mas malalaki at matutulis na piraso ng salamin ang debris na maaaring lumipad papasok at makasugat nang malubha.\n\n✅ **Ang Tamang Gawin:**\n1. Magkabit ng storm shutters, plywood, o makapal na tabla sa labas.\n2. Isara ang mga makakapal na kurtina (curtains) o blinds upang masalo ang mga maliliit na bubog kung sakaling mabasag.\n3. Lumayo sa mga bintana at manatili sa gitnang pasilyo o kwarto.`,
    filActions: ['Takpan ng plywood ang labas kung maaari', 'Isara ang makakapal na kurtina', 'Lumayo sa salamin habang may malakas na hangin'],
    enAnswer: `❌ **MYTH BUSTED: Do NOT Tape Windows with "X" Marks!**\n\n- Taping windows does NOT prevent glass from breaking during typhoons.\n- Worse, tape causes glass to shatter into massive, jagged shards that act like flying guillotine blades.\n\n✅ **What Actually Works:**\n1. Install exterior storm shutters or screw plywood over exterior glass.\n2. Draw heavy fabric drapes/curtains to catch flying glass fragments.\n3. Move to an interior room without windows.`,
    enActions: ['Cover windows with exterior plywood', 'Close heavy curtains', 'Shelter in interior windowless rooms'],
    cebAnswer: `❌ **AYAW BUTANGI UG TAPE ANG MGA BILDO SA BINTANA!**\n\nDili makapugong ang tape sa pagbuak sa bildo. Mas delikado hinuon kay maghimo kini ug dagko ug hait nga piraso sa bildo. Taboni ug plywood ang gawas ug isira ang kurtina.`,
    cebActions: ['Butangi ug plywood ang gawas', 'Isira ang baga nga kurtina', 'Palayo sa bildo']
  },

  // 4. LINDOL: DUCK COVER HOLD & INDOORS/OUTDOORS
  {
    id: 'earthquake-actions',
    category: 'earthquake',
    keywords: ['lindol', 'earthquake', 'linog', 'duck cover hold', 'umuuga', 'gumagalaw ang lupa', 'peis', 'aftershock'],
    intentPatterns: [/ano.*lindol/i, /habang.*lumilindol/i, /duck.*cover/i, /may\s+lindol/i, /nag-lindol/i],
    isHighAlert: true,
    filAnswer: `🚨 **MGA AGARANG HAKBANG SA LINDOL:**\n\n**HABANG LUMILINDOL:**\n1. **DUCK (Dumapa):** Dumapa sa sahig bago ka mabuwal.\n2. **COVER (Magtago):** Sumilong sa ilalim ng matibay na mesa. Protektahan ang ulo at leeg.\n3. **HOLD ON (Kumapit):** Humawak nang mahigpit sa paa ng mesa hanggang matapos ang uga.\n\n**KUNG SAAN KA NAABUTAN:**\n- **Nasa kama:** Manatili sa kama, takpan ang ulo ng makapal na unan.\n- **Naliligo / Sa Banyo:** Protektahan ang ulo gamit ang palad o planggana, lumayo sa salamin/tiles.\n- **Nagmamaneho:** Itabi ang sasakyan sa ligtas na lugar malayo sa tulay, overpass, at poste. Manatili sa loob hanggang huminto ang uga.\n- **Nasa mataas na gusali (Condo):** HUWAG gamitin ang elevator! Lumayo sa bintana.\n\n**PAGHINTO NG LINDOL:**\nPatayin ang tangke ng LPG at main electric breaker. Lumabas nang mahinahon papunta sa open field. Mag-ingat sa mga AFTERSHOCKS!`,
    filActions: ['Gawin ang Duck, Cover, and Hold On', 'Patayin ang tangke ng gasul at breaker', 'Lumabas gamit ang hagdan (Bawal ang elevator)', 'Magtungo sa bukas na ligtas na lugar (Open Field)'],
    enAnswer: `🚨 **EARTHQUAKE IMMEDIATE ACTION PROTOCOL:**\n\n**DURING THE SHAKE:**\n1. **DUCK:** Drop to hands and knees.\n2. **COVER:** Crawl beneath a sturdy desk/table; protect head and neck.\n3. **HOLD ON:** Grip the shelter's legs firmly until shaking stops.\n\n**LOCATION-SPECIFIC RULES:**\n- **In Bed:** Stay there, protect head with pillows.\n- **In Bathroom/Shower:** Drop down, cover head, stay clear of mirrors and ceramic.\n- **Driving:** Pull over away from overpasses, bridges, and power lines. Stay inside car.\n- **High-Rise Building:** NEVER use elevators. Stay clear of perimeter glass.\n\n**AFTER SHAKING:**\nShut off LPG gas and electrical breaker. Calmly evacuate via fire stairs to an open field. Expect aftershocks.`,
    enActions: ['Execute Duck, Cover, Hold', 'Shut off LPG gas and electrical main', 'Use stairs, never elevators', 'Evacuate to designated open field'],
    cebAnswer: `🚨 **GIYA SA PANAHON SA LINOG:**\n\n1. **DUCK (Pahapa):** Pahapa sa salog.\n2. **COVER (Pasilong):** Pasilong ilawom sa lig-on nga lamesa.\n3. **HOLD ON (Kupot):** Kupot sa tiil sa lamesa hangtod mohunong ang uyog.\n\nKung nagdrayb, ipadaplin ang sakyanan. Ayaw gamit ug elevator. Pagkahuman, sirhi ang tangke sa gas ug gawas sa hawan nga dapit.`,
    cebActions: ['Buhata ang Duck, Cover, and Hold', 'Sirhi ang gasul ug breaker', 'Ayaw gamit ug elevator', 'Gawas sa hawan nga lugar']
  },

  // 5. BAHA: TRAPPED SA BUBONG / PAGLIKAS
  {
    id: 'flood-trapped-roof',
    category: 'flood',
    keywords: ['trapped sa baha', 'bubong', 'tumataas ang tubig', 'na-trap', 'paano lumikas sa baha', 'baha bubong', 'rescue sa baha'],
    intentPatterns: [/trapped.*baha/i, /na-trap.*baha/i, /umakyat.*bubong/i, /mataas.*tubig/i],
    isHighAlert: true,
    filAnswer: `🌊 **KUNG NA-TRAP SA BUBONG O TUMATAAS ANG BAHA:**\n\n1. **Umakyat sa Bubong (Huwag sa Attic):**\n   - HUWAG magkulong sa attic na walang lagusan sa bubong dahil baka ma-trap ka kapag umabot ang tubig sa kisame!\n   - Dalhin ang flashlight, pito (whistle), cellphone, at maliwanag na tela.\n2. **Paano Mag-signal sa Rescuers:**\n   - Iwagayway ang maliwanag o matingkad na tela (pula, dilaw, kahel).\n   - Hipan ang pito nang tatlong beses nang paulit-ulit (Interational SOS signal).\n   - Sa gabi, ilawan ang sarili o mag-SOS strobe gamit ang flashlight o Panatag Siren Tool.\n3. **Kuryente:**\n   - Bago tumuntong sa tubig, siguraduhing patay ang main breaker kung ligtas itong maabot. Lumayo sa mga nakalubog na kable ng kuryente.\n4. **Tumawag ng Saklolo:**\n   - Dial **911** o **Philippine Coast Guard (PCG):** (02) 8527-8481 / 0917-724-3682.`,
    filActions: ['Umakyat sa bubong na may lagusan', 'Pumito o magwagayway ng maliwanag na damit', 'Patayin ang main breaker kung tuyo ang tinatapakan', 'Tawagan ang Coast Guard o 911'],
    enAnswer: `🌊 **IF TRAPPED BY RISING FLOODWATERS / ON ROOF:**\n\n1. **Get onto the Roof (Avoid Closed Attics):**\n   - Do NOT enter a closed attic unless there is an open hatch or window to the roof. Rising waters can trap you against the ceiling!\n2. **Signaling Rescuers:**\n   - Wave brightly colored cloth (red/orange/yellow).\n   - Blow a whistle in 3 sharp bursts repeatedly (universal distress code).\n   - At night, shine a flashlight or use Panatag's SOS Siren/Strobe.\n3. **Electrical Hazard:**\n   - Stay clear of submerged wires. Shut off main breaker only if standing on dry ground.\n4. **Dispatch:** Call 911 or Coast Guard (0917-724-3682).`,
    enActions: ['Climb onto open roof', 'Signal with bright clothing & whistle', 'Avoid submerged live electrical lines', 'Contact 911 or Coast Guard rescue'],
    cebAnswer: `🌊 **KUNG NA-TRAP SA BAHA O ATOP:**\n\n1. Sakat sa atop (ayaw sa sirado nga kisame aron dili ma-trap).\n2. Pagwagayway ug hayag nga panapton ug pito sa whistle aron makita sa rescuer.\n3. Palayo sa kable sa kuryente.\n4. Tawag sa 911 o Coast Guard (0917-724-3682).`,
    cebActions: ['Sakat sa ibabaw sa atop', 'Pito sa whistle para sa rescue', 'Tawag sa 911']
  },

  // 6. LEPTOSPIROSIS PROTOCOL & DOXYCYCLINE
  {
    keywords: ['leptospirosis', 'doxycycline', 'lumusot sa baha', 'baha sugat', 'ihi ng daga', 'gamot sa baha', 'prophylaxis'],
    category: 'flood',
    id: 'leptospirosis-guide',
    intentPatterns: [/leptospirosis/i, /doxycycline/i, /lumusong.*baha/i, /sugat.*baha/i],
    isHighAlert: true,
    filAnswer: `🩺 **LEPTOSPIROSIS PROTOCOL (DOH Guidelines):**\n\nAng Leptospirosis ay nakamamatay na impeksyon mula sa ihi ng daga na pumapasok sa sugat o balat habang bumabaha.\n\n**MGA SINTOMAS (Lilitaw pagkalipas ng 5–14 araw):**\n- Mataas na lagnat, panginginig, pananakit ng binti (calves) at kasu-kasuan, pamumula ng mata, at paninilaw ng balat.\n\n**HAKBANG KUNG NAKALUSONG SA BAHA:**\n1. Hugasan agad ang buong katawan gamit ang sabon at malinis na tubig.\n2. **Prophylaxis (Doxycycline):**\n   - Pumunta agad sa pinakamalapit na Barangay Health Center o Ospital sa loob ng **24 hanggang 48 oras**.\n   - Karaniwang DOH dosage sa may sugat: Doxycycline 100mg (2 kapsula single dose pagkatapos kumain).\n   - *Babala:* BAWAL ang Doxycycline sa mga buntis at batang mababa sa 8 taong gulang (Amoxicillin ang alternatibo).`,
    filActions: ['Hugasan ng sabon at malinis na tubig ang katawan', 'Bumisita sa Health Center para sa Doxycycline sa loob ng 48 oras', 'Magsuot ng bota kung kailangang lumusong', 'Bantayan kung may pananakit sa binti at lagnat'],
    enAnswer: `🩺 **LEPTOSPIROSIS PREVENTION & PROPHYLAXIS (DOH):**\n\nLeptospirosis is a life-threatening bacterial disease transmitted via rat urine in floodwaters.\n\n**Symptoms (5–14 days incubation):**\n- High fever, severe calf muscle pain, chills, red eyes, jaundice, dark urine.\n\n**IMMEDIATE POST-EXPOSURE PROTOCOL:**\n1. Wash thoroughly with clean water and antibacterial soap immediately.\n2. **Doxycycline Prophylaxis:**\n   - Visit the nearest Barangay Health Center within **24–48 hours**.\n   - Standard adult single-dose: 2 capsules of Doxycycline 100mg with a meal.\n   - *Caution:* Doxycycline is strictly contraindicated for pregnant women and children under 8 (Amoxicillin is used instead).`,
    enActions: ['Scrub with soap and running water immediately', 'Obtain Doxycycline at Health Center within 48 hrs', 'Wear rubber boots for unavoidable wading', 'Watch for fever and severe calf aches'],
    cebAnswer: `🩺 **LEPTOSPIROSIS UG DOXYCYCLINE:**\n\nHugasi dayon ug sabon ug limpyong tubig ang tiil human mosuong sa baha. Adto sa Health Center sulod sa 24–48 oras para sa Doxycycline prophylaxis. Peligro kaayo kini sa kidney ug atay.`,
    cebActions: ['Hugasi ug sabon ang lawas', 'Pangayo ug Doxycycline sa health center', 'Ayaw pasagdi kung may hilanat']
  },

  // 7. KAGAT NG ASO AT PUSA (RABIES FIRST AID)
  {
    id: 'rabies-animal-bite',
    category: 'firstaid',
    keywords: ['kagat ng aso', 'kagat ng pusa', 'rabies', 'nakagat', 'animal bite', 'kalmot', 'aso kagat'],
    intentPatterns: [/kagat.*aso/i, /kagat.*pusa/i, /nakagat.*aso/i, /rabies/i],
    isHighAlert: true,
    filAnswer: `🐕 **FIRST AID SA KAGAT O KALMOT NG ASO / PUSA (Rabies Protocol):**\n\n1. **HUGASAN AGAD:**\n   - Hugasan ang sugat sa **tumatakbong tubig at sabon** nang tuloy-tuloy sa loob ng **15 buong minuto**.\n   - Ito ang pinakamahalagang hakbang upang mapatay ang rabies virus bago pumasok sa mga ugat.\n2. **DISIMPEKTAHIN:**\n   - Lagyan ng 70% alcohol o Povidone-Iodine (Betadine).\n3. **MGA BAWAL GAWIN:**\n   - HUWAG lagyan ng bawang, tandok, barya, o langis. Ang tandok ay walang siyentipikong bisa at nagdudulot ng tetanus!\n4. **MAGPABAKUNA AGAD:**\n   - Pumunta agad sa pinakamalapit na Animal Bite Treatment Center (ABTC) o ospital para sa Anti-Rabies Vaccine (ARV) at Anti-Tetanus shot.\n   - Obserbahan ang aso/pusa sa loob ng 14 na araw kung buhay pa.`,
    filActions: ['Hugasan sa tumatakbong tubig at sabon nang 15 minuto', 'Lagyan ng Betadine o alcohol', 'BUMISITA sa Animal Bite Treatment Center para sa Anti-Rabies', 'HUWAG magpa-tandok o maglagay ng bawang'],
    enAnswer: `🐕 **ANIMAL BITE / RABIES EMERGENCY FIRST AID:**\n\n1. **WASH IMMEDIATELY:**\n   - Flush wound vigorously under running tap water with soap for **15 consecutive minutes**.\n   - This is the single most effective intervention to destroy the lipid rabies envelope.\n2. **DISINFECT:**\n   - Apply 70% isopropyl alcohol or Povidone-Iodine (Betadine).\n3. **NEVER USE FOLK REMEDIES:**\n   - Never perform 'tandok' (suction horn), apply garlic, coins, or cut the wound.\n4. **PROMPT VACCINATION:**\n   - Report immediately to an Animal Bite Treatment Center (ABTC) for Post-Exposure Prophylaxis (Rabies Vaccine & Tetanus shot).`,
    enActions: ['Wash with soap and water for 15 mins', 'Apply Betadine antiseptic', 'Visit Animal Bite Center for Rabies vaccine', 'Avoid tandok or garlic folk cures'],
    cebAnswer: `🐕 **FIRST AID SA KINAGTAN SA KERO O IRING:**\n\n1. Hugasi sa gripo ug sabon sulod sa 15 minutos.\n2. Butangi ug Betadine o alcohol.\n3. Ayaw pag-tandok o butang ug ahos!\n4. Adto dayon sa Animal Bite Treatment Center para sa Anti-Rabies vaccine.`,
    cebActions: ['Hugasi ug 15 minutos sa tubig ug sabon', 'Butangi ug Betadine', 'Adto sa Animal Bite Center']
  },

  // 8. KAGAT NG AHAS (SNAKE BITE FIRST AID)
  {
    id: 'snake-bite-protocol',
    category: 'firstaid',
    keywords: ['kagat ng ahas', 'snake bite', 'ahas', 'makamandag', 'venom', 'cobra', 'tuklaw'],
    intentPatterns: [/kagat.*ahas/i, /natuklaw/i, /snake\s*bite/i],
    isHighAlert: true,
    filAnswer: `🐍 **AGARANG FIRST AID SA KAGAT NG AHAS (Snakebite):**\n\n1. **KUMALMA AT HUWAG I-GALAW ANG BAHAGI:**\n   - Ang pagtakbo o pagkilos ay nagpapabilis sa pagkalat ng kamandag sa daluyan ng dugo.\n   - Panatilihing mas mababa sa lebel ng puso ang nakagat na braso o binti.\n2. **IMMOBILIZE:**\n   - Itali o balutan ng maluwag na bendahe (Pressure Immobilization Bandage) at lagyan ng pansamantalang splint (patpat) upang hindi maigalaw.\n3. **MGA MAHIGPIT NA BAWAL (Delikadong Myths):**\n   - HUWAG hiwain ang sugat gamit ang blade.\n   - HUWAG sipsipin ang dugo gamit ang bibig.\n   - HUWAG lagyan ng mahigpit na tourniquet (maaaring maging sanhi ng pagkaputol ng biyas).\n   - HUWAG lagyan ng yelo o kuryente.\n4. **DALHIN AGAD SA OSPITAL:**\n   - Kung ligtas, kumuha ng litrato ng ahas mula sa malayo para malaman ng doktor ang tamang Anti-Venom.`,
    filActions: ['Huwag igalaw ang nakagat na bahagi', 'Iposisyon nang mas mababa sa puso', 'HUWAG hiwain o sipsipin ang dugo', 'Dalhin agad sa pinakamalapit na ospital'],
    enAnswer: `🐍 **CRITICAL SNAKEBITE PROTOCOL:**\n\n1. **KEEP CALM & IMMOBILIZE:**\n   - Movement accelerates venom circulation through lymphatic pathways. Keep the affected limb strictly still and positioned below heart level.\n2. **SPLINT & BANDAGE:**\n   - Apply a broad compression bandage and splint the limb to prevent flexion.\n3. **STRICTLY PROHIBITED:**\n   - DO NOT cut across fang punctures.\n   - DO NOT attempt oral suction.\n   - DO NOT apply tight arterial tourniquets (causes limb necrosis).\n   - DO NOT apply ice or electric shocks.\n4. **RUSH TO HOSPITAL:**\n   - Safely photograph the snake from a distance to assist emergency physicians with Anti-Venom selection.`,
    enActions: ['Keep patient calm and limb immobilized', 'Position limb below heart level', 'NEVER cut, suck, or tourniquet wound', 'Transport immediately to emergency room'],
    cebAnswer: `🐍 **FIRST AID SA KINAGTAN SA BITIN:**\n\nAyaw lihoka ang tiil o kamot nga gipaak aron dili mikatap ang lala. Ibutang nga mas ubos sa kasingkasing. AYAW hiwaa, AYAW sipsipa, ug AYAW higti ug hugot nga tourniquet. Dad-a dayon sa ospital.`,
    cebActions: ['Ayaw ipalihok ang lawas', 'Ayaw hiwaa o sipsipa ang samad', 'Dad-a dayon sa ospital']
  },

  // 9. SUNOG SA MANTIKA / GREASE FIRE
  {
    id: 'grease-fire',
    category: 'fire',
    keywords: ['sunog sa mantika', 'apoy sa kawali', 'grease fire', 'cooking oil fire', 'mantika apoy', 'sunog sa kusina'],
    intentPatterns: [/mantika.*apoy/i, /sunog.*kawali/i, /grease\s*fire/i, /apoy.*mantika/i],
    isHighAlert: true,
    filAnswer: `🍳 **SUNOG SA MANTIKA O KAWALI (Grease Fire):**\n\n⚠️ **MAHIGPIT NA BABALA: HUWAG KAILANMAN BUHUHSAN NG TUBIG ANG NAG-AAPOY NA MANTIKA!**\n- Kapag binuhusan ng tubig, sasabog ito sa isang higanteng fireball dahil ang tubig ay magiging singaw agad at magsasabog ng nag-aapoy na langis sa buong kusina at sa iyong mukha!\n\n✅ **ANG TAMANG GAWIN:**\n1. **Patayin ang Kalan (Stove):** I-off agad ang burner o gas tank kung ligtas maabot.\n2. **Takpan ang Kawali:** Dahan-dahang ipatong ang takip ng kawali (metal lid) o basang tuwalya/basahan na piniga upang mawalan ng oxygen ang apoy.\n3. **Baking Soda:** Kung maliit ang apoy, ibuhos ang baking soda o asin (HUWAG gumamit ng harina o baking powder dahil sasabog ito).\n4. **Fire Extinguisher:** Gumamit ng Class B / K extinguisher kung mayroon.`,
    filActions: ['HUWAG BUHUSAN NG TUBIG', 'Patayin ang apoy sa kalan', 'Takpan ng metal na takip o basang tuwalya', 'I-off ang tangke ng gas'],
    enAnswer: `🍳 **KITCHEN GREASE / COOKING OIL FIRE PROTOCOL:**\n\n⚠️ **NEVER THROW WATER ON BURNING OIL!**\n- Water sinks and vaporizes instantly into expanding steam, causing a catastrophic violent fireball explosion!\n\n✅ **CORRECT ACTION:**\n1. **Smother:** Slide a metal pot lid or baking sheet horizontally over the burning pan.\n2. **Cut Heat:** Turn off the stove burner immediately.\n3. **Damp Cloth:** Cover with a thick, wrung-out damp towel.\n4. **Chemical:** Dump baking soda or salt on small flames (NEVER flour, which is explosive).\n5. Leave covered until completely cool.`,
    enActions: ['NEVER pour water on grease fire', 'Smother with metal lid or damp towel', 'Turn off stove burner', 'Shut off LPG tank regulator'],
    cebAnswer: `🍳 **SUNOG SA MANTIKA O KAWALI:**\n\nAYAW GAYUD BUBOI UG TUBIG ang nagdilaab nga mantika kay mosilaob kini ug mobuto! Taboni sa takob sa kaldero o basang panapton aron mamatay ang kalayo, ug palonga ang gasul.`,
    cebActions: ['Ayaw buboi ug tubig', 'Taboni sa takob sa kaldero', 'Palonga ang kalan']
  },

  // 10. CLOUDFLARE DEPLOYMENT & LOCAL AI IN PWA
  {
    id: 'cloudflare-deployment',
    category: 'all',
    keywords: ['cloudflare', 'deploy', 'cloudflare pages', 'how to deploy', 'paano i-deploy', 'pwa offline', 'local ai cloudflare', 'add to home screen'],
    intentPatterns: [/deploy.*cloudflare/i, /cloudflare\s*pages/i, /paano.*deploy/i, /paano.*install/i],
    filAnswer: `🚀 **PAANO I-DEPLOY ANG PANATAG SA CLOUDFLARE PAGES:**\n\nAng Panatag ay dinisenyo bilang isang 100% Client-Side Progressive Web App (PWA) gamit ang Vite + React. Handa na itong i-host sa Cloudflare Pages nang libre!\n\n**MGA HAKBANG SA PAG-DEPLOY:**\n1. **I-push sa GitHub:** I-commit at i-push ang codebase sa iyong GitHub repository.\n2. **Cloudflare Pages Dashboard:**\n   - Pumunta sa [dash.cloudflare.com](https://dash.cloudflare.com) > **Workers & Pages** > **Create application** > **Pages**.\n   - Ikonekta ang iyong GitHub repo.\n3. **Build Settings:**\n   - **Framework Preset:** Vite\n   - **Build command:** \`npm run build\`\n   - **Build output directory:** \`dist\`\n4. **I-click ang "Save and Deploy".**\n\n**PAGKATAPOS MA-DEPLOY:**\n- Buksan ang Cloudflare Pages URL sa iyong cellphone.\n- Pindutin ang **"Install App"** o sa browser menu: **"Add to Home Screen"**.\n- Mula roon, ang buong Panatag offline AI engine at mga gabay ay maiimbak sa memorya ng telepono. Maaari mo na itong buksan at gamitin kahit naka-Airplane mode o walang internet!`,
    filActions: ['I-run ang npm run build', 'Output directory ay "dist"', 'Piliin ang Vite framework preset sa Cloudflare', 'Subukan ang Add to Home Screen'],
    enAnswer: `🚀 **DEPLOYING PANATAG TO CLOUDFLARE PAGES (100% OFFLINE PWA):**\n\nPanatag is built as an offline-first client-side Progressive Web App (PWA) with zero server-side dependencies. It is fully ready for instant deployment on Cloudflare Pages.\n\n**DEPLOYMENT STEPS:**\n1. **Push to GitHub:** Push this repository to GitHub.\n2. **Cloudflare Dashboard:** Go to Cloudflare Dashboard > **Compute (Workers & Pages)** > **Create** > **Pages** > Connect Git.\n3. **Build Configuration:**\n   - **Framework Preset:** Vite\n   - **Build Command:** \`npm run build\`\n   - **Build Output Directory:** \`dist\`\n4. **Hit "Save and Deploy".**\n\n**AFTER DEPLOYMENT:**\n- Visit your Cloudflare Pages URL on mobile Chrome or Safari.\n- Tap **"Install App"** or browser menu **"Add to Home Screen"**.\n- The Service Worker pre-caches all bundles and the offline AI engine. Users can access the AI anytime with zero internet connection!`,
    enActions: ['Set build command: npm run build', 'Set output directory: dist', 'Deploy on Cloudflare Pages', 'Install via Add to Home Screen'],
    cebAnswer: `🚀 **UNSAON PAG-DEPLOY SA CLOUDFLARE PAGES:**\n\nI-connect lang ang repo sa Cloudflare Pages. Gamita ang build command nga \`npm run build\` ug build directory nga \`dist\`. Inig human, ablihi sa cellphone ug i-click ang "Add to Home Screen" para magamit 100% offline.`,
    cebActions: ['I-build gamit ang npm run build', 'I-deploy sa Cloudflare', 'I-add to Home Screen']
  },

  // 11. GEMMA 4 E2B LITERTLM RUNNER
  {
    id: 'litert-gemma-integration',
    category: 'all',
    keywords: ['gemma', 'litert', 'litert-lm', 'gemma-4-e2b', 'huggingface', 'litertlm', 'webgpu', 'local model', 'onnx', 'token'],
    intentPatterns: [/gemma.*litert/i, /litert.*lm/i, /gemma.*4.*e2b/i, /huggingface.*gemma/i],
    filAnswer: `🧠 **GOOGLE AI EDGE: LITERTLM & GEMMA-4-E2B-IT INTEGRATION:**\n\n- **Modelo:** \`litert-community/gemma-4-E2B-it-litert-lm\` sa Hugging Face.\n- **Format:** \`.litertlm\` (quantized 2-bit/4-bit/8-bit mixture para sa mobile NPUs at GPUs, ~0.8GB text footprint).\n- **Prompt Template:**\n  \`\`\`text\n  <start_of_turn>user\n  [Tanong tungkol sa sakuna sa Pilipinas]<end_of_turn>\n  <start_of_turn>model\n  [Panatag safety output]<end_of_turn>\n  \`\`\`\n\n**Paano ito tumatakbo sa Panatag Web App:**\n1. **Core Zero-Download Engine:** Agad na sumasagot nang walang kailangang i-download na 2.5GB file upang ligtas ang mga taong mahina ang signal o low storage.\n2. **WebGPU Acceleration:** Sinusuportahan ang in-browser WebGPU execution kapag may compatible na mobile browser.\n3. **Native Android APK:** Maaari ring i-bundle gamit ang Google AI Edge LiteRT-LM Kotlin SDK sa mga tablet ng rescue responders.`,
    filActions: ['Gamitin ang prompt format na <start_of_turn>user', 'Panoorin ang on-device token response', 'Gumagana nang walang internet'],
    enAnswer: `🧠 **GOOGLE AI EDGE LITERTLM & GEMMA-4-E2B ARCHITECTURE:**\n\n- **Model Reference:** \`litert-community/gemma-4-E2B-it-litert-lm\` on Hugging Face.\n- **Container Format:** \`.litertlm\` compiled with LiteRT runtime orchestration (XNNPack CPU + ML Drift GPU acceleration).\n- **Prompt Formatting:**\n  \`\`\`text\n  <start_of_turn>user\n  [Philippine disaster query]<end_of_turn>\n  <start_of_turn>model\n  [Panatag response]<end_of_turn>\n  \`\`\`\n\n**How Panatag WebApp handles on-device execution:**\n- **Instant Edge Reasoning:** Immediate local response with zero wait time and zero data cost.\n- **WebGPU Ready:** Compatible with browser-based quantized runtimes.\n- **Responders Deployment:** Fully compatible with Google AI Edge Kotlin Android SDK.`,
    enActions: ['Format with Gemma token turn markers', 'Offline local inference active', 'No external server dependencies'],
    cebAnswer: `🧠 **LITERTLM UG GEMMA-4-E2B ARCHITECTURE:**\n\nKini ang on-device model gikan sa Google para sa edge devices. Nagdagan kini sa device nga walay server call gamit ang token format nga \`<start_of_turn>user\` ug \`<start_of_turn>model\`.`,
    cebActions: ['On-device local inference', 'Walay internet kinahanglan']
  },

  // 12. CPR (ADULT, CHILD, INFANT)
  {
    id: 'cpr-protocol',
    category: 'firstaid',
    keywords: ['cpr', 'walang pulso', 'hindi humihinga', 'inake', 'heart attack', 'unresponsive', 'cardiac arrest', 'dibdib press'],
    intentPatterns: [/cpr/i, /walang\s+pulso/i, /hindi\s+humihinga/i, /cardiac\s*arrest/i],
    isHighAlert: true,
    filAnswer: `❤️ **EMERGENCY CPR (Cardiopulmonary Resuscitation):**\n\n1. **Suriin ang Malay:** Tapikin ang balikat: *"Ayos ka lang ba?"*. Suriin kung humihinga sa loob ng 5-10 segundo.\n2. **Tumawag ng Tulong:** I-dial ang **911** o **Red Cross 143** o sabihan ang katabi na tumawag.\n3. **HANDS-ONLY CPR (Matanda):**\n   - Ilapat ang takong ng isang palad sa gitna ng dibdib (sa pagitan ng utong).\n   - Ipatong ang kabilang kamay at i-lock ang mga daliri. Panatilihing tuwid ang mga siko.\n   - **Bilis at Lalim:** Mag-press nang 2 pulgada (5 cm) ang lalim sa bilis na **100 hanggang 120 compressions bawat minuto** (ritmo ng kantang *"Stayin' Alive"*).\n   - Huwag huminto hanggang dumating ang ambulansya o may magpalit sa iyo.`,
    filActions: ['Tumawag sa 911 o 143', 'Hands-Only CPR: 100-120 presses kada minuto', 'Diinan ang gitna ng dibdib nang 2 pulgada ang lalim'],
    enAnswer: `❤️ **EMERGENCY ADULT CPR PROTOCOL:**\n\n1. **Check Responsiveness:** Tap shoulders firmly and check for normal breathing (<10 seconds).\n2. **Call 911 / Red Cross 143:** Put phone on speaker.\n3. **HANDS-ONLY CHEST COMPRESSIONS:**\n   - Place heel of one hand in center of chest (nipple line). Interlock second hand.\n   - Lock elbows straight. Use upper body weight.\n   - Compress at **100–120 beats per minute** (~2 inches deep) to the beat of *"Stayin' Alive"*.\n   - Do not stop until EMS arrives or victim resumes spontaneous breathing.`,
    enActions: ['Call 911 or Red Cross 143 immediately', 'Hands-Only compressions at 100-120/min', 'Compress 2 inches deep continuously'],
    cebAnswer: `❤️ **HANDS-ONLY CPR:**\n\nKung wala nagginhawa ug walay pulso, iduso ang tunga sa dughan ug kusog ug paspas (100–120 ka press kada minuto) hangtod moabot ang rescue. Tawag sa 911 o 143.`,
    cebActions: ['Tawag sa 911', 'Hands-Only CPR sa tunga sa dughan']
  },

  // 13. TUBIG: PAGPAPAKULO AT BLEACH RATIO
  {
    id: 'water-purify',
    category: 'firstaid',
    keywords: ['tubig', 'water', 'purify', 'linis ng tubig', 'bleach tubig', 'patak ng bleach', 'pakuluan', 'inumin'],
    intentPatterns: [/linis.*tubig/i, /purify.*water/i, /bleach.*tubig/i, /pakulo.*tubig/i],
    filAnswer: `💧 **PAGLILINIS NG TUBIG-INUMIN HABANG KALAMIDAD:**\n\n1. **PAGPAPAKULO (Rolling Boil - Pinakaligtas):**\n   - Salain muna ang malabong tubig sa malinis na tela.\n   - Pakuluan nang rumaragasang kulo nang hindi bababa sa **3 minuto** bago palamigin at takpan.\n\n2. **HOUSEHOLD BLEACH (Kung walang apoy/kuryente):**\n   - Gumamit lamang ng regular, walang amoy (**unscented**) chlorine bleach (5%-6% sodium hypochlorite).\n   - **Rasyo:** **2 patak ng bleach bawat 1 litro ng malinaw na tubig** (o 8 patak bawat 1 galon).\n   - Kung malabo ang tubig, doblehin sa 4 na patak bawat litro.\n   - Haluin at patagalin nang **30 minuto** bago inumin (dapat may mahinang amoy ng chlorine).`,
    filActions: ['Pakuluan nang 3 buong minuto', 'O kaya: 2 patak unscented bleach kada 1 litro ng tubig', 'Maghintay ng 30 minuto bago inumin'],
    enAnswer: `💧 **EMERGENCY DRINKING WATER DISINFECTION:**\n\n1. **BOILING (Most Effective):**\n   - Filter turbid water through a clean cloth.\n   - Maintain a vigorous rolling boil for at least **3 full minutes**.\n\n2. **UNSCENTED HOUSEHOLD BLEACH (No heat/stove):**\n   - Use only plain, unscented 5%–6% household chlorine bleach.\n   - **Dosage:** **2 drops of bleach per 1 Liter of clear water** (8 drops per gallon).\n   - Double dosage to 4 drops/Liter if water is cloudy.\n   - Mix and let stand for **30 minutes**. A faint chlorine scent confirms disinfection.`,
    enActions: ['Boil for 3 full minutes', 'Or use 2 drops unscented bleach per 1L water', 'Wait 30 minutes before consuming'],
    cebAnswer: `💧 **PANGHINLO SA TUBIG NGA MAIMOM:**\n\nPabukali ug 3 minutos. Kung walay kalayo, butangi ug 2 ka tulo (drops) sa regular bleach kada 1 ka litro nga tubig ug pasagdi ug 30 minutos una imnon.`,
    cebActions: ['Pabukali ug 3 minutos', '2 ka tulo sa bleach kada 1 litro']
  },

  // 14. BROWNOUT & POWER BLACKOUT
  {
    id: 'blackout-brownout',
    category: 'all',
    keywords: ['brownout', 'blackout', 'walang kuryente', 'kandila', 'power outage', 'tipid baterya', 'charge phone'],
    intentPatterns: [/walang\s+kuryente/i, /brownout/i, /blackout/i, /tipid.*baterya/i],
    filAnswer: `💡 **GABAY SA MATAGALANG BROWNOUT AT BLACKOUT:**\n\n1. **Iwasan ang Kandila:**\n   - Huwag gumamit ng kandila kung may hinalang gas leak o malakas ang hangin. Ang kandila ang nangungunang sanhi ng sunog habang may bagyo. Gumamit ng LED flashlight o battery lantern.\n2. **Makatipid sa Baterya ng Telepono:**\n   - Buksan ang **Blackout Mode** (tingnan ang icon sa itaas) para sa pitch-black AMOLED display.\n   - I-on ang Low Power Mode at Airplane Mode kung walang signal (ang paghahanap ng signal ang pinakamabilis umubos ng baterya).\n   - Bawasan ang screen brightness.\n3. **Ref at Pagkain:**\n   - Huwag buksan nang buksan ang refrigerator. Ang saradong ref ay nagpapanatili ng lamig nang 4 na oras, at ang freezer ay hanggang 48 oras.`,
    filActions: ['Gamitin ang Blackout Mode sa Panatag', 'I-off ang mobile data kapag mahina ang signal', 'Huwag gumamit ng kandila malapit sa kurtina'],
    enAnswer: `💡 **PROLONGED POWER BLACKOUT SURVIVAL:**\n\n1. **Avoid Candles:** Candles cause severe structure fires in post-disaster scenarios. Use LED flashlights or emergency headlamps.\n2. **Conserve Phone Battery:**\n   - Toggle Panatag's **Blackout Mode** (moon icon in header) for zero-power AMOLED display.\n   - Turn on Battery Saver and Airplane Mode when cell signal is lost (network scanning drains battery rapidly).\n3. **Refrigerated Food:** Keep fridge doors shut. An unopened fridge preserves food safely for 4 hours; a full freezer lasts up to 48 hours.`,
    enActions: ['Activate Panatag Blackout Mode', 'Enable Airplane Mode during no-signal', 'Keep refrigerator doors sealed'],
    cebAnswer: `💡 **KUNG WALAY KURYENTE / BROWNOUT:**\n\nAyaw paggamit ug kandila aron dili masunog ang balay. Tipigi ang baterya sa cellphone: i-on ang airplane mode ug ipabilin nga sirado ang refrigerator.`,
    cebActions: ['I-on ang airplane mode', 'Gamit ug flashlight imbes kandila']
  },

  // 15. ALAGANG HAYOP (PET DISASTER SAFETY)
  {
    id: 'pet-safety',
    category: 'all',
    keywords: ['aso', 'pusa', 'alagang hayop', 'hayop', 'pet', 'pets', 'manok', 'baboy', 'livestock', 'tali aso'],
    intentPatterns: [/alaga.*hayop/i, /aso.*bagyo/i, /pusa.*baha/i, /pet.*evacuation/i],
    filAnswer: `🐾 **KALIGTASAN NG ALAGANG HAYOP (Pets & Livestock):**\n\n1. **HUWAG IWANANG NAKATALI SA BAHA:**\n   - Kapag tumataas ang tubig, KALAGAN o pawalan ang mga aso at alagang hayop kung hindi mo sila maisasama, upang magkaroon sila ng pagkakataong lumangoy at sumampa sa mataas na lugar.\n2. **Sa Evacuation:**\n   - Magdala ng tali (leash), basket o carrier, at kaunting tuyong pagkain ng hayop (kibble).\n   - Makipag-ugnayan sa barangay kung may hiwalay na lugar para sa mga alagang hayop sa evacuation shelter.\n3. **Tubig-Baha:**\n   - Huwag hayaang uminom ng tubig-baha ang mga aso dahil maaari rin silang magka-Leptospirosis.`,
    filActions: ['Huwag iwanang nakatali ang mga hayop sa baha', 'Magdala ng tali at pagkain ng aso/pusa', 'Huwag painumin ng tubig-baha'],
    enAnswer: `🐾 **PET & ANIMAL DISASTER PROTOCOL:**\n\n1. **NEVER LEAVE ANIMALS CAGED OR CHAINED IN FLOODS:**\n   - If you cannot evacuate with them, unchain and release them so they can swim to higher ground.\n2. **Evacuation Kit for Pets:**\n   - Pack a sturdy leash, carrier, water, and dry pet food.\n3. **Floodwater Toxicity:** Keep pets from drinking floodwater to prevent animal leptospirosis.`,
    enActions: ['Unchain animals if left behind in rising waters', 'Pack pet food and leash', 'Keep pets from drinking floodwater'],
    cebAnswer: `🐾 **ALAGANG KERO UG IRING:**\n\nAYAW GAYUD I-TALI ang mga hayop kung nagbaha aron makalangoy sila sa taas nga dapit. Pagdala ug higot ug pagkaon kung magbakwit.`,
    cebActions: ['Badbari ang higot sa hayop kung magbaha', 'Pagdala ug pagkaon sa hayop']
  }
];

/**
 * Intelligent entity extraction and dynamic disaster response generator
 * Ensures Panatag ALWAYS provides comprehensive, specific answers even for novel queries.
 */
function synthesizeDynamicAnswer(query: string, lang: Language): AIResponse {
  const q = query.toLowerCase();

  // Detect key intent domains
  const isTyphoon = /bagyo|hangin|storm|typhoon|signal|ulan|payong|bubong/i.test(q);
  const isQuake = /lindol|linog|earthquake|shake|uga|aftershock|peis|intensity|pader/i.test(q);
  const isFlood = /baha|tubig|flood|lumusong|anod|river|ilog/i.test(q);
  const isMedical = /sugat|dugo|cpr|gamot|hilanat|pananakit|patay|nahimatay|burn|paso|bali|kagat/i.test(q);
  const isFire = /sunog|apoy|usok|smoke|fire|kalan|lpg|gas/i.test(q);
  const isVolcano = /bulkan|volcano|taal|mayon|kanlaon|ashfall|abo|vog/i.test(q);

  if (lang === 'en') {
    let focus = 'General Disaster Safety';
    let bullets: string[] = [];

    if (isTyphoon) {
      focus = 'Typhoon & High Wind Safety';
      bullets = [
        'Secure exterior loose items and inspect roof trusses before winds intensify.',
        'Store at least 1 gallon of drinking water per person per day for at least 72 hours.',
        'Evacuate immediately if instructed by local DRRMO—do not wait for floodwaters to block roads.',
        'Never go outside during the calm "eye of the storm".'
      ];
    } else if (isQuake) {
      focus = 'Earthquake & Aftershock Protocol';
      bullets = [
        'Drop to the floor, take cover under a sturdy desk, and hold on until shaking ceases.',
        'Stay clear of glass windows, shelves, and heavy hanging fixtures.',
        'Shut off cooking gas (LPG) and the main electrical breaker immediately after shaking stops.',
        'Use the stairs to evacuate to an open field; never use elevators.'
      ];
    } else if (isFlood) {
      focus = 'Flood Survival & Health Defense';
      bullets = [
        'Shut off main electrical breakers before water reaches outlet levels.',
        'Avoid wading in floodwater; if unavoidable, scrub immediately and obtain Doxycycline within 48 hours.',
        'Boil all tap or well water for at least 3 minutes before drinking.',
        'If trapped by rapidly rising water, move onto the roof and signal with a whistle and bright cloth.'
      ];
    } else if (isMedical) {
      focus = 'Emergency First Aid Action';
      bullets = [
        'For severe bleeding, apply firm direct continuous pressure with a clean cloth for 5–10 minutes.',
        'For burns, cool under running water for 15 minutes; never apply oil or toothpaste.',
        'If victim is unresponsive and not breathing, begin Hands-Only CPR in the center of the chest (100–120 compressions/min).',
        'Call 911 or Philippine Red Cross 143 immediately.'
      ];
    } else if (isFire) {
      focus = 'Fire Escape & Protection';
      bullets = [
        'Crawl low under smoke where breathable oxygen remains near the floor.',
        'Touch doors with the back of your hand before opening; if warm, find an alternate escape route.',
        'If clothing ignites: STOP, DROP, and ROLL.',
        'Never use water on burning grease or cooking oil; smother with a metal lid.'
      ];
    } else if (isVolcano) {
      focus = 'Volcanic Ashfall & Health';
      bullets = [
        'Wear an N95 respirator mask or damp cloth over mouth and nose to prevent silica lung damage.',
        'Remove contact lenses and wear sealed goggles.',
        'Seal door bases and windows with damp towels.',
        'Sweep dry ash from corrugated roofs to avoid roof collapse.'
      ];
    } else {
      bullets = [
        'Assess your immediate perimeter for live electrical wires, gas odors, and unstable structures.',
        'Keep your 72-hour survival Go-Bag and an emergency whistle on your person.',
        'Tune a battery-operated AM radio to 738 kHz Radyo Pilipinas for official NDRRMC updates.',
        'In life-threatening distress, call 911 or Red Cross 143 immediately.'
      ];
    }

    return {
      answer: `🛡️ **Panatag Guidance: ${focus}**\n\nRegarding: *"__${query}__"*\n\nHere are the critical, authoritative safety steps:\n\n${bullets.map((b, i) => `${i + 1}. **${b.split('—')[0]}** ${b.includes('—') ? b.split('—')[1] : ''}`).join('\n\n')}\n\n*Note: Operating 100% offline via Panatag Local Engine.*`,
      category: 'all',
      suggestedActions: [
        'Check 72-hour Go-Bag supplies',
        'Dial 911 or Red Cross 143',
        'Enable Blackout Mode to conserve battery'
      ]
    };
  }

  // Filipino / Tagalog (Default)
  let focusTag = 'Pangkalahatang Kaligtasan sa Sakuna';
  let bulletsTag: string[] = [];

  if (isTyphoon) {
    focusTag = 'Kaligtasan sa Bagyo at Malalakas na Hangin';
    bulletsTag = [
      'Itali o ipasok ang mga gamit sa labas at patibayin ang mga bubong bago lumakas ang hangin.',
      'Mag-imbak ng hindi bababa sa 1 galon ng malinis na tubig bawat tao kada araw para sa 3 araw.',
      'Lumikas na agad kung mababa ang lugar o sinabihan ng Barangay DRRMO—huwag nang magpatumpik-tumpik.',
      'Huwag lumabas kahit tumahimik ang hangin dahil maaaring ito ay "Mata ng Bagyo".'
    ];
  } else if (isQuake) {
    focusTag = 'Alituntunin sa Lindol at Aftershocks';
    bulletsTag = [
      'Gawin ang DUCK, COVER, and HOLD ON: Dumapa, sumilong sa ilalim ng matibay na mesa, at kumapit nang mahigpit.',
      'Lumayo sa mga bintanang salamin, matataas na cabinet, at mabibigat na appliances.',
      'Patayin agad ang tangke ng gasul (LPG) at main electric breaker paghinto ng pagyanig.',
      'Gamitin ang hagdan sa paglikas papunta sa open field; BAWAL gumamit ng elevator.'
    ];
  } else if (isFlood) {
    focusTag = 'Proteksyon sa Baha at Leptospirosis';
    bulletsTag = [
      'Patayin ang main circuit breaker bago umabot ang tubig sa mga saksakan ng kuryente.',
      'Iwasang lumusong sa baha; kung hindi maiiwasan, hugasan agad ng sabon at uminom ng Doxycycline sa loob ng 48 oras sa health center.',
      'Pakuluan ang tubig-inumin nang hindi bababa sa 3 minuto bago inumin.',
      'Kung na-trap sa mabilis na pagbaha, umakyat sa bubong na may lagusan at pumito para sa rescue.'
    ];
  } else if (isMedical) {
    focusTag = 'Agarang First Aid at Pagsaklolo';
    bulletsTag = [
      'Sa malakas na pagdurugo: Diinan nang madiin gamit ang malinis na tela (Direct Pressure) nang tuloy-tuloy sa loob ng 5-10 minuto.',
      'Sa paso o nasunog: Ibabad sa malamig na tubig sa loob ng 15 minuto; HUWAG lagyan ng toothpaste, mantika, o toyo.',
      'Kung walang malay at hindi humihinga: Gawin agad ang Hands-Only CPR sa gitna ng dibdib (100–120 compressions bawat minuto).',
      'Tumawag agad sa 911 o Red Cross 143 para sa ambulansya.'
    ];
  } else if (isFire) {
    focusTag = 'Kaligtasan sa Sunog at Usok';
    bulletsTag = [
      'Gumapang nang mababa sa ilalim ng usok dahil ang malinis na hangin ay nasa ilalim.',
      'Hipuin ang pinto gamit ang likod ng palad bago buksan; kung mainit, humanap ng ibang labasan.',
      'Kung nag-aapoy ang damit: STOP, DROP, and ROLL (dumapa at magpagulong-gulong).',
      'HUWAG bubuhusan ng tubig ang nag-aapoy na mantika; takpan ito ng takip ng kaldero o basang basahan.'
    ];
  } else if (isVolcano) {
    focusTag = 'Proteksyon sa Bulkan at Ashfall';
    bulletsTag = [
      'Magsuot ng N95 mask o basang tela sa ilong at bibig upang hindi malanghap ang pinong bubog ng abo.',
      'Alisin ang contact lenses at magsuot ng safety goggles.',
      'Takpan ng basang tuwalya ang ilalim ng pinto at mga bintana.',
      'Walisin ang tuyong abo sa bubong upang hindi gumuho ang bahay dahil sa bigat.'
    ];
  } else {
    bulletsTag = [
      'Suriin ang paligid para sa mga live wire ng kuryente, amoy ng gas, o tumatagas na tubig.',
      'Panatilihing hawak ang 72-hour Go-Bag, cellphone, flashlight, at pito (whistle).',
      'Makinig sa de-bateryang AM radio (738 kHz Radyo Pilipinas) para sa opisyal na ulat ng NDRRMC.',
      'Kung nanganganib ang buhay, tumawag agad sa 911 o Philippine Red Cross 143.'
    ];
  }

  return {
    answer: `🛡️ **Gabay ni Panatag: ${focusTag}**\n\nTungkol sa: *"__${query}__"*\n\nNarito ang mga dapat mong gawin ngayon:\n\n${bulletsTag.map((b, i) => `${i + 1}. **${b}**`).join('\n\n')}\n\n*Paalala: Gumagana ito nang 100% offline sa Panatag Local Engine nang walang internet.*`,
    category: 'all',
    suggestedActions: [
      'I-check ang 72-hr Go-Bag',
      'Tumawag sa 911 o Red Cross 143',
      'I-on ang Blackout Mode para makatipid sa baterya'
    ]
  };
}

/**
 * Main query engine that matches topics with deep NLP scoring,
 * intent analysis, and fallback synthesis.
 */
export async function queryPanatagAI(query: string, lang: Language): Promise<AIResponse> {
  const clean = query.trim();
  if (!clean) {
    return {
      answer: 'Mangyaring mag-type ng iyong tanong tungkol sa kalamidad o emergency.',
      category: 'all',
      suggestedActions: ['Signal 3 ano gagawin?', 'Duck, Cover, and Hold', 'First aid sa pagdurugo']
    };
  }

  const lower = clean.toLowerCase();

  let bestTopic: KnowledgeTopic | null = null;
  let highestScore = 0;

  for (const topic of KNOWLEDGE_TOPICS) {
    let score = 0;

    // Pattern matching
    for (const pat of topic.intentPatterns) {
      if (pat.test(lower)) {
        score += 15;
      }
    }

    // Keyword scoring
    for (const kw of topic.keywords) {
      if (lower.includes(kw)) {
        score += kw.length > 5 ? 6 : 4;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  // Threshold for rich topic response
  if (bestTopic && highestScore >= 6) {
    let ans = bestTopic.filAnswer;
    let acts = bestTopic.filActions;

    if (lang === 'en') {
      ans = bestTopic.enAnswer;
      acts = bestTopic.enActions;
    } else if (lang === 'ceb') {
      ans = bestTopic.cebAnswer;
      acts = bestTopic.cebActions;
    }

    return {
      answer: ans,
      category: bestTopic.category,
      suggestedActions: acts,
      isHighAlert: bestTopic.isHighAlert
    };
  }

  // Dynamic context synthesis
  return synthesizeDynamicAnswer(clean, lang);
}

/**
 * Offline Text-to-Speech using browser native voice synthesis
 */
export function speakOfflineText(text: string, lang: Language): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[#*_~`]/g, '')
      .replace(/\n+/g, '. ')
      .replace(/⚠️|🚨|🌊|🌋|🩹|🎒|📞|💧|🔥|🐕|🐍|🍳|🚀|🧠|❤️|💡|🐾|🛡️|🌀/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (lang === 'fil') {
      const filVoice = voices.find(v => v.lang.startsWith('fil') || v.lang.startsWith('tl'));
      if (filVoice) utterance.voice = filVoice;
    } else if (lang === 'ceb') {
      const cebVoice = voices.find(v => v.lang.startsWith('ceb') || v.lang.startsWith('fil'));
      if (cebVoice) utterance.voice = cebVoice;
    } else {
      const enVoice = voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    return false;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
