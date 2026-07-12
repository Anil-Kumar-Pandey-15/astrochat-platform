import React, { useState } from 'react';
import { PlanetaryPosition, ZODIAC_SIGNS } from '../lib/astroEngine';
import { useTranslation } from '../hooks/useTranslation';

interface KundaliChartProps {
  planets: PlanetaryPosition[];
  title?: string;
}

export const KundaliChart: React.FC<KundaliChartProps> = ({ planets, title = "Lagna Chart" }) => {
  const { t, language } = useTranslation();
  const [style, setStyle] = useState<'north' | 'south'>('north');

  // Find Ascendant (Lagna) sign index (0-11)
  const ascendantPlanet = planets.find(p => p.name === "Ascendant");
  const ascendantSign = ascendantPlanet ? ascendantPlanet.sign : "Aries";
  const ascIndex = ZODIAC_SIGNS.indexOf(ascendantSign);

  // Group planets by house (1-12)
  const planetsByHouse: Record<number, PlanetaryPosition[]> = {};
  for (let i = 1; i <= 12; i++) {
    planetsByHouse[i] = [];
  }
  planets.forEach(p => {
    if (p.name !== "Ascendant") {
      planetsByHouse[p.house]?.push(p);
    }
  });

  // Localized abbreviations for planets
  const getPlanetAbbr = (name: string) => {
    const isHindi = ['hi', 'mr', 'ta', 'te', 'gu', 'bn', 'kn'].includes(language);
    if (isHindi) {
      switch (name) {
        case "Sun": return "सू";
        case "Moon": return "च";
        case "Mars": return "मं";
        case "Mercury": return "बु";
        case "Jupiter": return "गु";
        case "Venus": return "शु";
        case "Saturn": return "श";
        case "Rahu": return "रा";
        case "Ketu": return "के";
        default: return name.substring(0, 2);
      }
    } else {
      switch (name) {
        case "Sun": return "Su";
        case "Moon": return "Mo";
        case "Mars": return "Ma";
        case "Mercury": return "Me";
        case "Jupiter": return "Ju";
        case "Venus": return "Ve";
        case "Saturn": return "Sa";
        case "Rahu": return "Ra";
        case "Ketu": return "Ke";
        default: return name.substring(0, 2);
      }
    }
  };

  // Sign number in North Indian house
  const getSignNumForNorthHouse = (houseNum: number) => {
    return (ascIndex + houseNum - 1) % 12 + 1;
  };

  const renderNorthIndian = () => {
    // 12 houses centers & planet layout coordinates
    const houseCenters = [
      { house: 1, x: 200, y: 130, signX: 200, signY: 175 },
      { house: 2, x: 100, y: 70, signX: 130, signY: 85 },
      { house: 3, x: 70, y: 100, signX: 85, signY: 130 },
      { house: 4, x: 130, y: 200, signX: 175, signY: 200 },
      { house: 5, x: 70, y: 300, signX: 85, signY: 270 },
      { house: 6, x: 100, y: 330, signX: 130, signY: 315 },
      { house: 7, x: 200, y: 270, signX: 200, signY: 225 },
      { house: 8, x: 300, y: 330, signX: 270, signY: 315 },
      { house: 9, x: 330, y: 300, signX: 315, signY: 270 },
      { house: 10, x: 270, y: 200, signX: 225, signY: 200 },
      { house: 11, x: 330, y: 100, signX: 315, signY: 130 },
      { house: 12, x: 300, y: 70, signX: 270, signY: 85 }
    ];

    return (
      <svg className="w-full h-full border border-purple-900/30 rounded bg-black/40 shadow-inner" viewBox="0 0 400 400">
        {/* Outer Square */}
        <rect x="10" y="10" width="380" height="380" fill="none" stroke="#a855f7" strokeWidth="2.5" />
        
        {/* Diagonals */}
        <line x1="10" y1="10" x2="390" y2="390" stroke="#a855f7" strokeWidth="1.5" />
        <line x1="390" y1="10" x2="10" y2="390" stroke="#a855f7" strokeWidth="1.5" />

        {/* Inner Diamond */}
        <line x1="200" y1="10" x2="10" y2="200" stroke="#a855f7" strokeWidth="1.5" />
        <line x1="10" y1="200" x2="200" y2="390" stroke="#a855f7" strokeWidth="1.5" />
        <line x1="200" y1="390" x2="390" y2="200" stroke="#a855f7" strokeWidth="1.5" />
        <line x1="390" y1="200" x2="200" y2="10" stroke="#a855f7" strokeWidth="1.5" />

        {/* Render sign numbers and planets */}
        {houseCenters.map((hc) => {
          const signNum = getSignNumForNorthHouse(hc.house);
          const housePlanets = planetsByHouse[hc.house] || [];
          
          return (
            <g key={hc.house} className="select-none">
              {/* House Number (Vedic Sign Number) */}
              <text 
                x={hc.signX} 
                y={hc.signY} 
                textAnchor="middle" 
                fontSize="12" 
                fontWeight="bold" 
                fill="#cbd5e1"
              >
                {signNum}
              </text>
              
              {/* House identifier indicator in small text for reference */}
              {hc.house === 1 && (
                <text x="200" y="120" textAnchor="middle" fontSize="9" fill="#a855f7" opacity="0.6">
                  ल (Lagn)
                </text>
              )}

              {/* Planet Abbreviations */}
              <text 
                x={hc.x} 
                y={hc.y} 
                textAnchor="middle" 
                fontSize="13" 
                fill="#e879f9"
                fontWeight="600"
              >
                {housePlanets.map((p, idx) => {
                  const tag = getPlanetAbbr(p.name) + (p.retrograde ? "(R)" : "");
                  return idx === 0 ? tag : ` , ${tag}`;
                })}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderSouthIndian = () => {
    // South Indian layout represents 12 static sign boxes arranged in a border loop.
    // 0: Pisces, 1: Aries, 2: Taurus, 3: Gemini
    // 4: Cancer, 5: Leo, 6: Virgo, 7: Libra
    // 8: Scorpio, 9: Sagittarius, 10: Capricorn, 11: Aquarius
    const boxRashiNames = [
      "मीन / Pisces", "मेष / Aries", "वृषभ / Taurus", "मिथुन / Gemini",
      "कर्क / Cancer", "सिंह / Leo", "कन्या / Virgo", "तुला / Libra",
      "वृश्चिक / Scorpio", "धनु / Sagittarius", "मकर / Capricorn", "कुंभ / Aquarius"
    ];

    const boxCoordinates = [
      { signIdx: 11, col: 0, row: 0 }, // Pisces (fixed at 11 in standard counting)
      { signIdx: 0, col: 1, row: 0 },  // Aries
      { signIdx: 1, col: 2, row: 0 },  // Taurus
      { signIdx: 2, col: 3, row: 0 },  // Gemini
      { signIdx: 3, col: 3, row: 1 },  // Cancer
      { signIdx: 4, col: 3, row: 2 },  // Leo
      { signIdx: 5, col: 3, row: 3 },  // Virgo
      { signIdx: 6, col: 2, row: 3 },  // Libra
      { signIdx: 7, col: 1, row: 3 },  // Scorpio
      { signIdx: 8, col: 0, row: 3 },  // Sagittarius
      { signIdx: 9, col: 0, row: 2 },  // Capricorn
      { signIdx: 10, col: 0, row: 1 }  // Aquarius
    ];

    const getBoxSignIdx = (col: number, row: number) => {
      if (row === 0 && col === 0) return 11; // Pisces
      if (row === 0 && col === 1) return 0;  // Aries
      if (row === 0 && col === 2) return 1;  // Taurus
      if (row === 0 && col === 3) return 2;  // Gemini
      if (row === 1 && col === 3) return 3;  // Cancer
      if (row === 2 && col === 3) return 4;  // Leo
      if (row === 3 && col === 3) return 5;  // Virgo
      if (row === 3 && col === 2) return 6;  // Libra
      if (row === 3 && col === 1) return 7;  // Scorpio
      if (row === 3 && col === 0) return 8;  // Sagittarius
      if (row === 2 && col === 0) return 9;  // Capricorn
      if (row === 1 && col === 0) return 10; // Aquarius
      return -1;
    };

    const w = 95;
    const h = 95;

    return (
      <svg className="w-full h-full border border-purple-900/30 rounded bg-black/40 shadow-inner" viewBox="0 0 400 400">
        {/* Draw 4x4 grid boxes */}
        {Array.from({ length: 4 }).map((_, r) =>
          Array.from({ length: 4 }).map((_, c) => {
            // Skip the central 4 boxes
            if (r > 0 && r < 3 && c > 0 && c < 3) {
              if (r === 1 && c === 1) {
                return (
                  <rect 
                    key={`center`}
                    x={w + 10} 
                    y={h + 10} 
                    width={w * 2} 
                    height={h * 2} 
                    fill="#a855f7" 
                    fillOpacity="0.05"
                  />
                );
              }
              return null;
            }

            const x = 10 + c * w;
            const y = 10 + r * h;
            const signIdx = getBoxSignIdx(c, r);
            const signName = signIdx !== -1 ? ZODIAC_SIGNS[signIdx] : "";
            
            // Find planets in this sign
            const planetsInSign = planets.filter(p => p.sign === signName);
            const isLagna = ascendantSign === signName;

            return (
              <g key={`${r}-${c}`}>
                <rect 
                  x={x} 
                  y={y} 
                  width={w} 
                  height={h} 
                  fill="none" 
                  stroke="#a855f7" 
                  strokeWidth="1.5"
                />
                
                {/* Diagonal line if Lagna is here */}
                {isLagna && (
                  <line 
                    x1={x} 
                    y1={y} 
                    x2={x + w} 
                    y2={y + h} 
                    stroke="#e879f9" 
                    strokeWidth="1" 
                    strokeDasharray="2"
                  />
                )}

                {/* Box header - Sign name abbreviation */}
                {signIdx !== -1 && (
                  <text 
                    x={x + 5} 
                    y={y + 15} 
                    fontSize="9" 
                    fill="#94a3b8"
                  >
                    {language === 'en' ? ZODIAC_SIGNS[signIdx].substring(0, 3) : HINDI_ZODIAC_SIGNS[signIdx]}
                  </text>
                )}

                {/* Lagna indicator label */}
                {isLagna && (
                  <text 
                    x={x + w - 25} 
                    y={y + 15} 
                    fontSize="10" 
                    fill="#a855f7" 
                    fontWeight="bold"
                  >
                    ल / L
                  </text>
                )}

                {/* Planets text */}
                <text 
                  x={x + w/2} 
                  y={y + h/2 + 5} 
                  textAnchor="middle" 
                  fontSize="12" 
                  fill="#e879f9"
                  fontWeight="600"
                >
                  {planetsInSign
                    .filter(p => p.name !== "Ascendant")
                    .map(p => getPlanetAbbr(p.name) + (p.retrograde ? "R" : ""))
                    .join(", ")}
                </text>
              </g>
            );
          })
        )}
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full items-center mb-4">
        <h3 className="text-lg font-semibold text-purple-200">{title}</h3>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setStyle('north')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-l-md transition-all ${
              style === 'north'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-purple-950/40 text-purple-300 border border-purple-900/50 hover:bg-purple-900/30'
            }`}
          >
            {language === 'en' ? 'North Indian' : 'उत्तर भारतीय'}
          </button>
          <button
            onClick={() => setStyle('south')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-r-md transition-all ${
              style === 'south'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-purple-950/40 text-purple-300 border border-purple-900/50 hover:bg-purple-900/30'
            }`}
          >
            {language === 'en' ? 'South Indian' : 'दक्षिण भारतीय'}
          </button>
        </div>
      </div>

      <div className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[400px] md:h-[400px]">
        {style === 'north' ? renderNorthIndian() : renderSouthIndian()}
      </div>
    </div>
  );
};
export default KundaliChart;
