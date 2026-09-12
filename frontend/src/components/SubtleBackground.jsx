import React from 'react';

const SubtleBackground = () => {
  return (
    <>
      {/* Base gradient — warm gold emanation */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Secondary depth — bottom-right warmth */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 80% 90%, rgba(212,175,55,0.02) 0%, transparent 40%)',
        pointerEvents: 'none'
      }} />

      {/* Subtle vignette — focus attention to center */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.15) 100%)',
        pointerEvents: 'none'
      }} />
    </>
  );
};

export default SubtleBackground;
