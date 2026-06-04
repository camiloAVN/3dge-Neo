import Image from 'next/image';

interface Props {
  /** Logo size in px (image is square). Default 22. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Set true for logos above the fold so Next.js preloads the image. */
  priority?: boolean;
}

/**
 * Logo + "3DGE" mark.
 * Renders the cube logo to the left of the italic brand text.
 * Inherits font-family, font-weight, font-size, and color from the parent.
 */
export function Brand3DGE({ size = 22, className, style, priority }: Props) {
  const gap = Math.max(5, Math.round(size * 0.32));

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        lineHeight: 1,
        ...style,
      }}
    >
      <Image
        src="/imgs/logo.png"
        alt=""
        width={size}
        height={size}
        priority={priority}
        style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }}
      />
      3<span style={{ fontStyle: 'italic' }}>D</span>GE
    </span>
  );
}
