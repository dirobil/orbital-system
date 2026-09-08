import { useState, useEffect, useRef, useCallback } from 'react';

interface Planet {
  name: string;
  nameRu: string;
  radius: number; // визуальный радиус
  orbitRadius: number; // визуальный радиус орбиты
  realRadius: string; // реальный радиус
  distance: string; // расстояние от Солнца
  orbitalPeriod: string; // орбитальный период
  color: string;
  speed: number; // скорость вращения (радиан/кадр)
  angle: number; // текущий угол
  description: string;
}

const planetsData: Planet[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    radius: 4,
    orbitRadius: 60,
    realRadius: '2 439 км',
    distance: '57.9 млн км',
    orbitalPeriod: '88 дней',
    color: '#b5b5b5',
    speed: 0.04,
    angle: Math.random() * Math.PI * 2,
    description: 'Ближайшая к Солнцу планета. Самая маленькая планета Солнечной системы.'
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    radius: 7,
    orbitRadius: 95,
    realRadius: '6 052 км',
    distance: '108.2 млн км',
    orbitalPeriod: '225 дней',
    color: '#e8cda0',
    speed: 0.015,
    angle: Math.random() * Math.PI * 2,
    description: 'Вторая планета от Солнца. Самая горячая планета из-за парникового эффекта.'
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    radius: 8,
    orbitRadius: 130,
    realRadius: '6 371 км',
    distance: '149.6 млн км',
    orbitalPeriod: '365.25 дней',
    color: '#4da6ff',
    speed: 0.01,
    angle: Math.random() * Math.PI * 2,
    description: 'Наш дом. Единственная известная планета с жизнью.'
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    radius: 5,
    orbitRadius: 170,
    realRadius: '3 390 км',
    distance: '227.9 млн км',
    orbitalPeriod: '687 дней',
    color: '#e07040',
    speed: 0.008,
    angle: Math.random() * Math.PI * 2,
    description: 'Красная планета. Имеет самую высокую гору — Олимп.'
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    radius: 18,
    orbitRadius: 230,
    realRadius: '69 911 км',
    distance: '778.5 млн км',
    orbitalPeriod: '11.86 лет',
    color: '#d4a574',
    speed: 0.004,
    angle: Math.random() * Math.PI * 2,
    description: 'Самая большая планета. Газовый гигант с Большим Красным Пятном.'
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    radius: 15,
    orbitRadius: 295,
    realRadius: '58 232 км',
    distance: '1 434 млн км',
    orbitalPeriod: '29.46 лет',
    color: '#f0d890',
    speed: 0.003,
    angle: Math.random() * Math.PI * 2,
    description: 'Знаменита своими кольцами из льда и камней.'
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    radius: 11,
    orbitRadius: 355,
    realRadius: '25 362 км',
    distance: '2 871 млн км',
    orbitalPeriod: '84.01 лет',
    color: '#7fdbdb',
    speed: 0.002,
    angle: Math.random() * Math.PI * 2,
    description: 'Ледяной гигант. Вращается «на боку» — ось наклонена на 98°.'
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    radius: 10,
    orbitRadius: 410,
    realRadius: '24 622 км',
    distance: '4 495 млн км',
    orbitalPeriod: '164.8 лет',
    color: '#4169e1',
    speed: 0.001,
    angle: Math.random() * Math.PI * 2,
    description: 'Самая дальняя планета. Самые сильные ветры в Солнечной системе.'
  }
];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const planetsRef = useRef<Planet[]>(planetsData.map(p => ({ ...p })));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const drawSolarSystem = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Очистка
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Звёзды на фоне
    drawStars(ctx, width, height);

    // Рисуем орбиты
    planetsRef.current.forEach(planet => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Рисуем Солнце
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
    sunGradient.addColorStop(0, '#fff7e0');
    sunGradient.addColorStop(0.3, '#ffdd00');
    sunGradient.addColorStop(0.7, '#ff8c00');
    sunGradient.addColorStop(1, '#ff4500');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Свечение Солнца
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 55);
    glowGradient.addColorStop(0, 'rgba(255, 200, 0, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Рисуем планеты
    planetsRef.current.forEach(planet => {
      const x = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const y = centerY + Math.sin(planet.angle) * planet.orbitRadius;

      // Тень планеты
      const planetGradient = ctx.createRadialGradient(
        x - planet.radius * 0.3, y - planet.radius * 0.3, 0,
        x, y, planet.radius
      );
      planetGradient.addColorStop(0, lightenColor(planet.color, 30));
      planetGradient.addColorStop(1, planet.color);

      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planetGradient;
      ctx.fill();

      // Кольца Сатурна
      if (planet.name === 'Saturn') {
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius * 2, planet.radius * 0.5, 0.3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(210, 180, 120, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Подсветка выбранной планеты
      if (selectedPlanet && selectedPlanet.name === planet.name) {
        ctx.beginPath();
        ctx.arc(x, y, planet.radius + 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Название планеты
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(planet.nameRu, x, y + planet.radius + 15);
    });
  }, [selectedPlanet]);

  const starsRef = useRef<{x: number, y: number, size: number, opacity: number}[]>([]);

  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 200; i++) {
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
    }
    starsRef.current.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });
  };

  const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `rgb(${R}, ${G}, ${B})`;
  };

  const animate = useCallback(() => {
    if (isPlayingRef.current) {
      planetsRef.current.forEach(planet => {
        planet.angle += planet.speed * speedRef.current;
      });
    }
    drawSolarSystem();
    animationRef.current = requestAnimationFrame(animate);
  }, [drawSolarSystem]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      starsRef.current = []; // Пересоздать звёзды при ресайзе
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let clicked = false;
    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.orbitRadius;
      const py = centerY + Math.sin(planet.angle) * planet.orbitRadius;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);

      if (dist <= planet.radius + 10) {
        setSelectedPlanet({ ...planet });
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      setSelectedPlanet(null);
    }
  };

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      {/* Заголовок */}
      <header className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-[#0d0d2b] to-[#1a1a3e] border-b border-purple-900/30 z-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☀️</span>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            Солнечная система
          </h1>
        </div>
        <div className="text-sm text-gray-400 hidden md:block">
          Нажмите на планету для информации
        </div>
      </header>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="flex-1 cursor-pointer"
          onClick={handleCanvasClick}
        />

        {/* Панель управления */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10 shadow-2xl z-20">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            title={isPlaying ? 'Пауза' : 'Воспроизведение'}
          >
            {isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            )}
          </button>

          {/* Разделитель */}
          <div className="w-px h-8 bg-white/20"></div>

          {/* Скорость */}
          <div className="flex items-center gap-3">
            <span className="text-white/70 text-sm whitespace-nowrap">Скорость:</span>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-24 md:w-32 accent-purple-500"
            />
            <span className="text-white font-mono text-sm min-w-[40px]">
              {speed.toFixed(1)}x
            </span>
          </div>

          {/* Разделитель */}
          <div className="w-px h-8 bg-white/20"></div>

          {/* Кнопка информации */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              showInfo ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white/10 hover:bg-white/20'
            } text-white`}
            title="Информация"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>
        </div>

        {/* Информационная панель */}
        {selectedPlanet && showInfo && (
          <div className="absolute top-4 right-4 w-80 bg-black/70 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl z-20 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full shadow-lg"
                  style={{ backgroundColor: selectedPlanet.color }}
                ></div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedPlanet.nameRu}</h2>
                  <p className="text-xs text-gray-400">{selectedPlanet.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {selectedPlanet.description}
            </p>

            <div className="space-y-3">
              <InfoRow icon="📏" label="Радиус" value={selectedPlanet.realRadius} />
              <InfoRow icon="🌍" label="Расстояние от Солнца" value={selectedPlanet.distance} />
              <InfoRow icon="🔄" label="Орбитальный период" value={selectedPlanet.orbitalPeriod} />
            </div>
          </div>
        )}

        {/* Список планет (мобильный) */}
        <div className="absolute top-4 left-4 z-20 hidden md:block">
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <p className="text-xs text-gray-400 mb-2 font-medium">Планеты:</p>
            <div className="flex flex-col gap-1">
              {planetsData.map(planet => (
                <button
                  key={planet.name}
                  onClick={() => setSelectedPlanet({ ...planet })}
                  className={`flex items-center gap-2 px-2 py-1 rounded-lg text-left text-sm transition-colors ${
                    selectedPlanet?.name === planet.name
                      ? 'bg-white/15 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: planet.color }}
                  ></div>
                  <span>{planet.nameRu}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
    </div>
  );
}

export default App;
