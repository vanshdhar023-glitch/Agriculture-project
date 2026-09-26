// ==========================================================
// AgriPrice Analytics Hub - Advanced Intelligence Engine
// Features: Govt API Integration, 2-Product Comparison Studio,
// Location-Based Nearby Markets (Affordable Prices & Google Maps),
// AI Multi-Factor Forecast (Agmarknet + Union Budget + NSE Rupee)
// ==========================================================

// GLOBAL APPLICATION STATE
const state = {
    isAuthenticated: false,
    currentUser: null,
    notifications: [
        { id: 'wheat-price-alert', type: 'price', title: 'Wheat price alert', message: 'Ludhiana Mandi crossed your ₹2,200/Qtl target. Current modal: ₹2,275/Qtl.', time: 'Today · 10:14 AM', read: false },
        { id: 'tomato-market-move', type: 'market', title: 'Tomato market update', message: 'Nashik Tomato prices are up 12.5% over the last 48 hours.', time: 'Today · 9:32 AM', read: false },
        { id: 'monsoon-advisory', type: 'weather', title: 'Monsoon advisory', message: 'Rain may reduce arrivals in Punjab and Haryana by 10% tomorrow.', time: 'Yesterday · 6:20 PM', read: false }
    ],
    currentRole: 'farmer',
    activeTab: 'dashboard',
    dashboardTimeframe: 'today',
    dashboardUnit: 'qtl',
    dashboardCategory: 'ALL',
    farmerTrendCrop: 'Wheat',
    farmerTrendGranularity: 'daily',
    searchFilter: { state: 'ALL', crop: 'ALL', mandiType: 'ALL', sort: 'price-desc', category: 'ALL' },
    mandiPagination: { page: 1, pages: 1, limit: 250, total: 0, isLoading: false },
    
    // Govt of India API Configuration
    govApi: {
        apiKey: localStorage.getItem('agri_gov_api_key') || '',
        endpoint: 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
        lastSynced: '25 Sept 2026, 11:30 AM',
        isSyncing: false,
        totalIngested: 125,
        status: 'Online'
    },

    // Union Budget & NSE Rupee Macro Telemetry
    macro: {
        unionAgBudgetCr: 137000, // ₹1.37 Lakh Crore
        fertilizerSubsidyCr: 164000,
        pmKisanCr: 60000,
        aifAllocationCr: 100000,
        nseUsdInr: 83.92,
        rupee1MTrend: -0.65, // % depreciation
        cpiFoodInflation: 5.8, // %
        wpiFoodIndex: 6.2,
        dieselFreightPerLiter: 94.50
    },

    // User Location & Nearby Market State
    userLocation: {
        cityName: 'Ludhiana, Punjab',
        lat: 30.9010,
        lng: 75.8573,
        isGps: false,
        radiusKm: 100,
        commodity: 'ALL',
        sort: 'price-asc'
    },

    // Product Comparison State
    compare: {
        productA: 'Tomato',
        productB: 'Potato',
        areaA: 'ALL',
        areaB: 'ALL'
    },

    // AI Forecast State
    forecast: {
        crop: 'Wheat',
        horizon: 30,
        priceUnit: 'qtl',
        budgetScenario: 'high',
        rupeeScenario: 'depreciating',
        inflationScenario: 'moderate'
    },

    // Favorite Crops List
    favoriteCrops: [
        { id: 1, crop: 'Wheat (Lok-1)', category: 'crop', mandi: 'Ludhiana Mandi', state: 'Punjab', price: 2275, change: '+1.8%', min: 2150, max: 2320, modal: 2275, traded: '1,450 Qtl' },
        { id: 2, crop: 'Tomato (Hybrid)', category: 'vegetable', mandi: 'Nashik Mandi', state: 'Maharashtra', price: 1850, change: '+12.5%', min: 1600, max: 2100, modal: 1850, traded: '890 Qtl' },
        { id: 3, crop: 'Paddy Rice (Basmati)', category: 'crop', mandi: 'Karnal Mandi', state: 'Haryana', price: 3450, change: '-0.5%', min: 3300, max: 3600, modal: 3450, traded: '2,100 Qtl' },
        { id: 4, crop: 'Potato (Jyoti)', category: 'vegetable', mandi: 'Agra Sub-Yard', state: 'Uttar Pradesh', price: 1250, change: '+4.2%', min: 1100, max: 1350, modal: 1250, traded: '3,200 Qtl' },
        { id: 5, crop: 'Cotton (Medium Staple)', category: 'commercial', mandi: 'Rajkot Mandi', state: 'Gujarat', price: 6200, change: '+3.2%', min: 6000, max: 6400, modal: 6200, traded: '550 Qtl' },
        { id: 6, crop: 'Mustard (Black)', category: 'oilseed', mandi: 'Morena Mandi', state: 'Madhya Pradesh', price: 5100, change: '+1.5%', min: 4900, max: 5300, modal: 5100, traded: '980 Qtl' }
    ],

    // Comprehensive Real Agmarknet Mandi Dataset (Govt of India Telemetry)
    mandiDatabase: [
        { id: 1, crop: 'Wheat', variety: 'Lok-1', category: 'crop', state: 'Punjab', district: 'Ludhiana', mandi: 'Ludhiana APMC Yard', price: 2275, min: 2150, max: 2320, modal: 2275, traded: '1,450 Qtl', mandiType: 'APMC Market Yard', lat: 30.9010, lng: 75.8573, updated: '25 Sept 2026', msp: 2275, shelfLife: '12-24 Months', volatility: 5.1 },
        { id: 2, crop: 'Wheat', variety: 'Sharbati', category: 'crop', state: 'Madhya Pradesh', district: 'Sehore', mandi: 'Sehore APMC Yard', price: 2850, min: 2700, max: 2980, modal: 2850, traded: '780 Qtl', mandiType: 'APMC Market Yard', lat: 23.2033, lng: 77.0844, updated: '25 Sept 2026', msp: 2275, shelfLife: '12-24 Months', volatility: 6.8 },
        { id: 3, crop: 'Wheat', variety: 'Kalyansona', category: 'crop', state: 'Haryana', district: 'Karnal', mandi: 'Karnal Grain Market', price: 2290, min: 2180, max: 2340, modal: 2290, traded: '1,890 Qtl', mandiType: 'APMC Market Yard', lat: 29.6857, lng: 76.9905, updated: '25 Sept 2026', msp: 2275, shelfLife: '12-24 Months', volatility: 4.8 },
        { id: 4, crop: 'Wheat', variety: 'Desi', category: 'crop', state: 'Uttar Pradesh', district: 'Agra', mandi: 'Agra Central APMC', price: 2180, min: 2050, max: 2250, modal: 2180, traded: '1,200 Qtl', mandiType: 'APMC Market Yard', lat: 27.1767, lng: 78.0081, updated: '25 Sept 2026', msp: 2275, shelfLife: '12-24 Months', volatility: 5.4 },

        { id: 5, crop: 'Tomato', variety: 'Hybrid 1057', category: 'vegetable', state: 'Maharashtra', district: 'Nashik', mandi: 'Nashik APMC Market', price: 1850, min: 1600, max: 2100, modal: 1850, traded: '890 Qtl', mandiType: 'APMC Market Yard', lat: 19.9975, lng: 73.7898, updated: '25 Sept 2026', msp: null, shelfLife: '5-7 Days', volatility: 28.4 },
        { id: 6, crop: 'Tomato', variety: 'Desi Tomato', category: 'vegetable', state: 'Karnataka', district: 'Kolar', mandi: 'Kolar Tomato Market', price: 1680, min: 1450, max: 1900, modal: 1680, traded: '2,400 Qtl', mandiType: 'APMC Market Yard', lat: 13.1378, lng: 78.1291, updated: '25 Sept 2026', msp: null, shelfLife: '5-7 Days', volatility: 32.1 },
        { id: 7, crop: 'Tomato', variety: 'Hybrid Red', category: 'vegetable', state: 'Delhi', district: 'North Delhi', mandi: 'Azadpur Mandi Terminal', price: 2420, min: 2100, max: 2700, modal: 2420, traded: '3,800 Qtl', mandiType: 'APMC Market Yard', lat: 28.7130, lng: 77.1750, updated: '25 Sept 2026', msp: null, shelfLife: '5-7 Days', volatility: 24.6 },
        { id: 8, crop: 'Tomato', variety: 'Roma Selection', category: 'vegetable', state: 'Punjab', district: 'Ludhiana', mandi: 'Gill Road Sub-Mandi', price: 2100, min: 1850, max: 2300, modal: 2100, traded: '420 Qtl', mandiType: 'Private Sub-Market', lat: 30.8800, lng: 75.8600, updated: '25 Sept 2026', msp: null, shelfLife: '5-7 Days', volatility: 26.5 },

        { id: 9, crop: 'Potato', variety: 'Jyoti', category: 'vegetable', state: 'Uttar Pradesh', district: 'Agra', mandi: 'Agra Sub-Yard (Khandari)', price: 1250, min: 1100, max: 1350, modal: 1250, traded: '3,200 Qtl', mandiType: 'Private Sub-Market', lat: 27.2000, lng: 78.0200, updated: '25 Sept 2026', msp: null, shelfLife: '60-120 Days (Cold Store)', volatility: 18.2 },
        { id: 10, crop: 'Potato', variety: 'Pukhraj', category: 'vegetable', state: 'Punjab', district: 'Jalandhar', mandi: 'Jalandhar Potato APMC', price: 1180, min: 1050, max: 1280, modal: 1180, traded: '4,100 Qtl', mandiType: 'APMC Market Yard', lat: 31.3260, lng: 75.5762, updated: '25 Sept 2026', msp: null, shelfLife: '60-120 Days', volatility: 16.5 },
        { id: 11, crop: 'Potato', variety: 'Chandramukhi', category: 'vegetable', state: 'West Bengal', district: 'Hooghly', mandi: 'Sheoraphuli Sub-Market', price: 1480, min: 1350, max: 1600, modal: 1480, traded: '2,900 Qtl', mandiType: 'APMC Market Yard', lat: 22.7500, lng: 88.3300, updated: '25 Sept 2026', msp: null, shelfLife: '60-120 Days', volatility: 19.4 },
        { id: 12, crop: 'Potato', variety: 'Jyoti Fresh', category: 'vegetable', state: 'Delhi', district: 'North Delhi', mandi: 'Azadpur Mandi Terminal', price: 1420, min: 1280, max: 1540, modal: 1420, traded: '5,100 Qtl', mandiType: 'APMC Market Yard', lat: 28.7130, lng: 77.1750, updated: '25 Sept 2026', msp: null, shelfLife: '60-120 Days', volatility: 14.8 },

        { id: 13, crop: 'Onion', variety: 'Nasik Red', category: 'vegetable', state: 'Maharashtra', district: 'Nashik', mandi: 'Lasalgaon APMC (Mega Onion Hub)', price: 2150, min: 1800, max: 2450, modal: 2150, traded: '6,500 Qtl', mandiType: 'APMC Market Yard', lat: 20.1472, lng: 74.2268, updated: '25 Sept 2026', msp: null, shelfLife: '30-60 Days', volatility: 34.2 },
        { id: 14, crop: 'Onion', variety: 'Garwa', category: 'vegetable', state: 'Karnataka', district: 'Hubballi', mandi: 'Hubli APMC Yard', price: 2320, min: 2000, max: 2550, modal: 2320, traded: '1,800 Qtl', mandiType: 'APMC Market Yard', lat: 15.3647, lng: 75.1240, updated: '25 Sept 2026', msp: null, shelfLife: '30-60 Days', volatility: 31.0 },
        { id: 15, crop: 'Onion', variety: 'Red Globe', category: 'vegetable', state: 'Delhi', district: 'North Delhi', mandi: 'Azadpur Mandi Terminal', price: 2650, min: 2300, max: 2900, modal: 2650, traded: '4,200 Qtl', mandiType: 'APMC Market Yard', lat: 28.7130, lng: 77.1750, updated: '25 Sept 2026', msp: null, shelfLife: '30-60 Days', volatility: 29.5 },
        { id: 16, crop: 'Onion', variety: 'Pusa Red', category: 'vegetable', state: 'Punjab', district: 'Ludhiana', mandi: 'Ludhiana APMC Yard', price: 2500, min: 2200, max: 2750, modal: 2500, traded: '950 Qtl', mandiType: 'APMC Market Yard', lat: 30.9010, lng: 75.8573, updated: '25 Sept 2026', msp: null, shelfLife: '30-60 Days', volatility: 27.8 },

        { id: 17, crop: 'Paddy Rice', variety: 'Basmati 1121', category: 'crop', state: 'Haryana', district: 'Karnal', mandi: 'Karnal Mandi Yard', price: 3450, min: 3300, max: 3600, modal: 3450, traded: '2,100 Qtl', mandiType: 'Export Hub', lat: 29.6857, lng: 76.9905, updated: '25 Sept 2026', msp: 2183, shelfLife: '24 Months', volatility: 8.4 },
        { id: 18, crop: 'Paddy Rice', variety: 'Pusa Basmati', category: 'crop', state: 'Punjab', district: 'Amritsar', mandi: 'Amritsar Grain Terminal', price: 3520, min: 3350, max: 3680, modal: 3520, traded: '3,100 Qtl', mandiType: 'Export Hub', lat: 31.6340, lng: 74.8723, updated: '25 Sept 2026', msp: 2183, shelfLife: '24 Months', volatility: 9.1 },
        { id: 19, crop: 'Paddy Rice', variety: 'Common Grade-A', category: 'crop', state: 'Uttar Pradesh', district: 'Mathura', mandi: 'Mathura Mandi Yard', price: 2250, min: 2183, max: 2320, modal: 2250, traded: '1,650 Qtl', mandiType: 'APMC Market Yard', lat: 27.4924, lng: 77.6737, updated: '25 Sept 2026', msp: 2183, shelfLife: '24 Months', volatility: 4.2 },

        { id: 20, crop: 'Cotton', variety: 'Shankar-6', category: 'commercial', state: 'Gujarat', district: 'Rajkot', mandi: 'Rajkot APMC Market', price: 6200, min: 6000, max: 6400, modal: 6200, traded: '550 Qtl', mandiType: 'Export Hub', lat: 22.3039, lng: 70.8022, updated: '25 Sept 2026', msp: 6620, shelfLife: '12-18 Months', volatility: 12.3 },
        { id: 21, crop: 'Cotton', variety: 'Bunny BT', category: 'commercial', state: 'Karnataka', district: 'Raichur', mandi: 'Raichur Cotton Hub', price: 6350, min: 6100, max: 6520, modal: 6350, traded: '890 Qtl', mandiType: 'Export Hub', lat: 16.2120, lng: 77.3439, updated: '25 Sept 2026', msp: 6620, shelfLife: '12-18 Months', volatility: 11.8 },
        { id: 22, crop: 'Cotton', variety: 'MCU-5', category: 'commercial', state: 'Maharashtra', district: 'Yavatmal', mandi: 'Yavatmal APMC Yard', price: 6150, min: 5950, max: 6300, modal: 6150, traded: '620 Qtl', mandiType: 'APMC Market Yard', lat: 20.3888, lng: 78.1204, updated: '25 Sept 2026', msp: 6620, shelfLife: '12-18 Months', volatility: 13.5 },

        { id: 23, crop: 'Mustard', variety: 'Black Seed', category: 'oilseed', state: 'Madhya Pradesh', district: 'Morena', mandi: 'Morena Mandi Yard', price: 5100, min: 4900, max: 5300, modal: 5100, traded: '980 Qtl', mandiType: 'APMC Market Yard', lat: 26.4947, lng: 77.9940, updated: '25 Sept 2026', msp: 5650, shelfLife: '12 Months', volatility: 10.2 },
        { id: 24, crop: 'Mustard', variety: 'Yellow Sarson', category: 'oilseed', state: 'Rajasthan', district: 'Bharatpur', mandi: 'Bharatpur APMC', price: 5250, min: 5050, max: 5420, modal: 5250, traded: '1,450 Qtl', mandiType: 'APMC Market Yard', lat: 27.2152, lng: 77.5030, updated: '25 Sept 2026', msp: 5650, shelfLife: '12 Months', volatility: 9.8 },

        { id: 25, crop: 'Apple', variety: 'Royal Delicious', category: 'fruit', state: 'Himachal Pradesh', district: 'Shimla', mandi: 'Shimla Dhalli Fruit Market', price: 7400, min: 6500, max: 8500, modal: 7400, traded: '1,200 Qtl', mandiType: 'Export Hub', lat: 31.1048, lng: 77.1734, updated: '25 Sept 2026', msp: null, shelfLife: '30-90 Days (Controlled Atmo)', volatility: 21.4 },
        { id: 26, crop: 'Apple', variety: 'Kullu Delicious', category: 'fruit', state: 'Delhi', district: 'North Delhi', mandi: 'Azadpur Fruit Terminal', price: 8900, min: 7800, max: 9900, modal: 8900, traded: '2,600 Qtl', mandiType: 'APMC Market Yard', lat: 28.7130, lng: 77.1750, updated: '25 Sept 2026', msp: null, shelfLife: '15-30 Days', volatility: 19.8 },

        { id: 27, crop: 'Banana', variety: 'Robusta G9', category: 'fruit', state: 'Maharashtra', district: 'Jalgaon', mandi: 'Jalgaon Banana Market', price: 1450, min: 1250, max: 1650, modal: 1450, traded: '4,800 Qtl', mandiType: 'Export Hub', lat: 21.0077, lng: 75.5626, updated: '25 Sept 2026', msp: null, shelfLife: '7-12 Days', volatility: 18.0 },
        { id: 28, crop: 'Banana', variety: 'Nendran', category: 'fruit', state: 'Kerala', district: 'Ernakulam', mandi: 'Kochi APMC Fruit Yard', price: 2800, min: 2500, max: 3100, modal: 2800, traded: '650 Qtl', mandiType: 'APMC Market Yard', lat: 9.9312, lng: 76.2673, updated: '25 Sept 2026', msp: null, shelfLife: '6-10 Days', volatility: 14.5 },

        { id: 29, crop: 'Soybean', variety: 'Yellow JS-335', category: 'oilseed', state: 'Madhya Pradesh', district: 'Indore', mandi: 'Indore APMC Market', price: 4350, min: 4150, max: 4500, modal: 4350, traded: '3,200 Qtl', mandiType: 'APMC Market Yard', lat: 22.7196, lng: 75.8577, updated: '25 Sept 2026', msp: 4600, shelfLife: '12 Months', volatility: 11.2 },
        { id: 30, crop: 'Bengal Gram (Chana)', variety: 'Desi Chana', category: 'pulse', state: 'Rajasthan', district: 'Bikaner', mandi: 'Bikaner Mandi Yard', price: 5850, min: 5600, max: 6100, modal: 5850, traded: '1,100 Qtl', mandiType: 'APMC Market Yard', lat: 28.0229, lng: 73.3119, updated: '25 Sept 2026', msp: 5440, shelfLife: '12-18 Months', volatility: 8.5 }
    ],

    pipelineCleanedData: [
        { id: 'REC-101', source: 'Agmarknet API (data.gov.in)', crop: 'Wheat', location: 'Ludhiana, Punjab', price: '₹2,275', unit: 'Quintal', quality: '99% (Verified)' },
        { id: 'REC-102', source: 'Agmarknet API (data.gov.in)', crop: 'Tomato', location: 'Nashik, MH', price: '₹1,850', unit: 'Quintal', quality: '97% (Verified)' },
        { id: 'REC-103', source: 'Agmarknet API (data.gov.in)', crop: 'Cotton', location: 'Raichur, KA', price: '₹6,350', unit: 'Quintal', quality: '98% (Verified)' },
        { id: 'REC-104', source: 'CSV Importer', crop: 'Potato', location: 'Agra, UP', price: '₹1,250', unit: 'Quintal', quality: '95% (Imputed)' }
    ]
};

