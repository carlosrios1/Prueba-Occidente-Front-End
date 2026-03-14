// badge.config.ts
export const BADGE_VARIANTS = [
    'primary', 'secondary', 'neutral', 'default', 'danger',
    'success', 'warning', 'info', 'purple', 'pink',
    'orange', 'teal', 'cyan', 'black'
] as const;

export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
