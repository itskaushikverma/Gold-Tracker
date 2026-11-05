import logo from '../../assets/gold.svg';
import { cn } from '../../lib/utils';

export default function Logo({ withWordmark = false, size = 44, className = '' }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img
        src={logo}
        alt=""
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
      />
      {withWordmark ? (
        <span className="text-foreground text-xl font-semibold tracking-tight">Gold Tracker</span>
      ) : null}
    </div>
  );
}