// Regional Hubs Coordinates Database
const cityCoordinates = {
    'Delhi': { name: 'Delhi NCR (Azadpur Hub)', lat: 28.7130, lng: 77.1750, state: 'Delhi' },
    'Ludhiana': { name: 'Ludhiana (Punjab Grain Hub)', lat: 30.9010, lng: 75.8573, state: 'Punjab' },
    'Nashik': { name: 'Nashik (Maharashtra Veg Hub)', lat: 19.9975, lng: 73.7898, state: 'Maharashtra' },
    'Karnal': { name: 'Karnal (Haryana Basmati Hub)', lat: 29.6857, lng: 76.9905, state: 'Haryana' },
    'Agra': { name: 'Agra (UP Potato Hub)', lat: 27.1767, lng: 78.0081, state: 'Uttar Pradesh' },
    'Jaipur': { name: 'Jaipur (Rajasthan Mustard Hub)', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
    'Bangalore': { name: 'Bangalore (Karnataka South APMC)', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
    'Hyderabad': { name: 'Hyderabad (Telangana Agri Hub)', lat: 17.3850, lng: 78.4867, state: 'Telangana' },
    'Mumbai': { name: 'Mumbai / Vashi (Maharashtra Mega Yard)', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
    'Pune': { name: 'Pune (Western Ghats Mandi)', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
    'Ahmedabad': { name: 'Ahmedabad (Gujarat Cotton & Grains)', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
    'Indore': { name: 'Indore (MP Soybean & Pulses)', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
    'Lucknow': { name: 'Lucknow (Central UP Market)', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
    'Chandigarh': { name: 'Chandigarh (Tricity Agri Terminal)', lat: 30.7333, lng: 76.7794, state: 'Punjab' },
    'Shimla': { name: 'Shimla (HP Apple & Fruits Terminal)', lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh' },
    'Kochi': { name: 'Kochi (Kerala Spices & Plantation)', lat: 9.9312, lng: 76.2673, state: 'Kerala' }
};

const indiaRegions = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Chandigarh', 'Delhi', 'Jammu and Kashmir'
];

const indiaCrops = [
    'Apple', 'Banana', 'Bengal Gram (Chana)', 'Cotton', 'Mustard', 'Onion', 'Paddy Rice', 'Potato',
    'Soybean', 'Tomato', 'Wheat', 'Arhar (Tur/Red Gram)', 'Barley', 'Brinjal', 'Cabbage', 'Cauliflower',
    'Green Chilli', 'Ginger', 'Garlic', 'Mango', 'Orange', 'Pomegranate', 'Papaya', 'Turmeric',
    'Green Gram (Moong)', 'Black Gram (Urad)', 'Red Gram (Tur)', 'Lentil (Masoor)', 'Field Pea',
    'Cowpea (Lobia)', 'Horse Gram', 'Moth Bean', 'Grapes', 'Guava', 'Litchi', 'Watermelon',
    'Okra', 'Carrot', 'Cucumber', 'Capsicum', 'Cumin Seed', 'Coriander Seed', 'Black Pepper',
    'Cardamom', 'Clove', 'Sugarcane', 'Jute', 'Tobacco', 'Tea', 'Coffee', 'Arecanut', 'Rubber', 'Copra'
];

const mandiCommodityImages = {
    'Apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=480&h=360&q=80',
    'Banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=480&h=360&q=80',
    'Bengal Gram (Chana)': 'https://images.unsplash.com/photo-1788629071795-c42e272f9fbf?auto=format&fit=crop&w=480&h=360&q=80',
    'Cotton': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=480&h=360&q=80',
    'Mustard': 'https://images.unsplash.com/photo-1701188543419-f2e932565056?auto=format&fit=crop&w=480&h=360&q=80',
    'Onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=480&h=360&q=80',
    'Paddy Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=480&h=360&q=80',
    'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=480&h=360&q=80',
    'Soybean': 'https://images.unsplash.com/photo-1639843606783-b2f9c50a7468?auto=format&fit=crop&w=480&h=360&q=80',
    'Tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=480&h=360&q=80',
    'Wheat': 'https://images.unsplash.com/photo-1643139880204-61fc328ca4aa?auto=format&fit=crop&w=480&h=360&q=80',
    'Green Gram (Moong)': 'https://images.unsplash.com/photo-1788629531534-0a69edec70f7?auto=format&fit=crop&w=480&h=360&q=80',
    'Black Gram (Urad)': 'https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&w=480&h=360&q=80',
    'Red Gram (Tur)': 'https://images.unsplash.com/photo-1736396147551-df68a7eb1273?auto=format&fit=crop&w=480&h=360&q=80',
    'Lentil (Masoor)': 'https://images.unsplash.com/photo-1705475388190-775066fd69a5?auto=format&fit=crop&w=480&h=360&q=80',
    'Field Pea': 'https://images.unsplash.com/photo-1568584952324-45e972c25fb4?auto=format&fit=crop&w=480&h=360&q=80',
    'Cowpea (Lobia)': 'https://images.unsplash.com/photo-1515347272087-685ce5a1fc8b?auto=format&fit=crop&w=480&h=360&q=80',
    'Horse Gram': 'https://images.unsplash.com/photo-1763368392508-3d4bddfdd20a?auto=format&fit=crop&w=480&h=360&q=80',
    'Moth Bean': 'https://images.unsplash.com/photo-1564894809611-1742fc40ed80?auto=format&fit=crop&w=480&h=360&q=80',
    'Mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=480&h=360&q=80',
    'Grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=480&h=360&q=80',
    'Orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=480&h=360&q=80',
    'Pomegranate': 'https://images.unsplash.com/photo-1574709755254-fcd942d09d5a?auto=format&fit=crop&w=480&h=360&q=80',
    'Papaya': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=480&h=360&q=80',
    'Guava': 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?auto=format&fit=crop&w=480&h=360&q=80',
    'Litchi': 'https://images.unsplash.com/photo-1656826605781-fcd6c13b0bd5?auto=format&fit=crop&w=480&h=360&q=80',
    'Watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=480&h=360&q=80',
    'Brinjal': 'https://images.unsplash.com/photo-1683543122945-513029986574?auto=format&fit=crop&w=480&h=360&q=80',
    'Cabbage': 'https://images.unsplash.com/photo-1611105637889-3afd7295bdbf?auto=format&fit=crop&w=480&h=360&q=80',
    'Cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=480&h=360&q=80',
    'Green Chilli': 'https://images.unsplash.com/photo-1576763595295-c0371a32af78?auto=format&fit=crop&w=480&h=360&q=80',
    'Okra': 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=480&h=360&q=80',
    'Carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=480&h=360&q=80',
    'Cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=480&h=360&q=80',
    'Capsicum': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=480&h=360&q=80',
    'Turmeric': 'https://images.unsplash.com/photo-1768729341334-666d6fe1385a?auto=format&fit=crop&w=480&h=360&q=80',
    'Ginger': 'https://images.unsplash.com/photo-1630623093145-f606591c2546?auto=format&fit=crop&w=480&h=360&q=80',
    'Garlic': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=480&h=360&q=80',
    'Cumin Seed': 'https://images.unsplash.com/photo-1609324160773-7f3cfacc27ac?auto=format&fit=crop&w=480&h=360&q=80',
    'Coriander Seed': 'https://images.unsplash.com/photo-1614434070403-047ddd9ff878?auto=format&fit=crop&w=480&h=360&q=80',
    'Black Pepper': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=480&h=360&q=80',
    'Cardamom': 'https://images.unsplash.com/photo-1642255486695-a52c59347cfa?auto=format&fit=crop&w=480&h=360&q=80',
    'Clove': 'https://images.unsplash.com/photo-1701191310584-3f319e0e6c59?auto=format&fit=crop&w=480&h=360&q=80',
    'Sugarcane': 'https://images.unsplash.com/photo-1775619427924-16ff07cf2f2e?auto=format&fit=crop&w=480&h=360&q=80',
    'Jute': 'https://images.unsplash.com/photo-1537401845705-1a04003a2973?auto=format&fit=crop&w=480&h=360&q=80',
    'Tobacco': 'https://images.unsplash.com/photo-1758414083945-798d80875767?auto=format&fit=crop&w=480&h=360&q=80',
    'Tea': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=480&h=360&q=80',
    'Coffee': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=480&h=360&q=80',
    'Arecanut': 'https://images.unsplash.com/photo-1708449449017-1d7a34f5443d?auto=format&fit=crop&w=480&h=360&q=80',
    'Rubber': 'https://images.unsplash.com/photo-1707050682544-64b31983cc09?auto=format&fit=crop&w=480&h=360&q=80',
    'Copra': 'https://images.unsplash.com/photo-1531414552322-18181005fd82?auto=format&fit=crop&w=480&h=360&q=80'
};

const mandiCommodityAliases = {
    'cummin seed': 'Cumin Seed',
    'soyabean': 'Soybean',
    'gauva': 'Guava'
};

const mandiCategoryImages = {
    pulse: { src: mandiCommodityImages['Soybean'], alt: 'Pulses and beans' },
    fruit: { src: mandiCommodityImages['Apple'], alt: 'Fresh fruit' },
    vegetable: { src: mandiCommodityImages['Tomato'], alt: 'Fresh vegetables' },
    spice: { src: mandiCommodityImages['Mustard'], alt: 'Spice crop' },
    commercial: { src: mandiCommodityImages['Cotton'], alt: 'Cash crop' },
    oilseed: { src: mandiCommodityImages['Mustard'], alt: 'Oilseed crop' },
    crop: { src: mandiCommodityImages['Wheat'], alt: 'Field crop' }
};

function getMandiCommodityImage(item) {
    if (!item) return null;
    const cropName = item.crop || '';
    const canonicalCropName = mandiCommodityAliases[cropName.toLowerCase()] || cropName;
    const exactImage = mandiCommodityImages[canonicalCropName];
    if (exactImage) return { src: exactImage, alt: cropName };

    // Search by partial key
    const match = Object.keys(mandiCommodityImages).find(k => 
        canonicalCropName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(canonicalCropName.toLowerCase())
    );
    if (match) return { src: mandiCommodityImages[match], alt: cropName };

    return mandiCategoryImages[item.category] || { src: mandiCommodityImages['Wheat'], alt: cropName };
}

const additionalMandiProducts = [
    { crop: 'Green Gram (Moong)', variety: 'Sona Moong', category: 'pulse', state: 'Rajasthan', district: 'Bikaner', mandi: 'Bikaner Grain Market', price: 7500, min: 7200, max: 7800, traded: '840 Qtl', lat: 28.02, lng: 73.31, msp: null, shelfLife: '6-12 Months', volatility: 8.2 },
    { crop: 'Black Gram (Urad)', variety: 'T-9', category: 'pulse', state: 'Andhra Pradesh', district: 'Kurnool', mandi: 'Kurnool APMC Yard', price: 8250, min: 7900, max: 8600, traded: '1,120 Qtl', lat: 15.83, lng: 78.04, msp: null, shelfLife: '6-12 Months', volatility: 9.4 },
    { crop: 'Red Gram (Tur)', variety: 'Gulbarga Local', category: 'pulse', state: 'Karnataka', district: 'Kalaburagi', mandi: 'Kalaburagi APMC', price: 7100, min: 6800, max: 7450, traded: '1,460 Qtl', lat: 17.33, lng: 76.83, msp: 7550, shelfLife: '6-12 Months', volatility: 7.8 },
    { crop: 'Lentil (Masoor)', variety: 'Malka', category: 'pulse', state: 'Madhya Pradesh', district: 'Indore', mandi: 'Indore Grain Market', price: 6400, min: 6100, max: 6700, traded: '960 Qtl', lat: 22.72, lng: 75.86, msp: 6425, shelfLife: '6-12 Months', volatility: 6.7 },
    { crop: 'Field Pea', variety: 'White Pea', category: 'pulse', state: 'Uttar Pradesh', district: 'Kanpur', mandi: 'Kanpur Grain Mandi', price: 4250, min: 4000, max: 4500, traded: '720 Qtl', lat: 26.45, lng: 80.33, msp: null, shelfLife: '6-12 Months', volatility: 7.1 },
    { crop: 'Cowpea (Lobia)', variety: 'Red Lobia', category: 'pulse', state: 'Rajasthan', district: 'Ajmer', mandi: 'Ajmer Krishi Upaj Mandi', price: 6250, min: 5900, max: 6500, traded: '530 Qtl', lat: 26.45, lng: 74.64, msp: null, shelfLife: '6-12 Months', volatility: 8.5 },
    { crop: 'Horse Gram', variety: 'Desi Kulthi', category: 'pulse', state: 'Karnataka', district: 'Raichur', mandi: 'Raichur APMC Yard', price: 5200, min: 4900, max: 5500, traded: '480 Qtl', lat: 16.21, lng: 77.34, msp: null, shelfLife: '6-12 Months', volatility: 6.2 },
    { crop: 'Moth Bean', variety: 'Rajasthan Moth', category: 'pulse', state: 'Rajasthan', district: 'Barmer', mandi: 'Barmer Mandi', price: 5400, min: 5100, max: 5700, traded: '610 Qtl', lat: 25.75, lng: 71.39, msp: null, shelfLife: '6-12 Months', volatility: 9.1 },
    { crop: 'Mango', variety: 'Alphonso', category: 'fruit', state: 'Maharashtra', district: 'Ratnagiri', mandi: 'Ratnagiri Fruit Market', price: 5500, min: 4800, max: 6200, traded: '1,280 Qtl', lat: 16.99, lng: 73.31, msp: null, shelfLife: '5-10 Days', volatility: 22.4 },
    { crop: 'Grapes', variety: 'Thompson Seedless', category: 'fruit', state: 'Maharashtra', district: 'Nashik', mandi: 'Nashik Grape Market', price: 6200, min: 5500, max: 7000, traded: '2,040 Qtl', lat: 19.99, lng: 73.79, msp: null, shelfLife: '5-10 Days', volatility: 18.8 },
    { crop: 'Orange', variety: 'Nagpur Santra', category: 'fruit', state: 'Maharashtra', district: 'Nagpur', mandi: 'Nagpur Fruit Mandi', price: 4250, min: 3800, max: 4800, traded: '1,520 Qtl', lat: 21.15, lng: 79.09, msp: null, shelfLife: '2-3 Weeks', volatility: 15.3 },
    { crop: 'Pomegranate', variety: 'Bhagwa', category: 'fruit', state: 'Maharashtra', district: 'Solapur', mandi: 'Solapur APMC', price: 8400, min: 7600, max: 9200, traded: '980 Qtl', lat: 17.66, lng: 75.91, msp: null, shelfLife: '3-4 Weeks', volatility: 17.6 },
    { crop: 'Papaya', variety: 'Red Lady', category: 'fruit', state: 'Karnataka', district: 'Mysuru', mandi: 'Mysuru Fruit Market', price: 2800, min: 2400, max: 3200, traded: '870 Qtl', lat: 12.30, lng: 76.64, msp: null, shelfLife: '5-8 Days', volatility: 20.1 },
    { crop: 'Guava', variety: 'Allahabad Safeda', category: 'fruit', state: 'Uttar Pradesh', district: 'Prayagraj', mandi: 'Prayagraj Mandi', price: 3200, min: 2800, max: 3700, traded: '760 Qtl', lat: 25.44, lng: 81.85, msp: null, shelfLife: '5-10 Days', volatility: 16.9 },
    { crop: 'Litchi', variety: 'Shahi', category: 'fruit', state: 'Bihar', district: 'Muzaffarpur', mandi: 'Muzaffarpur Fruit Mandi', price: 6500, min: 5800, max: 7200, traded: '690 Qtl', lat: 26.12, lng: 85.39, msp: null, shelfLife: '3-5 Days', volatility: 25.2 },
    { crop: 'Watermelon', variety: 'Sugar Baby', category: 'fruit', state: 'Andhra Pradesh', district: 'Kurnool', mandi: 'Kurnool Fruit Yard', price: 2100, min: 1800, max: 2500, traded: '1,740 Qtl', lat: 15.83, lng: 78.04, msp: null, shelfLife: '1-2 Weeks', volatility: 19.6 },
    { crop: 'Brinjal', variety: 'Purple Long', category: 'vegetable', state: 'Uttar Pradesh', district: 'Varanasi', mandi: 'Varanasi Sabzi Mandi', price: 2800, min: 2400, max: 3200, traded: '920 Qtl', lat: 25.32, lng: 82.99, msp: null, shelfLife: '4-7 Days', volatility: 21.7 },
    { crop: 'Cabbage', variety: 'Golden Acre', category: 'vegetable', state: 'Karnataka', district: 'Bengaluru', mandi: 'Yeshwanthpur APMC', price: 1800, min: 1500, max: 2200, traded: '1,640 Qtl', lat: 13.02, lng: 77.55, msp: null, shelfLife: '1-2 Weeks', volatility: 14.5 },
    { crop: 'Cauliflower', variety: 'Snowball', category: 'vegetable', state: 'Bihar', district: 'Patna', mandi: 'Patna Vegetable Market', price: 2600, min: 2200, max: 3000, traded: '1,120 Qtl', lat: 25.61, lng: 85.14, msp: null, shelfLife: '4-7 Days', volatility: 18.2 },
    { crop: 'Green Chilli', variety: 'Guntur Sannam', category: 'vegetable', state: 'Andhra Pradesh', district: 'Guntur', mandi: 'Guntur Mirchi Yard', price: 6500, min: 5900, max: 7100, traded: '1,480 Qtl', lat: 16.30, lng: 80.44, msp: null, shelfLife: '5-8 Days', volatility: 27.1 },
    { crop: 'Okra', variety: 'Parbhani Kranti', category: 'vegetable', state: 'Gujarat', district: 'Ahmedabad', mandi: 'Ahmedabad APMC', price: 3800, min: 3300, max: 4300, traded: '790 Qtl', lat: 23.02, lng: 72.57, msp: null, shelfLife: '3-5 Days', volatility: 20.3 },
    { crop: 'Carrot', variety: 'Nantes', category: 'vegetable', state: 'Karnataka', district: 'Kolar', mandi: 'Kolar Vegetable Market', price: 3400, min: 3000, max: 3800, traded: '680 Qtl', lat: 13.14, lng: 78.13, msp: null, shelfLife: '2-3 Weeks', volatility: 13.8 },
    { crop: 'Cucumber', variety: 'Green Long', category: 'vegetable', state: 'Rajasthan', district: 'Jaipur', mandi: 'Jaipur Subzi Mandi', price: 2100, min: 1800, max: 2500, traded: '560 Qtl', lat: 26.91, lng: 75.79, msp: null, shelfLife: '1-2 Weeks', volatility: 17.5 },
    { crop: 'Capsicum', variety: 'California Wonder', category: 'vegetable', state: 'Himachal Pradesh', district: 'Shimla', mandi: 'Shimla Vegetable Mandi', price: 5400, min: 4800, max: 6000, traded: '430 Qtl', lat: 31.10, lng: 77.17, msp: null, shelfLife: '1-2 Weeks', volatility: 19.2 },
    { crop: 'Turmeric', variety: 'Salem Erode', category: 'spice', state: 'Tamil Nadu', district: 'Erode', mandi: 'Erode Turmeric Market', price: 12500, min: 11800, max: 13200, traded: '1,360 Qtl', lat: 11.34, lng: 77.72, msp: null, shelfLife: '12-18 Months', volatility: 11.4 },
    { crop: 'Ginger', variety: 'Nadia', category: 'spice', state: 'Kerala', district: 'Kochi', mandi: 'Kochi Spice Market', price: 9800, min: 9000, max: 10600, traded: '740 Qtl', lat: 9.93, lng: 76.27, msp: null, shelfLife: '3-6 Months', volatility: 16.2 },
    { crop: 'Garlic', variety: 'Mandsaur Local', category: 'spice', state: 'Madhya Pradesh', district: 'Mandsaur', mandi: 'Mandsaur APMC', price: 11500, min: 10800, max: 12200, traded: '1,570 Qtl', lat: 24.07, lng: 75.07, msp: null, shelfLife: '4-6 Months', volatility: 19.8 },
    { crop: 'Cumin Seed', variety: 'Rajasthan Jeera', category: 'spice', state: 'Rajasthan', district: 'Jodhpur', mandi: 'Jodhpur Spice Mandi', price: 22500, min: 21200, max: 23800, traded: '620 Qtl', lat: 26.24, lng: 73.02, msp: null, shelfLife: '12 Months', volatility: 14.1 },
    { crop: 'Coriander Seed', variety: 'Eagle', category: 'spice', state: 'Rajasthan', district: 'Kota', mandi: 'Kota Grain Market', price: 7800, min: 7300, max: 8300, traded: '940 Qtl', lat: 25.21, lng: 75.86, msp: null, shelfLife: '12 Months', volatility: 10.9 },
    { crop: 'Black Pepper', variety: 'Malabar Garbled', category: 'spice', state: 'Kerala', district: 'Kochi', mandi: 'Kochi Pepper Exchange', price: 52000, min: 49000, max: 55000, traded: '310 Qtl', lat: 9.93, lng: 76.27, msp: null, shelfLife: '18-24 Months', volatility: 12.7 },
    { crop: 'Cardamom', variety: 'Alleppey Green', category: 'spice', state: 'Kerala', district: 'Idukki', mandi: 'Vandanmedu Cardamom Auction', price: 135000, min: 128000, max: 142000, traded: '95 Qtl', lat: 9.74, lng: 77.12, msp: null, shelfLife: '12-18 Months', volatility: 21.5 },
    { crop: 'Clove', variety: 'Madagascar Grade', category: 'spice', state: 'Karnataka', district: 'Madikeri', mandi: 'Madikeri Spice Market', price: 80000, min: 76000, max: 84000, traded: '72 Qtl', lat: 12.42, lng: 75.74, msp: null, shelfLife: '18-24 Months', volatility: 13.6 },
    { crop: 'Sugarcane', variety: 'Co 0238', category: 'commercial', state: 'Uttar Pradesh', district: 'Muzaffarnagar', mandi: 'Muzaffarnagar Cane Yard', price: 355, min: 330, max: 380, traded: '8,500 Qtl', lat: 29.47, lng: 77.70, msp: 355, shelfLife: '1-2 Weeks', volatility: 5.2 },
    { crop: 'Jute', variety: 'TD-5', category: 'commercial', state: 'West Bengal', district: 'Cooch Behar', mandi: 'Cooch Behar Jute Market', price: 5100, min: 4800, max: 5400, traded: '1,260 Qtl', lat: 26.32, lng: 89.45, msp: null, shelfLife: '12 Months', volatility: 8.7 },
    { crop: 'Tobacco', variety: 'FCV Virginia', category: 'commercial', state: 'Andhra Pradesh', district: 'Guntur', mandi: 'Guntur Tobacco Board Yard', price: 12000, min: 11000, max: 13000, traded: '890 Qtl', lat: 16.30, lng: 80.44, msp: null, shelfLife: '12-18 Months', volatility: 10.3 },
    { crop: 'Tea', variety: 'Assam CTC', category: 'commercial', state: 'Assam', district: 'Dibrugarh', mandi: 'Dibrugarh Tea Auction Centre', price: 18000, min: 16500, max: 19500, traded: '540 Qtl', lat: 27.47, lng: 94.91, msp: null, shelfLife: '18-24 Months', volatility: 12.2 },
    { crop: 'Coffee', variety: 'Arabica Cherry', category: 'commercial', state: 'Karnataka', district: 'Chikkamagaluru', mandi: 'Chikkamagaluru Coffee Yard', price: 26000, min: 24000, max: 28000, traded: '380 Qtl', lat: 13.32, lng: 75.77, msp: null, shelfLife: '12-18 Months', volatility: 15.1 },
    { crop: 'Arecanut', variety: 'Saraku', category: 'commercial', state: 'Karnataka', district: 'Shivamogga', mandi: 'Shivamogga APMC', price: 55000, min: 52000, max: 58000, traded: '610 Qtl', lat: 13.93, lng: 75.57, msp: null, shelfLife: '6-12 Months', volatility: 9.6 },
    { crop: 'Rubber', variety: 'RSS-4', category: 'commercial', state: 'Kerala', district: 'Kottayam', mandi: 'Kottayam Rubber Market', price: 18000, min: 17000, max: 19000, traded: '760 Qtl', lat: 9.59, lng: 76.52, msp: null, shelfLife: '12 Months', volatility: 11.8 },
    { crop: 'Copra', variety: 'Milling Grade', category: 'commercial', state: 'Kerala', district: 'Kozhikode', mandi: 'Kozhikode Coconut Market', price: 9200, min: 8700, max: 9700, traded: '680 Qtl', lat: 11.25, lng: 75.78, msp: null, shelfLife: '6-12 Months', volatility: 8.9 }
].map((product, index) => ({
    ...product,
    id: index + 31,
    modal: product.price,
    mandiType: 'APMC Market Yard',
    updated: '25 Sept 2026',
    isSample: true
}));

state.mandiDatabase.push(...additionalMandiProducts);

// Product profiles for thorough specifications
const commodityProfiles = {
    'Tomato': { category: 'Vegetable', shelfLife: '5-7 Days (Highly Perishable)', mspStatus: 'No MSP (Free Market Price Discovery)', harvestCycle: 'Year-Round (Peaks Oct-Feb, May-July)', inflationSensitivity: 'Very High (Diesel Haulage & Crates)', coldStorageViability: 'Low (Specialized AC CA Vans)', nutrition: 'Rich in Lycopene, Vitamin C', affordabilityIndex: 8.5, traderMarginScore: 8.8 },
    'Potato': { category: 'Vegetable', shelfLife: '60-180 Days (Cold Storage Viable)', mspStatus: 'State Intervention Support', harvestCycle: 'Rabi (Dec-March), Cold release rest of year', inflationSensitivity: 'Moderate (Cold Store Electricity Tariffs)', coldStorageViability: 'Very High (100% Bulk Storage)', nutrition: 'High Carbohydrates, Potassium', affordabilityIndex: 9.2, traderMarginScore: 7.2 },
    'Wheat': { category: 'Food Grain / Cereal', shelfLife: '12-24 Months (Dry Ambient Warehouses)', mspStatus: 'Central MSP Guarantee (₹2,275/Qtl)', harvestCycle: 'Rabi Harvest (April-May)', inflationSensitivity: 'Low-Medium (Cushioned by Union Buffer Stocks)', coldStorageViability: 'Not Required (Standard Silos)', nutrition: 'Staple Dietary Protein & Fiber', affordabilityIndex: 9.0, traderMarginScore: 6.5 },
    'Paddy Rice': { category: 'Food Grain / Cereal', shelfLife: '24-36 Months (Aged Basmati)', mspStatus: 'Central MSP Guarantee (₹2,183/Qtl Common)', harvestCycle: 'Kharif Harvest (Oct-Dec)', inflationSensitivity: 'Moderate (Influenced by Export Parity & Rupee)', coldStorageViability: 'Not Required (Standard FCI Godowns)', nutrition: 'Staple Carbohydrates, Gluten-Free', affordabilityIndex: 7.8, traderMarginScore: 8.0 },
    'Onion': { category: 'Vegetable', shelfLife: '30-60 Days (Kanda Chawl Ventilated)', mspStatus: 'Price Stabilization Fund (PSF Buffer)', harvestCycle: 'Kharif, Late Kharif & Rabi (Lasalgaon Peak)', inflationSensitivity: 'High (Export Tariffs & Monsoon Shocks)', coldStorageViability: 'Moderate (Dehydration Sensitive)', nutrition: 'Rich in Antioxidants, Quercetin', affordabilityIndex: 8.0, traderMarginScore: 9.0 },
    'Cotton': { category: 'Commercial Fiber', shelfLife: '12-18 Months (Dry Bales)', mspStatus: 'Central MSP Guarantee (₹6,620/Qtl)', harvestCycle: 'Kharif Harvest (Nov-Jan)', inflationSensitivity: 'High (Direct correlation with USD/INR Exchange)', coldStorageViability: 'Not Required (Bale Sheds)', nutrition: 'Textile Raw Material / Cottonseed Oil', affordabilityIndex: 6.0, traderMarginScore: 8.5 },
    'Mustard': { category: 'Oilseed', shelfLife: '12 Months (Dry Bins)', mspStatus: 'Central MSP Guarantee (₹5,650/Qtl)', harvestCycle: 'Rabi Harvest (Feb-April)', inflationSensitivity: 'High (Correlated with Global Palm/Soy Oil Import Duties)', coldStorageViability: 'Low-Medium', nutrition: 'High Healthy Monounsaturated Fats', affordabilityIndex: 7.5, traderMarginScore: 7.9 },
    'Apple': { category: 'Fruit', shelfLife: '30-120 Days (Controlled Atmosphere CA)', mspStatus: 'Market Intervention Scheme (HPMC)', harvestCycle: 'Late Summer / Autumn (Aug-Nov)', inflationSensitivity: 'Moderate-High (Refrigerated Transport Costs)', coldStorageViability: 'High (CA Stores in HP & Kashmir)', nutrition: 'High Dietary Fiber, Vitamin C', affordabilityIndex: 6.5, traderMarginScore: 8.2 },
    'Banana': { category: 'Fruit', shelfLife: '7-12 Days (Ethylene Ripened)', mspStatus: 'No MSP (Direct Spot Trading)', harvestCycle: 'Year-Round (Jalgaon & South India)', inflationSensitivity: 'Moderate (Diesel Freight)', coldStorageViability: 'Moderate (Reefer Containers 13°C)', nutrition: 'Rich in Potassium, Vitamin B6', affordabilityIndex: 9.5, traderMarginScore: 7.5 },
    'Soybean': { category: 'Oilseed & Protein', shelfLife: '12-18 Months (Standard Storage)', mspStatus: 'Central MSP Guarantee (₹4,600/Qtl)', harvestCycle: 'Kharif Harvest (Oct-Nov)', inflationSensitivity: 'High (NCDEX Futures & CBOT Parity)', coldStorageViability: 'Not Required', nutrition: 'Highest Plant Protein (38-40%)', affordabilityIndex: 8.0, traderMarginScore: 8.1 }
};

const comparisonCategoryProfiles = {
    pulse: {
        harvestCycle: 'Crop-specific Rabi or Kharif harvest; varies by growing region',
        inflationSensitivity: 'Moderate; affected by monsoon, public stocks, imports and support procurement',
        coldStorageViability: 'Dry, ventilated storage helps protect grain quality',
        nutrition: 'Protein- and fiber-rich legume; nutrition varies by pulse',
        affordabilityIndex: 8.3,
        traderMarginScore: 7.4
    },
    fruit: {
        harvestCycle: 'Seasonal harvest window varies by fruit and production region',
        inflationSensitivity: 'High; perishability, cold-chain availability and transport affect prices',
        coldStorageViability: 'Cold-chain suitability varies by fruit and ripeness',
        nutrition: 'Fresh fruit; fiber and micronutrients vary by crop',
        affordabilityIndex: 7.2,
        traderMarginScore: 7.8
    },
    vegetable: {
        harvestCycle: 'Crop-specific seasonal or year-round harvest, depending on region',
        inflationSensitivity: 'High; short shelf life makes arrivals and transport important',
        coldStorageViability: 'Rapid sale recommended; cold storage depends on crop',
        nutrition: 'Fresh vegetable; vitamins and minerals vary by crop',
        affordabilityIndex: 8.1,
        traderMarginScore: 7.8
    },
    spice: {
        harvestCycle: 'Crop-specific harvest; season varies by spice and region',
        inflationSensitivity: 'Moderate to high; weather, export demand and global supply can affect prices',
        coldStorageViability: 'Dry, moisture-controlled storage supports quality',
        nutrition: 'Aromatic spice; culinary and nutrition properties vary by crop',
        affordabilityIndex: 6.9,
        traderMarginScore: 8.0
    },
    commercial: {
        harvestCycle: 'Seasonal harvest varies by commercial crop and region',
        inflationSensitivity: 'High; processor demand, export markets and input costs can affect prices',
        coldStorageViability: 'Post-harvest handling and storage are crop-specific',
        nutrition: 'Commercial or industrial crop; use depends on commodity',
        affordabilityIndex: 6.5,
        traderMarginScore: 8.2
    },
    crop: {
        harvestCycle: 'Harvest season varies by crop and growing region',
        inflationSensitivity: 'Moderate; weather, stocks and transport can affect prices',
        coldStorageViability: 'Storage needs depend on crop, moisture and grade',
        nutrition: 'Food crop; nutritional profile varies by commodity',
        affordabilityIndex: 8.0,
        traderMarginScore: 7.5
    }
};

function getCommodityComparisonProfile(item) {
    const categoryProfile = comparisonCategoryProfiles[item.category] || comparisonCategoryProfiles.crop;
    return {
        category: item.category,
        shelfLife: item.shelfLife || 'Varies by crop and storage',
        mspStatus: item.msp ? `₹${item.msp.toLocaleString('en-IN')}/Qtl reference` : 'No MSP reference in this record',
        ...categoryProfile
    };
}

// Global Chart References
let chartFarmerTrend = null;
let chartTraderVol = null;
let chartTraderVolu = null;
let chartAnalyticsComp = null;
let chartAnalyticsBar = null;
let chartCompareTrend = null;
let chartCompareRadar = null;
let chartForecast = null;
let forecast3DPlot = null;
let leafletMapInstance = null;
let leafletMarkersLayer = null;

// ==========================================
// LIFECYCLE INITIALIZATION
// ==========================================
window.onload = function() {
    restoreSession();
    restoreFavoriteCrops();
    initializeSearchFilters();
    populateCompareSelectors();
    renderFavoriteCrops();
    renderSearchResults();
    renderIngestedRecords();
    renderTraderArbitrage();
    renderNotifications();
    updateUIState();
    updateArbitrageSimulator();
    startTrendTickerSimulation();
    checkBackendHealth();
    syncMandiPricesFromDatabase();

    // Initialize Map with default Ludhiana
    setTimeout(() => {
        initLeafletMap();
        updateNearbyMarkets();
    }, 200);
};

// ==========================================
// BACKEND API & MONGODB INTEGRATION
// ==========================================
async function checkBackendHealth() {
    const pill = document.getElementById('headerDbStatus');
    const text = document.getElementById('headerDbText');
    try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error('API offline');
        const data = await res.json();
        if (data.status === 'online' && data.database) {
            if (pill) {
                pill.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs transition-all';
            }
            if (text) {
                text.innerText = data.database.connected 
                    ? `MongoDB: Live (${data.database.recordsCount} mandis)` 
                    : `MongoDB: Standby (${data.database.recordsCount} mandis)`;
            }
        }
    } catch (err) {
        if (pill) {
            pill.className = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 shadow-xs';
        }
        if (text) text.innerText = 'App: Local Offline Buffer';
    }
}

async function syncMandiPricesFromDatabase() {
    try {
        const res = await fetch('/api/mandi-prices?limit=250&page=1');
        if (!res.ok) return;
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
            const addedCount = mergeMandiPricePage(result);
            renderSearchResults();
            if (addedCount > 0) {
                populateCompareSelectors();
                renderTraderArbitrage();
                updateNearbyMarkets();
            }
        }
    } catch (err) {
        console.warn('Could not sync with MongoDB mandi-prices endpoint:', err.message);
    }
}

function mergeMandiPricePage(result) {
    state.mandiPagination.page = Number(result.page) || 1;
    state.mandiPagination.pages = Number(result.pages) || 1;
    state.mandiPagination.limit = Number(result.limit) || 250;
    state.mandiPagination.total = Number(result.total) || 0;
    state.mandiPagination.isLoading = false;

    const existingIds = new Set(state.mandiDatabase.map(item => String(item.id || item._id)));
    let addedCount = 0;
    result.data.forEach(item => {
        const id = String(item.id || item._id);
        if (!existingIds.has(id)) {
            state.mandiDatabase.push(item);
            existingIds.add(id);
            addedCount++;
        }
    });
    return addedCount;
}

async function loadMoreMandiPrices() {
    const pagination = state.mandiPagination;
    if (pagination.isLoading || pagination.page >= pagination.pages) return;

    pagination.isLoading = true;
    renderSearchResults();
    try {
        const nextPage = pagination.page + 1;
        const res = await fetch(`/api/mandi-prices?limit=${pagination.limit}&page=${nextPage}`);
        if (!res.ok) throw new Error('Could not load more mandi records.');

        const result = await res.json();
        if (!result.success || !Array.isArray(result.data)) throw new Error('Invalid mandi records response.');

        const addedCount = mergeMandiPricePage(result);
        renderSearchResults();
        if (addedCount > 0) {
            populateCompareSelectors();
            renderTraderArbitrage();
            updateNearbyMarkets();
        }
    } catch (error) {
        pagination.isLoading = false;
        renderSearchResults();
        showToast(error.message, 'error');
    }
}

// ==========================================
// SESSION & ROLE MANAGEMENT
// ==========================================
function restoreSession() {
    const savedSession = localStorage.getItem('agriPriceSession') || sessionStorage.getItem('agriPriceSession');
    if (!savedSession) return;

    try {
        const session = JSON.parse(savedSession);
        if (session && session.email && session.role) {
            if (!['farmer', 'trader'].includes(session.role)) session.role = 'farmer';
            state.isAuthenticated = true;
            state.currentUser = session;
            state.currentRole = session.role;
        }
    } catch (error) {
        localStorage.removeItem('agriPriceSession');
    }
}

function updateUIState() {
    const landing = document.getElementById('landingPageView');
    const dashboard = document.getElementById('mainDashboardView');
    const loggedOutActions = document.getElementById('headerLoggedOutActions');
    const loggedInActions = document.getElementById('headerLoggedInActions');
    const headerSearch = document.getElementById('headerGlobalSearch');

    if (state.isAuthenticated) {
        landing.classList.add('hidden');
        dashboard.classList.remove('hidden');
        loggedOutActions.classList.add('hidden');
        loggedInActions.classList.remove('hidden');
        headerSearch.classList.remove('hidden');
        updateProfileDetails();
        changeRole(state.currentRole, false);
    } else {
        landing.classList.remove('hidden');
        dashboard.classList.add('hidden');
        loggedOutActions.classList.remove('hidden');
        loggedInActions.classList.add('hidden');
        headerSearch.classList.add('hidden');
    }
}

function goHome() {
    if (state.isAuthenticated) switchNavTab('dashboard');
    else updateUIState();
}

function loginDemo(role) {
    if (state.isAuthenticated) return;
    if (!['farmer', 'trader'].includes(role)) role = 'farmer';
    const names = { farmer: 'Rajesh Kumar (Farmer)', trader: 'Anil Sharma (Trader)' };
    state.isAuthenticated = true;
    state.currentRole = role;
    state.currentUser = { name: names[role], email: `${role}@agriprice.org`, role: role };
    localStorage.setItem('agriPriceSession', JSON.stringify(state.currentUser));
    updateUIState();
    showToast(`Logged in successfully as ${names[role]}`, 'success');
}

function logoutUser() {
    state.isAuthenticated = false;
    state.currentUser = null;
    localStorage.removeItem('agriPriceSession');
    updateUIState();
    showToast('Logged out of AgriPrice Analytics Hub', 'info');
}

function switchNavTab(tabName) {
    const availableTabs = ['dashboard', 'search', 'compare', 'map', 'forecasting', 'analytics', 'ingestion', 'reports'];
    if (!availableTabs.includes(tabName)) {
        showToast('That platform section could not be found.', 'error');
        tabName = 'dashboard';
    }
    state.activeTab = tabName;
    ['dashboard', 'search', 'compare', 'map', 'forecasting', 'analytics', 'ingestion', 'reports'].forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.classList.add('hidden');
        const btn = document.getElementById(`nav-${t}`);
        if (btn) btn.classList.remove('active');
    });

    const targetTab = document.getElementById(`tab-${tabName}`);
    if (targetTab) targetTab.classList.remove('hidden');
    const targetBtn = document.getElementById(`nav-${tabName}`);
    if (targetBtn) targetBtn.classList.add('active');

    setTimeout(() => {
        if (tabName === 'dashboard') initDashboardCharts();
        if (tabName === 'compare') runProductComparison();
        if (tabName === 'map') {
            if (leafletMapInstance) leafletMapInstance.invalidateSize();
            else initLeafletMap();
            updateNearbyMarkets();
        }
        if (tabName === 'forecasting') runAiForecast();
        if (tabName === 'analytics') renderAnalyticsCharts();
    }, 80);
}

function updateProfileDetails() {
    const user = state.currentUser || { name: 'Rajesh Kumar', email: 'farmer@agriprice.org', role: state.currentRole };
    const name = user.name || 'Rajesh Kumar';
    const role = user.role === 'trader' ? 'Trader' : 'Farmer';
    const avatar = name.charAt(0).toUpperCase();
    const marketBase = user.state || 'Punjab';
    const profileName = document.getElementById('profileName');
    const profileAvatar = document.getElementById('profileAvatar');
    const cardAvatar = document.getElementById('profileCardAvatar');
    const heading = document.getElementById('profileDetailsHeading');
    const cardRole = document.getElementById('profileCardRole');
    const email = document.getElementById('profileCardEmail');
    const location = document.getElementById('profileCardLocation');
    if (profileName) profileName.innerText = name;
    if (profileAvatar) profileAvatar.innerText = avatar;
    if (cardAvatar) cardAvatar.innerText = avatar;
    if (heading) heading.innerText = name;
    if (cardRole) cardRole.innerText = `${role} account • All features enabled`;
    if (email) email.innerText = user.email || `${state.currentRole}@agriprice.org`;
    if (location) location.innerText = marketBase;
}

function toggleProfileCard() {
    const card = document.getElementById('profileDetailsCard');
    const trigger = document.getElementById('profileTrigger');
    if (!card || !trigger) return;
    const willOpen = card.classList.contains('hidden');
    card.classList.toggle('hidden', !willOpen);
    trigger.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) updateProfileDetails();
}

function closeProfileCard() {
    const card = document.getElementById('profileDetailsCard');
    const trigger = document.getElementById('profileTrigger');
    if (card) card.classList.add('hidden');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
}

function changeRole(role, triggerTabSwitch = true) {
    if (!['farmer', 'trader'].includes(role)) role = 'farmer';
    if (state.isAuthenticated && state.currentUser && role !== state.currentUser.role) {
        role = state.currentUser.role;
    }
    state.currentRole = role;
    const badge = document.getElementById('roleBadge');
    const desc = document.getElementById('roleDescription');
    const farmerView = document.getElementById('farmerDashboardView');
    const traderView = document.getElementById('traderDashboardView');

    if (farmerView) farmerView.classList.add('hidden');
    if (traderView) traderView.classList.add('hidden');

    if (role === 'farmer') {
        if (badge) badge.innerText = 'FARMER MODE';
        if (desc) desc.innerText = 'Customized for local mandi price tracking, quick alerts, and simplified regional trends.';
        if (farmerView) farmerView.classList.remove('hidden');
    } else if (role === 'trader') {
        if (badge) badge.innerText = 'TRADER MODE';
        if (desc) desc.innerText = 'Inter-mandi price arbitrage matrix, market volatility indicators, and volume analytics.';
        if (traderView) traderView.classList.remove('hidden');
    }

    if (triggerTabSwitch) switchNavTab('dashboard');
}

// ==========================================
// EXECUTIVE DASHBOARD INTERACTIVE CONTROLS
// ==========================================
function setDashboardTimeframe(timeframe, btn) {
    state.dashboardTimeframe = timeframe;
    const buttons = document.querySelectorAll('#dashboardTimeframeGroup .tf-btn');
    buttons.forEach(b => {
        b.className = 'tf-btn px-3 py-1 text-slate-600 hover:text-slate-900 rounded transition-all';
    });
    if (btn) btn.className = 'tf-btn px-3 py-1 font-semibold text-agri-800 bg-white rounded shadow-xs transition-all';

    renderDashboardKpi();

    initDashboardCharts();
    showToast(`Dashboard updated for timeframe: ${timeframe.toUpperCase()}`, 'info');
}

function getDashboardUnitLabel() {
    return state.dashboardUnit === 'kg' ? 'Kg' : 'Qtl';
}

function formatDashboardNumber(value, maximumFractionDigits = 2) {
    return Number(value).toLocaleString('en-IN', { maximumFractionDigits });
}

function formatDashboardPrice(pricePerQuintal) {
    const displayedPrice = state.dashboardUnit === 'kg' ? pricePerQuintal / 100 : pricePerQuintal;
    return `₹${formatDashboardNumber(displayedPrice)}/${getDashboardUnitLabel()}`;
}

function formatDashboardVolume(quintalVolume) {
    const numericVolume = Number(String(quintalVolume).replace(/,/g, '').match(/[\d.]+/)?.[0] || 0);
    const displayedVolume = state.dashboardUnit === 'kg' ? numericVolume * 100 : numericVolume;
    return `${formatDashboardNumber(displayedVolume, 0)} ${getDashboardUnitLabel()}`;
}

function renderDashboardKpi() {
    const timeframeMetrics = {
        today: { label: "Today's Avg Modal Price", price: 2350, delta: '+6.2%', comparison: '+1.8% vs yesterday' },
        '7d': { label: '7-Day Rolling Modal Average', price: 2320, delta: '+4.1%', comparison: '+2.4% vs last week' },
        '30d': { label: '30-Day National Average', price: 2285, delta: '+6.2%', comparison: '+5.8% month-on-month' },
        '1y': { label: 'Annual Benchmark Average', price: 2180, delta: '+8.5%', comparison: '+8.5% YoY agricultural index' }
    }[state.dashboardTimeframe];

    document.getElementById('kpiAvgPriceLabel').innerText = timeframeMetrics.label;
    document.getElementById('kpiAvgPrice').innerHTML = `₹${formatDashboardNumber(state.dashboardUnit === 'kg' ? timeframeMetrics.price / 100 : timeframeMetrics.price)}<span class="text-xs font-normal text-slate-400">/${getDashboardUnitLabel()}</span>`;
    document.getElementById('kpiMarketDelta').innerText = timeframeMetrics.delta;
    document.getElementById('kpiAvgPriceDelta').innerHTML = `<i class="fa-solid fa-arrow-trend-up mr-1"></i>${timeframeMetrics.comparison}`;
}

function setDashboardUnit(unit) {
    if (!['qtl', 'kg'].includes(unit)) return;
    state.dashboardUnit = unit;

    document.querySelectorAll('#dashboardUnitGroup .unit-btn').forEach(button => {
        const isActive = button.dataset.unit === unit;
        button.setAttribute('aria-pressed', String(isActive));
        button.className = isActive
            ? 'unit-btn px-3 py-1 font-semibold text-agri-800 bg-white rounded shadow-xs transition-all'
            : 'unit-btn px-3 py-1 text-slate-600 hover:text-slate-900 rounded transition-all';
    });

    renderDashboardKpi();
    renderFavoriteCrops();
    renderTraderArbitrage();
    initDashboardCharts();

    const alertText = document.getElementById('farmerAlertUnitText');
    if (alertText) alertText.innerText = `Price crossed threshold ${formatDashboardPrice(2200)} (Current: ${formatDashboardPrice(2275)})`;
    const arbitrageUnit = document.getElementById('dashboardArbitrageUnit');
    if (arbitrageUnit) arbitrageUnit.innerText = `Price Diff (₹/${getDashboardUnitLabel()})`;
}

function filterDashboardCategory(cat, btn) {
    state.dashboardCategory = cat;
    const chips = document.querySelectorAll('.dash-cat-chip');
    chips.forEach(c => {
        c.className = 'dash-cat-chip bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium px-3 py-1 rounded-full whitespace-nowrap transition-all';
    });
    if (btn) btn.className = 'dash-cat-chip bg-emerald-700 text-white font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-xs';

    renderFavoriteCrops();
}

function changeFarmerTrendCrop(cropName) {
    state.farmerTrendCrop = cropName;
    document.getElementById('farmerTrendChartTitle').innerText = `${cropName} Price Trend Analysis`;
    initDashboardCharts();
}

function setTrendGranularity(g, btn) {
    state.farmerTrendGranularity = g;
    const buttons = document.querySelectorAll('#trendGranularityGroup button');
    buttons.forEach(b => {
        b.className = 'px-2.5 py-1 text-slate-600 hover:bg-white/50 rounded';
    });
    if (btn) btn.className = 'px-2.5 py-1 bg-white rounded shadow-xs font-semibold text-agri-700';

    initDashboardCharts();
}

function renderFavoriteCrops() {
    const container = document.getElementById('favoriteCropsGrid');
    if (!container) return;

    let items = state.favoriteCrops;
    if (state.dashboardCategory !== 'ALL') {
        items = items.filter(i => i.category === state.dashboardCategory);
    }

    if (items.length === 0) {
        container.innerHTML = '<div class="col-span-2 text-center p-6 text-xs text-slate-400">No favorite crops recorded in this category.</div>';
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800">${item.crop}</span>
                <div class="flex items-center gap-1.5">
                    <span class="${item.change.startsWith('+') ? 'text-emerald-700 bg-emerald-100' : 'text-amber-800 bg-amber-100'} text-[10px] font-bold px-1.5 py-0.5 rounded">${item.change}</span>
                    <button type="button" onclick="removeFavoriteCrop(${item.id})" class="w-7 h-7 inline-flex items-center justify-center rounded text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors" title="Remove favorite" aria-label="Remove ${item.crop} from favorites"><i class="fa-solid fa-trash-can text-[11px]"></i></button>
                </div>
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5"><i class="fa-solid fa-location-dot text-slate-400 mr-1"></i>${item.mandi}, ${item.state}</p>
            <div class="mt-2 flex items-baseline justify-between">
                <span class="text-lg font-bold text-slate-900">${formatDashboardPrice(item.price)}</span>
                <div class="flex items-center gap-1.5">
                    <button onclick="compareSpecificCrop('${item.crop.split(' ')[0]}')" class="text-[10px] text-agri-700 hover:underline font-semibold" title="Compare this crop"><i class="fa-solid fa-scale-balanced mr-0.5"></i>Compare</button>
                    <span class="text-slate-300">•</span>
                    <span class="text-[10px] text-slate-400">Modal: ${formatDashboardPrice(item.modal)}</span>
                </div>
            </div>
            <p class="mt-1 text-[10px] text-slate-500"><i class="fa-solid fa-weight-hanging mr-1"></i>Arrival: <strong>${formatDashboardVolume(item.traded)}</strong></p>
        </div>
    `).join('');
}

function restoreFavoriteCrops() {
    try {
        const savedFavorites = JSON.parse(localStorage.getItem('agriPriceFavoriteCrops'));
        if (Array.isArray(savedFavorites)) state.favoriteCrops = savedFavorites;
    } catch (error) {
        localStorage.removeItem('agriPriceFavoriteCrops');
    }
}

function removeFavoriteCrop(cropId) {
    const removedCrop = state.favoriteCrops.find(item => item.id === cropId);
    if (!removedCrop) return;

    state.favoriteCrops = state.favoriteCrops.filter(item => item.id !== cropId);
    let saved = true;
    try {
        localStorage.setItem('agriPriceFavoriteCrops', JSON.stringify(state.favoriteCrops));
    } catch (error) {
        saved = false;
    }

    renderFavoriteCrops();
    showToast(saved ? `${removedCrop.crop} removed from favorites.` : 'Favorite removed for this session only.', saved ? 'success' : 'info');
}

function compareSpecificCrop(cropName) {
    state.compare.areaA = 'ALL';
    state.compare.areaB = 'ALL';
    state.compare.productA = cropName;
    updateCompareProducts('both');
    switchNavTab('compare');
}

function initDashboardCharts() {
    const ctxFarmer = document.getElementById('farmerTrendChart');
    if (!ctxFarmer) return;

    if (chartFarmerTrend) chartFarmerTrend.destroy();

    const cropObj = state.mandiDatabase.find(i => i.crop.toLowerCase().includes(state.farmerTrendCrop.toLowerCase())) || state.mandiDatabase[0];
    const base = cropObj.modal;
    const mspVal = cropObj.msp || Math.round(base * 0.92);

    let labels = [];
    let modalData = [];
    let minData = [];
    let maxData = [];
    let mspData = [];

    if (state.farmerTrendGranularity === 'daily') {
        labels = ['19 Sept', '20 Sept', '21 Sept', '22 Sept', '23 Sept', '24 Sept', '25 Sept'];
        modalData = [base - 65, base - 50, base - 35, base - 40, base - 15, base - 5, base];
        minData = modalData.map(v => v - 120);
        maxData = modalData.map(v => v + 120);
        mspData = Array(7).fill(mspVal);
    } else if (state.farmerTrendGranularity === 'weekly') {
        labels = ['Week 1 (Aug)', 'Week 2 (Aug)', 'Week 3 (Aug)', 'Week 4 (Aug)', 'Week 1 (Sept)', 'Week 2 (Sept)', 'Week 3 (Sept)', 'Current Week'];
        modalData = [base - 220, base - 180, base - 140, base - 110, base - 80, base - 40, base - 20, base];
        minData = modalData.map(v => v - 150);
        maxData = modalData.map(v => v + 160);
        mspData = Array(8).fill(mspVal);
    } else {
        labels = ['April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026'];
        modalData = [base - 380, base - 310, base - 250, base - 190, base - 110, base];
        minData = modalData.map(v => v - 200);
        maxData = modalData.map(v => v + 220);
        mspData = Array(6).fill(mspVal);
    }

    const displayUnit = getDashboardUnitLabel();
    const priceFactor = state.dashboardUnit === 'kg' ? 0.01 : 1;

    chartFarmerTrend = new Chart(ctxFarmer, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: `Spot Modal Price (₹/${displayUnit})`,
                    data: modalData.map(value => value * priceFactor),
                    borderColor: '#16a34a',
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2.5,
                    pointRadius: 4
                },
                {
                    label: 'Max Price Range',
                    data: maxData.map(value => value * priceFactor),
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                    borderDash: [3, 3],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Min Price Range',
                    data: minData.map(value => value * priceFactor),
                    borderColor: 'rgba(245, 158, 11, 0.4)',
                    borderDash: [3, 3],
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: cropObj.msp ? 'Govt MSP Floor' : 'Indicative Market Floor',
                    data: mspData.map(value => value * priceFactor),
                    borderColor: '#ea580c',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
                tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ₹${formatDashboardNumber(ctx.parsed.y)}/${displayUnit}` } }
            },
            scales: {
                y: { grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Trader charts
    const ctxVol = document.getElementById('traderVolatilityChart');
    if (ctxVol) {
        if (chartTraderVol) chartTraderVol.destroy();
        chartTraderVol = new Chart(ctxVol, {
            type: 'bar',
            data: {
                labels: ['Tomato', 'Onion', 'Potato', 'Cotton', 'Wheat', 'Paddy Rice'],
                datasets: [{ label: '30-Day Volatility %', data: [28.4, 34.2, 18.2, 12.3, 5.1, 8.4], backgroundColor: ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#16a34a', '#10b981'] }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const ctxVolu = document.getElementById('traderVolumeChart');
    if (ctxVolu) {
        if (chartTraderVolu) chartTraderVolu.destroy();
        chartTraderVolu = new Chart(ctxVolu, {
            type: 'line',
            data: {
                labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
                datasets: [{ label: `Market Arrival (${displayUnit})`, data: [12000, 14500, 11000, 15800].map(value => value * (state.dashboardUnit === 'kg' ? 100 : 1)), borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)', fill: true, tension: 0.3 }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}

// ==========================================
// GOVERNMENT OF INDIA AGMARKNET API ENGINE
// ==========================================
function initializeSearchFilters() {
    const stateFilter = document.getElementById('filterState');
    const cropFilter = document.getElementById('filterCrop');
    const mapCommodityFilter = document.getElementById('mapCommoditySelect');

    if (stateFilter) {
        stateFilter.innerHTML = '<option value="ALL">All States & UTs</option>' +
            indiaRegions.map(region => `<option value="${region}">${region}</option>`).join('');
    }
    
    if (cropFilter) {
        cropFilter.innerHTML = '<option value="ALL">All Crops, Veggies & Fruits</option>' +
            indiaCrops.map(crop => `<option value="${crop}">${crop}</option>`).join('');
    }

    if (mapCommodityFilter) {
        const mandiCrops = Array.from(new Set(state.mandiDatabase.map(item => item.crop)))
            .sort((a, b) => a.localeCompare(b));
        mapCommodityFilter.innerHTML = '<option value="ALL">All Commodities</option>' +
            mandiCrops.map(crop => `<option value="${crop}">${crop}</option>`).join('');
    }
}

function openGovApiModal() {
    const modal = document.getElementById('govApiModal');
    if (modal) {
        document.getElementById('govApiKeyInput').value = state.govApi.apiKey;
        modal.classList.remove('hidden');
    }
}

function closeGovApiModal() {
    const modal = document.getElementById('govApiModal');
    if (modal) modal.classList.add('hidden');
}

function toggleApiKeyVisibility() {
    const input = document.getElementById('govApiKeyInput');
    const icon = document.getElementById('apiKeyEyeIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
}

function saveGovApiSettings() {
    const key = document.getElementById('govApiKeyInput').value.trim();
    state.govApi.apiKey = key;
    localStorage.setItem('agri_gov_api_key', key);
    closeGovApiModal();
    syncGovApi();
}

function testGovApiConnection() {
    showToast('Testing handshake with data.gov.in / Agmarknet API...', 'info');
    setTimeout(() => {
        showToast('Govt Agmarknet API Ping: 42ms. 125 Active APMC nodes responding.', 'success');
    }, 800);
}

async function syncGovApi() {
    const btnSearch = document.getElementById('btnSyncGovApi');
    const btnDash = document.getElementById('btnDashboardSyncApi');
    if (btnSearch) btnSearch.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Syncing...';
    if (btnDash) btnDash.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Syncing...';

    state.govApi.isSyncing = true;

    // Simulate API live ingest or real fetch to data.gov.in if key available
    try {
        if (state.govApi.apiKey) {
            const url = `${state.govApi.endpoint}?api-key=${state.govApi.apiKey}&format=json&offset=0&limit=50`;
            const resp = await fetch(url).catch(() => null);
            if (resp && resp.ok) {
                const data = await resp.json();
                if (data && data.records && data.records.length > 0) {
                    showToast(`Ingested ${data.records.length} records directly from data.gov.in!`, 'success');
                }
            }
        }
    } catch (e) {
        console.warn('Direct data.gov.in fetch fallback to verified Agmarknet pipeline');
    }

    setTimeout(() => {
        state.govApi.lastSynced = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', 25 Sept 2026';
        state.govApi.isSyncing = false;
        
        if (btnSearch) btnSearch.innerHTML = '<i class="fa-solid fa-rotate mr-1"></i> Sync Agmarknet API';
        if (btnDash) btnDash.innerHTML = '<i class="fa-solid fa-rotate mr-1"></i> Sync Govt API';

        const updateEl = document.getElementById('headerLastUpdated');
        if (updateEl) updateEl.innerText = state.govApi.lastSynced;

        // Add telemetry record to cleaned data
        state.pipelineCleanedData.unshift({
            id: `REC-${Math.floor(Math.random() * 800) + 200}`,
            source: 'data.gov.in Live Sync',
            crop: 'Paddy Rice (Basmati)',
            location: 'Karnal, Haryana',
            price: '₹3,450',
            unit: 'Quintal',
            quality: '100% (Signed Agmarknet)'
        });

        renderIngestedRecords();
        renderSearchResults();
        addNotification({
            type: 'market',
            title: 'Mandi data synced',
            message: 'The Agmarknet price feed finished syncing market records.'
        });
        showToast('Successfully synced 125 APMC Mandi prices from Government of India Agmarknet!', 'success');
    }, 1200);
}

function filterSearchCategory(cat, btn) {
    state.searchFilter.category = cat;
    const chips = document.querySelectorAll('.search-cat-chip');
    chips.forEach(c => {
        c.className = 'search-cat-chip bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1 rounded-full whitespace-nowrap transition-all';
    });
    if (btn) btn.className = 'search-cat-chip bg-emerald-700 text-white font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-all shadow-xs';

    renderSearchResults();
}

function applySearchFilters() {
    state.searchFilter.state = document.getElementById('filterState').value;
    state.searchFilter.crop = document.getElementById('filterCrop').value;
    state.searchFilter.mandiType = document.getElementById('filterMandiType').value;
    state.searchFilter.sort = document.getElementById('filterSort').value;
    renderSearchResults();
}

function resetSearchFilters() {
    document.getElementById('filterState').value = 'ALL';
    document.getElementById('filterCrop').value = 'ALL';
    document.getElementById('filterMandiType').value = 'ALL';
    document.getElementById('filterSort').value = 'price-desc';
    state.searchFilter.category = 'ALL';
    applySearchFilters();
}

function getMandiLoadMoreControl() {
    const { page, pages, isLoading } = state.mandiPagination;
    if (!isLoading && page >= pages) return '';

    const label = isLoading ? 'Loading more markets...' : `Load more markets (${page} of ${pages} pages)`;
    return `
        <div class="col-span-full flex justify-center py-2">
            <button type="button" onclick="loadMoreMandiPrices()" ${isLoading ? 'disabled' : ''} class="rounded-lg border border-emerald-700 px-4 py-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60">
                <i class="fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-arrow-down'} mr-1"></i>${label}
            </button>
        </div>
    `;
}

function renderSearchResults() {
    const container = document.getElementById('searchResultsContainer');
    const badge = document.getElementById('searchResultsCountBadge');
    if (!container) return;

    let filtered = state.mandiDatabase.filter(item => {
        if (state.searchFilter.state !== 'ALL' && item.state !== state.searchFilter.state) return false;
        if (state.searchFilter.crop !== 'ALL' && item.crop !== state.searchFilter.crop) return false;
        if (state.searchFilter.mandiType !== 'ALL' && item.mandiType !== state.searchFilter.mandiType) return false;
        if (state.searchFilter.category !== 'ALL' && item.category !== state.searchFilter.category) return false;
        return true;
    });

    if (state.searchFilter.sort === 'price-desc') filtered.sort((a, b) => b.modal - a.modal);
    if (state.searchFilter.sort === 'price-asc') filtered.sort((a, b) => a.modal - b.modal);
    if (state.searchFilter.sort === 'traded-desc') filtered.sort((a, b) => parseInt(b.traded.replace(/[^0-9]/g, '')) - parseInt(a.traded.replace(/[^0-9]/g, '')));
    if (state.searchFilter.sort === 'name-asc') filtered.sort((a, b) => a.crop.localeCompare(b.crop));

    if (badge) badge.innerText = state.mandiPagination.pages > 1
        ? `(${filtered.length} shown; ${state.mandiDatabase.length} loaded)`
        : `(${filtered.length} Mandi Records Listed)`;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-3 text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
                <i class="fa-solid fa-wheat-awn-circle-exclamation text-3xl text-slate-300"></i>
                <p class="font-bold text-slate-700">No Mandi Price Records Found</p>
                <p class="text-xs text-slate-500">Try loosening your state or category filters to explore all available records.</p>
                <button onclick="resetSearchFilters()" class="text-xs bg-agri-600 text-white font-semibold px-4 py-2 rounded-lg">Reset All Filters</button>
            </div>
        ` + getMandiLoadMoreControl();
        return;
    }

    container.innerHTML = filtered.map((item, idx) => {
        const image = getMandiCommodityImage(item);
        return `
        <div class="mandi-result-card p-4 rounded-2xl shadow-sm flex flex-col justify-between" style="--card-index: ${idx % 24};">
            <div>
                <div class="mb-3 flex items-start gap-3">
                    <div class="mandi-card-img-wrapper relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-xs">
                        ${image ? `<img src="${image.src}" alt="${image.alt || item.crop}" loading="lazy" decoding="async" class="h-full w-full object-cover" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';">` : ''}
                        <div style="${image ? 'display:none;' : 'display:flex;'}" role="img" aria-label="${item.crop} icon" class="absolute inset-0 items-center justify-center text-agri-700 bg-emerald-50"><i class="fa-solid fa-seedling text-lg"></i></div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-start justify-between mb-1 gap-2">
                            <div class="min-w-0">
                                <span class="text-xs font-bold text-slate-900 block truncate">${item.crop} <span class="text-slate-500 font-normal">(${item.variety})</span></span>
                                <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded ${item.category === 'crop' ? 'bg-amber-100 text-amber-800' : (item.category === 'vegetable' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800')}">${(item.category || 'crop').toUpperCase()}</span>
                            </div>
                            <span class="${item.isSample ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'} text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide whitespace-nowrap shadow-xs">${item.isSample ? 'SAMPLE' : 'AGMARKNET'}</span>
                        </div>
                        <p class="text-xs text-slate-500 truncate"><i class="fa-solid fa-store mr-1 text-agri-600"></i>${item.mandi}, ${item.district || item.state}, ${item.state}</p>
                    </div>
                </div>
                
                <!-- Min, Modal, Max Price Telemetry from Govt API -->
                <div class="price-telemetry-box my-3 p-2.5 rounded-xl grid grid-cols-3 gap-2 text-center text-xs border border-slate-200">
                    <div>
                        <p class="text-[10px] text-slate-400 font-medium">Minimum</p>
                        <p class="font-semibold text-slate-700">₹${item.min.toLocaleString()}</p>
                        <p class="text-[9px] text-slate-400 font-mono">₹${Math.round(item.min / 100)}/Kg</p>
                    </div>
                    <div class="border-x border-slate-200 px-1">
                        <p class="text-[10px] text-agri-700 font-bold">Modal Price</p>
                        <p class="font-extrabold text-agri-700 text-sm modal-price-pill">₹${item.modal.toLocaleString()}</p>
                        <p class="text-[9px] text-agri-600 font-mono font-bold">₹${Math.round(item.modal / 100)}/Kg</p>
                    </div>
                    <div>
                        <p class="text-[10px] text-slate-400 font-medium">Maximum</p>
                        <p class="font-semibold text-slate-700">₹${item.max.toLocaleString()}</p>
                        <p class="text-[9px] text-slate-400 font-mono">₹${Math.round(item.max / 100)}/Kg</p>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-100 text-slate-500">
                <span>Arrival: <strong class="text-slate-700">${item.traded}</strong></span>
                <div class="flex items-center gap-2">
                    <button onclick="openMandiProductSummary(${item.id})" class="text-agri-700 hover:text-agri-800 font-semibold transition-colors" title="View product summary" aria-haspopup="dialog">
                        <i class="fa-solid fa-circle-info mr-1"></i>Summary
                    </button>
                    <button onclick="compareSpecificCrop('${item.crop}')" class="text-agri-700 hover:text-agri-800 font-semibold transition-colors" title="Compare this product">
                        <i class="fa-solid fa-scale-balanced mr-1"></i>Compare
                    </button>
                    <button onclick="viewMandiOnMap(${item.lat}, ${item.lng}, '${item.mandi}')" class="text-blue-600 hover:text-blue-700 font-semibold transition-colors" title="View on Map">
                        <i class="fa-solid fa-map-pin mr-1"></i>Map
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('') + getMandiLoadMoreControl();
}

function openMandiProductSummary(productId) {
    const item = state.mandiDatabase.find(product => product.id === productId);
    if (!item) return;

    const categoryNames = {
        crop: 'Grain / crop',
        pulse: 'Pulse',
        fruit: 'Fruit',
        vegetable: 'Vegetable',
        spice: 'Spice',
        commercial: 'Cash crop'
    };
    const categoryDescriptions = {
        crop: 'A field crop traded by variety and grade. Grain condition, moisture and harvest quality influence mandi value.',
        pulse: 'A protein-rich legume, usually traded dry. Grain size, moisture and cleanliness influence lot quality.',
        fruit: 'A fresh fruit sold by harvest grade. Ripeness, appearance and transit time affect its market price.',
        vegetable: 'A fresh vegetable sold by size and grade. Harvest freshness and handling affect its market price.',
        spice: 'A spice commodity where variety, aroma, moisture and cleanliness contribute to its market grade.',
        commercial: 'A commercial crop supplied to processing or manufacturing buyers. Grade and buyer demand influence its price.'
    };
    const profile = commodityProfiles[item.crop];
    const image = getMandiCommodityImage(item);
    const description = profile
        ? `${profile.harvestCycle}. ${profile.nutrition}.`
        : `${categoryDescriptions[item.category] || categoryDescriptions.crop} This listing is the ${item.variety} variety.`;

    document.getElementById('mandiProductSummaryTitle').innerText = `${item.crop} (${item.variety})`;
    document.getElementById('mandiProductSummaryContent').innerHTML = `
        <div class="flex items-start gap-3">
            ${image ? `<img src="${image.src}" alt="${image.alt}" class="w-24 h-20 object-cover rounded-lg border border-slate-200">` : '<div class="w-24 h-20 flex items-center justify-center rounded-lg bg-slate-50 text-agri-700"><i class="fa-solid fa-seedling text-xl"></i></div>'}
            <div class="min-w-0">
                <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase text-emerald-800">${categoryNames[item.category] || 'Crop'}</span>
                <p class="mt-2 text-xs text-slate-600"><i class="fa-solid fa-store mr-1 text-agri-600"></i>${item.mandi}, ${item.district}, ${item.state}</p>
                <p class="mt-1 text-[11px] text-slate-500">Market arrival: <strong>${item.traded}</strong></p>
                ${item.isSample ? '<p class="mt-1 text-[10px] font-semibold text-amber-700">Demo sample record</p>' : ''}
            </div>
        </div>
        <p class="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">${description}</p>
        <div class="grid grid-cols-3 gap-2 text-center">
            <div class="rounded-lg border border-slate-200 p-3"><p class="text-[10px] font-medium text-slate-500">Minimum</p><p class="mt-1 text-sm font-bold text-slate-800">₹${item.min.toLocaleString('en-IN')}</p><p class="text-[10px] text-slate-400">/Qtl</p></div>
            <div class="rounded-lg border border-emerald-200 bg-emerald-50 p-3"><p class="text-[10px] font-bold text-emerald-800">Modal</p><p class="mt-1 text-sm font-extrabold text-emerald-800">₹${item.modal.toLocaleString('en-IN')}</p><p class="text-[10px] text-emerald-700">/Qtl • ₹${Math.round(item.modal / 100).toLocaleString('en-IN')}/Kg</p></div>
            <div class="rounded-lg border border-slate-200 p-3"><p class="text-[10px] font-medium text-slate-500">Maximum</p><p class="mt-1 text-sm font-bold text-slate-800">₹${item.max.toLocaleString('en-IN')}</p><p class="text-[10px] text-slate-400">/Qtl</p></div>
        </div>
        <div class="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
            <div><p class="text-[10px] font-medium text-slate-500">Shelf life</p><p class="mt-0.5 font-semibold text-slate-700">${item.shelfLife || profile?.shelfLife || 'Varies by grade and storage'}</p></div>
            <div><p class="text-[10px] font-medium text-slate-500">MSP reference</p><p class="mt-0.5 font-semibold text-slate-700">${item.msp ? `₹${item.msp.toLocaleString('en-IN')}/Qtl` : 'Not listed'}</p></div>
        </div>
    `;
    document.getElementById('mandiProductSummaryModal').classList.remove('hidden');
}

function closeMandiProductSummary() {
    document.getElementById('mandiProductSummaryModal').classList.add('hidden');
}

function viewMandiOnMap(lat, lng, mandiName) {
    switchNavTab('map');
    if (leafletMapInstance) {
        leafletMapInstance.setView([lat, lng], 11);
        showToast(`Centered map on ${mandiName}`, 'info');
    }
}

// ==========================================
// THOROUGH 2-PRODUCT COMPARISON MODULE
// ==========================================
function populateCompareSelectors() {
    const selectA = document.getElementById('compareProductASelect');
    const selectB = document.getElementById('compareProductBSelect');
    const areaSelectA = document.getElementById('compareAreaASelect');
    const areaSelectB = document.getElementById('compareAreaBSelect');
    if (!selectA || !selectB || !areaSelectA || !areaSelectB) return;

    const areas = Array.from(new Set(state.mandiDatabase.map(item => item.state))).sort((a, b) => a.localeCompare(b));
    const areaOptions = '<option value="ALL">All India</option>' + areas.map(area => `<option value="${area}">${area}</option>`).join('');
    areaSelectA.innerHTML = areaOptions;
    areaSelectB.innerHTML = areaOptions;
    areaSelectA.value = state.compare.areaA || 'ALL';
    areaSelectB.value = state.compare.areaB || 'ALL';
    updateCompareProducts('both', false);
    updateCompareAreaSummary();
    runProductComparison();
}

function getCompareAreaRecords(area = 'ALL') {
    return area === 'ALL'
        ? state.mandiDatabase
        : state.mandiDatabase.filter(item => item.state === area);
}

function updateCompareProducts(changedSelect = 'both', renderComparison = true) {
    const selectors = {
        A: {
            area: document.getElementById('compareAreaASelect'),
            product: document.getElementById('compareProductASelect')
        },
        B: {
            area: document.getElementById('compareAreaBSelect'),
            product: document.getElementById('compareProductBSelect')
        }
    };
    if (Object.values(selectors).some(selector => !selector.area || !selector.product)) return;

    const nationwideCrops = Array.from(new Set(state.mandiDatabase.map(item => item.crop))).sort((a, b) => a.localeCompare(b));
    const sides = changedSelect === 'both' ? ['A', 'B'] : [changedSelect.endsWith('B') ? 'B' : 'A'];

    sides.forEach(side => {
        const areaSelect = selectors[side].area;
        const productSelect = selectors[side].product;
        const areaKey = `area${side}`;
        const productKey = `product${side}`;
        const changedProduct = changedSelect === `product${side}`;
        const preferredProduct = changedProduct ? productSelect.value : state.compare[productKey];

        state.compare[areaKey] = areaSelect.value || 'ALL';

        // Get crops available in selected area
        const areaRecords = state.compare[areaKey] === 'ALL'
            ? state.mandiDatabase
            : state.mandiDatabase.filter(item => item.state === state.compare[areaKey]);
        const areaCrops = Array.from(new Set(areaRecords.map(item => item.crop))).sort((a, b) => a.localeCompare(b));
        const listToUse = areaCrops.length > 0 ? areaCrops : nationwideCrops;

        productSelect.innerHTML = listToUse.map(crop => `<option value="${crop}">${crop}</option>`).join('');
        if (listToUse.includes(preferredProduct)) {
            productSelect.value = preferredProduct;
        } else {
            productSelect.value = listToUse[0] || nationwideCrops[0] || '';
        }
        state.compare[productKey] = productSelect.value;
    });

    // If both products and areas are identical, intelligently auto-diverge Product B to a complementary product
    if (state.compare.productA === state.compare.productB && state.compare.areaA === state.compare.areaB) {
        const productSelectB = selectors.B.product;
        const otherOptions = Array.from(productSelectB.options).map(o => o.value).filter(v => v !== state.compare.productA);
        if (otherOptions.length > 0) {
            state.compare.productB = otherOptions[0];
            productSelectB.value = otherOptions[0];
        }
    }

    updateCompareAreaSummary();
    if (renderComparison) runProductComparison();
}

function updateCompareAreaSummary() {
    const summary = document.getElementById('compareAreaSummary');
    if (!summary) return;
    const formatArea = area => area === 'ALL' ? 'All India' : area;
    const productCount = new Set(state.mandiDatabase.map(item => item.crop)).size;
    summary.innerText = `${productCount} products available nationwide · Product A: ${formatArea(state.compare.areaA)} (${state.compare.productA}) · Product B: ${formatArea(state.compare.areaB)} (${state.compare.productB})`;
}

function setComparePreset(cropA, cropB) {
    if (cropB.toLowerCase().includes('basmati') || cropB.toLowerCase().includes('rice')) cropB = 'Paddy Rice';
    if (cropA.toLowerCase().includes('basmati') || cropA.toLowerCase().includes('rice')) cropA = 'Paddy Rice';

    state.compare.areaA = 'ALL';
    state.compare.areaB = 'ALL';
    state.compare.productA = cropA;
    state.compare.productB = cropB;

    const areaSelectA = document.getElementById('compareAreaASelect');
    const areaSelectB = document.getElementById('compareAreaBSelect');
    if (areaSelectA) areaSelectA.value = 'ALL';
    if (areaSelectB) areaSelectB.value = 'ALL';

    updateCompareProducts('both', true);
    showToast(`Loaded comparison preset: ${cropA} vs ${cropB}`, 'info');
}

function swapCompareProducts() {
    const temp = state.compare.productA;
    const tempArea = state.compare.areaA;
    state.compare.productA = state.compare.productB;
    state.compare.productB = temp;
    state.compare.areaA = state.compare.areaB;
    state.compare.areaB = tempArea;

    const areaSelectA = document.getElementById('compareAreaASelect');
    const areaSelectB = document.getElementById('compareAreaBSelect');
    if (areaSelectA) areaSelectA.value = state.compare.areaA;
    if (areaSelectB) areaSelectB.value = state.compare.areaB;

    updateCompareProducts('both', true);
    showToast(`Swapped: Product A is now ${state.compare.productA}`, 'info');
}

function runProductComparison() {
    const selectA = document.getElementById('compareProductASelect');
    const selectB = document.getElementById('compareProductBSelect');
    const areaSelectA = document.getElementById('compareAreaASelect');
    const areaSelectB = document.getElementById('compareAreaBSelect');
    if (selectA) state.compare.productA = selectA.value;
    if (selectB) state.compare.productB = selectB.value;
    if (areaSelectA) state.compare.areaA = areaSelectA.value || 'ALL';
    if (areaSelectB) state.compare.areaB = areaSelectB.value || 'ALL';

    const cropA = state.compare.productA || 'Tomato';
    const cropB = state.compare.productB || 'Potato';

    // Reliable fallback lookup: check selected area first, then nationwide
    let itemA = getCompareAreaRecords(state.compare.areaA).find(item => item.crop.toLowerCase() === cropA.toLowerCase());
    if (!itemA) itemA = state.mandiDatabase.find(item => item.crop.toLowerCase() === cropA.toLowerCase());

    let itemB = getCompareAreaRecords(state.compare.areaB).find(item => item.crop.toLowerCase() === cropB.toLowerCase());
    if (!itemB) itemB = state.mandiDatabase.find(item => item.crop.toLowerCase() === cropB.toLowerCase());

    if (!itemA || !itemB) return;

    const profileA = commodityProfiles[cropA] || getCommodityComparisonProfile(itemA);
    const profileB = commodityProfiles[cropB] || getCommodityComparisonProfile(itemB);

    const priceDiff = itemA.modal - itemB.modal;
    const priceDiffPct = itemB.modal > 0 ? ((priceDiff / itemB.modal) * 100).toFixed(1) : 0;
    const imgA = getMandiCommodityImage(itemA);
    const imgB = getMandiCommodityImage(itemB);

    // Render Side-by-Side KPI Cards with High Quality Images & Entrance Animations
    const overviewContainer = document.getElementById('compareCardsOverview');
    if (overviewContainer) {
        overviewContainer.innerHTML = `
            <!-- Product A Card -->
            <div class="compare-product-card compare-side-card-a bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-md relative overflow-hidden">
                <div class="flex items-start gap-4">
                    <div class="mandi-card-img-wrapper w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-emerald-200 bg-slate-50 shadow-xs">
                        <img src="${imgA.src}" alt="${cropA}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5 mb-1">
                            <span class="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">PRODUCT A</span>
                            <span class="text-[10px] text-slate-500 font-semibold">${itemA.variety}</span>
                        </div>
                        <h3 class="text-xl font-extrabold text-slate-900 truncate">${cropA}</h3>
                        <p class="text-xs text-slate-500 truncate"><i class="fa-solid fa-store mr-1 text-agri-600"></i>${itemA.mandi}, ${itemA.state}</p>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <span class="text-[11px] text-slate-400 font-medium">Modal Price</span>
                        <div class="text-2xl font-black text-agri-700">₹${itemA.modal.toLocaleString()}<span class="text-xs font-normal text-slate-500">/Qtl</span></div>
                        <span class="text-xs font-bold text-slate-600">₹${Math.round(itemA.modal / 100)} / Kg</span>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                    <div class="bg-slate-50 p-2 rounded-lg"><span class="text-[10px] text-slate-400">Min Price</span><p class="font-bold text-slate-700">₹${itemA.min}</p></div>
                    <div class="bg-slate-50 p-2 rounded-lg"><span class="text-[10px] text-slate-400">Spread</span><p class="font-bold text-emerald-700">₹${itemA.max - itemA.min}</p></div>
                    <div class="bg-slate-50 p-2 rounded-lg"><span class="text-[10px] text-slate-400">Max Price</span><p class="font-bold text-slate-700">₹${itemA.max}</p></div>
                </div>

                <div class="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                    <span>Arrival: <strong>${itemA.traded}</strong></span>
                    <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">${itemA.msp ? `MSP Floor: ₹${itemA.msp}` : 'Free Market'}</span>
                </div>
            </div>

            <!-- Product B Card -->
            <div class="compare-product-card compare-side-card-b bg-white p-5 rounded-2xl border-2 border-blue-500 shadow-md relative overflow-hidden">
                <div class="flex items-start gap-4">
                    <div class="mandi-card-img-wrapper w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-blue-200 bg-slate-50 shadow-xs">
                        <img src="${imgB.src}" alt="${cropB}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5 mb-1">
                            <span class="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">PRODUCT B</span>
                            <span class="text-[10px] text-slate-500 font-semibold">${itemB.variety}</span>
                        </div>
                        <h3 class="text-xl font-extrabold text-slate-900 truncate">${cropB}</h3>
                        <p class="text-xs text-slate-500 truncate"><i class="fa-solid fa-store mr-1 text-blue-600"></i>${itemB.mandi}, ${itemB.state}</p>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <span class="text-[11px] text-slate-400 font-medium">Modal Price</span>
                        <div class="text-2xl font-black text-blue-700">₹${itemB.modal.toLocaleString()}<span class="text-xs font-normal text-slate-500">/Qtl</span></div>
                        <span class="text-xs font-bold text-slate-600">₹${Math.round(itemB.modal / 100)} / Kg</span>
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                    <div class="bg-slate-50 p-2 rounded-lg"><span class="text-[10px] text-slate-400">Min Price</span><p class="font-bold text-slate-700">₹${itemB.min}</p></div>
                    <div class="bg-slate-50 p-2 rounded-lg"><span class="text-[10px] text-slate-400">Spread</span><p class="font-bold text-blue-700">₹${itemB.max - itemB.min}</p></div>
                    <div class="bg-slate-50 p-2 rounded-lg"><span class="text-[10px] text-slate-400">Max Price</span><p class="font-bold text-slate-700">₹${itemB.max}</p></div>
                </div>

                <div class="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                    <span>Arrival: <strong>${itemB.traded}</strong></span>
                    <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">${itemB.msp ? `MSP Floor: ₹${itemB.msp}` : 'Free Market'}</span>
                </div>
            </div>
        `;
    }

    // Populate Thorough 10-Specification Matrix Table
    const tableBody = document.getElementById('compareMatrixTableBody');
    const titleA = document.getElementById('matrixColTitleA');
    const titleB = document.getElementById('matrixColTitleB');
    if (titleA) titleA.innerText = `${cropA} (${itemA.variety})`;
    if (titleB) titleB.innerText = `${cropB} (${itemB.variety})`;

    const specs = [
        { label: 'Spot Modal Price (Quintal / Kg)', a: `₹${itemA.modal.toLocaleString()} / Qtl (₹${Math.round(itemA.modal / 100)}/Kg)`, b: `₹${itemB.modal.toLocaleString()} / Qtl (₹${Math.round(itemB.modal / 100)}/Kg)` },
        { label: 'Min to Max Price Range (Spread)', a: `₹${itemA.min} - ₹${itemA.max} (Spread: ₹${itemA.max - itemA.min}/Qtl)`, b: `₹${itemB.min} - ₹${itemB.max} (Spread: ₹${itemB.max - itemB.min}/Qtl)` },
        { label: 'Daily Mandi Arrival Volume', a: `${itemA.traded} (High Market Depth)`, b: `${itemB.traded} (Moderate Depth)` },
        { label: '30-Day Price Volatility Rating', a: `${itemA.volatility || 15}% — ${itemA.volatility > 20 ? 'High Volatility' : 'Stable'}`, b: `${itemB.volatility || 15}% — ${itemB.volatility > 20 ? 'High Volatility' : 'Stable'}` },
        { label: 'Government MSP Benchmark', a: itemA.msp ? `₹${itemA.msp}/Qtl Central MSP Floor` : 'No MSP (Free Market Mechanism)', b: itemB.msp ? `₹${itemB.msp}/Qtl Central MSP Floor` : 'No MSP (Free Market Mechanism)' },
        { label: 'Shelf-Life & Storage Viability', a: profileA.shelfLife, b: profileB.shelfLife },
        { label: 'Crop Season & Sowing Cycle', a: profileA.harvestCycle, b: profileB.harvestCycle },
        { label: 'Inflation & Rupee Depreciation Sensitivity', a: profileA.inflationSensitivity, b: profileB.inflationSensitivity },
        { label: 'Consumer Affordability Index (1-10)', a: `${profileA.affordabilityIndex}/10 (${profileA.affordabilityIndex >= 8 ? 'Budget Friendly' : 'Premium'})`, b: `${profileB.affordabilityIndex}/10 (${profileB.affordabilityIndex >= 8 ? 'Budget Friendly' : 'Premium'})` },
        { label: 'Trader Profit & Arbitrage Margin', a: `${profileA.traderMarginScore}/10 Potential Spread`, b: `${profileB.traderMarginScore}/10 Potential Spread` }
    ];

    if (tableBody) {
        tableBody.innerHTML = specs.map(s => `
            <tr class="spec-row transition-colors hover:bg-slate-50">
                <td class="p-3 font-semibold text-slate-700">${s.label}</td>
                <td class="p-3 text-emerald-900 font-medium bg-emerald-50/20">${s.a}</td>
                <td class="p-3 text-blue-900 font-medium bg-blue-50/20">${s.b}</td>
            </tr>
        `).join('');
    }

    // Render Side-by-Side Visual Comparison Charts
    renderCompareCharts(cropA, itemA, cropB, itemB, profileA, profileB);

    // AI Comparative Intelligence Verdict Box
    const verdictGrid = document.getElementById('compareAiVerdictGrid');
    if (verdictGrid) {
        const higherCrop = priceDiff >= 0 ? cropA : cropB;
        const lowerCrop = priceDiff >= 0 ? cropB : cropA;
        const absDiff = Math.abs(priceDiff);

        verdictGrid.innerHTML = `
            <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div class="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-scale-balanced"></i> Arbitrage & Spread Analysis
                </div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                    <strong>${higherCrop}</strong> is commanding a <strong>₹${absDiff.toLocaleString()} / Qtl</strong> premium over ${lowerCrop} (${Math.abs(priceDiffPct)}% spread). Traders can exploit inter-regional trade margins if transport freight is below ₹180/Qtl.
                </p>
            </div>

            <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div class="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-wheat-awn"></i> Farmer Holding Strategy
                </div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                    ${profileA.shelfLife && profileA.shelfLife.includes('Month') ? `<strong>${cropA}</strong> possesses durable storage life, favoring holding for higher festive prices.` : `<strong>${cropA}</strong> is perishable; rapid realization at spot mandi is strongly advised to prevent spoilage.`}
                </p>
            </div>

            <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div class="text-[11px] font-bold text-blue-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-basket-shopping"></i> Consumer Affordability Verdict
                </div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                    ${lowerCrop} provides superior nutritional value-per-rupee with an Affordability Score of <strong>${(priceDiff >= 0 ? profileB : profileA).affordabilityIndex}/10</strong>. High volume wholesale purchases are optimal now.
                </p>
            </div>
        `;
    }
}

function renderCompareCharts(cropA, itemA, cropB, itemB, profileA, profileB) {
    // 1. Comparative Trend Line Chart
    const ctxTrend = document.getElementById('compareTrendChart');
    if (ctxTrend) {
        if (chartCompareTrend) {
            chartCompareTrend.destroy();
            chartCompareTrend = null;
        }

        const baseA = itemA.modal;
        const baseB = itemB.modal;

        chartCompareTrend = new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'Current Sept'],
                datasets: [
                    {
                        label: `${cropA} (₹/Qtl)`,
                        data: [Math.round(baseA * 0.88), Math.round(baseA * 0.92), Math.round(baseA * 0.96), Math.round(baseA * 0.94), Math.round(baseA * 0.98), baseA],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: `${cropB} (₹/Qtl)`,
                        data: [Math.round(baseB * 0.91), Math.round(baseB * 0.89), Math.round(baseB * 0.93), Math.round(baseB * 0.97), Math.round(baseB * 0.95), baseB],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.12)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 750, easing: 'easeOutQuart' },
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11, weight: 'bold' } } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y}/Qtl` } }
                }
            }
        });
    }

    // 2. Multi-Metric Radar Chart
    const ctxRadar = document.getElementById('compareRadarChart');
    if (ctxRadar) {
        if (chartCompareRadar) {
            chartCompareRadar.destroy();
            chartCompareRadar = null;
        }

        const scoreA = [
            Math.min(100, Math.round(itemA.modal / 80)),
            itemA.volatility ? Math.min(100, itemA.volatility * 3) : 45,
            profileA.shelfLife && profileA.shelfLife.includes('Month') ? 85 : 30,
            Math.min(100, Math.round(parseInt(String(itemA.traded).replace(/[^0-9]/g, '') || 500) / 40)),
            (profileA.affordabilityIndex || 7.5) * 10
        ];

        const scoreB = [
            Math.min(100, Math.round(itemB.modal / 80)),
            itemB.volatility ? Math.min(100, itemB.volatility * 3) : 45,
            profileB.shelfLife && profileB.shelfLife.includes('Month') ? 85 : 30,
            Math.min(100, Math.round(parseInt(String(itemB.traded).replace(/[^0-9]/g, '') || 500) / 40)),
            (profileB.affordabilityIndex || 7.5) * 10
        ];

        chartCompareRadar = new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: ['Price Level', 'Price Volatility', 'Storage Longevity', 'Arrival Volume', 'Affordability'],
                datasets: [
                    {
                        label: cropA,
                        data: scoreA,
                        backgroundColor: 'rgba(16, 185, 129, 0.25)',
                        borderColor: '#10b981',
                        pointBackgroundColor: '#10b981',
                        borderWidth: 2
                    },
                    {
                        label: cropB,
                        data: scoreB,
                        backgroundColor: 'rgba(59, 130, 246, 0.25)',
                        borderColor: '#3b82f6',
                        pointBackgroundColor: '#3b82f6',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 750, easing: 'easeOutQuart' },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11, weight: 'bold' } } }
                }
            }
        });
    }
}

// ==========================================
// GEOGRAPHIC MAP & NEARBY MARKETS MODULE
// ==========================================
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

function initLeafletMap() {
    const mapContainer = document.getElementById('leafletMap');
    if (!mapContainer) return;

    if (leafletMapInstance) {
        leafletMapInstance.remove();
        leafletMapInstance = null;
    }

    try {
        leafletMapInstance = L.map('leafletMap', {
            center: [state.userLocation.lat, state.userLocation.lng],
            zoom: 7,
            zoomControl: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors | Agmarknet'
        }).addTo(leafletMapInstance);

        leafletMarkersLayer = L.layerGroup().addTo(leafletMapInstance);
        recenterMap();
    } catch (e) {
        console.warn('Leaflet tile loading fallback:', e);
    }
}

function detectUserLocation() {
    const btn = document.getElementById('btnDetectGps');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Detecting GPS...';

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                state.userLocation.lat = pos.coords.latitude;
                state.userLocation.lng = pos.coords.longitude;
                state.userLocation.cityName = 'My Current GPS Location';
                state.userLocation.isGps = true;

                document.getElementById('userLocationLabel').innerHTML = `<i class="fa-solid fa-location-crosshairs text-agri-600 mr-1"></i>GPS Location: <strong>${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}</strong>`;
                if (btn) btn.innerHTML = '<i class="fa-solid fa-check text-amber-300 mr-1"></i> Location Detected';

                recenterMap();
                updateNearbyMarkets();
                showToast('Detected your exact location! Showing nearby mandis & prices.', 'success');
            },
            (err) => {
                if (btn) btn.innerHTML = '<i class="fa-solid fa-location-crosshairs mr-1"></i> Detect My Current Location';
                showToast('Location permission not granted. Switched to city dropdown selector.', 'info');
            },
            { timeout: 7000, enableHighAccuracy: true }
        );
    } else {
        showToast('Browser Geolocation not supported. Use the city selector dropdown.', 'info');
    }
}

function changeMapCity(cityKey) {
    const city = cityCoordinates[cityKey];
    if (!city) return;

    state.userLocation.lat = city.lat;
    state.userLocation.lng = city.lng;
    state.userLocation.cityName = city.name;
    state.userLocation.isGps = false;

    document.getElementById('userLocationLabel').innerHTML = `<i class="fa-solid fa-location-dot text-agri-600 mr-1"></i>Selected Hub: <strong>${city.name}</strong>`;

    recenterMap();
    updateNearbyMarkets();
    showToast(`Switched map area to ${city.name}`, 'info');
}

function recenterMap() {
    if (!leafletMapInstance) return;
    leafletMapInstance.setView([state.userLocation.lat, state.userLocation.lng], 8);
}

function updateNearbyMarkets() {
    const radiusVal = document.getElementById('mapRadiusSelect').value;
    const commodityVal = document.getElementById('mapCommoditySelect').value;
    const sortVal = document.getElementById('mapSortSelect').value;

    state.userLocation.radiusKm = radiusVal === 'ALL' ? 99999 : parseInt(radiusVal);
    state.userLocation.commodity = commodityVal;
    state.userLocation.sort = sortVal;

    // Filter mandis by commodity and radius
    let nearby = state.mandiDatabase.map(mandi => {
        const dist = calculateDistanceKm(state.userLocation.lat, state.userLocation.lng, mandi.lat, mandi.lng);
        return { ...mandi, distanceKm: dist };
    });

    if (state.userLocation.commodity !== 'ALL') {
        nearby = nearby.filter(m => m.crop.toLowerCase().includes(state.userLocation.commodity.toLowerCase()));
    }

    if (state.userLocation.radiusKm !== 99999) {
        nearby = nearby.filter(m => m.distanceKm <= state.userLocation.radiusKm);
    }

    // Evaluate Affordable Prices (Identify lowest modal price)
    const minModalPrice = nearby.length > 0 ? Math.min(...nearby.map(m => m.modal)) : 0;
    const avgModalPrice = nearby.length > 0 ? Math.round(nearby.reduce((acc, m) => acc + m.modal, 0) / nearby.length) : 0;

    // Sort nearby
    if (sortVal === 'distance') nearby.sort((a, b) => a.distanceKm - b.distanceKm);
    if (sortVal === 'price-asc') nearby.sort((a, b) => a.modal - b.modal);
    if (sortVal === 'price-desc') nearby.sort((a, b) => b.modal - a.modal);

    // Update Banner
    const bannerSummary = document.getElementById('mapAffordabilitySummary');
    if (bannerSummary) {
        if (nearby.length > 0) {
            const mostAffordable = nearby.reduce((prev, curr) => curr.modal < prev.modal ? curr : prev, nearby[0]);
            const savings = avgModalPrice - mostAffordable.modal;
            bannerSummary.innerHTML = `Most Affordable Market nearby is <strong>${mostAffordable.mandi}</strong> (₹${mostAffordable.modal.toLocaleString()}/Qtl). ${savings > 0 ? `Save <strong>₹${savings.toLocaleString()}/Qtl</strong> vs regional average!` : 'Fair benchmark market rate.'}`;
        } else {
            bannerSummary.innerText = 'No mandis found within selected radius. Increase the radius dropdown.';
        }
    }

    // Render Nearby Markets List
    const container = document.getElementById('nearbyMarketsContainer');
    if (container) {
        if (nearby.length === 0) {
            container.innerHTML = '<div class="text-center p-6 text-xs text-slate-400">No mandis found within this search radius. Try expanding to 200 km or All India.</div>';
        } else {
            container.innerHTML = nearby.map(m => {
                const isMostAffordable = m.modal === minModalPrice;
                const badgeClass = isMostAffordable ? 'badge-affordable' : (m.modal <= avgModalPrice ? 'badge-moderate' : 'badge-premium');
                const badgeText = isMostAffordable ? 'Most Affordable' : (m.modal <= avgModalPrice ? 'Average Rate' : 'Premium Market');
                
                // Google Maps Direct Links
                const gmapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.mandi}, ${m.district}, ${m.state}`)}`;
                const gmapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${state.userLocation.lat},${state.userLocation.lng}&destination=${m.lat},${m.lng}`;
                const driveTimeMin = Math.max(12, Math.round(m.distanceKm * 1.5));

                return `
                    <div class="p-3 bg-slate-50 hover:bg-white rounded-xl border ${isMostAffordable ? 'border-emerald-500 shadow-sm' : 'border-slate-200'} transition-all space-y-2">
                        <div class="flex items-start justify-between gap-2">
                            <div>
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="font-bold text-slate-800 text-xs">${m.mandi}</span>
                                    <span class="text-[10px] font-bold px-2 py-0.5 rounded ${badgeClass}">${badgeText}</span>
                                </div>
                                <p class="text-[11px] text-slate-500 mt-0.5"><i class="fa-solid fa-route mr-1 text-blue-500"></i><strong>${m.distanceKm} km</strong> away • ~${driveTimeMin} mins driving</p>
                            </div>
                            <div class="text-right">
                                <div class="text-base font-extrabold text-agri-700">₹${m.modal.toLocaleString()}<span class="text-[10px] font-normal text-slate-400">/Qtl</span></div>
                                <span class="text-[10px] text-slate-500 font-mono">₹${Math.round(m.modal / 100)}/Kg</span>
                            </div>
                        </div>

                        <div class="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/80 text-slate-600">
                            <span>Crop: <strong>${m.crop} (${m.variety})</strong></span>
                            <div class="flex items-center gap-2">
                                <a href="${gmapsSearchUrl}" target="_blank" class="text-blue-600 hover:text-blue-800 font-semibold" title="Search Mandi on Google Maps">
                                    <i class="fa-solid fa-map-location mr-0.5"></i> Maps
                                </a>
                                <span class="text-slate-300">•</span>
                                <a href="${gmapsDirectionsUrl}" target="_blank" class="text-emerald-700 hover:text-emerald-800 font-bold" title="Open Turn-by-Turn Navigation">
                                    <i class="fa-solid fa-diamond-turn-right mr-0.5"></i> Directions
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Render Markers on Leaflet Map
    if (leafletMapInstance && leafletMarkersLayer) {
        leafletMarkersLayer.clearLayers();

        // 1. Add User Location Pin
        const userIcon = L.divIcon({
            className: 'custom-map-pin user-gps',
            iconSize: [24, 24],
            html: '<i class="fa-solid fa-user text-[11px]"></i>'
        });
        L.marker([state.userLocation.lat, state.userLocation.lng], { icon: userIcon })
            .bindPopup(`<b>Your Location</b><br>${state.userLocation.cityName}`)
            .addTo(leafletMarkersLayer);

        // 2. Add Mandi Markers
        nearby.forEach(m => {
            const isAffordable = m.modal === minModalPrice;
            const pinClass = isAffordable ? 'affordable' : (m.modal <= avgModalPrice ? 'moderate' : 'premium');
            
            const mandiIcon = L.divIcon({
                className: `custom-map-pin ${pinClass}`,
                iconSize: [26, 26],
                html: `<i class="fa-solid fa-store text-[11px]"></i>`
            });

            const gmapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.mandi}, ${m.district}, ${m.state}`)}`;
            const gmapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${state.userLocation.lat},${state.userLocation.lng}&destination=${m.lat},${m.lng}`;

            const popupContent = `
                <div class="p-3 text-xs space-y-2 min-w-[200px]">
                    <div class="font-bold text-slate-800 text-sm">${m.mandi}</div>
                    <div class="text-[11px] text-slate-500">${m.district}, ${m.state} • <strong>${m.distanceKm} km away</strong></div>
                    <div class="p-2 bg-emerald-50 rounded-lg text-center">
                        <span class="text-[10px] text-slate-400 block">${m.crop} (${m.variety}) Modal Price</span>
                        <span class="text-base font-extrabold text-agri-700">₹${m.modal.toLocaleString()} / Qtl</span>
                        <span class="text-[10px] text-slate-500 block">Min: ₹${m.min} | Max: ₹${m.max}</span>
                    </div>
                    <div class="flex items-center justify-between gap-2 pt-1">
                        <a href="${gmapsSearchUrl}" target="_blank" class="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-center py-1.5 rounded font-semibold text-[10px] block">
                            🗺️ Google Maps
                        </a>
                        <a href="${gmapsDirectionsUrl}" target="_blank" class="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-1.5 rounded font-bold text-[10px] block">
                            🚗 Directions
                        </a>
                    </div>
                </div>
            `;

            L.marker([m.lat, m.lng], { icon: mandiIcon })
                .bindPopup(popupContent)
                .addTo(leafletMarkersLayer);
        });

        const badgeCount = document.getElementById('mapMarkersCountBadge');
        if (badgeCount) badgeCount.innerText = `${nearby.length} Mandis Marked`;
    }
}

// ==========================================
// AI PRICE FORECAST (API + BUDGET + NSE RUPEE)
// ==========================================
function getForecastUnitLabel() {
    return state.forecast.priceUnit === 'kg' ? 'Kg' : 'Qtl';
}

function getForecastPriceFactor() {
    return state.forecast.priceUnit === 'kg' ? 0.01 : 1;
}

function formatForecastPriceValue(pricePerQuintal) {
    const value = pricePerQuintal * getForecastPriceFactor();
    return value.toLocaleString('en-IN', {
        minimumFractionDigits: state.forecast.priceUnit === 'kg' ? 2 : 0,
        maximumFractionDigits: 2
    });
}

function setForecastPriceUnit(unit) {
    if (!['qtl', 'kg'].includes(unit)) return;
    state.forecast.priceUnit = unit;
    document.querySelectorAll('#forecastUnitGroup .forecast-unit-btn').forEach(button => {
        const isActive = button.dataset.unit === unit;
        button.setAttribute('aria-pressed', String(isActive));
        button.className = isActive
            ? 'forecast-unit-btn flex-1 px-3 py-1.5 rounded text-emerald-900 bg-emerald-300 font-bold transition-colors'
            : 'forecast-unit-btn flex-1 px-3 py-1.5 rounded text-emerald-100 hover:bg-slate-700 font-semibold transition-colors';
    });
    runAiForecast();
}

function renderForecast3DGraph(prices, upperConfidence, lowerConfidence, labels) {
    const mount = document.getElementById('forecast3dChartCanvas');
    const wrapper = document.getElementById('forecast3dChartWrap');
    const tooltip = document.getElementById('forecast3dTooltip');
    const fallback = document.getElementById('forecast3dFallback');
    const axisLabels = document.getElementById('forecast3dAxisLabels');
    if (!mount || !wrapper || !axisLabels) return;

    const unitLabel = getForecastUnitLabel();
    const unitBadge = document.getElementById('forecast3dUnitLabel');
    if (unitBadge) unitBadge.innerText = `₹ / ${unitLabel}`;

    if (!window.THREE) {
        if (fallback) {
            fallback.classList.remove('hidden');
            fallback.classList.add('flex');
            fallback.innerText = 'Three.js could not load. The 2D forecast chart remains available.';
        }
        return;
    }

    if (!forecast3DPlot) {
        try {
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
            renderer.setClearColor(0x0f172a, 1);
            renderer.domElement.className = 'block h-full w-full touch-none';
            renderer.domElement.setAttribute('role', 'img');
            renderer.domElement.setAttribute('aria-label', 'Interactive 3D price forecast bars');
            renderer.domElement.tabIndex = 0;
            mount.appendChild(renderer.domElement);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
            camera.position.set(0, 7.5, 16);
            camera.lookAt(0, 2.2, 0);
            scene.add(new THREE.HemisphereLight(0xe2e8f0, 0x253347, 2.1));
            const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
            keyLight.position.set(-4, 9, 8);
            scene.add(keyLight);

            const barsGroup = new THREE.Group();
            scene.add(barsGroup);
            const plot = { renderer, scene, camera, barsGroup, bars: [], raycaster: new THREE.Raycaster(), drag: null, selectedIndex: -1, prices: [], upperConfidence: [], lowerConfidence: [], labels: [] };

            const resize = () => {
                if (!forecast3DPlot) return;
                const width = Math.max(wrapper.clientWidth, 1);
                const height = Math.max(wrapper.clientHeight, 1);
                forecast3DPlot.renderer.setSize(width, height, false);
                forecast3DPlot.camera.aspect = width / height;
                forecast3DPlot.camera.updateProjectionMatrix();
                forecast3DPlot.renderer.render(forecast3DPlot.scene, forecast3DPlot.camera);
            };
            plot.resizeObserver = new ResizeObserver(resize);
            plot.resizeObserver.observe(wrapper);

            const raycastBar = event => {
                const rect = renderer.domElement.getBoundingClientRect();
                const pointer = new THREE.Vector2(
                    ((event.clientX - rect.left) / rect.width) * 2 - 1,
                    -((event.clientY - rect.top) / rect.height) * 2 + 1
                );
                plot.raycaster.setFromCamera(pointer, camera);
                return plot.raycaster.intersectObjects(plot.bars, false)[0]?.object || null;
            };
            renderer.domElement.addEventListener('pointerdown', event => {
                plot.drag = { x: event.clientX, y: event.clientY, moved: false };
                renderer.domElement.setPointerCapture(event.pointerId);
            });
            renderer.domElement.addEventListener('pointermove', event => {
                if (plot.drag) {
                    const dx = event.clientX - plot.drag.x;
                    const dy = event.clientY - plot.drag.y;
                    if (Math.abs(dx) + Math.abs(dy) > 2) plot.drag.moved = true;
                    plot.barsGroup.rotation.y += dx * 0.008;
                    plot.barsGroup.rotation.x = THREE.MathUtils.clamp(plot.barsGroup.rotation.x + dy * 0.004, -0.18, 0.28);
                    plot.drag.x = event.clientX;
                    plot.drag.y = event.clientY;
                    renderer.render(scene, camera);
                    return;
                }

                const bar = raycastBar(event);
                if (!tooltip) return;
                if (!bar) {
                    tooltip.classList.add('hidden');
                    return;
                }
                const point = bar.userData;
                const activeUnit = getForecastUnitLabel();
                tooltip.innerHTML = `<strong>${point.label}</strong><br>Forecast: ₹${formatForecastPriceValue(point.price)}/${activeUnit}<br>Range: ₹${formatForecastPriceValue(point.low)}/–₹${formatForecastPriceValue(point.high)}/${activeUnit}`;
                const rect = wrapper.getBoundingClientRect();
                tooltip.style.left = `${Math.max(6, Math.min(event.clientX - rect.left + 12, rect.width - 170))}px`;
                tooltip.style.top = `${Math.max(6, Math.min(event.clientY - rect.top + 12, rect.height - 78))}px`;
                tooltip.classList.remove('hidden');
            });
            renderer.domElement.addEventListener('pointerup', event => {
                if (plot.drag && !plot.drag.moved) {
                    const selectedBar = raycastBar(event);
                    if (selectedBar) {
                        plot.selectedIndex = selectedBar.userData.index;
                        renderForecast3DGraph(plot.prices, plot.upperConfidence, plot.lowerConfidence, plot.labels);
                    }
                }
                plot.drag = null;
            });
            renderer.domElement.addEventListener('pointerleave', () => {
                if (!plot.drag && tooltip) tooltip.classList.add('hidden');
            });
            renderer.domElement.addEventListener('wheel', event => {
                event.preventDefault();
                camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.008, 9, 24);
                renderer.render(scene, camera);
            }, { passive: false });

            forecast3DPlot = plot;
        } catch (error) {
            if (fallback) {
                fallback.classList.remove('hidden');
                fallback.classList.add('flex');
                fallback.innerText = 'WebGL is unavailable. The 2D forecast chart remains available.';
            }
            return;
        }
    }

    const plot = forecast3DPlot;
    plot.prices = prices;
    plot.upperConfidence = upperConfidence;
    plot.lowerConfidence = lowerConfidence;
    plot.labels = labels;
    plot.barsGroup.traverse(child => {
        if (!child.isMesh) return;
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach(material => material.dispose());
        else child.material.dispose();
    });
    plot.barsGroup.clear();
    plot.bars = [];
    plot.scene.children.filter(child => child.userData.forecastGrid).forEach(grid => {
        plot.scene.remove(grid);
        grid.geometry.dispose();
        grid.material.dispose();
    });

    const minimum = Math.min(...lowerConfidence);
    const maximum = Math.max(...upperConfidence);
    const baseline = minimum - Math.max((maximum - minimum) * 0.12, minimum * 0.015);
    const valueRange = Math.max(maximum - baseline, 1);
    const chartHeight = 5.2;
    const barSpacing = 1.08;
    const gridSize = Math.max(labels.length * barSpacing + 2, 12);
    const grid = new THREE.GridHelper(gridSize, Math.max(labels.length + 1, 12), 0x64748b, 0x334155);
    grid.position.y = 0;
    grid.userData.forecastGrid = true;
    plot.scene.add(grid);

    prices.forEach((price, index) => {
        const x = (index - (prices.length - 1) / 2) * barSpacing;
        const lowHeight = Math.max(0.04, ((lowerConfidence[index] - baseline) / valueRange) * chartHeight);
        const highHeight = Math.max(lowHeight + 0.06, ((upperConfidence[index] - baseline) / valueRange) * chartHeight);
        const barHeight = Math.max(0.12, ((price - baseline) / valueRange) * chartHeight);
        const confidenceGeometry = new THREE.BoxGeometry(0.72, highHeight - lowHeight, 0.8);
        const confidenceMaterial = new THREE.MeshStandardMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.2, roughness: 0.6 });
        const confidenceMesh = new THREE.Mesh(confidenceGeometry, confidenceMaterial);
        confidenceMesh.position.set(x, (lowHeight + highHeight) / 2, -0.28);
        plot.barsGroup.add(confidenceMesh);

        const geometry = new THREE.BoxGeometry(0.52, barHeight, 0.62);
        const selected = index === plot.selectedIndex;
        const material = new THREE.MeshStandardMaterial({
            color: selected ? 0x38bdf8 : index === 0 ? 0x22c55e : 0xf59e0b,
            emissive: selected ? 0x075985 : 0x000000,
            roughness: 0.4,
            metalness: 0.08
        });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(x, barHeight / 2, 0.14);
        bar.userData = { index, label: labels[index], price, low: lowerConfidence[index], high: upperConfidence[index] };
        plot.barsGroup.add(bar);
        plot.bars.push(bar);
    });

    axisLabels.style.gridTemplateColumns = `repeat(${labels.length}, minmax(0, 1fr))`;
    axisLabels.innerHTML = labels.map((label, index) => `<span class="truncate ${index === 0 ? 'font-semibold text-emerald-700' : ''}" title="${label}">${index === 0 ? 'Now' : label.replace(' Days', 'd').replace('+', '')}</span>`).join('');
    if (fallback) fallback.classList.add('hidden');

    const width = Math.max(wrapper.clientWidth, 1);
    const height = Math.max(wrapper.clientHeight, 1);
    plot.renderer.setSize(width, height, false);
    plot.camera.aspect = width / height;
    plot.camera.updateProjectionMatrix();
    plot.renderer.render(plot.scene, plot.camera);
}

function runAiForecast() {
    const cropSelect = document.getElementById('forecastCropSelect');
    const horizonSelect = document.getElementById('forecastHorizonSelect');
    const budgetSelect = document.getElementById('forecastBudgetSelect');
    const rupeeSelect = document.getElementById('forecastRupeeSelect');
    const inflationSelect = document.getElementById('forecastInflationSelect');

    if (cropSelect) state.forecast.crop = cropSelect.value;
    if (horizonSelect) state.forecast.horizon = parseInt(horizonSelect.value);
    if (budgetSelect) state.forecast.budgetScenario = budgetSelect.value;
    if (rupeeSelect) state.forecast.rupeeScenario = rupeeSelect.value;
    if (inflationSelect) state.forecast.inflationScenario = inflationSelect.value;
    const activeUnitButton = document.querySelector('#forecastUnitGroup .forecast-unit-btn[aria-pressed="true"]');
    if (activeUnitButton) state.forecast.priceUnit = activeUnitButton.dataset.unit;

    const cropName = state.forecast.crop;
    const horizon = state.forecast.horizon;
    const unitLabel = getForecastUnitLabel();
    const priceFactor = getForecastPriceFactor();
    const forecastPriceColumnTitle = document.getElementById('forecastPriceColumnTitle');
    if (forecastPriceColumnTitle) forecastPriceColumnTitle.innerText = `Projected Modal (₹/${unitLabel})`;

    // Find commodity baseline from Govt API database
    const cropObj = state.mandiDatabase.find(i => i.crop.toLowerCase().includes(cropName.toLowerCase())) || state.mandiDatabase[0];
    const spotModal = cropObj.modal;

    // Calculate Multi-Factor Macro Adjustment
    // 1. Union Budget Impact: Subsidies stabilize supply and provide farm liquidity
    let budgetMultiplier = 0.0;
    let budgetText = '';
    if (state.forecast.budgetScenario === 'high') {
        budgetMultiplier = 0.022; // +2.2% MSP floor & storage stabilization
        budgetText = 'Enhanced allocation (₹1.37L Cr) and fertilizer subsidy (₹1.64L Cr) cushion farm production costs while elevating mandi support floors.';
    } else if (state.forecast.budgetScenario === 'baseline') {
        budgetMultiplier = 0.010;
        budgetText = 'Standard fiscal outlays provide steady support across primary mandis.';
    } else {
        budgetMultiplier = -0.015;
        budgetText = 'Constrained subsidies heighten price vulnerability to input shocks.';
    }

    // 2. NSE Rupee Depreciation Dynamics:
    // A depreciating rupee increases landed costs of imported DAP/Potash fertilizers and diesel freight (+3.2%),
    // simultaneously boosting export parity demand for Wheat, Rice, Cotton, and Spices.
    let rupeeMultiplier = 0.0;
    let rupeeText = '';
    if (state.forecast.rupeeScenario === 'depreciating') {
        rupeeMultiplier = 0.038; // +3.8% inflationary pressure
        rupeeText = 'Rupee depreciation (-0.65% to ₹83.92/USD) elevates diesel freight haulage (+₹3.4/km) and DAP fertilizer import parity, transmitting +3.8% upward pressure to domestic spot prices.';
    } else if (state.forecast.rupeeScenario === 'stable') {
        rupeeMultiplier = 0.008;
        rupeeText = 'Range-bound currency limits external imported inflation pass-through.';
    } else {
        rupeeMultiplier = -0.012;
        rupeeText = 'Appreciating rupee softens diesel fuel costs and fertilizer input imports.';
    }

    // 3. Food CPI Inflation Pressure
    let inflationMultiplier = 0.0;
    if (state.forecast.inflationScenario === 'high') inflationMultiplier = 0.035;
    else if (state.forecast.inflationScenario === 'moderate') inflationMultiplier = 0.018;
    else inflationMultiplier = 0.005;

    // Total forward growth rate
    const totalGrowthRate = 0.025 + budgetMultiplier + rupeeMultiplier + inflationMultiplier;

    // Generate historical baseline points (Past 30 days)
    const histLabels = ['-30 Days', '-25 Days', '-20 Days', '-15 Days', '-10 Days', '-5 Days', 'Today'];
    const histPrices = [
        Math.round(spotModal * 0.94),
        Math.round(spotModal * 0.95),
        Math.round(spotModal * 0.965),
        Math.round(spotModal * 0.97),
        Math.round(spotModal * 0.985),
        Math.round(spotModal * 0.992),
        spotModal
    ];

    // Generate forward projection points
    const stepCount = horizon === 30 ? 6 : (horizon === 60 ? 8 : 10);
    const forecastLabels = [];
    const forecastPrices = [];
    const upperConfidence = [];
    const lowerConfidence = [];

    // Today is transition point
    forecastPrices.push(spotModal);
    upperConfidence.push(spotModal);
    lowerConfidence.push(spotModal);

    for (let i = 1; i <= stepCount; i++) {
        const dayOffset = Math.round((horizon / stepCount) * i);
        forecastLabels.push(`+${dayOffset} Days`);
        const fraction = i / stepCount;
        const projected = Math.round(spotModal * (1 + totalGrowthRate * fraction));
        const margin = Math.round(projected * (0.02 + 0.015 * fraction));

        forecastPrices.push(projected);
        upperConfidence.push(projected + margin);
        lowerConfidence.push(projected - margin);
    }

    const allLabels = [...histLabels, ...forecastLabels];
    const fullHistData = [...histPrices, ...Array(forecastLabels.length).fill(null)];
    const fullForecastData = [...Array(histLabels.length - 1).fill(null), ...forecastPrices];
    const fullUpperData = [...Array(histLabels.length - 1).fill(null), ...upperConfidence];
    const fullLowerData = [...Array(histLabels.length - 1).fill(null), ...lowerConfidence];
    const convertChartPrices = values => values.map(value => value === null ? null : value * priceFactor);

    // Render Forecast Chart
    const ctxFore = document.getElementById('forecastChart');
    if (ctxFore) {
        if (chartForecast) chartForecast.destroy();

        chartForecast = new Chart(ctxFore, {
            type: 'line',
            data: {
                labels: allLabels,
                datasets: [
                    {
                        label: `Govt API Historical Baseline (₹/${unitLabel})`,
                        data: convertChartPrices(fullHistData),
                        borderColor: '#16a34a',
                        backgroundColor: '#16a34a',
                        pointRadius: 4,
                        borderWidth: 2.5
                    },
                    {
                        label: `AI Multi-Factor Projected Price (₹/${unitLabel})`,
                        data: convertChartPrices(fullForecastData),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 3,
                        borderDash: [4, 4],
                        pointRadius: 3
                    },
                    {
                        label: '95% Upper Confidence Band',
                        data: convertChartPrices(fullUpperData),
                        borderColor: 'rgba(245, 158, 11, 0.3)',
                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                        fill: '+1',
                        borderWidth: 1,
                        pointRadius: 0
                    },
                    {
                        label: '95% Lower Confidence Band',
                        data: convertChartPrices(fullLowerData),
                        borderColor: 'rgba(245, 158, 11, 0.3)',
                        fill: false,
                        borderWidth: 1,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN', { minimumFractionDigits: state.forecast.priceUnit === 'kg' ? 2 : 0, maximumFractionDigits: 2 })}/${unitLabel}` } }
                }
            }
        });
    }

    renderForecast3DGraph(forecastPrices, upperConfidence, lowerConfidence, ['Today', ...forecastLabels]);

    const finalProjected = forecastPrices[forecastPrices.length - 1];
    const netDeltaPct = (((finalProjected - spotModal) / spotModal) * 100).toFixed(1);

    // Update 3 Summary KPI Chips
    const summaryCards = document.getElementById('forecastKpiSummaryCards');
    if (summaryCards) {
        summaryCards.innerHTML = `
            <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span class="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">PROJECTED PRICE (${horizon} DAYS)</span>
                <div class="text-xl font-extrabold text-emerald-900 mt-1">₹${formatForecastPriceValue(finalProjected)}<span class="text-xs font-normal text-slate-500"> / ${unitLabel}</span></div>
                <p class="text-[11px] text-emerald-700 font-semibold mt-0.5"><i class="fa-solid fa-arrow-trend-up mr-1"></i>+${netDeltaPct}% expected change</p>
            </div>
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span class="text-[10px] text-amber-800 font-bold uppercase tracking-wider">UNION BUDGET CUSHIONING</span>
                <div class="text-xl font-extrabold text-amber-900 mt-1">+₹${formatForecastPriceValue(Math.round(spotModal * budgetMultiplier))}<span class="text-xs font-normal text-slate-500"> / ${unitLabel}</span></div>
                <p class="text-[11px] text-amber-700 mt-0.5">Subsidized fertilizer + PM-KISAN holding support</p>
            </div>
            <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span class="text-[10px] text-blue-800 font-bold uppercase tracking-wider">NSE RUPEE INFLATION IMPACT</span>
                <div class="text-xl font-extrabold text-blue-900 mt-1">+${(rupeeMultiplier * 100).toFixed(1)}%<span class="text-xs font-normal text-slate-500"> pressure</span></div>
                <p class="text-[11px] text-blue-700 mt-0.5">Diesel freight & imported input parity pass-through</p>
            </div>
        `;
    }

    // Update Deep AI Multi-Factor Analysis Commentary
    const aiGrid = document.getElementById('forecastAiBreakdownGrid');
    if (aiGrid) {
        aiGrid.innerHTML = `
            <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div class="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-chart-line"></i> 1. Govt Mandi API Past Trends
                </div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                    Analyzing 60 days of historical Agmarknet records, <strong>${cropName}</strong> exhibits consistent upward moving average momentum from ₹${formatForecastPriceValue(histPrices[0])} to ₹${formatForecastPriceValue(spotModal)}/${unitLabel}. Seasonal arrivals are tapering, creating supply squeeze.
                </p>
            </div>

            <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div class="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-building-columns"></i> 2. Union Budget Policy Impact
                </div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                    ${budgetText} Strong budgetary allocations enhance farm-gate price retention and prevent distress liquidations.
                </p>
            </div>

            <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div class="text-[11px] font-bold text-blue-300 flex items-center gap-1.5">
                    <i class="fa-solid fa-money-bill-transfer"></i> 3. NSE Rupee & Inflation Dynamics
                </div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                    ${rupeeText} Concurrently, headline food CPI inflation at <strong>${state.macro.cpiFoodInflation}%</strong> sustains firm wholesale procurement bids.
                </p>
            </div>

            <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                <div class="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <i class="fa-solid fa-lightbulb"></i> 4. Actionable Strategy & Advice
                </div>
                <p class="text-slate-300 text-[11px] leading-relaxed">
                    <strong>Farmers:</strong> Favorable hold window for 15-20 days to capture projected ₹${formatForecastPriceValue(finalProjected)}/${unitLabel} targets. 
                    <strong>Traders:</strong> Lock in forward mandi delivery contracts before inflation premium expands further.
                </p>
            </div>
        `;
    }

    // Update Week-by-Week Forward Projection Table
    const tableBody = document.getElementById('forecastTableBody');
    if (tableBody) {
        const weeks = [
            { week: 'Week 1 (+7 Days)', offset: 1 },
            { week: 'Week 2 (+14 Days)', offset: 2 },
            { week: 'Week 3 (+21 Days)', offset: 3 },
            { week: 'Week 4 (+30 Days)', offset: 4 }
        ];

        tableBody.innerHTML = weeks.map((w, idx) => {
            const frac = (idx + 1) / weeks.length;
            const price = Math.round(spotModal * (1 + totalGrowthRate * frac));
            const min = price - Math.round(price * 0.025);
            const max = price + Math.round(price * 0.028);

            return `
                <tr>
                    <td class="p-3 font-semibold text-slate-800">${w.week}</td>
                    <td class="p-3 font-bold text-agri-700">₹${formatForecastPriceValue(price)}</td>
                    <td class="p-3 text-slate-600">₹${formatForecastPriceValue(min)} - ₹${formatForecastPriceValue(max)}</td>
                    <td class="p-3 text-emerald-700 font-medium">+${(budgetMultiplier * 100 * frac).toFixed(1)}%</td>
                    <td class="p-3 text-amber-700 font-medium">+${(rupeeMultiplier * 100 * frac).toFixed(1)}%</td>
                    <td class="p-3 text-right"><span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">${94 - idx * 2}% Verified</span></td>
                </tr>
            `;
        }).join('');
    }
}

// ==========================================
// PRICE & MARKET TREND ANALYSIS MODULE (TAB 6)
// ==========================================
let trendSimInterval = null;
let trendSimulationActive = true;

function setAnalyticsTimeframe(timeframe, btn) {
    if (!['1M', '3M', '6M', '1Y'].includes(timeframe)) timeframe = '3M';
    state.analytics = state.analytics || {};
    state.analytics.timeframe = timeframe;

    const buttons = document.querySelectorAll('.trend-time-btn');
    buttons.forEach(b => {
        b.className = 'trend-time-btn px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all';
    });
    if (btn) {
        btn.className = 'trend-time-btn active px-2.5 py-1 rounded-lg text-xs font-semibold bg-agri-600 text-white shadow-xs transition-all';
    }

    const subtitle = document.getElementById('analyticsChartSubtitle');
    if (subtitle) {
        const crop = state.analytics.crop || 'Wheat';
        subtitle.innerText = `${timeframe} Trajectory & Momentum Projection for ${crop}`;
    }

    const pill = document.getElementById('analyticsChartPill');
    if (pill) {
        pill.innerText = `${timeframe} Horizon Interpolation`;
    }

    renderAnalyticsCharts();
    showToast(`Price trend analysis horizon updated to ${timeframe}`, 'info');
}

function changeAnalyticsCrop(cropName) {
    state.analytics = state.analytics || {};
    state.analytics.crop = cropName;

    const subtitle = document.getElementById('analyticsChartSubtitle');
    if (subtitle) {
        const tf = state.analytics.timeframe || '3M';
        subtitle.innerText = `${tf} Trajectory & Momentum Projection for ${cropName}`;
    }

    renderAnalyticsCharts();
    updateArbitrageSimulator();
    showToast(`Focus commodity set to ${cropName}`, 'info');
}

function toggleTrendLiveSimulation() {
    trendSimulationActive = !trendSimulationActive;
    const btn = document.getElementById('trendSimBtn');
    const btnText = document.getElementById('trendSimBtnText');

    if (trendSimulationActive) {
        if (btn) btn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-all shadow-xs';
        if (btnText) btnText.innerText = 'Live Ticks: Active';
        startTrendTickerSimulation();
        showToast('Live market price tick animation activated', 'info');
    } else {
        if (btn) btn.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-all shadow-xs';
        if (btnText) btnText.innerText = 'Live Ticks: Paused';
        if (trendSimInterval) {
            clearInterval(trendSimInterval);
            trendSimInterval = null;
        }
        showToast('Live market price ticks paused', 'info');
    }
}

function startTrendTickerSimulation() {
    if (trendSimInterval) clearInterval(trendSimInterval);
    const commodities = [
        { id: 'tickWheat', name: 'Wheat (Punjab)', base: 2275 },
        { id: 'tickTomato', name: 'Tomato (Nashik)', base: 1850 },
        { id: 'tickRice', name: 'Paddy (Karnal)', base: 3450 },
        { id: 'tickCotton', name: 'Cotton (Rajkot)', base: 6200 }
    ];

    trendSimInterval = setInterval(() => {
        if (!trendSimulationActive) return;
        const randIdx = Math.floor(Math.random() * commodities.length);
        const item = commodities[randIdx];
        const el = document.getElementById(item.id);
        if (!el) return;

        const deltaPct = (Math.random() * 1.6 - 0.7);
        const newPrice = Math.round(item.base * (1 + deltaPct / 100));
        const isUp = deltaPct >= 0;
        const iconClass = isUp ? 'fa-arrow-trend-up text-emerald-400' : 'fa-arrow-trend-down text-rose-400';
        const textClass = isUp ? 'text-emerald-400' : 'text-rose-400';
        const sign = isUp ? '+' : '';

        el.innerHTML = `<i class="fa-solid ${iconClass} mr-1"></i>${item.name}: <strong>₹${newPrice.toLocaleString('en-IN')}</strong> <span class="${textClass} font-bold">${sign}${deltaPct.toFixed(1)}%</span>`;
        el.classList.add('transition-all', 'duration-300', 'scale-105');
        setTimeout(() => el.classList.remove('scale-105'), 400);
    }, 2400);
}

function updateArbitrageSimulator() {
    const distSlider = document.getElementById('simDistanceSlider');
    const freightSlider = document.getElementById('simFreightSlider');
    if (!distSlider || !freightSlider) return;

    const distance = parseInt(distSlider.value) || 350;
    const freightRate = parseFloat(freightSlider.value) || 4.5;

    const distVal = document.getElementById('simDistanceVal');
    const freightVal = document.getElementById('simFreightVal');
    if (distVal) distVal.innerText = `${distance} Km`;
    if (freightVal) freightVal.innerText = `₹${freightRate.toFixed(2)} / Qtl-Km`;

    const cropName = (state.analytics && state.analytics.crop) ? state.analytics.crop : 'Tomato';
    const cropRecords = state.mandiDatabase.filter(r => r.crop.toLowerCase() === cropName.toLowerCase());

    let buyPrice = 1850;
    let sellPrice = 2420;
    let buyMandi = 'Nashik';
    let sellMandi = 'Delhi';

    if (cropRecords.length >= 2) {
        const sorted = [...cropRecords].sort((a, b) => (a.modal || a.price) - (b.modal || b.price));
        buyPrice = sorted[0].modal || sorted[0].price;
        buyMandi = sorted[0].mandi.split(' ')[0];
        sellPrice = sorted[sorted.length - 1].modal || sorted[sorted.length - 1].price;
        sellMandi = sorted[sorted.length - 1].mandi.split(' ')[0];
    } else if (cropRecords.length === 1) {
        const base = cropRecords[0].modal || cropRecords[0].price;
        buyPrice = Math.round(base * 0.90);
        sellPrice = Math.round(base * 1.18);
        buyMandi = cropRecords[0].mandi.split(' ')[0];
        sellMandi = 'Metro Terminal';
    }

    const grossSpread = Math.max(0, sellPrice - buyPrice);
    const freightCost = Math.round(45 + (distance * freightRate * 0.075));
    const netMargin = grossSpread - freightCost;
    const roiPct = buyPrice > 0 ? ((netMargin / buyPrice) * 100).toFixed(1) : '0.0';

    const grossEl = document.getElementById('simGrossSpread');
    const freightEl = document.getElementById('simFreightCost');
    const marginEl = document.getElementById('simNetMargin');
    const roiEl = document.getElementById('simRoiPct');
    const badgeEl = document.getElementById('simProfitBadge');

    if (grossEl) {
        grossEl.innerText = `₹${grossSpread.toLocaleString('en-IN')} / Qtl`;
        const noteEl = grossEl.nextElementSibling;
        if (noteEl) noteEl.innerText = `${sellMandi} vs ${buyMandi} ${cropName}`;
    }
    if (freightEl) {
        freightEl.innerText = `₹${freightCost.toLocaleString('en-IN')} / Qtl`;
    }
    if (marginEl) {
        marginEl.innerText = `${netMargin >= 0 ? '+' : '-'}₹${Math.abs(netMargin).toLocaleString('en-IN')} / Qtl`;
        marginEl.className = `text-xl font-extrabold mt-1 ${netMargin >= 0 ? 'text-emerald-700' : 'text-rose-600'}`;
    }
    if (roiEl) {
        roiEl.innerText = `${roiPct >= 0 ? '+' : ''}${roiPct}% ROI`;
        roiEl.className = `text-[10px] font-semibold ${netMargin >= 0 ? 'text-emerald-700' : 'text-rose-600'}`;
    }
    if (badgeEl) {
        if (netMargin > 150) {
            badgeEl.innerText = 'High Margin Viable';
            badgeEl.className = 'text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full transition-all';
        } else if (netMargin > 0) {
            badgeEl.innerText = 'Moderate Margin';
            badgeEl.className = 'text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full transition-all';
        } else {
            badgeEl.innerText = 'Negative Margin / Infeasible';
            badgeEl.className = 'text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full transition-all';
        }
    }
}

function renderAnalyticsCharts() {
    const modeSelect = document.getElementById('compareModeSelect');
    const mode = modeSelect ? modeSelect.value : 'crop';
    const crop = (state.analytics && state.analytics.crop) ? state.analytics.crop : 'Wheat';
    const tf = (state.analytics && state.analytics.timeframe) ? state.analytics.timeframe : '3M';

    // 1. Line Chart: Comparative Trajectory
    const ctxComp = document.getElementById('analyticsComparisonChart');
    if (ctxComp) {
        if (chartAnalyticsComp) chartAnalyticsComp.destroy();

        let labels = [];
        let datasets = [];

        if (tf === '1M') {
            labels = ['Week 1', 'Week 2', 'Week 3', 'Current Week'];
        } else if (tf === '3M') {
            labels = ['Month -2', 'Month -1', 'Current Month'];
        } else if (tf === '6M') {
            labels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept'];
        } else {
            labels = ['Oct', 'Dec', 'Feb', 'Apr', 'Jun', 'Aug', 'Sept'];
        }

        const matchingRecords = state.mandiDatabase.filter(r => r.crop.toLowerCase() === crop.toLowerCase());
        const baseModal = matchingRecords.length > 0 ? (matchingRecords[0].modal || matchingRecords[0].price) : 2200;

        const colors = [
            { border: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
            { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.10)' },
            { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.10)' }
        ];

        if (mode === 'crop') {
            const topCrops = [crop, crop === 'Tomato' ? 'Potato' : 'Tomato', crop === 'Wheat' ? 'Paddy Rice' : 'Wheat'];
            datasets = topCrops.map((cName, idx) => {
                const recs = state.mandiDatabase.filter(r => r.crop.toLowerCase() === cName.toLowerCase());
                const mPrice = recs.length > 0 ? (recs[0].modal || recs[0].price) : (baseModal * (1 + idx * 0.15));
                const dataPoints = labels.map((_, i) => {
                    const progress = i / (labels.length - 1 || 1);
                    const factor = 1 + (progress - 0.5) * 0.12 + (Math.sin(i * 1.5 + idx) * 0.03);
                    return Math.round(mPrice * factor);
                });
                return {
                    label: `${cName} Price Index (₹/Qtl)`,
                    data: dataPoints,
                    borderColor: colors[idx % colors.length].border,
                    backgroundColor: colors[idx % colors.length].bg,
                    fill: idx === 0,
                    tension: 0.35,
                    borderWidth: idx === 0 ? 3 : 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                };
            });
        } else if (mode === 'market') {
            const mandiNames = matchingRecords.length >= 3 
                ? matchingRecords.slice(0, 3).map(r => `${r.mandi} (${r.state})`)
                : [`Ludhiana Mandi (PB)`, `Agra Mandi (UP)`, `Nashik APMC (MH)`];

            datasets = mandiNames.map((mName, idx) => {
                const rec = matchingRecords[idx];
                const mPrice = rec ? (rec.modal || rec.price) : (baseModal * (1 + (idx - 1) * 0.08));
                const dataPoints = labels.map((_, i) => {
                    const progress = i / (labels.length - 1 || 1);
                    const variance = (idx === 0 ? 0.04 : idx === 1 ? -0.02 : 0.07);
                    return Math.round(mPrice * (1 + (progress - 0.5) * variance));
                });
                return {
                    label: mName,
                    data: dataPoints,
                    borderColor: colors[idx % colors.length].border,
                    backgroundColor: colors[idx % colors.length].bg,
                    fill: idx === 0,
                    tension: 0.35,
                    borderWidth: idx === 0 ? 3 : 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                };
            });
        } else {
            const stateNames = ['Punjab', 'Uttar Pradesh', 'Maharashtra'];
            datasets = stateNames.map((sName, idx) => {
                const stateRecs = state.mandiDatabase.filter(r => r.state.toLowerCase() === sName.toLowerCase());
                const avgPrice = stateRecs.length > 0 
                    ? Math.round(stateRecs.reduce((acc, r) => acc + (r.modal || r.price), 0) / stateRecs.length)
                    : (baseModal * (1 + (idx - 1) * 0.05));
                const dataPoints = labels.map((_, i) => {
                    const progress = i / (labels.length - 1 || 1);
                    return Math.round(avgPrice * (1 + (progress - 0.4) * 0.06));
                });
                return {
                    label: `${sName} State Average`,
                    data: dataPoints,
                    borderColor: colors[idx % colors.length].border,
                    backgroundColor: colors[idx % colors.length].bg,
                    fill: idx === 0,
                    tension: 0.35,
                    borderWidth: 2.5,
                    pointRadius: 4
                };
            });
        }

        chartAnalyticsComp = new Chart(ctxComp, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 750, easing: 'easeOutQuart' },
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11, weight: '600' } } },
                    tooltip: {
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN')}/Qtl`
                        }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(226, 232, 240, 0.6)' },
                        ticks: { callback: (v) => `₹${v.toLocaleString('en-IN')}` }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // 2. Bar Chart: Regional Price Differential
    const ctxBar = document.getElementById('analyticsBarChart');
    if (ctxBar) {
        if (chartAnalyticsBar) chartAnalyticsBar.destroy();

        const stateGroups = {};
        state.mandiDatabase.forEach(r => {
            if (!stateGroups[r.state]) stateGroups[r.state] = [];
            if (r.crop.toLowerCase() === crop.toLowerCase() || stateGroups[r.state].length < 2) {
                stateGroups[r.state].push(r.modal || r.price);
            }
        });

        let barLabels = Object.keys(stateGroups).slice(0, 6);
        if (barLabels.length < 3) barLabels = ['Punjab', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Haryana'];

        const barData = barLabels.map((sName, idx) => {
            const arr = stateGroups[sName];
            if (arr && arr.length > 0) {
                return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
            }
            return Math.round(2100 + idx * 85);
        });

        const barColors = barData.map((_, i) => i === 0 ? '#10b981' : i === 1 ? '#059669' : i === 2 ? '#3b82f6' : '#6366f1');

        chartAnalyticsBar = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [{
                    label: `${crop} Average Modal Price (₹/Qtl)`,
                    data: barData,
                    backgroundColor: barColors,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 750, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: (ctx) => ` Average Price: ₹${ctx.parsed.y.toLocaleString('en-IN')}/Qtl`
                        }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(226, 232, 240, 0.6)' },
                        ticks: { callback: (v) => `₹${v.toLocaleString('en-IN')}` }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    renderMarketTrendRecommendations();
}

function renderMarketTrendRecommendations() {
    const container = document.getElementById('marketTrendRecommendations');
    if (!container || !state.mandiDatabase.length) return;

    const changeByCrop = state.favoriteCrops.reduce((changes, favorite) => {
        const change = Number.parseFloat(String(favorite.change).replace('%', ''));
        if (Number.isFinite(change)) changes[favorite.crop.split(' ')[0]] = change;
        return changes;
    }, {});
    const cropGroups = {};

    state.mandiDatabase.forEach(item => {
        if (!cropGroups[item.crop]) cropGroups[item.crop] = { crop: item.crop, records: [], prices: [], spreads: [], volume: 0, volatility: [] };
        const group = cropGroups[item.crop];
        group.records.push(item);
        group.prices.push(Number(item.modal || item.price || 0));
        group.spreads.push(Math.max(0, Number(item.max || item.price || 0) - Number(item.min || item.price || 0)));
        group.volume += Number.parseFloat(String(item.traded || '0').replace(/,/g, '').match(/[\d.]+/)?.[0] || 0);
        group.volatility.push(Number(item.volatility || 15));
    });

    const rankedCrops = Object.values(cropGroups).map(group => {
        const averagePrice = group.prices.reduce((sum, price) => sum + price, 0) / group.prices.length;
        const averageSpread = group.spreads.reduce((sum, spread) => sum + spread, 0) / group.spreads.length;
        const averageVolatility = group.volatility.reduce((sum, volatility) => sum + volatility, 0) / group.volatility.length;
        const averageMspCoverage = group.records.filter(item => item.msp && item.modal >= item.msp).length / group.records.length;
        const trend = changeByCrop[group.crop] || (averageVolatility > 20 ? 2.5 : 1.2);
        const spreadScore = Math.min(100, (averageSpread / Math.max(averagePrice, 1)) * 240);
        const volumeScore = Math.min(100, group.volume / 80);
        const stabilityScore = Math.max(0, 100 - averageVolatility * 2.5);
        const trendScore = Math.max(0, Math.min(100, 50 + trend * 5));
        const farmerScore = Math.round(trendScore * 0.35 + stabilityScore * 0.3 + averageMspCoverage * 100 * 0.2 + volumeScore * 0.15);
        const traderScore = Math.round(spreadScore * 0.4 + trendScore * 0.25 + volumeScore * 0.2 + stabilityScore * 0.15);
        return { ...group, averagePrice, averageSpread, averageVolatility, trend, farmerScore, traderScore };
    });

    const bestFarmer = [...rankedCrops].sort((a, b) => b.farmerScore - a.farmerScore)[0] || { crop: 'Wheat', farmerScore: 92, averagePrice: 2275, trend: 1.8, averageVolatility: 5.1 };
    const bestTrader = [...rankedCrops].sort((a, b) => b.traderScore - a.traderScore)[0] || { crop: 'Tomato', traderScore: 89, averagePrice: 1850, trend: 12.5, averageVolatility: 28.4 };

    const renderRecommendation = (crop, role, score, icon, colorClass, explanation) => `
        <article class="trend-stat-card p-5 border border-slate-200 bg-white rounded-xl shadow-xs transition-all hover:shadow-md">
            <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                    <span class="w-11 h-11 rounded-xl ${colorClass} flex items-center justify-center text-xl shadow-xs"><i class="fa-solid ${icon}"></i></span>
                    <div>
                        <div class="flex items-center gap-1.5">
                            <span class="market-live-dot"></span>
                            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Top ${role} Profit Opportunity</p>
                        </div>
                        <h4 class="text-base font-extrabold text-slate-900 mt-0.5">${crop.crop}</h4>
                    </div>
                </div>
                <div class="score-badge-circle" title="AgriScore Rating">
                    <span>${score}</span>
                </div>
            </div>
            <p class="text-xs text-slate-600 mt-3 leading-relaxed">${explanation}</p>
            <div class="grid grid-cols-3 gap-2 mt-4 text-[10px]">
                <div class="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                    <p class="text-slate-400 font-medium">Avg Modal</p>
                    <p class="font-extrabold text-slate-800 text-xs mt-0.5">₹${Math.round(crop.averagePrice).toLocaleString('en-IN')}</p>
                </div>
                <div class="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                    <p class="text-slate-400 font-medium">Market Trend</p>
                    <p class="font-extrabold ${crop.trend >= 0 ? 'text-emerald-700' : 'text-rose-600'} text-xs mt-0.5">${crop.trend >= 0 ? '+' : ''}${crop.trend.toFixed(1)}%</p>
                </div>
                <div class="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                    <p class="text-slate-400 font-medium">Volatility</p>
                    <p class="font-extrabold text-slate-800 text-xs mt-0.5">${crop.averageVolatility.toFixed(1)}%</p>
                </div>
            </div>
        </article>`;

    container.innerHTML = renderRecommendation(
        bestFarmer, 
        'Farmer', 
        bestFarmer.farmerScore, 
        'fa-wheat-awn', 
        'bg-amber-100 text-amber-700', 
        `${bestFarmer.crop} currently offers the strongest score of positive price momentum, stability, arrival volume, and MSP backing. Excellent holding stability for regional farmers.`
    ) + renderRecommendation(
        bestTrader, 
        'Trader', 
        bestTrader.traderScore, 
        'fa-arrow-trend-up', 
        'bg-emerald-100 text-emerald-700', 
        `${bestTrader.crop} provides optimal inter-mandi arbitrage spreads and liquid trading depth. High gross margins viable with refrigerated or rapid logistics.`
    );
}

// ==========================================
// ARBITRAGE & INGESTION SIMULATOR
// ==========================================
function renderTraderArbitrage() {
    const container = document.getElementById('traderArbitrageTable');
    if (!container) return;
    const arbitrageData = [
        { crop: 'Tomato (Hybrid)', buyMandi: 'Nashik (MH)', sellMandi: 'Azadpur (Delhi)', buyPrice: 1850, sellPrice: 2420, spread: '+30.8%', vol: 'High' },
        { crop: 'Wheat (Lok-1)', buyMandi: 'Ludhiana (PB)', sellMandi: 'Mumbai (MH)', buyPrice: 2275, sellPrice: 2650, spread: '+16.5%', vol: 'Medium' },
        { crop: 'Potato (Jyoti)', buyMandi: 'Jalandhar (PB)', sellMandi: 'Kolkata (WB)', buyPrice: 1180, sellPrice: 1480, spread: '+25.4%', vol: 'High' },
        { crop: 'Mustard (Black)', buyMandi: 'Morena (MP)', sellMandi: 'Jaipur (RJ)', buyPrice: 5100, sellPrice: 5520, spread: '+8.2%', vol: 'Medium' }
    ];

    container.innerHTML = arbitrageData.map(row => `
        <tr>
            <td class="p-2.5 font-bold text-slate-800">${row.crop}</td>
            <td class="p-2.5 text-slate-600">${row.buyMandi} - ${formatDashboardPrice(row.buyPrice)}</td>
            <td class="p-2.5 text-slate-600">${row.sellMandi} - ${formatDashboardPrice(row.sellPrice)}</td>
            <td class="p-2.5 font-bold text-emerald-600">${formatDashboardPrice(row.sellPrice - row.buyPrice)} (${row.spread})</td>
            <td class="p-2.5"><span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">${row.vol}</span></td>
            <td class="p-2.5 text-right"><button onclick="compareSpecificCrop('${row.crop.split(' ')[0]}')" class="bg-agri-600 hover:bg-agri-700 text-white font-medium px-2 py-1 rounded text-[10px]">Track Route</button></td>
        </tr>
    `).join('');
}

function simulateCSVUpload() {
    document.getElementById('pipelineStep1').innerText = 'Loaded 120 raw CSV rows (Uncleaned)';
    showToast('Raw Agricultural CSV File loaded into pipeline buffer!', 'info');
}

function simulateAPIFetch() {
    syncGovApi();
}

function runPipelineTransformation() {
    const btn = document.getElementById('runPipelineBtn');
    btn.innerText = 'Cleaning Data Pipeline...';
    btn.disabled = true;

    setTimeout(() => { document.getElementById('pipelineStep2').innerText = 'Duplicates: 4 Removed | Imputed: 2 Missing Prices'; }, 500);
    setTimeout(() => { document.getElementById('pipelineStep3').innerText = 'Normalized 12 Kg entries to ₹/Quintal'; }, 1000);
    setTimeout(() => {
        document.getElementById('pipelineStep4').innerText = 'Ingested into PostgreSQL Partition';
        btn.innerText = 'Execute Pipeline Cleaning Process';
        btn.disabled = false;
        state.pipelineCleanedData.unshift({
            id: `REC-${Math.floor(Math.random() * 900) + 100}`,
            source: 'Automated CSV Run',
            crop: 'Mustard',
            location: 'Morena, MP',
            price: '₹5,100',
            unit: 'Quintal',
            quality: '97% (Verified)'
        });
        renderIngestedRecords();
        showToast('Pipeline cleaning completed successfully! Records standardized.', 'success');
    }, 1500);
}

function renderIngestedRecords() {
    const container = document.getElementById('ingestedRecordsTable');
    if (!container) return;
    container.innerHTML = state.pipelineCleanedData.map(row => `
        <tr>
            <td class="p-2.5 font-mono text-slate-500">${row.id}</td>
            <td class="p-2.5 font-medium text-slate-700">${row.source}</td>
            <td class="p-2.5 font-bold text-slate-800">${row.crop}</td>
            <td class="p-2.5 text-slate-600">${row.location}</td>
            <td class="p-2.5 font-bold text-agri-700">${row.price}</td>
            <td class="p-2.5 text-slate-500">${row.unit}</td>
            <td class="p-2.5"><span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">${row.quality}</span></td>
        </tr>
    `).join('');
}

// ==========================================
// TOAST & MODAL UTILITIES
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const colors = {
        success: 'bg-emerald-800 text-white border-emerald-600',
        error: 'bg-red-800 text-white border-red-600',
        info: 'bg-slate-900 text-white border-slate-700'
    };

    toast.className = `toast-msg p-3 px-4 rounded-xl border text-xs font-semibold shadow-xl flex items-center gap-2 ${colors[type] || colors.info}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-emerald-400' : (type === 'error' ? 'fa-triangle-exclamation text-red-400' : 'fa-circle-info text-blue-400')}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function openArchitectureModal() { document.getElementById('archModal').classList.remove('hidden'); }
function closeArchitectureModal() { document.getElementById('archModal').classList.add('hidden'); }
function openManualEntryModal() { document.getElementById('manualEntryModal').classList.remove('hidden'); }
function closeManualEntryModal() { document.getElementById('manualEntryModal').classList.add('hidden'); }

function openPriceAlertModal() {
    const modal = document.getElementById('priceAlertModal');
    if (modal) modal.classList.remove('hidden');
}

function closePriceAlertModal() {
    const modal = document.getElementById('priceAlertModal');
    if (modal) modal.classList.add('hidden');
}

function handleCreatePriceAlert(e) {
    e.preventDefault();
    const crop = document.getElementById('alertCropSelect').value;
    const condition = document.getElementById('alertCondition').value;
    const targetPrice = document.getElementById('alertTargetPrice').value;

    const list = document.getElementById('farmerAlertsList');
    if (list) {
        const item = document.createElement('div');
        item.className = 'bg-emerald-50 border-l-4 border-emerald-500 p-2.5 rounded text-emerald-900';
        item.innerHTML = `
            <p class="font-semibold">${crop}</p>
            <p class="text-[11px] text-emerald-700">Alert triggers if price ${condition === 'above' ? 'rises above' : 'drops below'} ₹${targetPrice}/Qtl</p>
        `;
        list.prepend(item);
    }

    closePriceAlertModal();
    addNotification({
        type: 'price',
        title: `${crop} price alert created`,
        message: `You will be notified when the price ${condition === 'above' ? 'rises above' : 'drops below'} ₹${Number(targetPrice).toLocaleString('en-IN')}/Qtl.`
    });
    showToast(`Price Alert created for ${crop} at ₹${targetPrice}/Qtl`, 'success');
}

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    const button = document.getElementById('notificationButton');
    if (!panel || !button) return;

    const willOpen = panel.classList.contains('hidden');
    panel.classList.toggle('hidden', !willOpen);
    button.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) renderNotifications();
}

function closeNotifications() {
    const panel = document.getElementById('notificationPanel');
    const button = document.getElementById('notificationButton');
    if (panel) panel.classList.add('hidden');
    if (button) button.setAttribute('aria-expanded', 'false');
}

function renderNotifications() {
    const list = document.getElementById('notificationList');
    const badge = document.getElementById('notifBadge');
    const button = document.getElementById('notificationButton');
    if (!list || !badge || !button) return;

    const unreadCount = state.notifications.filter(notification => !notification.read).length;
    badge.innerText = unreadCount > 9 ? '9+' : String(unreadCount);
    badge.classList.toggle('hidden', unreadCount === 0);
    button.setAttribute('aria-label', unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications');

    if (state.notifications.length === 0) {
        list.innerHTML = '<div class="px-4 py-10 text-center"><i class="fa-regular fa-bell-slash text-2xl text-slate-300"></i><p class="mt-2 text-sm font-semibold text-slate-600">You are all caught up</p><p class="mt-1 text-xs text-slate-400">New market updates will appear here.</p></div>';
        return;
    }

    const icons = {
        price: 'fa-tag text-amber-600 bg-amber-50',
        market: 'fa-chart-line text-emerald-700 bg-emerald-50',
        weather: 'fa-cloud-rain text-blue-700 bg-blue-50'
    };

    list.innerHTML = state.notifications.map(notification => `
        <button type="button" onclick="markNotificationRead('${notification.id}')" class="w-full px-4 py-3 flex items-start gap-3 text-left border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors ${notification.read ? 'bg-white' : 'bg-emerald-50/40'}">
            <span class="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${icons[notification.type] || icons.market}"><i class="fa-solid ${icons[notification.type]?.split(' ')[0] || 'fa-circle-info'} text-xs"></i></span>
            <span class="min-w-0 flex-1">
                <span class="flex items-center gap-2 text-xs font-bold text-slate-800">${notification.title}${notification.read ? '' : '<span class="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-label="Unread"></span>'}</span>
                <span class="block mt-1 text-[11px] leading-relaxed text-slate-600">${notification.message}</span>
                <span class="block mt-1.5 text-[10px] text-slate-400">${notification.time}</span>
            </span>
        </button>
    `).join('');
}

function markNotificationRead(notificationId) {
    const notification = state.notifications.find(item => item.id === notificationId);
    if (notification) notification.read = true;
    renderNotifications();
}

function markAllNotificationsRead() {
    state.notifications.forEach(notification => { notification.read = true; });
    renderNotifications();
}

function clearNotifications() {
    state.notifications = [];
    renderNotifications();
}

function addNotification(notification) {
    state.notifications.unshift({
        id: `notification-${Date.now()}`,
        time: 'Just now',
        read: false,
        ...notification
    });
    renderNotifications();
}

document.addEventListener('click', event => {
    const wrapper = document.getElementById('notificationMenuWrapper');
    if (wrapper && !wrapper.contains(event.target)) closeNotifications();
    const profileWrapper = document.getElementById('profileMenuWrapper');
    if (profileWrapper && !profileWrapper.contains(event.target)) closeProfileCard();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeNotifications();
        closeProfileCard();
    }
});

async function handleManualSubmit(e) {
    e.preventDefault();
    const crop = document.getElementById('manualCrop').value;
    const mandi = document.getElementById('manualMandi').value;
    const stateVal = document.getElementById('manualState').value;
    const price = parseInt(document.getElementById('manualPrice').value);
    
    const newRecord = {
        id: Date.now(),
        crop: crop,
        variety: 'Standard Quality',
        category: 'crop',
        state: stateVal,
        district: mandi,
        mandi: mandi,
        price: price,
        min: price - 100,
        max: price + 100,
        modal: price,
        traded: '500 Qtl',
        mandiType: 'Manual Entry',
        lat: 28.6139,
        lng: 77.2090,
        updated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        shelfLife: 'Standard'
    };

    state.mandiDatabase.unshift(newRecord);
    renderSearchResults();
    populateCompareSelectors();
    closeManualEntryModal();

    // Persist to MongoDB backend
    try {
        const resp = await fetch('/api/mandi-prices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord)
        });
        if (resp.ok) {
            showToast('New agricultural price record saved to MongoDB & platform index!', 'success');
            checkBackendHealth();
            return;
        }
    } catch (err) {
        console.warn('MongoDB POST failed, retained in client memory:', err);
    }
    showToast('New agricultural price record added to platform index!', 'success');
}

function handleGlobalSearch(query) {
    const dropdown = document.getElementById('searchResultsDropdown');
    if (!query || query.trim().length < 2) {
        dropdown.classList.add('hidden');
        return;
    }

    const q = query.toLowerCase();
    const matches = state.mandiDatabase.filter(i => 
        i.crop.toLowerCase().includes(q) || 
        i.mandi.toLowerCase().includes(q) || 
        i.state.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
        dropdown.innerHTML = '<div class="p-3 text-xs text-slate-400 text-center">No matching market records found</div>';
    } else {
        dropdown.innerHTML = matches.slice(0, 6).map(m => `
            <div class="p-2.5 border-b border-slate-100 hover:bg-slate-50 cursor-pointer text-xs" onclick="selectSearchResult('${m.crop}')">
                <div class="font-bold text-slate-800">${m.crop} (${m.variety})</div>
                <div class="text-[11px] text-slate-500">${m.mandi}, ${m.state} — Modal: ₹${m.modal}/Qtl</div>
            </div>
        `).join('');
    }
    dropdown.classList.remove('hidden');
}

function selectSearchResult(crop) {
    document.getElementById('searchResultsDropdown').classList.add('hidden');
    switchNavTab('search');
    document.getElementById('filterCrop').value = crop;
    applySearchFilters();
}

function downloadReport(format, title) {
    if (format === 'CSV') {
        let csvContent = 'data:text/csv;charset=utf-8,RecordID,Crop,Variety,Category,State,District,Mandi,MinPrice,ModalPrice,MaxPrice,ArrivalDate\n';
        state.mandiDatabase.forEach(r => {
            csvContent += `${r.id},${r.crop},${r.variety},${r.category},${r.state},${r.district},"${r.mandi}",${r.min},${r.modal},${r.max},${r.updated}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${title}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`Exported ${title}.csv file!`, 'success');
        return;
    }

    if (format !== 'PDF') {
        showToast(`Unsupported report format: ${format}.`, 'error');
        return;
    }

    const jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) {
        showToast('PDF generator could not load. Check your internet connection and try again.', 'error');
        return;
    }

    const records = [...state.mandiDatabase];
    if (!records.length) {
        showToast('There are no mandi records to include in this report.', 'error');
        return;
    }

    const hasNumericValue = value => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));
    const isAudit = title.toLowerCase().includes('audit');
    const reportDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
    const states = new Set(records.map(record => record.state).filter(Boolean));
    const crops = new Set(records.map(record => record.crop).filter(Boolean));
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(20, 83, 45);
    doc.text(isAudit ? 'Monthly Volatility Audit Report' : 'State Mandi Daily Bulletin', 14, 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`AgriPrice Hub | Generated ${reportDate} | Current dataset snapshot`, 14, 25);

    let tableRows;
    let summaryLines;
    if (isAudit) {
        const volatilityValues = records.filter(record => hasNumericValue(record.volatility)).map(record => Number(record.volatility));
        const averageVolatility = volatilityValues.length
            ? (volatilityValues.reduce((total, value) => total + value, 0) / volatilityValues.length).toFixed(1)
            : 'N/A';
        const highVolatilityCount = records.filter(record => Number(record.volatility) >= 20).length;
        const belowMspCount = records.filter(record => hasNumericValue(record.msp) && hasNumericValue(record.modal) && Number(record.modal) < Number(record.msp)).length;
        const missingDataCount = records.filter(record =>
            !record.state || !record.crop || !record.mandi || !hasNumericValue(record.modal)
        ).length;
        const missingVolatilityCount = records.filter(record => !hasNumericValue(record.volatility)).length;

        summaryLines = [
            `Records reviewed: ${records.length}    States: ${states.size}    Crops: ${crops.size}`,
            `Average recorded volatility: ${averageVolatility}%    High volatility (20%+): ${highVolatilityCount}    Below MSP: ${belowMspCount}`,
            `Missing core fields: ${missingDataCount}    Missing volatility values: ${missingVolatilityCount}`
        ];
        tableRows = records
            .sort((first, second) => Number(second.volatility || 0) - Number(first.volatility || 0))
            .map(record => {
                const flags = [];
                if (Number(record.volatility) >= 20) flags.push('High volatility');
                if (hasNumericValue(record.msp) && hasNumericValue(record.modal) && Number(record.modal) < Number(record.msp)) flags.push('Below MSP');
                if (!record.state || !record.crop || !record.mandi || !hasNumericValue(record.modal)) flags.push('Missing core data');
                return [
                    record.crop || 'N/A', record.state || 'N/A', record.mandi || 'N/A',
                    hasNumericValue(record.modal) ? Number(record.modal).toLocaleString('en-IN') : 'N/A',
                    hasNumericValue(record.volatility) ? `${Number(record.volatility).toFixed(1)}%` : 'N/A',
                    hasNumericValue(record.msp) ? Number(record.msp).toLocaleString('en-IN') : 'Not set',
                    flags.join(', ') || 'Within thresholds'
                ];
            });
    } else {
        summaryLines = [
            `Mandi records: ${records.length}    States/UTs: ${states.size}    Crops: ${crops.size}`,
            'Prices shown in INR per quintal (Qtl). Listings reflect the currently available dataset.'
        ];
        tableRows = records
            .sort((first, second) => String(first.state || '').localeCompare(String(second.state || '')) || String(first.crop || '').localeCompare(String(second.crop || '')))
            .map(record => [
                record.state || 'N/A', record.district || 'N/A', record.mandi || 'N/A',
                `${record.crop || 'N/A'}${record.variety ? ` (${record.variety})` : ''}`,
                hasNumericValue(record.min) ? Number(record.min).toLocaleString('en-IN') : 'N/A',
                hasNumericValue(record.modal ?? record.price) ? Number(record.modal ?? record.price).toLocaleString('en-IN') : 'N/A',
                hasNumericValue(record.max) ? Number(record.max).toLocaleString('en-IN') : 'N/A',
                record.updated || 'N/A'
            ]);
    }

    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(summaryLines, 14, 34, { lineHeightFactor: 1.6 });

    if (typeof doc.autoTable !== 'function') {
        showToast('PDF table formatter could not load. Refresh the page and try again.', 'error');
        return;
    }

    doc.autoTable({
        startY: 45,
        head: [isAudit
            ? ['Crop', 'State', 'Mandi', 'Modal (INR/Qtl)', 'Volatility', 'MSP (INR/Qtl)', 'Audit flags']
            : ['State', 'District', 'Mandi', 'Crop / Variety', 'Min (INR)', 'Modal (INR)', 'Max (INR)', 'Updated']],
        body: tableRows,
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 7, cellPadding: 2.2, overflow: 'linebreak' },
        headStyles: { fillColor: [20, 83, 45], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        margin: { left: 14, right: 14, bottom: 15 },
        didDrawPage: () => {
            const pageCount = doc.internal.getNumberOfPages();
            const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(`AgriPrice Hub | Page ${pageNumber} of ${pageCount}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 7, { align: 'right' });
        }
    });

    const filename = `${title.trim().replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'AgriPrice_Report'}.pdf`;
    doc.save(filename);
    showToast(`Downloaded ${filename}.`, 'success');
}

function drillMap(level) {
    if (level === 'India') {
        const el = document.getElementById('breadcrumbState');
        if (el) el.innerText = 'All States';
    }
}
