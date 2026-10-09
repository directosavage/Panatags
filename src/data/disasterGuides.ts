import { StormSignal, EarthquakeIntensity } from '../types';

export const STORM_SIGNALS: StormSignal[] = [
  {
    signal: 1,
    windSpeed: '39 to 61 km/h',
    leadTime: '36 hours lead time',
    waveHeight: '1.25 to 4.0 meters',
    threatLevel: 'Minimal to Minor Threat',
    color: '#0284c7', // Sky Blue
    impacts: [
      'Magaan na pinsala sa mga istrukturang gawa sa mahihinang materyales (pawid, kawayan).',
      'Maaaring mabuwal ang ilang sanga ng puno at mga tanim na saging.',
      'Ligtas pa ang karamihan sa mga matitibay na bahay at gusali.'
    ],
    actions: [
      'Ihanda ang 72-hour Go-Bag at i-check ang mga flashlight.',
      'I-charge ang mga cellphone, power bank, at battery radio.',
      'Makinig sa regular na ulat ng PAGASA sa radyo o TV tuwing 6 na oras.',
      'Mag-imbak ng malinis na tubig-inumin.'
    ]
  },
  {
    signal: 2,
    windSpeed: '62 to 88 km/h',
    leadTime: '24 hours lead time',
    waveHeight: '4.0 to 9.0 meters',
    threatLevel: 'Minor to Moderate Threat',
    color: '#eab308', // Yellow
    impacts: [
      'Katamtamang pinsala sa mahihinang bahay; maaaring mawala ang ilang yero.',
      'Maraming sanga ng puno ang mababali; mabubunot ang mga lumang puno.',
      'Maaaring maputol ang linya ng kuryente at komunikasyon sa ilang lugar.'
    ],
    actions: [
      'Ikandado at patibayin ang bubong at bintana.',
      'Kanselahin ang mga biyahe sa dagat (Gale warning sa mga mangingisda).',
      'Ihanda ang mga bata at matatanda para sa posibleng evacuation.',
      'Ipasok sa loob ng bahay ang mga gamit na maaaring tangayin ng hangin.'
    ]
  },
  {
    signal: 3,
    windSpeed: '89 to 117 km/h',
    leadTime: '18 hours lead time',
    waveHeight: '9.0 to 14.0 meters',
    threatLevel: 'Moderate to Significant Threat',
    color: '#f97316', // Orange
    impacts: [
      'Mabigat na pinsala sa mga bahay na gawa sa kahoy at yero.',
      'Malawakang pagkabali ng mga puno at pagkatumba ng mga poste ng kuryente.',
      'Malawakang brownout at kawalan ng supply ng tubig.'
    ],
    actions: [
      'LUMIKAS NA AGAD kung nakatira sa mababang lugar, tabing-ilog, o baybayin.',
      'Huwag nang lumabas ng bahay; manatili sa pinakamatatag na silid.',
      'Patayin ang main electrical switch bago pasukin ng tubig-baha.',
      'Itali ang mga alagang hayop sa mas ligtas at mataas na lugar.'
    ]
  },
  {
    signal: 4,
    windSpeed: '118 to 184 km/h (Typhoon)',
    leadTime: '12 hours lead time',
    waveHeight: '> 14.0 meters (Storm surge 2-3m)',
    threatLevel: 'Severe Threat to Life and Property',
    color: '#ef4444', // Red
    impacts: [
      'Napakalubhang pinsala sa karamihan ng mga istruktura.',
      'Maaaring mawala ang mga bubong ng mga pampublikong gusali.',
      'Bagsak ang halos lahat ng komunikasyon at linya ng kuryente.'
    ],
    actions: [
      'MANDATORY EVACUATION: Lumikas sa pinakamalapit na matibay na evacuation center.',
      'Iwasan ang mga bintanang salamin; magkubli sa ilalim ng matitibay na poste o mesa.',
      'Ihanda ang pito (whistle) at first aid kit sa katawan.',
      'Huwag lumabas kahit biglang humina ang hangin—ito ay maaaring "Eye of the Storm".'
    ]
  },
  {
    signal: 5,
    windSpeed: '185 km/h pataas (Super Typhoon)',
    leadTime: '12 hours lead time',
    waveHeight: '> 14.0 meters (Storm surge > 3m)',
    threatLevel: 'Catastrophic & Extreme Threat',
    color: '#9333ea', // Purple
    impacts: [
      'Malawakan at matinding pagkawasak ng mga kabahayan at komunidad.',
      'Storm surge na lampas 3 metro ang taas na parang tsunami sa baybayin.',
      'Pagkawasak ng mga pananim at lubhang matagal na pagkawala ng kuryente.'
    ],
    actions: [
      'Manatili sa pinakamatatag na evacuation building (Kongkretong gusali).',
      'Huwag nang subukang maglakbay o magligtas ng gamit sa labas.',
      'Humawak sa matitibay na suporta; protektahan ang ulo gamit ang helmet o unan.',
      'Gamitin ang Panatag Siren / Whistle kung kailangan ng agarang rescue.'
    ]
  }
];

