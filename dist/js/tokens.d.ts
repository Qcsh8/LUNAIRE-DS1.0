// Lunaire Design System — TypeScript Definitions

export declare const tokens: {
  colors: { light: Record<string, string>; dark: Record<string, string> };
  spacing: Record<string, string>;
  typography: Record<string, { fontFamily: string; fontWeight: number; fontSize: number; lineHeight: number; letterSpacing?: number }>;
  effects: Record<string, Array<Record<string, string>>>;
};
export declare const colors: typeof tokens.colors;
export declare const spacing: typeof tokens.spacing;
export declare const typography: typeof tokens.typography;
export declare const effects: typeof tokens.effects;
export default tokens;