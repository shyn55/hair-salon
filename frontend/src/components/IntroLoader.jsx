import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const IntroLoader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const lineRef = useRef(null);
  const charsRef = useRef([]);
  const subRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      if (onComplete) onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // 1. Split-door reveal — doors slide apart
    tl.fromTo([leftDoorRef.current, rightDoorRef.current],
      { scaleX: 1 },
      { scaleX: 0, duration: 0.6, ease: [0.76, 0, 0.24, 1], stagger: 0.05 }
    );

    // 2. Gold line draws in from center
    tl.fromTo(lineRef.current,
      { scaleX: 0, transformOrigin: 'center' },
      { scaleX: 1, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      '-=0.2'
    );

    // 3. Glow pulse behind text
    tl.fromTo(glowRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 0.15, scale: 1.2, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );

    // 4. Characters stagger in with spring physics
    tl.fromTo(charsRef.current,
      { opacity: 0, y: 12, rotateX: -15 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.5,
        stagger: 0.03,
        ease: [0.175, 0.885, 0.32, 1.275]
      },
      '-=0.3'
    );

    // 5. Subtitle fades in with slight upward drift
    tl.fromTo(subRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      '-=0.2'
    );

    // 6. Hold, then orchestrate exit
    tl.to(glowRef.current, {
      opacity: 0, scale: 1.4, duration: 0.4, ease: 'power2.in'
    }, '+=0.4');

    tl.to(charsRef.current, {
      opacity: 0, y: -8, duration: 0.3, stagger: 0.02, ease: [0.16, 1, 0.3, 1]
    }, '-=0.3');

    tl.to([lineRef.current, subRef.current], {
      opacity: 0, duration: 0.2, ease: 'power2.in'
    }, '-=0.2');
  }, [onComplete]);

  const nameChars = 'HAMID STUDIO'.split('');

  return (
    <div ref={containerRef} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#1A1A1C'
    }}>
      {/* Split doors */}
      <div ref={leftDoorRef} style={{
        position: 'absolute', left: 0, top: 0, width: '50%', height: '100%',
        backgroundColor: '#1A1A1C', transformOrigin: 'left center', zIndex: 101
      }} />
      <div ref={rightDoorRef} style={{
        position: 'absolute', right: 0, top: 0, width: '50%', height: '100%',
        backgroundColor: '#1A1A1C', transformOrigin: 'right center', zIndex: 101
      }} />

      {/* Glow behind text */}
      <div ref={glowRef} style={{
        position: 'absolute',
        width: '200px', height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
        zIndex: 0, opacity: 0
      }} />

      {/* Content */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Gold line */}
        <div ref={lineRef} style={{
          width: '32px', height: '1px',
          backgroundColor: '#D4AF37',
          margin: '0 auto 16px',
          boxShadow: '0 0 8px rgba(212,175,55,0.3)'
        }} />

        {/* Name — each character for stagger animation */}
        <h1 style={{
          margin: '0 0 10px 0',
          fontSize: 'clamp(18px, 5vw, 24px)',
          fontWeight: 300,
          letterSpacing: '3px',
          display: 'flex',
          justifyContent: 'center',
          gap: '0px',
          perspective: '600px'
        }}>
          {nameChars.map((char, i) => (
            <span
              key={i}
              ref={el => charsRef.current[i] = el}
              style={{
                color: '#F7F5F0',
                display: 'inline-block',
                minWidth: char === ' ' ? '6px' : 'auto',
                transformStyle: 'preserve-3d'
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p ref={subRef} style={{
          color: '#A3A099',
          fontSize: '9px',
          margin: 0,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          opacity: 0
        }}>
          Hair Artist
        </p>
      </div>
    </div>
  );
};

export default IntroLoader;
