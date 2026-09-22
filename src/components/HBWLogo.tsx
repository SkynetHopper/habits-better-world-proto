import React from 'react';

export type HBWLogoVariant = 'full' | 'horizontal' | 'favicon' | 'auto';
export type HBWLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface HBWLogoProps {
  className?: string;
  size?: HBWLogoSize;
  variant?: HBWLogoVariant;
  theme?: 'dark' | 'light';
  title?: string;
}

/**
 * Dedicated Brand Favicon Component
 * Follows Page 13 of Brand Guidelines & uploaded hbw-favicon-full-color-rgb.svg
 * Features Azure left semicircle (#24A1FF) and White right semicircle (#FFFFFF)
 * with Pearl background disc (#F7F4F4) for maximum contrast and legibility.
 */
export function HBWFavicon({ 
  className = '', 
  size = 24, 
  theme = 'light' 
}: { 
  className?: string; 
  size?: number | string; 
  theme?: 'dark' | 'light';
}) {
  const isDark = theme === 'dark';
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
      className={`shrink-0 select-none ${className}`}
      aria-label="Habits for a Better World icon"
    >
      {/* Background disc for boundary definition on any surface (Pearl #F7F4F4) */}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        fill={isDark ? '#0A0A0C' : '#F7F4F4'} 
        stroke={isDark ? 'rgba(36, 161, 255, 0.25)' : '#E5E5EA'} 
        strokeWidth="2" 
      />
      {/* Left semicircle: Azure 1 (#24A1FF) */}
      <path 
        d="M 50 10 A 40 40 0 0 0 50 90 Z" 
        fill="#24A1FF" 
      />
      {/* Right semicircle: White (#FFFFFF) */}
      <path 
        d="M 50 10 A 40 40 0 0 1 50 90 Z" 
        fill="#FFFFFF" 
      />
    </svg>
  );
}

/**
 * Habits for a Better World Brand Logo Component
 * Adheres strictly to the official Brand Guidelines:
 * - Main Logo (Page 7 & uploaded hbw-logo-full-color-rgb.svg): Semicircle + 4-line stacked wordmark
 * - Horizontal Logo (Page 14): Semicircle + 2-line wordmark for wide/short headers
 * - Favicon (Page 13 & uploaded hbw-favicon-full-color-rgb.svg): Simplified two-toned circular symbol for tight spaces
 * - Inverted Version (Page 10): White text for dark mode
 * - Azure 1 (#24A1FF): Primary logo color
 * - Charcoal (#0A0A0A) & White (#FFFFFF): Primary wordmark text
 */
export default function HBWLogo({ 
  className = '', 
  size = 'md', 
  variant = 'auto', 
  theme = 'light',
  title = 'Habits for a Better World'
}: HBWLogoProps) {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#0A0A0A';

  // Determine variant based on space availability (Brand Guidelines Pg 7, 9, 13, 14)
  let activeVariant = variant;
  if (activeVariant === 'auto') {
    if (size === 'xs') {
      // Space is very restricted (< 20px). Per Pg 9 (15px min logo height) & Pg 13, use Favicon.
      activeVariant = 'favicon';
    } else if (size === 'sm') {
      // Compact bar/header format. Per Pg 14, use Horizontal logo.
      activeVariant = 'horizontal';
    } else {
      // Generous space available. Per Pg 7, use Main Logo (preferred).
      activeVariant = 'full';
    }
  }

  // 1. Favicon / Pure Icon variant (Page 13)
  if (activeVariant === 'favicon') {
    const faviconSizes: Record<HBWLogoSize, string> = {
      xs: 'w-4 h-4',
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-10 h-10',
      xl: 'w-14 h-14'
    };
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${faviconSizes[size]} ${className}`} title={title}>
        <HBWFavicon className="w-full h-full" theme={theme} />
      </div>
    );
  }

  // 2. Horizontal Logo variant (Page 14: "made for the website header... very wide and short")
  if (activeVariant === 'horizontal') {
    const horizontalHeights: Record<HBWLogoSize, string> = {
      xs: 'h-4',
      sm: 'h-6 sm:h-7',
      md: 'h-8 sm:h-9',
      lg: 'h-10 sm:h-12',
      xl: 'h-14 sm:h-16'
    };

    return (
      <div className={`inline-flex items-center shrink-0 select-none ${horizontalHeights[size]} ${className}`} title={title}>
        <svg 
          viewBox="0 0 236 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
          aria-label={title}
        >
          {/* Azure 1 Semicircle symbol */}
          <path 
            d="M 28 4 A 26 26 0 0 0 28 56 Z" 
            fill="#24A1FF" 
          />
          {/* Line 1: HABITS FOR A */}
          <text 
            x="38" 
            y="26" 
            fontFamily="'Figtree', 'Inter', system-ui, sans-serif" 
            fontWeight="900" 
            fontSize="22" 
            fill={textColor} 
            letterSpacing="-0.4"
          >
            HABITS FOR A
          </text>
          {/* Line 2: BETTER WORLD */}
          <text 
            x="38" 
            y="52" 
            fontFamily="'Figtree', 'Inter', system-ui, sans-serif" 
            fontWeight="900" 
            fontSize="22" 
            letterSpacing="-0.4"
          >
            <tspan fill="#24A1FF">BETTER </tspan>
            <tspan fill={textColor}>WORLD</tspan>
          </text>
        </svg>
      </div>
    );
  }

  // 3. Main Full Logo variant (Page 7: Primary & preferred version with 4-line stacked wordmark)
  const fullHeights: Record<HBWLogoSize, string> = {
    xs: 'h-5',
    sm: 'h-8',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24'
  };

  return (
    <div className={`inline-flex items-center shrink-0 select-none ${fullHeights[size]} ${className}`} title={title}>
      <svg 
        viewBox="0 0 168 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        aria-label={title}
      >
        {/* Azure 1 Semicircle symbol (Page 7 & 44) */}
        <path 
          d="M 48 2 A 47 47 0 0 0 48 98 Z" 
          fill="#24A1FF" 
        />
        {/* Line 1: HABITS */}
        <text 
          x="58" 
          y="23" 
          fontFamily="'Figtree', 'Inter', system-ui, sans-serif" 
          fontWeight="900" 
          fontSize="24" 
          fill={textColor} 
          letterSpacing="-0.5"
        >
          HABITS
        </text>
        {/* Line 2: FOR A */}
        <text 
          x="58" 
          y="47" 
          fontFamily="'Figtree', 'Inter', system-ui, sans-serif" 
          fontWeight="900" 
          fontSize="24" 
          fill={textColor} 
          letterSpacing="-0.5"
        >
          FOR A
        </text>
        {/* Line 3: BETTER in Azure 1 */}
        <text 
          x="58" 
          y="71" 
          fontFamily="'Figtree', 'Inter', system-ui, sans-serif" 
          fontWeight="900" 
          fontSize="24" 
          fill="#24A1FF" 
          letterSpacing="-0.5"
        >
          BETTER
        </text>
        {/* Line 4: WORLD */}
        <text 
          x="58" 
          y="95" 
          fontFamily="'Figtree', 'Inter', system-ui, sans-serif" 
          fontWeight="900" 
          fontSize="24" 
          fill={textColor} 
          letterSpacing="-0.5"
        >
          WORLD
        </text>
      </svg>
    </div>
  );
}

