import React from 'react';
import Spline from '@splinetool/react-spline';

const HeroSpline = () => {
  return (
    <div className="relative w-full h-64 md:h-96 lg:h-[28rem] rounded-3xl overflow-hidden border border-white/10 bg-[#0F172A]">
      <Spline
        scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0F172A]/20 via-transparent to-[#0F172A]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-none text-center px-6">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white drop-shadow-lg">
            Rabbit AI
          </h1>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-white/80 max-w-xl mx-auto">
            Your calm, witty, multilingual personal assistant that remembers, organizes, and helps you think.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSpline;
