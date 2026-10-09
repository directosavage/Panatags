import { EmergencyContact } from '../types';

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: '911',
    name: 'National Emergency Hotline',
    tagalogName: 'Pambansang Emergency Hotline',
    number: '911',
    tel: 'tel:911',
    agency: 'Philippine National Police / DILG',
    category: 'national',
    description: 'Pangkalahatang saklolo para sa pulis, bumbero, ambulansya, at search and rescue.',
    availableHours: '24/7 Nationwide',
    smsAvailable: true,
    smsNumber: 'sms:911'
  },
  {
    id: 'red-cross',
    name: 'Philippine Red Cross',
    tagalogName: 'Philippine Red Cross Rescue & Blood Bank',
    number: '143 / (02) 8790-2300',
    tel: 'tel:143',
    agency: 'PRC Operations Center',
    category: 'rescue',
    description: 'Ambulansya, first aid, blood requests, disaster relief, at family tracing.',
    availableHours: '24/7 Operations',
    smsAvailable: false
  },
  {
    id: 'ndrrmc',
    name: 'NDRRMC Operations Center',
    tagalogName: 'National Disaster Risk Reduction & Management Council',
    number: '(02) 8911-5061 to 65',
    tel: 'tel:0289115061',
    agency: 'Office of Civil Defense (OCD)',
    category: 'national',
    description: 'Pangunahing ahensya sa koordinasyon ng pambansang kalamidad, bagyo, at lindol.',
    availableHours: '24/7 Monitoring',
    smsAvailable: false
  },
  {
    id: 'pagasa',
    name: 'PAGASA Weather Central',
    tagalogName: 'Pangasiwaan sa Kalagayan ng Panahon at Bagyo',
    number: '(02) 8284-0800',
    tel: 'tel:0282840800',
    agency: 'DOST - PAGASA',
    category: 'weather',
    description: 'Opisyal na ulat sa bagyo (TCWS Signals), rainfall advisories, baha, at storm surge.',
    availableHours: '24/7 Weather Desk',
    smsAvailable: false
  },
  {
    id: 'phivolcs',
    name: 'PHIVOLCS Seismology & Volcanology',
    tagalogName: 'Institusyon ng Bulkanolohiya at Sismolohiya',
    number: '(02) 8426-1468',
    tel: 'tel:0284261468',
    agency: 'DOST - PHIVOLCS',
    category: 'national',
    description: 'Ulat sa lindol, tsunami alerts, at alert level ng bulkang Taal, Mayon, at Kanlaon.',
    availableHours: '24/7 Seismic Watch',
    smsAvailable: false
  },
  {
    id: 'bfp',
    name: 'Bureau of Fire Protection (BFP)',
    tagalogName: 'Kawanihan ng Pamatay-Sunog',
    number: '(02) 8426-0219 / (02) 8426-0246',
    tel: 'tel:0284260219',
    agency: 'BFP National Headquarters',
    category: 'fire',
    description: 'Pamatay-sunog, rescue sa gumuhong gusali, at vehicular extrication.',
    availableHours: '24/7 Fire Stations',
    smsAvailable: false
  },
  {
    id: 'pcg',
    name: 'Philippine Coast Guard (PCG)',
    tagalogName: 'Tanod Baybayin ng Pilipinas',
    number: '(02) 8527-8481 to 89 / 0917-724-3682',
    tel: 'tel:0285278481',
    agency: 'PCG Action Center',
    category: 'rescue',
    description: 'Maritime rescue, pagbaha sa baybayin, at rubber boat rescue operations.',
    availableHours: '24/7 Coastal Watch',
    smsAvailable: true,
    smsNumber: 'sms:09177243682'
  },
  {
    id: 'pnp',
    name: 'Philippine National Police (PNP)',
    tagalogName: 'Pambansang Pulisya ng Pilipinas',
    number: '117 / (02) 8722-0650',
    tel: 'tel:117',
    agency: 'PNP Emergency Operations',
    category: 'police',
    description: 'Kapayapaan, kaayusan, crowd control, at seguridad sa evacuation centers.',
    availableHours: '24/7 Patrol',
    smsAvailable: false
  },
  {
    id: 'doh',
    name: 'DOH Health Emergency Bureau',
    tagalogName: 'Kagawaran ng Kalusugan Emergency Desk',
    number: '1555 / (02) 8651-7800',
    tel: 'tel:1555',
    agency: 'Department of Health (DOH)',
    category: 'health',
    description: 'Leptospirosis prophylaxis, pagkalason, cholera, at ospital referral.',
    availableHours: '24/7 Hotline',
    smsAvailable: false
  },
  {
    id: 'dswd',
    name: 'DSWD Disaster Response Unit',
    tagalogName: 'Kagawaran ng Kagalingang Panlipunan',
    number: '(02) 8931-8101 to 07',
    tel: 'tel:0289318101',
    agency: 'DSWD Relief Operations',
    category: 'national',
    description: 'Family food packs, relief goods, at evacuation center welfare support.',
    availableHours: '8:00 AM - 5:00 PM (24/7 during disasters)',
    smsAvailable: false
  },
  {
    id: 'mmda',
    name: 'MMDA Metrobase Hotline',
    tagalogName: 'Metro Manila Development Authority',
    number: '136 / (02) 8882-4151',
    tel: 'tel:136',
    agency: 'MMDA Flood Control & Rescue',
    category: 'rescue',
    description: 'Baha sa mga pangunahing kalsada ng Metro Manila at trapiko.',
    availableHours: '24/7 Metrobase',
    smsAvailable: false
  }
];
