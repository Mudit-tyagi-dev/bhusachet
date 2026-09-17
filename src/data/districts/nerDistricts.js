// Comprehensive District Dataset for all 8 North Eastern Region (NER) States
// Coordinates are accurate district headquarters / centroid coordinates.

export const NER_STATES = [
  'Arunachal Pradesh',
  'Assam',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Sikkim',
  'Tripura',
];

export const NER_BOUNDS = {
  minLat: 21.8,
  maxLat: 29.5,
  minLon: 88.0,
  maxLon: 97.5,
  center: [26.2, 92.8],
  defaultZoom: 7,
};

export const STATE_CENTROIDS = {
  'Arunachal Pradesh': { center: [28.218, 94.7278], zoom: 8 },
  'Assam': { center: [26.2006, 92.9376], zoom: 7.5 },
  'Manipur': { center: [24.6637, 93.9063], zoom: 8.5 },
  'Meghalaya': { center: [25.467, 91.3662], zoom: 8.5 },
  'Mizoram': { center: [23.1645, 92.9376], zoom: 8 },
  'Nagaland': { center: [26.1584, 94.5624], zoom: 8.5 },
  'Sikkim': { center: [27.533, 88.5122], zoom: 9 },
  'Tripura': { center: [23.9408, 91.9882], zoom: 8.5 },
};

