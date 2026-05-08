// Mock Data for CivicEye AI Prototype

const mapCenter = [12.9716, 77.5946]; // Bengaluru Center

const mockHazards = [
  {
    id: 1,
    lat: 12.9279,
    lng: 77.6271,
    type: 'flood',
    severity: 'high',
    location: 'Koramangala 80ft Road',
    desc: 'Severe waterlogging, knee-deep water',
    time: '10 mins ago',
    icon: '🌊'
  },
  {
    id: 2,
    lat: 12.9345,
    lng: 77.6746,
    type: 'flood',
    severity: 'high',
    location: 'Bellandur Lake Road',
    desc: 'Water overlapping road surface',
    time: '25 mins ago',
    icon: '🌊'
  },
  {
    id: 3,
    lat: 12.9569,
    lng: 77.7011,
    type: 'pothole',
    severity: 'moderate',
    location: 'Marathahalli Bridge',
    desc: 'Multiple deep potholes in middle lane',
    time: '1 hour ago',
    icon: '🕳️'
  },
  {
    id: 4,
    lat: 12.9121,
    lng: 77.6446,
    type: 'construction',
    severity: 'moderate',
    location: 'HSR Layout Sector 2',
    desc: 'Road dug up for pipeline work',
    time: '3 hours ago',
    icon: '🚧'
  },
  {
    id: 5,
    lat: 12.9784,
    lng: 77.6408,
    type: 'pothole',
    severity: 'low',
    location: 'Indiranagar 100ft Road',
    desc: 'Uneven surface and minor cracks',
    time: '4 hours ago',
    icon: '🕳️'
  },
  {
    id: 6,
    lat: 12.9698,
    lng: 77.7499,
    type: 'traffic',
    severity: 'high',
    location: 'Whitefield Main Road',
    desc: 'Heavy traffic due to waterlogging',
    time: '15 mins ago',
    icon: '🚦'
  }
];

const dashboardData = {
  riskZones: [
    { icon: '🌊', title: 'Bellandur EcoSpace', desc: 'High waterlogging risk (90%)', time: 'Live' },
    { icon: '🕳️', title: 'Silk Board Junction', desc: 'Multiple severe potholes reported', time: 'Live' },
    { icon: '🚧', title: 'Outer Ring Road', desc: 'Metro construction bottleneck', time: 'Live' }
  ],
  predictions: [
    { icon: '🌧️', title: 'Koramangala 4th Block', desc: 'Likely to flood in next 30 mins based on rain intensity', time: '+30m' },
    { icon: '🚗', title: 'Marathahalli Bridge', desc: 'Traffic likely to stall due to damaged road surface', time: '+45m' },
    { icon: '⚠️', title: 'HSR Layout Sector 1', desc: 'High risk for two-wheelers due to low visibility', time: '+1h' }
  ],
  reports: [
    { icon: '📱', title: 'Citizen Report #4892', desc: 'Video upload: "Water up to silencer level near RMZ Ecospace"', time: '2 mins ago' },
    { icon: '📱', title: 'Citizen Report #4891', desc: 'Image upload: "Cracked road near Indiranagar metro"', time: '12 mins ago' },
    { icon: '📱', title: 'Citizen Report #4890', desc: 'Voice complaint: "Ambulance stuck near Silk Board due to flood"', time: '18 mins ago' }
  ]
};

const routeMockData = {
  from: 'Marathahalli',
  to: 'HSR Layout',
  primaryRoute: {
    name: 'via Outer Ring Road',
    time: '45 mins',
    distance: '12 km',
    safetyScore: 35, // low
    issues: ['Severe Flooding', 'Potholes']
  },
  alternateRoute: {
    name: 'via HAL Old Airport Road & Inner Ring Road',
    time: '55 mins',
    distance: '15.5 km',
    safetyScore: 88, // high
    issues: ['Minor Traffic']
  }
};

// Export for Node.js testing environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mockHazards, dashboardData, routeMockData, mapCenter };
}
