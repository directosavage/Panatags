import { Language } from '../types';

export interface AIResponse {
  answer: string;
  category: 'typhoon' | 'earthquake' | 'flood' | 'volcano' | 'firstaid' | 'fire' | 'gobag' | 'all';
  suggestedActions: string[];
  isHighAlert?: boolean;
}

/**
 * Normalization for Filipino, Taglish, Bisaya, and colloquial terms
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
 * Tailored specifically for life-threatening trauma, disasters, and medical emergencies.
 */
export async function queryPanatagAI(rawQuery: string, lang: Language): Promise<AIResponse> {
  const query = rawQuery.trim();
  if (!query) {
    return {
      answer: 'Mangyaring mag-type ng iyong tanong o emergency na sitwasyon.',
      category: 'all',
      suggestedActions: ['Naputol ang daliri o kamay', 'Signal #3 ano gagawin?', 'Baha at Leptospirosis']
    };
  }

  const q = normalizeQuery(query);

  // 1. AMPUTATION / NAPUTOL ANG DALIRI / KAMAY / PAA (CRITICAL TRAUMA)
  if (/naputol|putol|amputat|severed|napigtas|napugot|daliri.*putol|kamay.*putol|paa.*putol/i.test(q)) {
    return {
      answer: `🚨 **AGARANG FIRST AID SA NAPUTOL NA DALIRI O KAMAY (CRITICAL TRAUMA):**\n\n1. **PIGILIN AGAD ANG PAGDURUGO NG PASYENTE (Unang Prayoridad):**\n   - **Direct Pressure:** Kumuha agad ng malinis na tela o gasa at diinan nang buong lakas ang pinagputulan.\n   - **Itaas ang Bahagi:** Panatilihing mas mataas sa lebel ng puso ang kamay o braso upang mabawasan ang presyon ng dugo.\n   - **Tourniquet (Kung sumisirit ang dugo):** Kung tuloy-tuloy ang pagsirit ng dugo mula sa naputol na braso o binti, maglagay ng tourniquet o makapal na tela/sinturon **2 hanggang 3 pulgada sa itaas ng sugat** (huwag sa mismong kasukasuan). Higpitan gamit ang patpat hanggang huminto ang pagsirit. Isulat ang oras kung kailan inilagay.\n\n2. **PAANO PANGANGALAGAAN ANG NAPUTOL NA BAHAGI (Para maitahi pa sa ospital - Replantation):**\n   - **Step 1:** Pulutin ang naputol na daliri o kamay. Banlawan nang marahan ng malinis na tubig kung may dumi (huwag kuskusin).\n   - **Step 2:** Balutin ito sa malinis at bahagyang mamasa-masang tela o sterile gauze.\n   - **Step 3:** Ilagay ang binalot na bahagi sa loob ng **malinis at saradong plastic bag (Ziploc)** at iselyo.\n   - **Step 4:** Ilagay ang selyadong plastic bag sa isa pang lalagyan na may **YELO NA MAY KASAMANG TUBIG (Ice water)**.\n   - ⚠️ **MAHIGPIT NA BAWAL:** HUWAG direktang ilagay ang daliri/kamay sa yelo o tubig nang walang plastic bag! Masusunog ang tissue sa lamig (frostbite) at hindi na maitatahi ng doktor!\n\n3. **SUMUGOD AGAD SA OSPITAL:**\n   - Dalhin agad ang pasyente at ang naputol na bahagi sa ospital na may Trauma / Microsurgery Center sa loob ng **6 na oras (Golden Window)**.\n   - Tumawag agad sa **911** o Red Cross **143** para sa ambulansya.`,
      category: 'firstaid',
      suggestedActions: [
        'Diinan nang madiin ang sugat gamit ang malinis na tela',
        'Ibalot ang naputol na daliri sa plastic bag bago ilagay sa yelo',
        'Tumawag agad sa 911 o Red Cross 143'
      ],
      isHighAlert: true
    };
  }

  // 2. SINAKSAK / PUNCTURE WOUND / NAKATARAK NA KUTSILYO
  if (/sinaksak|saksak|saksakin|tarik|kutsilyo|nakatusok|tusok|nabutas|saksakan/i.test(q)) {
    return {
      answer: `🚨 **FIRST AID SA SINAKSAK O NAKATARAK NA BAGAY (PUNCTURE WOUND):**\n\n1. **HUWAG KAILANMAN BUBUNUTIN ANG NAKATARAK NA KUTSILYO O BAGAY!**\n   - Ang nakatarak na bagay ang mismong nagtatakip sa sugat upang hindi sumirit ang dugo. Kapag binunot mo ito, maaaring mamatay ang biktima sa biglaang internal bleeding bago makarating sa ospital!\n\n2. **PATATAGIN ANG NAKATARAK NA BAGAY:**\n   - Maglagay ng makakapal na rolyo ng tela o bendahe sa magkabilang gilid ng kutsilyo upang hindi ito gumalaw.\n   - Itali nang maingat sa paligid nang hindi pinipindot o tinutulak ang bagay.\n\n3. **KUNG LUMABAS ANG BITUKA (Evisceration):**\n   - HUWAG ipapasok pabalik ang bituka!\n   - Takpan ito ng malinis na basang tela o sterile plastic wrap upang hindi matuyo at maimpeksyon.\n\n4. Dalhin agad sa pinakamalapit na Emergency Room / Hospital o tumawag sa **911**.`,
      category: 'firstaid',
      suggestedActions: [
        'HUWAG BUBUNUTIN ang nakatarak na kutsilyo',
        'Patatagin gamit ang makapal na tela sa gilid',
        'Tumawag agad sa 911 o 143'
      ],
      isHighAlert: true
    };
  }

  // 3. NABAGOK ANG ULO / NAHULOG / HINDI MAGALAW ANG LEEG
  if (/nabagok|untog|ulo dugo|hindi magalaw|leeg|likod|spinal|nahulog|nauntog/i.test(q)) {
    return {
      answer: `🚨 **FIRST AID SA NABAGOK ANG ULO AT PINSALA SA LEEG/LIKOD:**\n\n1. **HUWAG IGALAW ANG LEEG O KATAWAN:**\n   - Kung pinaghihinalaang may pinsala sa leeg o gulugod (spine), ang maling pagbuhat o paggalaw ay maaaring magdulot ng permanenteng paralisis (pagkalumpo) o pagkamatay.\n   - Hawakan nang steady ang ulo sa magkabilang gilid upang manatiling tuwid ang leeg.\n\n2. **BANTAYAN ANG DANGER SIGNS SA ULO:**\n   - Pagsusuka na parang sumisirit (projectile vomiting).\n   - Pagkaantok o pagkawala ng malay.\n   - Tumutulong malinaw na likido o dugo mula sa ilong o tainga.\n   - Magkaibang laki ng pupil ng mata.\n\n3. Tumawag agad sa **911** o Red Cross **143** para sa rescue team na may cervical collar at spine board.`,
      category: 'firstaid',
      suggestedActions: [
        'Huwag igalaw ang leeg at likod',
        'Bantayan kung may pagsusuka o pagkahilo',
        'Tumawag sa 911 para sa spine board'
      ],
      isHighAlert: true
    };
  }

  // 4. ATOMS OF BLEEDING & CPR
  if (/dugo|bleeding|sumisirit|tumatagas ang dugo|hiwa/i.test(q)) {
    return {
      answer: `🩹 **FIRST AID SA MALAKAS NA PAGDURUGO:**\n\n1. **Direct Pressure:** Kumuha agad ng malinis na tela o gasa at diinan nang madiin mismo sa sugat gamit ang dalawang kamay nang tuloy-tuloy sa loob ng **5 hanggang 10 minuto** nang hindi binubuhat ang tela.\n2. **Kung Tumagos ang Dugo:** HUWAG aalisin ang unang tela! Patungan lamang ito ng isa pang makapal na tela at patuloy na diinan.\n3. **Itaas:** Itaas ang sugatang bahagi na mas mataas sa lebel ng puso kung walang bali.\n4. **Tourniquet:** Gamitin lamang sa binti o braso kung sumisirit ang dugo at hindi maampat ng diin. Isulat ang oras kung kailan inilagay.\n5. Tumawag agad sa **911** o Red Cross **143**.`,
      category: 'firstaid',
      suggestedActions: ['Diinan nang madiin ang sugat nang 10 minuto', 'Huwag alisin ang unang tela', 'Itaas ang sugat sa lebel ng puso'],
      isHighAlert: true
    };
  }

  // 5. EARTHQUAKE DUCK COVER HOLD
  if (/lindol|linog|earthquake|shake|uga|lumilindol/i.test(q)) {
    if (/naliligo|banyo|shower/i.test(q)) {
      return {
        answer: `🚿 **KUNG NALILIGO HABANG LUMILINDOL:**\n\n1. Dumapa agad at takpan ang ulo gamit ang palad, tuwalya, o planggana.\n2. Lumayo sa salamin, bintana, at madudulas na tiles.\n3. Huwag magmadaling tumakbo sa labas habang umuuga upang hindi madulas o mabagsakan ng kisame.\n4. Buksan nang bahagya ang pinto upang hindi ma-trap kapag nagbago ang hugis ng pader.`,
        category: 'earthquake',
        suggestedActions: ['Takpan ang ulo', 'Lumayo sa salamin', 'Lumabas paghinto ng uga']
      };
    }
    return {
      answer: `🚨 **LINDOL: DUCK, COVER, AND HOLD ON:**\n\n1. **DUCK (Dumapa):** Dumapa sa sahig bago ka mabuwal.\n2. **COVER (Magtago):** Sumilong sa ilalim ng matibay na mesa. Protektahan ang ulo at leeg.\n3. **HOLD ON (Kumapit):** Humawak nang mahigpit sa paa ng mesa hanggang matapos ang uga.\n\n- BAWAL gumamit ng elevator; gamitin ang hagdan.\n- Patayin ang tangke ng LPG at electric breaker paghinto ng pagyanig.\n- Lumabas sa open field at mag-ingat sa aftershocks.`,
      category: 'earthquake',
      suggestedActions: ['Duck, Cover, and Hold', 'Patayin ang tangke ng gas', 'Lumabas sa Open Field']
    };
  }

  // 6. FLOOD & LEPTOSPIROSIS
  if (/baha|flood|leptospirosis|doxycycline|trapped sa baha/i.test(q)) {
    if (/sugat|lumusong/i.test(q)) {
      return {
        answer: `🩺 **LEPTOSPIROSIS AT SUGAT SA BAHA (DOH GUIDELINES):**\n\n1. Hugasan agad ang sugat at katawan sa malinis na tubig at sabon nang 15 minuto.\n2. Pumunta sa pinakamalapit na Health Center sa loob ng **24–48 oras** para sa **Doxycycline 100mg** (2 kapsula single dose pagkatapos kumain).\n3. Bawal ang Doxycycline sa buntis at batang mababa sa 8 taon (Amoxicillin ang pamalit).\n4. Magpabakuna ng Anti-Tetanus kung nasugatan sa kalawangin na pako o yero.`,
        category: 'flood',
        suggestedActions: ['Hugasan ng sabon ang katawan', 'Humingi ng Doxycycline sa health center', 'Bantayan kung may lagnat']
      };
    }
    return {
      answer: `🌊 **KALIGTASAN SA BAHA:**\n\n1. Patayin agad ang main electrical breaker bago umabot ang tubig sa mga saksakan.\n2. Iwasang lumusong sa baha dahil sa Leptospirosis at nakalubog na kuryente.\n3. Kung na-trap sa mabilis na pagtaas ng tubig, umakyat sa bubong na may lagusan (huwag sa saradong attic).\n4. Gumamit ng pito at pulang tela para mag-signal sa rescue boats.\n5. Tumawag sa 911 o Coast Guard (0917-724-3682).`,
      category: 'flood',
      suggestedActions: ['Patayin ang main breaker', 'Umakyat sa bubong na may labasan', 'Tawagan ang Coast Guard']
    };
  }

  // 7. KAGAT NG ASO AT AHAS
  if (/kagat|aso|pusa|rabies|ahas|snake/i.test(q)) {
    if (/ahas|snake/i.test(q)) {
      return {
        answer: `🐍 **FIRST AID SA KAGAT NG AHAS:**\n\n1. Panatilihing nakapahinga at mas mababa sa puso ang nakagat na braso o binti (ang paggalaw ay nagpapabilis sa pagkalat ng lason).\n2. HUWAG hiwain, HUWAG sipsipin ang dugo, at HUWAG lagyan ng mahigpit na tourniquet!\n3. Dalhin agad sa pinakamalapit na ospital para sa Anti-Venom.`,
        category: 'firstaid',
        suggestedActions: ['Huwag ipalihok ang bahagi', 'Iposisyon mas mababa sa puso', 'Dalhin agad sa ospital']
      };
    }
    return {
      answer: `🐕 **FIRST AID SA KAGAT NG ASO / PUSA (RABIES):**\n\n1. Hugasan agad sa gripo at sabon nang tuloy-tuloy sa loob ng **15 buong minuto**.\n2. Lagyan ng Betadine o 70% alcohol.\n3. HUWAG lagyan ng tandok, bawang, o barya.\n4. Pumunta agad sa Animal Bite Treatment Center para sa Anti-Rabies Vaccine (ARV) at Tetanus shot.`,
      category: 'firstaid',
      suggestedActions: ['Hugasan ng sabon nang 15 minuto', 'Lagyan ng Betadine', 'Pumunta sa Animal Bite Center']
    };
  }

  // 8. SUNOG SA MANTIKA O KAWALI
  if (/mantika|kawali|grease fire|apoy sa kusina/i.test(q)) {
    return {
      answer: `🍳 **SUNOG SA MANTIKA O KAWALI:**\n\n⚠️ **HUWAG BUHUSAN NG TUBIG!** Sasabog ito sa isang higanteng fireball dahil ang tubig ay magiging steam at magsasabog ng nag-aapoy na langis!\n\n1. Patayin ang apoy sa kalan kung ligtas.\n2. Takpan ang kawali ng metal na takip o basang tuwalya na piniga upang maubusan ng hangin ang apoy.\n3. Ibuhos ang baking soda o asin sa maliliit na apoy (bawal ang harina dahil sasabog).\n4. I-off ang tangke ng gasul.`,
      category: 'fire',
      suggestedActions: ['HUWAG BUHUSAN NG TUBIG', 'Takpan ng metal lid o basang tuwalya', 'Patayin ang kalan']
    };
  }

  // 9. TYPHOON SIGNALS
  if (/bagyo|typhoon|signal|tcws|hangin/i.test(q)) {
    return {
      answer: `🌀 **PAGASA TYPHOON SIGNALS PROTOCOL:**\n\n- **Signal #1 (39–61 km/h):** Ihanda ang Go-Bag, mag-imbak ng tubig-inumin, i-charge ang gadgets.\n- **Signal #2 (62–88 km/h):** Ikandado ang bubong/bintana. Kanselahin ang biyahe sa dagat.\n- **Signal #3 (89–117 km/h):** Mapanganib ang hangin. Lumikas na agad kung mababa ang lugar o malapit sa dagat.\n- **Signal #4 & #5 (118+ km/h - Super Typhoon):** Catastrophic. Manatili sa kongkretong silid. HUWAG lumabas kahit humina ang hangin (Mata ng Bagyo).`,
      category: 'typhoon',
      suggestedActions: ['I-check ang Go-Bag', 'Mag-imbak ng tubig', 'Alamin ang evacuation center']
    };
  }

  // 10. HOTLINES
  if (/hotline|number|numero|telepono|tawagan|phone|911|red cross/i.test(q)) {
    return {
      answer: `📞 **MGA PANGUNAHING EMERGENCY HOTLINES (24/7):**\n\n- **National Emergency:** **911**\n- **Philippine Red Cross:** **143** o (02) 8790-2300\n- **NDRRMC:** (02) 8911-5061 to 65\n- **PAGASA:** (02) 8284-0800\n- **PHIVOLCS:** (02) 8426-1468\n- **BFP (Bumbero):** (02) 8426-0219\n- **Coast Guard (PCG):** (02) 8527-8481 / 0917-724-3682\n- **DOH:** 1555`,
      category: 'all',
      suggestedActions: ['Tumawag sa 911', 'Tumawag sa 143']
    };
  }

  // 11. GENERAL RESILIENT RESPONSE (WITHOUT DUMB GO-BAG REPETITION)
  return {
    answer: `🛡️ **Gabay ni Panatag:**\n\nTungkol sa iyong tanong: *"__${query}__"*\n\n1. **Agarang Hakbang:** Manatiling ligtas at suriin kung may agaran na pinsala sa katawan o panganib sa paligid.\n2. **Tulong Medikal:** Kung may matinding pinsala o dugo, diinan agad ng malinis na tela at tumawag sa **911** o Red Cross **143**.\n3. **Komunikasyon:** Makinig sa AM radio (738 kHz Radyo Pilipinas) kung walang cellular signal.\n\n*Paalala: Tumatakbo ito 100% offline sa iyong device nang walang internet.*`,
    category: 'all',
    suggestedActions: ['Tumawag sa 911', 'Tumawag sa Red Cross 143']
  };
}
