
import React, { useEffect, useRef } from 'react';

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars();
    };
    
    // Star properties
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      rotation: number;
      twinkleSpeed: number;
      opacity: number;
    }> = [];
    
    // Create stars
    function createStars() {
      stars.length = 0;
      const starCount = Math.floor((canvas.width * canvas.height) / 3000);
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5 + 0.5;
        const opacity = Math.random() * 0.8 + 0.2;
        const twinkleSpeed = Math.random() * 0.02 + 0.01;
        const rotation = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.05 + 0.01;
        
        // Create a mix of blue, purple, and white stars
        let color;
        const colorRand = Math.random();
        if (colorRand > 0.8) {
          color = 'rgba(173, 216, 230, 1)'; // Light blue
        } else if (colorRand > 0.6) {
          color = 'rgba(221, 160, 221, 1)'; // Plum
        } else {
          color = 'rgba(255, 255, 255, 1)'; // White
        }
        
        stars.push({
          x,
          y,
          radius,
          color,
          speed,
          rotation,
          twinkleSpeed,
          opacity
        });
      }
      
      // Add a few larger stars and nebula-like effects
      for (let i = 0; i < 5; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 4 + 3;
        const opacity = Math.random() * 0.7 + 0.3;
        const twinkleSpeed = Math.random() * 0.01 + 0.005;
        const rotation = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.03 + 0.005;
        
        const colorOptions = [
          'rgba(255, 223, 186, 1)', // Soft orange
          'rgba(173, 216, 230, 1)', // Light blue
          'rgba(221, 160, 221, 1)', // Plum
          'rgba(255, 255, 255, 1)'  // White
        ];
        
        const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        
        stars.push({
          x,
          y,
          radius,
          color,
          speed,
          rotation,
          twinkleSpeed,
          opacity
        });
      }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Animation variables
    let time = 0;
    const nebulaPositions = Array(3).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 200 + 100,
      color: Math.random() > 0.5 ? 
        'rgba(138, 43, 226, 0.1)' : // Purple
        'rgba(70, 130, 180, 0.1)'   // Steel blue
    }));
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;
      
      // Draw nebula-like effects
      nebulaPositions.forEach(nebula => {
        const gradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.size
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(nebula.x, nebula.y, nebula.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw stars
      stars.forEach(star => {
        // Apply rotation and movement
        star.x += Math.cos(star.rotation) * star.speed;
        star.y += Math.sin(star.rotation) * star.speed;
        
        // Twinkle effect
        const twinkle = Math.sin(time * star.twinkleSpeed * 10) * 0.5 + 0.5;
        const currentOpacity = star.opacity * twinkle;
        
        // Reset if star goes off screen
        if (star.x < -20 || star.x > canvas.width + 20 || 
            star.y < -20 || star.y > canvas.height + 20) {
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color.replace('1)', `${currentOpacity})`);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-[-1] bg-black overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)' }}
      />
    </div>
  );
};

export default StarBackground;
