
export interface ZodiacSignData {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  planet: string;
  dates: string;
  traits: string[];
  compatibility: string[];
  description: string;
}

export const zodiacSigns: ZodiacSignData[] = [
  {
    name: 'Aries',
    symbol: '♈',
    element: 'fire',
    planet: 'Mars',
    dates: 'March 21 - April 19',
    traits: ['Courageous', 'Determined', 'Confident', 'Enthusiastic', 'Impulsive'],
    compatibility: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
    description: 'Aries is the first sign of the zodiac, and those born under this sign are known for their fiery, passionate nature. They\'re natural leaders who are energetic and competitive, often taking initiative and pursuing their goals with determination.'
  },
  {
    name: 'Taurus',
    symbol: '♉',
    element: 'earth',
    planet: 'Venus',
    dates: 'April 20 - May 20',
    traits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Stubborn'],
    compatibility: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
    description: 'Taurus is known for being reliable, practical, ambitious and sensual. They value stability and tend to be determined and stubborn. They enjoy life\'s material pleasures and can be excellent at managing resources.'
  },
  {
    name: 'Gemini',
    symbol: '♊',
    element: 'air',
    planet: 'Mercury',
    dates: 'May 21 - June 20',
    traits: ['Gentle', 'Affectionate', 'Curious', 'Adaptable', 'Inconsistent'],
    compatibility: ['Libra', 'Aquarius', 'Aries', 'Leo'],
    description: 'Gemini is characterized by duality, adaptability, and intellectual curiosity. Those born under this sign are often excellent communicators who enjoy learning and sharing knowledge. They can be witty, social, and versatile.'
  },
  {
    name: 'Cancer',
    symbol: '♋',
    element: 'water',
    planet: 'Moon',
    dates: 'June 21 - July 22',
    traits: ['Tenacious', 'Highly Imaginative', 'Loyal', 'Emotional', 'Sympathetic'],
    compatibility: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
    description: 'Cancer is deeply emotional, intuitive, and sensitive. Those born under this sign are known for their nurturing nature and strong attachment to home and family. They can be protective, sympathetic, and highly imaginative.'
  },
  {
    name: 'Leo',
    symbol: '♌',
    element: 'fire',
    planet: 'Sun',
    dates: 'July 23 - August 22',
    traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Proud'],
    compatibility: ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
    description: 'Leo is known for its courage, creativity, and regal confidence. Those born under this sign are natural leaders with a flair for drama and a love of luxury. They\'re generous, loyal, and have a strong presence that draws others to them.'
  },
  {
    name: 'Virgo',
    symbol: '♍',
    element: 'earth',
    planet: 'Mercury',
    dates: 'August 23 - September 22',
    traits: ['Analytical', 'Kind', 'Hardworking', 'Practical', 'Critical'],
    compatibility: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
    description: 'Virgo is characterized by analytical thinking, attention to detail, and a methodical approach to life. Those born under this sign are practical, hardworking, and often perfectionistic, with a desire to be of service to others.'
  },
  {
    name: 'Libra',
    symbol: '♎',
    element: 'air',
    planet: 'Venus',
    dates: 'September 23 - October 22',
    traits: ['Diplomatic', 'Fair-minded', 'Social', 'Cooperative', 'Indecisive'],
    compatibility: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
    description: 'Libra is known for its sense of balance, harmony, and fairness. Those born under this sign value relationships and are diplomatic, cooperative, and social. They appreciate beauty and often have a strong aesthetic sense.'
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    element: 'water',
    planet: 'Pluto',
    dates: 'October 23 - November 21',
    traits: ['Resourceful', 'Powerful', 'Brave', 'Passionate', 'Secretive'],
    compatibility: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
    description: 'Scorpio is characterized by intensity, passion, and a powerful emotional nature. Those born under this sign are often resourceful, determined, and have a penetrating insight. They value truth and can be fiercely loyal.'
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    planet: 'Jupiter',
    dates: 'November 22 - December 21',
    traits: ['Generous', 'Idealistic', 'Great Sense of Humor', 'Enthusiastic', 'Restless'],
    compatibility: ['Aries', 'Leo', 'Libra', 'Aquarius'],
    description: 'Sagittarius is known for its love of freedom, adventure, and philosophical thinking. Those born under this sign are often enthusiastic, optimistic, and straightforward, with a desire to explore and expand their horizons.'
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    planet: 'Saturn',
    dates: 'December 22 - January 19',
    traits: ['Responsible', 'Disciplined', 'Self-control', 'Good managers', 'Reserved'],
    compatibility: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
    description: 'Capricorn is characterized by ambition, discipline, and a practical approach to life. Those born under this sign are often responsible, patient, and have a strong work ethic. They value tradition and can be excellent managers and organizers.'
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    element: 'air',
    planet: 'Uranus',
    dates: 'January 20 - February 18',
    traits: ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Detached'],
    compatibility: ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
    description: 'Aquarius is known for its originality, independence, and humanitarian outlook. Those born under this sign are often forward-thinking, intellectually curious, and value freedom and social justice.'
  },
  {
    name: 'Pisces',
    symbol: '♓',
    element: 'water',
    planet: 'Neptune',
    dates: 'February 19 - March 20',
    traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Escapist'],
    compatibility: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'],
    description: 'Pisces is characterized by compassion, artistic sensibility, and deep intuition. Those born under this sign are often imaginative, sensitive, and empathetic, with a strong spiritual or mystical inclination.'
  }
];

export const getZodiacSignByName = (name: string): ZodiacSignData | undefined => {
  return zodiacSigns.find(sign => sign.name.toLowerCase() === name.toLowerCase());
};

export const getCompatibility = (sign1: string, sign2: string): string => {
  const zodiac1 = getZodiacSignByName(sign1);
  const zodiac2 = getZodiacSignByName(sign2);
  
  if (!zodiac1 || !zodiac2) return "Unknown compatibility";
  
  if (zodiac1.compatibility.includes(zodiac2.name)) {
    return "High Compatibility ★★★★★";
  } else if (zodiac1.element === zodiac2.element) {
    return "Good Compatibility ★★★★☆";
  } else if (
    (zodiac1.element === 'fire' && zodiac2.element === 'air') ||
    (zodiac1.element === 'air' && zodiac2.element === 'fire') ||
    (zodiac1.element === 'earth' && zodiac2.element === 'water') ||
    (zodiac1.element === 'water' && zodiac2.element === 'earth')
  ) {
    return "Moderate Compatibility ★★★☆☆";
  } else {
    return "Challenging Compatibility ★★☆☆☆";
  }
};
