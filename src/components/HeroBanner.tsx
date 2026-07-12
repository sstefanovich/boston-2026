import type { CityTheme } from '../data/content';

const BADGE_CLASS: Record<CityTheme, string> = {
  boston: 'badge-boston',
  northend: 'badge-northend',
  harbor: 'badge-harbor',
  cambridge: 'badge-cambridge',
  sports: 'badge-sports',
  travel: 'badge-travel',
  food: 'badge-food',
  fallout: 'badge-fallout',
};

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  image: string;
  theme?: CityTheme;
  badge?: string;
}

export function HeroBanner({ title, subtitle, image, theme, badge }: HeroBannerProps) {
  return (
    <div className="hero">
      <img src={image} alt={title} loading="eager" decoding="async" />
      <div className="hero-overlay">
        {badge && theme && <span className={`badge ${BADGE_CLASS[theme]}`}>{badge}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