export const NER_DISTRICTS = [
  // --- SIKKIM (6 Districts) ---
  { id: 'sk-gangtok', name: 'Gangtok', state: 'Sikkim', latitude: 27.3314, longitude: 88.6138, elevationM: 1650 },
  { id: 'sk-namchi', name: 'Namchi', state: 'Sikkim', latitude: 27.1667, longitude: 88.35, elevationM: 1315 },
  { id: 'sk-gyalshing', name: 'Gyalshing', state: 'Sikkim', latitude: 27.2833, longitude: 88.2333, elevationM: 1900 },
  { id: 'sk-mangan', name: 'Mangan', state: 'Sikkim', latitude: 27.5167, longitude: 88.5333, elevationM: 1250 },
  { id: 'sk-pakyong', name: 'Pakyong', state: 'Sikkim', latitude: 27.24, longitude: 88.59, elevationM: 1120 },
  { id: 'sk-soreng', name: 'Soreng', state: 'Sikkim', latitude: 27.17, longitude: 88.22, elevationM: 1450 },

  // --- MEGHALAYA (12 Districts) ---
  { id: 'mg-east-khasi', name: 'East Khasi Hills (Shillong)', state: 'Meghalaya', latitude: 25.5788, longitude: 91.8933, elevationM: 1525 },
  { id: 'mg-west-khasi', name: 'West Khasi Hills (Nongstoin)', state: 'Meghalaya', latitude: 25.52, longitude: 91.27, elevationM: 1409 },
  { id: 'mg-south-west-khasi', name: 'South West Khasi Hills (Mawkyrwat)', state: 'Meghalaya', latitude: 25.35, longitude: 91.45, elevationM: 1350 },
  { id: 'mg-eastern-west-khasi', name: 'Eastern West Khasi Hills (Mairang)', state: 'Meghalaya', latitude: 25.56, longitude: 91.63, elevationM: 1560 },
  { id: 'mg-ri-bhoi', name: 'Ri-Bhoi (Nongpoh)', state: 'Meghalaya', latitude: 25.9, longitude: 91.88, elevationM: 485 },
  { id: 'mg-west-garo', name: 'West Garo Hills (Tura)', state: 'Meghalaya', latitude: 25.5144, longitude: 90.2201, elevationM: 350 },
  { id: 'mg-east-garo', name: 'East Garo Hills (Williamnagar)', state: 'Meghalaya', latitude: 25.6, longitude: 90.62, elevationM: 275 },
  { id: 'mg-south-garo', name: 'South Garo Hills (Baghmara)', state: 'Meghalaya', latitude: 25.19, longitude: 90.64, elevationM: 120 },
  { id: 'mg-north-garo', name: 'North Garo Hills (Resubelpara)', state: 'Meghalaya', latitude: 25.97, longitude: 90.6, elevationM: 145 },
  { id: 'mg-south-west-garo', name: 'South West Garo Hills (Ampati)', state: 'Meghalaya', latitude: 25.46, longitude: 89.93, elevationM: 110 },
  { id: 'mg-west-jaintia', name: 'West Jaintia Hills (Jowai)', state: 'Meghalaya', latitude: 25.45, longitude: 92.2, elevationM: 1380 },
  { id: 'mg-east-jaintia', name: 'East Jaintia Hills (Khliehriat)', state: 'Meghalaya', latitude: 25.35, longitude: 92.37, elevationM: 1210 },

  // --- ARUNACHAL PRADESH (26 Districts) ---
  { id: 'ar-itangar', name: 'Papum Pare (Itanagar)', state: 'Arunachal Pradesh', latitude: 27.0844, longitude: 93.6053, elevationM: 320 },
  { id: 'ar-tawang', name: 'Tawang', state: 'Arunachal Pradesh', latitude: 27.5861, longitude: 91.8594, elevationM: 3048 },
  { id: 'ar-west-kameng', name: 'West Kameng (Bomdila)', state: 'Arunachal Pradesh', latitude: 27.2645, longitude: 92.4237, elevationM: 2217 },
  { id: 'ar-east-kameng', name: 'East Kameng (Seppa)', state: 'Arunachal Pradesh', latitude: 27.3556, longitude: 93.0333, elevationM: 363 },
  { id: 'ar-pakke-kessang', name: 'Pakke-Kessang (Lemmi)', state: 'Arunachal Pradesh', latitude: 27.12, longitude: 93.22, elevationM: 450 },
  { id: 'ar-lower-subansiri', name: 'Lower Subansiri (Ziro)', state: 'Arunachal Pradesh', latitude: 27.595, longitude: 93.834, elevationM: 1572 },
  { id: 'ar-upper-subansiri', name: 'Upper Subansiri (Daporijo)', state: 'Arunachal Pradesh', latitude: 27.9833, longitude: 94.2167, elevationM: 600 },
  { id: 'ar-kamle', name: 'Kamle (Raga)', state: 'Arunachal Pradesh', latitude: 27.76, longitude: 94.02, elevationM: 1100 },
  { id: 'ar-kurung-kumey', name: 'Kurung Kumey (Koloriang)', state: 'Arunachal Pradesh', latitude: 27.91, longitude: 93.35, elevationM: 1040 },
  { id: 'ar-kra-daadi', name: 'Kra Daadi (Palin)', state: 'Arunachal Pradesh', latitude: 27.71, longitude: 93.61, elevationM: 1080 },
  { id: 'ar-west-siang', name: 'West Siang (Aalo)', state: 'Arunachal Pradesh', latitude: 28.1667, longitude: 94.8, elevationM: 610 },
  { id: 'ar-east-siang', name: 'East Siang (Pasighat)', state: 'Arunachal Pradesh', latitude: 28.0667, longitude: 95.3333, elevationM: 153 },
  { id: 'ar-siang', name: 'Siang (Pangin)', state: 'Arunachal Pradesh', latitude: 28.23, longitude: 94.99, elevationM: 420 },
  { id: 'ar-upper-siang', name: 'Upper Siang (Yingkiong)', state: 'Arunachal Pradesh', latitude: 28.6167, longitude: 94.9167, elevationM: 620 },
  { id: 'ar-lower-siang', name: 'Lower Siang (Likabali)', state: 'Arunachal Pradesh', latitude: 27.65, longitude: 94.67, elevationM: 180 },
  { id: 'ar-lepa-rada', name: 'Lepa Rada (Basar)', state: 'Arunachal Pradesh', latitude: 27.98, longitude: 94.67, elevationM: 660 },
  { id: 'ar-shi-yomi', name: 'Shi Yomi (Tato)', state: 'Arunachal Pradesh', latitude: 28.53, longitude: 94.37, elevationM: 1200 },
  { id: 'ar-dibang-valley', name: 'Dibang Valley (Anini)', state: 'Arunachal Pradesh', latitude: 28.9833, longitude: 95.9, elevationM: 1968 },
  { id: 'ar-lower-dibang', name: 'Lower Dibang Valley (Roing)', state: 'Arunachal Pradesh', latitude: 28.1333, longitude: 95.8333, elevationM: 390 },
  { id: 'ar-lohit', name: 'Lohit (Tezu)', state: 'Arunachal Pradesh', latitude: 27.9167, longitude: 96.1667, elevationM: 210 },
  { id: 'ar-anjaw', name: 'Anjaw (Hawai)', state: 'Arunachal Pradesh', latitude: 27.88, longitude: 96.8, elevationM: 1296 },
  { id: 'ar-namsai', name: 'Namsai', state: 'Arunachal Pradesh', latitude: 27.67, longitude: 95.87, elevationM: 156 },
  { id: 'ar-changlang', name: 'Changlang', state: 'Arunachal Pradesh', latitude: 27.15, longitude: 95.73, elevationM: 580 },
  { id: 'ar-tirap', name: 'Tirap (Khonsa)', state: 'Arunachal Pradesh', latitude: 26.9833, longitude: 95.5, elevationM: 1215 },
  { id: 'ar-longding', name: 'Longding', state: 'Arunachal Pradesh', latitude: 26.85, longitude: 95.27, elevationM: 1100 },
  { id: 'ar-keyi-panyor', name: 'Keyi Panyor (Yachuli)', state: 'Arunachal Pradesh', latitude: 27.48, longitude: 93.75, elevationM: 1120 },

  // --- ASSAM (35 Districts) ---
  { id: 'as-kamrup-metro', name: 'Kamrup Metropolitan (Guwahati)', state: 'Assam', latitude: 26.1445, longitude: 91.7362, elevationM: 55 },
  { id: 'as-kamrup-rural', name: 'Kamrup Rural (Amingaon)', state: 'Assam', latitude: 26.19, longitude: 91.68, elevationM: 54 },
  { id: 'as-dibrugarh', name: 'Dibrugarh', state: 'Assam', latitude: 27.4728, longitude: 94.912, elevationM: 108 },
  { id: 'as-tinsukia', name: 'Tinsukia', state: 'Assam', latitude: 27.5, longitude: 95.3667, elevationM: 116 },
  { id: 'as-jorhat', name: 'Jorhat', state: 'Assam', latitude: 26.75, longitude: 94.2167, elevationM: 116 },
  { id: 'as-golaghat', name: 'Golaghat', state: 'Assam', latitude: 26.52, longitude: 93.97, elevationM: 95 },
  { id: 'as-sivasagar', name: 'Sivasagar', state: 'Assam', latitude: 26.98, longitude: 94.63, elevationM: 95 },
  { id: 'as-charaideo', name: 'Charaideo (Sonari)', state: 'Assam', latitude: 27.02, longitude: 95.03, elevationM: 110 },
  { id: 'as-nagaon', name: 'Nagaon', state: 'Assam', latitude: 26.35, longitude: 92.68, elevationM: 61 },
  { id: 'as-morigaon', name: 'Morigaon', state: 'Assam', latitude: 26.25, longitude: 92.33, elevationM: 56 },
  { id: 'as-sonitpur', name: 'Sonitpur (Tezpur)', state: 'Assam', latitude: 26.63, longitude: 92.8, elevationM: 78 },
  { id: 'as-biswanath', name: 'Biswanath (Chariali)', state: 'Assam', latitude: 26.73, longitude: 93.15, elevationM: 85 },
  { id: 'as-lakhimpur', name: 'Lakhimpur (North Lakhimpur)', state: 'Assam', latitude: 27.23, longitude: 94.1, elevationM: 101 },
  { id: 'as-dhemaji', name: 'Dhemaji', state: 'Assam', latitude: 27.48, longitude: 94.58, elevationM: 104 },
  { id: 'as-cachar', name: 'Cachar (Silchar)', state: 'Assam', latitude: 24.8333, longitude: 92.7789, elevationM: 22 },
  { id: 'as-karimganj', name: 'Karimganj (Sribhumi)', state: 'Assam', latitude: 24.87, longitude: 92.35, elevationM: 23 },
  { id: 'as-hailakandi', name: 'Hailakandi', state: 'Assam', latitude: 24.68, longitude: 92.57, elevationM: 21 },
  { id: 'as-dima-hasao', name: 'Dima Hasao (Haflong)', state: 'Assam', latitude: 25.1833, longitude: 93.0167, elevationM: 680 },
  { id: 'as-karbi-anglong', name: 'Karbi Anglong (Diphu)', state: 'Assam', latitude: 25.84, longitude: 93.43, elevationM: 186 },
  { id: 'as-west-karbi', name: 'West Karbi Anglong (Hamren)', state: 'Assam', latitude: 25.98, longitude: 92.57, elevationM: 320 },
  { id: 'as-barpeta', name: 'Barpeta', state: 'Assam', latitude: 26.32, longitude: 91.0, elevationM: 35 },
  { id: 'as-nalbari', name: 'Nalbari', state: 'Assam', latitude: 26.44, longitude: 91.44, elevationM: 42 },
  { id: 'as-baksa', name: 'Baksa (Musalpur)', state: 'Assam', latitude: 26.58, longitude: 91.4, elevationM: 65 },
  { id: 'as-chirang', name: 'Chirang (Kajalgaon)', state: 'Assam', latitude: 26.54, longitude: 90.54, elevationM: 70 },
  { id: 'as-kokrajhar', name: 'Kokrajhar', state: 'Assam', latitude: 26.4, longitude: 90.27, elevationM: 48 },
  { id: 'as-dhubri', name: 'Dhubri', state: 'Assam', latitude: 26.02, longitude: 89.98, elevationM: 34 },
  { id: 'as-south-salmara', name: 'South Salmara-Mankachar (Hatsingimari)', state: 'Assam', latitude: 25.68, longitude: 89.88, elevationM: 32 },
  { id: 'as-goalpara', name: 'Goalpara', state: 'Assam', latitude: 26.17, longitude: 90.62, elevationM: 35 },
  { id: 'as-bongaigaon', name: 'Bongaigaon', state: 'Assam', latitude: 26.5, longitude: 90.53, elevationM: 54 },
  { id: 'as-darrang', name: 'Darrang (Mangaldai)', state: 'Assam', latitude: 26.44, longitude: 92.03, elevationM: 52 },
  { id: 'as-udalguri', name: 'Udalguri', state: 'Assam', latitude: 26.75, longitude: 92.1, elevationM: 180 },
  { id: 'as-hojai', name: 'Hojai (Sankardev Nagar)', state: 'Assam', latitude: 26.0, longitude: 92.86, elevationM: 59 },
  { id: 'as-tamulpur', name: 'Tamulpur', state: 'Assam', latitude: 26.63, longitude: 91.57, elevationM: 58 },
  { id: 'as-bajali', name: 'Bajali (Pathsala)', state: 'Assam', latitude: 26.49, longitude: 91.18, elevationM: 40 },
  { id: 'as-majuli', name: 'Majuli (Garamur)', state: 'Assam', latitude: 26.96, longitude: 94.22, elevationM: 84 },

  // --- MANIPUR (16 Districts) ---
  { id: 'mn-imphal-west', name: 'Imphal West (Lamphelpat)', state: 'Manipur', latitude: 24.817, longitude: 93.9368, elevationM: 786 },
  { id: 'mn-imphal-east', name: 'Imphal East (Porompat)', state: 'Manipur', latitude: 24.82, longitude: 93.96, elevationM: 790 },
  { id: 'mn-churachandpur', name: 'Churachandpur', state: 'Manipur', latitude: 24.3333, longitude: 93.6667, elevationM: 922 },
  { id: 'mn-senapati', name: 'Senapati', state: 'Manipur', latitude: 25.2667, longitude: 94.0167, elevationM: 1420 },
  { id: 'mn-ukhrul', name: 'Ukhrul', state: 'Manipur', latitude: 25.1167, longitude: 94.3667, elevationM: 1662 },
  { id: 'mn-tamenglong', name: 'Tamenglong', state: 'Manipur', latitude: 24.9833, longitude: 93.4833, elevationM: 1260 },
  { id: 'mn-chandel', name: 'Chandel', state: 'Manipur', latitude: 24.33, longitude: 94.0, elevationM: 800 },
  { id: 'mn-thoubal', name: 'Thoubal', state: 'Manipur', latitude: 24.6333, longitude: 93.9833, elevationM: 775 },
  { id: 'mn-bishnupur', name: 'Bishnupur', state: 'Manipur', latitude: 24.63, longitude: 93.76, elevationM: 770 },
  { id: 'mn-kangpokpi', name: 'Kangpokpi', state: 'Manipur', latitude: 25.15, longitude: 93.97, elevationM: 1250 },
  { id: 'mn-tengnoupal', name: 'Tengnoupal', state: 'Manipur', latitude: 24.38, longitude: 94.15, elevationM: 1300 },
  { id: 'mn-kamjong', name: 'Kamjong', state: 'Manipur', latitude: 24.88, longitude: 94.52, elevationM: 1500 },
  { id: 'mn-noney', name: 'Noney (Longmai)', state: 'Manipur', latitude: 24.83, longitude: 93.6, elevationM: 450 },
  { id: 'mn-pherzawl', name: 'Pherzawl', state: 'Manipur', latitude: 24.27, longitude: 93.2, elevationM: 1100 },
  { id: 'mn-kakching', name: 'Kakching', state: 'Manipur', latitude: 24.48, longitude: 93.98, elevationM: 770 },
  { id: 'mn-jiribam', name: 'Jiribam', state: 'Manipur', latitude: 24.8, longitude: 93.12, elevationM: 30 },

  // --- MIZORAM (11 Districts) ---
  { id: 'mz-aizawl', name: 'Aizawl', state: 'Mizoram', latitude: 23.7271, longitude: 92.7176, elevationM: 1132 },
  { id: 'mz-lunglei', name: 'Lunglei', state: 'Mizoram', latitude: 22.8833, longitude: 92.7333, elevationM: 1222 },
  { id: 'mz-champhai', name: 'Champhai', state: 'Mizoram', latitude: 23.4756, longitude: 93.3283, elevationM: 1678 },
  { id: 'mz-kolasib', name: 'Kolasib', state: 'Mizoram', latitude: 24.23, longitude: 92.68, elevationM: 610 },
  { id: 'mz-serchhip', name: 'Serchhip', state: 'Mizoram', latitude: 23.35, longitude: 92.83, elevationM: 1290 },
  { id: 'mz-mamit', name: 'Mamit', state: 'Mizoram', latitude: 23.93, longitude: 92.49, elevationM: 718 },
  { id: 'mz-lawngtlai', name: 'Lawngtlai', state: 'Mizoram', latitude: 22.53, longitude: 92.89, elevationM: 980 },
  { id: 'mz-saiha', name: 'Siaha', state: 'Mizoram', latitude: 22.49, longitude: 92.98, elevationM: 729 },
  { id: 'mz-hnahthial', name: 'Hnahthial', state: 'Mizoram', latitude: 22.97, longitude: 92.93, elevationM: 1150 },
  { id: 'mz-khawzawl', name: 'Khawzawl', state: 'Mizoram', latitude: 23.53, longitude: 93.18, elevationM: 1250 },
  { id: 'mz-saitual', name: 'Saitual', state: 'Mizoram', latitude: 23.68, longitude: 92.97, elevationM: 1200 },

  // --- NAGALAND (16 Districts) ---
  { id: 'nl-kohima', name: 'Kohima', state: 'Nagaland', latitude: 25.6751, longitude: 94.1086, elevationM: 1444 },
  { id: 'nl-dimapur', name: 'Dimapur', state: 'Nagaland', latitude: 25.9094, longitude: 93.7266, elevationM: 145 },
  { id: 'nl-mokokchung', name: 'Mokokchung', state: 'Nagaland', latitude: 26.3256, longitude: 94.5211, elevationM: 1325 },
  { id: 'nl-tuensang', name: 'Tuensang', state: 'Nagaland', latitude: 26.28, longitude: 94.83, elevationM: 1371 },
  { id: 'nl-wokha', name: 'Wokha', state: 'Nagaland', latitude: 26.1, longitude: 94.27, elevationM: 1313 },
  { id: 'nl-zunheboto', name: 'Zunheboto', state: 'Nagaland', latitude: 25.97, longitude: 94.52, elevationM: 1874 },
  { id: 'nl-phek', name: 'Phek', state: 'Nagaland', latitude: 25.67, longitude: 94.48, elevationM: 1650 },
  { id: 'nl-mon', name: 'Mon', state: 'Nagaland', latitude: 26.75, longitude: 95.05, elevationM: 898 },
  { id: 'nl-peren', name: 'Peren', state: 'Nagaland', latitude: 25.52, longitude: 93.74, elevationM: 1445 },
  { id: 'nl-kiphire', name: 'Kiphire', state: 'Nagaland', latitude: 25.88, longitude: 94.78, elevationM: 896 },
  { id: 'nl-longleng', name: 'Longleng', state: 'Nagaland', latitude: 26.47, longitude: 94.81, elevationM: 1066 },
  { id: 'nl-noklak', name: 'Noklak', state: 'Nagaland', latitude: 26.2, longitude: 95.01, elevationM: 1600 },
  { id: 'nl-shamator', name: 'Shamator', state: 'Nagaland', latitude: 26.05, longitude: 94.92, elevationM: 1400 },
  { id: 'nl-tseminyu', name: 'Tseminyu', state: 'Nagaland', latitude: 25.92, longitude: 94.21, elevationM: 1260 },
  { id: 'nl-chumoukedima', name: 'Chümoukedima', state: 'Nagaland', latitude: 25.82, longitude: 93.77, elevationM: 170 },
  { id: 'nl-niuland', name: 'Niuland', state: 'Nagaland', latitude: 25.96, longitude: 93.88, elevationM: 155 },

  // --- TRIPURA (8 Districts) ---
  { id: 'tr-west-tripura', name: 'West Tripura (Agartala)', state: 'Tripura', latitude: 23.8315, longitude: 91.2868, elevationM: 16 },
  { id: 'tr-south-tripura', name: 'South Tripura (Belonia)', state: 'Tripura', latitude: 23.25, longitude: 91.45, elevationM: 23 },
  { id: 'tr-gomati', name: 'Gomati (Udaipur)', state: 'Tripura', latitude: 23.53, longitude: 91.48, elevationM: 21 },
  { id: 'tr-sepahijala', name: 'Sepahijala (Bishramganj)', state: 'Tripura', latitude: 23.63, longitude: 91.33, elevationM: 15 },
  { id: 'tr-khowai', name: 'Khowai', state: 'Tripura', latitude: 24.06, longitude: 91.6, elevationM: 23 },
  { id: 'tr-north-tripura', name: 'North Tripura (Dharmanagar)', state: 'Tripura', latitude: 24.37, longitude: 92.17, elevationM: 29 },
  { id: 'tr-unakoti', name: 'Unakoti (Kailashahar)', state: 'Tripura', latitude: 24.33, longitude: 92.01, elevationM: 28 },
  { id: 'tr-dhalai', name: 'Dhalai (Ambassa)', state: 'Tripura', latitude: 23.92, longitude: 91.85, elevationM: 52 },
];

// Helper to filter districts by state
export function getDistrictsByState(stateName) {
  if (!stateName || stateName === 'ALL' || stateName === 'All States') {
    return NER_DISTRICTS;
  }
  return NER_DISTRICTS.filter(
    (d) => d.state.toLowerCase() === stateName.toLowerCase()
  );
}

// Find district by ID
export function getDistrictById(districtId) {
  return NER_DISTRICTS.find((d) => d.id === districtId);
}