export const EARTHQUAKE_INTENSITIES: EarthquakeIntensity[] = [
  {
    scale: 'PEIS I',
    name: 'Scarcely Perceptible',
    tagalogName: 'Bahagyang Nararamdaman',
    description: 'Nararamdaman lamang ng ilang taong nakapahinga sa loob ng bahay. Bahagyang gumagalaw ang tubig sa baso.',
    color: '#38bdf8',
    safetyAction: 'Walang pinsala. Manatiling alerto sa posibleng kasunod na pagyanig.'
  },
  {
    scale: 'PEIS II',
    name: 'Slightly Felt',
    tagalogName: 'Bahagyang Malakas',
    description: 'Nararamdaman ng mga taong nakaupo sa mataas na gusali. Umuugoy ang mga nakasabit na gamit.',
    color: '#34d399',
    safetyAction: 'Tingnan ang paligid kung may mga nakasabit na maaaring mahulog.'
  },
  {
    scale: 'PEIS III',
    name: 'Weak',
    tagalogName: 'Mahina',
    description: 'Nararamdaman ng maraming tao sa loob ng bahay na parang may dumaang magaan na truck.',
    color: '#a3e635',
    safetyAction: 'Ihanda ang sarili sa pagdapa (Duck) kung lumakas ang pagyanig.'
  },
  {
    scale: 'PEIS IV',
    name: 'Moderately Strong',
    tagalogName: 'Katamtamang Lakas',
    description: 'Nararamdaman sa loob at labas. Kumakalansing ang mga pinggan at bintana. Gumigising sa mga natutulog.',
    color: '#facc15',
    safetyAction: 'Gawin ang Duck, Cover, and Hold kung kinakailangan. Lumayo sa mga salamin.'
  },
  {
    scale: 'PEIS V',
    name: 'Strong',
    tagalogName: 'Malakas',
    description: 'Nararamdaman ng karamihan; natatakot at lumalabas ang mga tao. Umuugoy ang mga puno at poste.',
    color: '#fb923c',
    safetyAction: 'Agad na magsagawa ng DUCK, COVER, and HOLD ON sa ilalim ng matibay na mesa.'
  },
  {
    scale: 'PEIS VI',
    name: 'Very Strong',
    tagalogName: 'Napakalakas',
    description: 'Nahihirapang tumayo ang mga tao. Nababasag ang mga salamin; nagkakaroon ng maliliit na bitak sa plaster ng pader.',
    color: '#f87171',
    safetyAction: 'Huwag tumakbo habang umuuga. Paghinto, patayin ang gas at lumabas sa open field.'
  },
  {
    scale: 'PEIS VII',
    name: 'Destructive',
    tagalogName: 'Mapaminsala',
    description: 'Nahihirapang tumayo kahit sa labas. Malaking bitak sa mga lumang gusali; posibleng pagguho ng lupa (landslide).',
    color: '#ef4444',
    safetyAction: 'LUMIKAS agad sa open field paghinto ng pagyanig. Mag-ingat sa aftershocks at sirang kuryente.'
  },
  {
    scale: 'PEIS VIII - X',
    name: 'Very Destructive to Devastating',
    tagalogName: 'Lubhang Mapaminsala hanggang Mapangwasak',
    description: 'Malawakang pagguho ng mga tulay, gusali, at kalsada. Pagka-trap ng mga tao sa ilalim ng debris.',
    color: '#7c3aed',
    safetyAction: 'Gamitin ang rescue whistle o Panatag Siren. Huwag gumamit ng apoy dahil sa posibleng gas leak.'
  }
];

export const FIRST_AID_TOPICS = [
  {
    id: 'cpr',
    title: 'Hands-Only CPR (Buhay sa Gitna ng Krisis)',
    steps: [
      'Suriin kung humihinga at may malay ang biktima (Tapikin sa balikat: "Ayos ka lang ba?").',
      'Tumawag agad ng saklolo (911 o Red Cross 143).',
      'Ilapat ang takong ng palad sa gitna ng dibdib, ipatong ang kabilang kamay.',
      'Itulak nang madiin at mabilis (100–120 compressions bawat minuto) hanggang dumating ang tulong.',
      'Tandaan ang ritmo ng kantang "Stayin\' Alive".'
    ]
  },
  {
    id: 'bleeding',
    title: 'Pahintuin ang Matinding Pagdurugo (Direct Pressure)',
    steps: [
      'Maglagay ng malinis na gasa, tuwalya, o damit diretso sa sugat.',
      'Diinan nang buong lakas gamit ang dalawang kamay nang tuloy-tuloy sa loob ng 5-10 minuto.',
      'Huwag aalisin ang unang tela kahit mabad-bad sa dugo; patungan lamang ng karagdagang tela.',
      'Itaas ang sugatang bahagi na mas mataas sa puso kung walang bali sa buto.'
    ]
  },
  {
    id: 'burns',
    title: 'Paso at Sunog sa Balat (First & Second Degree)',
    steps: [
      'Ibabad o hugasan agad sa malamig at tumatakbong tubig sa loob ng 10-20 minuto.',
      'Alisin ang mga singsing o masisikip na gamit bago mamaga ang parte.',
      'Takpan ng malinis at tuyong gasa o sterile plastic wrap.',
      'BAWAL: Huwag lagyan ng toothpaste, mantika, alcohol, toyo, o yelo dahil nagdudulot ito ng impeksyon.'
    ]
  },
  {
    id: 'choking',
    title: 'Nabulunan (Heimlich Maneuver)',
    steps: [
      'Tumayo sa likod ng taong nabulunan at ilibot ang mga braso sa kanyang baywang.',
      'Iikom ang isang kamay (fist) at ilagay sa itaas lamang ng pusod pero sa ilalim ng tadyang.',
      'Hawakan ang kamao gamit ang kabilang kamay at humila paitaas at paloob nang mabilis.',
      'Ulitin hanggang lumabas ang bara sa lalamunan.'
    ]
  }
];
