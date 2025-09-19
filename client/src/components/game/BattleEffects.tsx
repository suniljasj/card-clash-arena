import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface DamageNumber {
  id: string;
  value: number;
  x: number;
  y: number;
  type: 'damage' | 'healing';
  timestamp: number;
}

interface SpellEffect {
  id: string;
  type: 'fire' | 'ice' | 'lightning' | 'healing' | 'buff';
  x: number;
  y: number;
  timestamp: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

interface BattleEffectsProps {
  className?: string;
  screenShake?: boolean;
  onScreenShakeEnd?: () => void;
}

export const BattleEffects: React.FC<BattleEffectsProps> = ({
  className,
  screenShake = false,
  onScreenShakeEnd
}) => {
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [spellEffects, setSpellEffects] = useState<SpellEffect[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Handle screen shake
  useEffect(() => {
    if (screenShake) {
      const timer = setTimeout(() => {
        onScreenShakeEnd?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [screenShake, onScreenShakeEnd]);

  // Particle animation loop
  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.1, // gravity
        life: particle.life - 1
      })).filter(particle => particle.life > 0));

      animationRef.current = requestAnimationFrame(animate);
    };

    if (particles.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length]);

  // Clean up old effects
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      setDamageNumbers(prev => prev.filter(num => now - num.timestamp < 2000));
      setSpellEffects(prev => prev.filter(effect => now - effect.timestamp < 1500));
    };

    const interval = setInterval(cleanup, 100);
    return () => clearInterval(interval);
  }, []);

  // Public methods for triggering effects
  const triggerDamageNumber = (value: number, x: number, y: number, type: 'damage' | 'healing' = 'damage') => {
    const newDamageNumber: DamageNumber = {
      id: `damage-${Date.now()}-${Math.random()}`,
      value,
      x,
      y,
      type,
      timestamp: Date.now()
    };
    setDamageNumbers(prev => [...prev, newDamageNumber]);
  };

  const triggerSpellEffect = (type: SpellEffect['type'], x: number, y: number) => {
    const newSpellEffect: SpellEffect = {
      id: `spell-${Date.now()}-${Math.random()}`,
      type,
      x,
      y,
      timestamp: Date.now()
    };
    setSpellEffects(prev => [...prev, newSpellEffect]);
  };

  const createParticles = (x: number, y: number, count: number = 10, color: string = '#ffd700') => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        size: Math.random() * 4 + 2,
        color,
        life: 60,
        maxLife: 60
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Expose methods globally for use in battle components
  useEffect(() => {
    (window as any).battleEffects = {
      triggerDamageNumber,
      triggerSpellEffect,
      createParticles
    };

    return () => {
      delete (window as any).battleEffects;
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 pointer-events-none z-50",
        screenShake && "screen-shake",
        className
      )}
    >
      {/* Damage Numbers */}
      {damageNumbers.map(damageNum => (
        <div
          key={damageNum.id}
          className={cn(
            "absolute font-bold text-2xl font-mono",
            damageNum.type === 'damage' ? 'damage-number text-red-400' : 'healing-number text-green-400'
          )}
          style={{
            left: damageNum.x,
            top: damageNum.y,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {damageNum.type === 'damage' ? '-' : '+'}{damageNum.value}
        </div>
      ))}

      {/* Spell Effects */}
      {spellEffects.map(spell => (
        <div
          key={spell.id}
          className={cn(
            "absolute w-20 h-20 rounded-full",
            spell.type === 'fire' && "spell-cast-fire bg-red-500/30",
            spell.type === 'ice' && "spell-cast-ice bg-blue-500/30",
            spell.type === 'lightning' && "spell-cast-lightning bg-yellow-500/30",
            spell.type === 'healing' && "bg-green-500/30",
            spell.type === 'buff' && "bg-purple-500/30"
          )}
          style={{
            left: spell.x - 40,
            top: spell.y - 40
          }}
        />
      ))}

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full particle-sparkle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life / particle.maxLife
          }}
        />
      ))}

      {/* Victory Confetti */}
      <div className="absolute inset-0 overflow-hidden">
        {/* This will be triggered for victory celebrations */}
      </div>
    </div>
  );
};

// Helper function to trigger effects from other components
export const triggerBattleEffect = {
  damage: (value: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    (window as any).battleEffects?.triggerDamageNumber(value, x, y, 'damage');
  },
  
  heal: (value: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    (window as any).battleEffects?.triggerDamageNumber(value, x, y, 'healing');
  },
  
  spell: (type: 'fire' | 'ice' | 'lightning' | 'healing' | 'buff', element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    (window as any).battleEffects?.triggerSpellEffect(type, x, y);
  },
  
  particles: (element: HTMLElement, count: number = 10, color: string = '#ffd700') => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    (window as any).battleEffects?.createParticles(x, y, count, color);
  }
};