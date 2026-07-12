export interface City {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export const INDIAN_CITIES: City[] = [
  // Maharashtra
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
  { name: "Thane", state: "Maharashtra", lat: 19.1828, lng: 72.9612 },
  { name: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898 },
  { name: "Aurangabad", state: "Maharashtra", lat: 19.8762, lng: 75.3433 },
  { name: "Solapur", state: "Maharashtra", lat: 17.6599, lng: 75.9064 },
  { name: "Amravati", state: "Maharashtra", lat: 20.9320, lng: 77.7523 },
  { name: "Kolhapur", state: "Maharashtra", lat: 16.7050, lng: 74.2433 },
  { name: "Navi Mumbai", state: "Maharashtra", lat: 19.0330, lng: 73.0297 },
  // Delhi
  { name: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.2090 },
  { name: "New Delhi", state: "Delhi", lat: 28.6149, lng: 77.2090 },
  // Karnataka
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Mysore", state: "Karnataka", lat: 12.2958, lng: 76.6394 },
  { name: "Hubli", state: "Karnataka", lat: 15.3647, lng: 75.1240 },
  { name: "Mangalore", state: "Karnataka", lat: 12.9141, lng: 74.8560 },
  { name: "Belgaum", state: "Karnataka", lat: 15.8497, lng: 74.4977 },
  { name: "Gulbarga", state: "Karnataka", lat: 17.3294, lng: 76.8343 },
  // Tamil Nadu
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", state: "Tamil Nadu", lat: 9.9252, lng: 78.1198 },
  { name: "Tiruchirappalli", state: "Tamil Nadu", lat: 10.7905, lng: 78.7047 },
  { name: "Salem", state: "Tamil Nadu", lat: 11.6643, lng: 78.1460 },
  { name: "Tiruppur", state: "Tamil Nadu", lat: 11.1085, lng: 77.3411 },
  // West Bengal
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Howrah", state: "West Bengal", lat: 22.5958, lng: 88.2636 },
  { name: "Darjeeling", state: "West Bengal", lat: 27.0410, lng: 88.2627 },
  { name: "Siliguri", state: "West Bengal", lat: 26.7271, lng: 88.3953 },
  { name: "Asansol", state: "West Bengal", lat: 23.6889, lng: 86.9749 },
  { name: "Durgapur", state: "West Bengal", lat: 23.5204, lng: 87.3119 },
  // Andhra Pradesh
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
  { name: "Vijayawada", state: "Andhra Pradesh", lat: 16.5062, lng: 80.6480 },
  { name: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lng: 80.4365 },
  { name: "Nellore", state: "Andhra Pradesh", lat: 14.4426, lng: 79.9865 },
  { name: "Tirupati", state: "Andhra Pradesh", lat: 13.6288, lng: 79.4192 },
  // Telangana
  { name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867 },
  { name: "Warangal", state: "Telangana", lat: 18.0000, lng: 79.5800 },
  { name: "Nizamabad", state: "Telangana", lat: 18.6725, lng: 78.0941 },
  // Gujarat
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
  { name: "Vadodara", state: "Gujarat", lat: 22.3072, lng: 73.1812 },
  { name: "Rajkot", state: "Gujarat", lat: 22.3039, lng: 70.8022 },
  { name: "Jamnagar", state: "Gujarat", lat: 22.4707, lng: 70.0577 },
  { name: "Bhavnagar", state: "Gujarat", lat: 21.7645, lng: 72.1519 },
  { name: "Gandhinagar", state: "Gujarat", lat: 23.2156, lng: 72.6369 },
  // Rajasthan
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243 },
  { name: "Kota", state: "Rajasthan", lat: 25.1800, lng: 75.8300 },
  { name: "Udaipur", state: "Rajasthan", lat: 24.5854, lng: 73.7125 },
  { name: "Bikaner", state: "Rajasthan", lat: 28.0166, lng: 73.3119 },
  { name: "Ajmer", state: "Rajasthan", lat: 26.4499, lng: 74.6399 },
  // Uttar Pradesh
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319 },
  { name: "Ghaziabad", state: "Uttar Pradesh", lat: 28.6692, lng: 77.4538 },
  { name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081 },
  { name: "Meerut", state: "Uttar Pradesh", lat: 28.9845, lng: 77.7064 },
  { name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
  { name: "Prayagraj", state: "Uttar Pradesh", lat: 25.4358, lng: 81.8463 },
  { name: "Bareilly", state: "Uttar Pradesh", lat: 28.3670, lng: 79.4304 },
  { name: "Aligarh", state: "Uttar Pradesh", lat: 27.8974, lng: 78.0880 },
  { name: "Moradabad", state: "Uttar Pradesh", lat: 28.8351, lng: 78.7749 },
  { name: "Gorakhpur", state: "Uttar Pradesh", lat: 26.7606, lng: 83.3731 },
  { name: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.3910 },
  { name: "Jhansi", state: "Uttar Pradesh", lat: 25.4484, lng: 78.5685 },
  { name: "Mathura", state: "Uttar Pradesh", lat: 27.4924, lng: 77.6737 },
  { name: "Ayodhya", state: "Uttar Pradesh", lat: 26.7922, lng: 82.1998 },
  // Bihar
  { name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  { name: "Gaya", state: "Bihar", lat: 24.7955, lng: 84.9994 },
  { name: "Bhagalpur", state: "Bihar", lat: 25.2425, lng: 87.0145 },
  { name: "Muzaffarpur", state: "Bihar", lat: 26.1196, lng: 85.3910 },
  { name: "Darbhanga", state: "Bihar", lat: 26.1542, lng: 85.8918 },
  // Madhya Pradesh
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { name: "Jabalpur", state: "Madhya Pradesh", lat: 23.1608, lng: 79.9378 },
  { name: "Gwalior", state: "Madhya Pradesh", lat: 26.2183, lng: 78.1828 },
  { name: "Ujjain", state: "Madhya Pradesh", lat: 23.1760, lng: 75.7885 },
  // Punjab
  { name: "Ludhiana", state: "Punjab", lat: 30.9010, lng: 75.8573 },
  { name: "Amritsar", state: "Punjab", lat: 31.6340, lng: 74.8723 },
  { name: "Jalandhar", state: "Punjab", lat: 31.3260, lng: 75.5762 },
  { name: "Patiala", state: "Punjab", lat: 30.3398, lng: 76.3869 },
  { name: "Mohali", state: "Punjab", lat: 30.6970, lng: 76.7218 },
  // Haryana
  { name: "Gurugram", state: "Haryana", lat: 28.4595, lng: 77.0266 },
  { name: "Faridabad", state: "Haryana", lat: 28.4089, lng: 77.3178 },
  { name: "Panipat", state: "Haryana", lat: 29.3909, lng: 76.9635 },
  { name: "Ambala", state: "Haryana", lat: 30.3782, lng: 76.7767 },
  // Kerala
  { name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  { name: "Kozhikode", state: "Kerala", lat: 11.2588, lng: 75.7804 },
  // Odisha
  { name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245 },
  { name: "Cuttack", state: "Odisha", lat: 20.4625, lng: 85.8830 },
  { name: "Rourkela", state: "Odisha", lat: 22.2604, lng: 84.8536 },
  // Chhattisgarh
  { name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296 },
  { name: "Bhilai", state: "Chhattisgarh", lat: 21.1938, lng: 81.3509 },
  // Jharkhand
  { name: "Ranchi", state: "Jharkhand", lat: 23.3441, lng: 85.3096 },
  { name: "Jamshedpur", state: "Jharkhand", lat: 22.8046, lng: 86.2029 },
  { name: "Dhanbad", state: "Jharkhand", lat: 23.7957, lng: 86.4304 },
  // Assam
  { name: "Guwahati", state: "Assam", lat: 26.1158, lng: 91.7086 },
  { name: "Dibrugarh", state: "Assam", lat: 27.4728, lng: 94.9120 },
  // Uttarakhand
  { name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { name: "Haridwar", state: "Uttarakhand", lat: 29.9457, lng: 78.1642 },
  // Himachal Pradesh
  { name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
  { name: "Dharamshala", state: "Himachal Pradesh", lat: 32.2190, lng: 76.3234 },
  // Goa
  { name: "Panaji", state: "Goa", lat: 15.4909, lng: 73.8278 },
  // UTs & Others
  { name: "Srinagar", state: "Jammu and Kashmir", lat: 34.0837, lng: 74.7973 },
  { name: "Jammu", state: "Jammu and Kashmir", lat: 32.7266, lng: 74.8570 },
  { name: "Leh", state: "Ladakh", lat: 34.1526, lng: 77.5771 },
  { name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Puducherry", state: "Puducherry", lat: 11.9416, lng: 79.8083 },
  { name: "Port Blair", state: "Andaman and Nicobar", lat: 11.6234, lng: 92.7265 }
];
