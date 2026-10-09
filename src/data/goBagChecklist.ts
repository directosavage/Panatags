import { GoBagItem } from '../types';

export const DEFAULT_GOBAG_ITEMS: GoBagItem[] = [
  // 1. Water & Food
  {
    id: 'water',
    title: 'Drinking Water (1 Gallon / Person / Day for 3 Days)',
    tagalogTitle: 'Malinis na Tubig-Inumin (3 Araw na Suplay)',
    category: 'water_food',
    essential: true,
    notes: 'Minimum 1 galon (4 litro) bawat miyembro ng pamilya araw-araw.',
    packed: false
  },
  {
    id: 'food',
    title: 'Ready-to-eat Non-Perishable Canned Goods & Biscuits',
    tagalogTitle: 'De-lata (Easy-open), Biskwit, Energy Bars',
    category: 'water_food',
    essential: true,
    notes: 'Piliin ang mga hindi kailangan ng luto o pampainit.',
    packed: false
  },
  {
    id: 'can_opener',
    title: 'Manual Can Opener & Plastic Utensils',
    tagalogTitle: 'Manual Can Opener at Kubyertos',
    category: 'water_food',
    essential: true,
    notes: 'Kung may de-latang walang pull-tab.',
    packed: false
  },
  {
    id: 'water_purification',
    title: 'Water Purification Tablets or Plain Chlorine Bleach with Dropper',
    tagalogTitle: 'Tabletas o Regular Bleach para sa Paglinis ng Tubig',
    category: 'water_food',
    essential: true,
    notes: '2 patak bawat litro ng malinaw na tubig; maghintay ng 30 minuto.',
    packed: false
  },

  // 2. First Aid & Medicine
  {
    id: 'first_aid_kit',
    title: 'First Aid Kit (Bandages, Gauze, Betadine, Alcohol)',
    tagalogTitle: 'First Aid Kit (Gasang, Band-aid, Betadine, 70% Alcohol)',
    category: 'first_aid',
    essential: true,
    notes: 'Para sa agarang paggagamot ng mga sugat at gasgas.',
    packed: false
  },
  {
    id: 'maintenance_meds',
    title: '7-Day Supply of Personal Maintenance Medications',
    tagalogTitle: '7-Araw na Gamot sa Maintenance (Presyon, Diabetes, Asthma)',
    category: 'first_aid',
    essential: true,
    notes: 'Ilagay sa waterproof na lalagyan kasama ang reseta.',
    packed: false
  },
  {
    id: 'otc_meds',
    title: 'Emergency Medicines (Paracetamol, Loperamide, Antihistamine)',
    tagalogTitle: 'Pangkaraniwang Gamot (Hilanat, Pagtatae, Allergy)',
    category: 'first_aid',
    essential: true,
    notes: 'Paracetamol para sa sakit/hilanat, Diatabs/loperamide sa diarrhea.',
    packed: false
  },
  {
    id: 'n95_masks',
    title: 'N95 Respirator Masks / Face Masks (Ashfall & Dust)',
    tagalogTitle: 'N95 Face Masks (Proteksyon sa Abo ng Bulkan at Alikabok)',
    category: 'first_aid',
    essential: true,
    notes: 'Napakahalaga sa ashfall ng Taal/Mayon o gumuhong semento sa lindol.',
    packed: false
  },

  // 3. Tools & Light
  {
    id: 'whistle',
    title: 'High-Decibel Emergency Whistle (Wear on Neck)',
    tagalogTitle: 'Pito (Whistle) para sa Pagsaklolo (Isabit sa Leeg)',
    category: 'tools_light',
    essential: true,
    notes: 'Mas malakas at hindi nakakapagod kaysa sa sumigaw kapag na-trap.',
    packed: false
  },
  {
    id: 'flashlight',
    title: 'Heavy-Duty LED Flashlight & Extra Batteries',
    tagalogTitle: 'Maliwanag na LED Flashlight at Ekstrang Baterya',
    category: 'tools_light',
    essential: true,
    notes: 'Iwasang gumamit ng kandila upang maiwasan ang sunog o pagsabog ng gas.',
    packed: false
  },
  {
    id: 'radio',
    title: 'Battery-Operated or Hand-Crank AM/FM Radio',
    tagalogTitle: 'De-bateryang AM/FM Radio',
    category: 'tools_light',
    essential: true,
    notes: 'Tanging komunikasyon kapag bumagsak ang cellular data at cell towers.',
    packed: false
  },
  {
    id: 'powerbank',
    title: 'Charged Power Bank (20,000mAh+) & Charging Cables',
    tagalogTitle: 'Naka-charge na Power Bank at Charging Cord',
    category: 'tools_light',
    essential: true,
    notes: 'Panatilihing laging 100% full bago tumama ang bagyo.',
    packed: false
  },
  {
    id: 'multitool',
    title: 'Swiss Army Knife / Multi-Tool & Duct Tape',
    tagalogTitle: 'Multi-Tool (Kutsilyo, Gunting) at Duct Tape',
    category: 'tools_light',
    essential: false,
    notes: 'Pamputol, panselyo ng sirang gamit o kapote.',
    packed: false
  },

  // 4. Important Documents & Cash
  {
    id: 'sealed_docs',
    title: 'Waterproof Pouch with Birth Certificates, IDs, Land Titles',
    tagalogTitle: 'Nakaselyong Dokumento (Birth Cert, Titulo, IDs, Insurance)',
    category: 'documents',
    essential: true,
    notes: 'I-double zip lock bag; magdala rin ng scanned copies sa flash drive.',
    packed: false
  },
  {
    id: 'emergency_cash',
    title: 'Emergency Cash in Small Bills (₱20, ₱50, ₱100) and Coins',
    tagalogTitle: 'Emergency Cash sa Barya at Maliliit na Papel',
    category: 'documents',
    essential: true,
    notes: 'Hindi gagana ang mga ATM machine at cashless e-wallets kapag brownout.',
    packed: false
  },

  // 5. Hygiene & Sanitation
  {
    id: 'hygiene_pack',
    title: 'Soap, Toothbrush, Toothpaste, Sanitary Pads, Wet Wipes',
    tagalogTitle: 'Sabon, Toothbrush, Modess/Pads, Wet Wipes, Tissue',
    category: 'hygiene',
    essential: true,
    notes: 'Upang maiwasan ang sakit sa loob ng siksikang evacuation center.',
    packed: false
  },
  {
    id: 'trash_bags',
    title: 'Heavy-Duty Trash Bags & Ziplock Bags',
    tagalogTitle: 'Makakapal na Garbage Bags at Ziplock',
    category: 'hygiene',
    essential: true,
    notes: 'Pansamantalang kapote, pagtatapon ng dumi, proteksyon sa basa.',
    packed: false
  },

  // 6. Clothing & Shelter
  {
    id: 'clothing',
    title: 'Rain Poncho / Jacket, Extra Clothes & Sturdy Shoes',
    tagalogTitle: 'Kapote, Ekstrang Damit, Matibay na Sapatos o Bota',
    category: 'clothing',
    essential: true,
    notes: 'Huwag mag-tsinelas kapag lumilikas upang maiwasan ang sugat at tetanus.',
    packed: false
  },
  {
    id: 'blanket',
    title: 'Thermal Emergency Blanket / Mylar Space Blanket',
    tagalogTitle: 'Emergency Foil Blanket o Kumot',
    category: 'clothing',
    essential: false,
    notes: 'Magaan at napipigilan ang hypothermia o panginginig sa ulan.',
    packed: false
  }
];
