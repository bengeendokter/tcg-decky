import { PALETTE_TYPE, type PaletteType, type PaletteValue } from './palette';

interface PaletteTypeValue {
	paletteType: PaletteType;
	paletteValue: PaletteValue;
}

const ACCENT_PALETTE_VALUE = {
	PRIMARY: PALETTE_TYPE.PRIMARY,
	SECONDARY: PALETTE_TYPE.SECONDARY,
	TERTIARY: PALETTE_TYPE.TERTIARY,
	ERROR: PALETTE_TYPE.ERROR,
} as const satisfies Record<Uppercase<string>, PaletteType>;

export type AccentPaletteValue = (typeof ACCENT_PALETTE_VALUE)[keyof typeof ACCENT_PALETTE_VALUE];

type AccentRoleKey<T extends AccentPaletteValue> =
	| T
	| `on-${T}`
	| `${T}-container`
	| `on-${T}-container`;

type FixedRoleKey<T extends AccentPaletteValue> =
	| `${T}-fixed`
	| `${T}-fixed-dim`
	| `on-${T}-fixed`
	| `on-${T}-fixed-variant`;

type PrimaryRolesKey =
	| AccentRoleKey<typeof ACCENT_PALETTE_VALUE.PRIMARY>
	| FixedRoleKey<typeof ACCENT_PALETTE_VALUE.PRIMARY>;
type SecondaryRolesKey =
	| AccentRoleKey<typeof ACCENT_PALETTE_VALUE.SECONDARY>
	| FixedRoleKey<typeof ACCENT_PALETTE_VALUE.SECONDARY>;
type TertiaryRolesKey =
	| AccentRoleKey<typeof ACCENT_PALETTE_VALUE.TERTIARY>
	| FixedRoleKey<typeof ACCENT_PALETTE_VALUE.TERTIARY>;
type ErrorRolesKey = AccentRoleKey<typeof ACCENT_PALETTE_VALUE.ERROR>;
type SurfaceRoleKey =
	| 'surface'
	| 'surface-dim'
	| 'surface-bright'
	| 'surface-container-lowest'
	| 'surface-container-low'
	| 'surface-container'
	| 'surface-container-high'
	| 'surface-container-highest'
	| 'on-surface'
	| 'on-surface-variant';

type OutlineRoleKey = 'outline' | 'outline-variant';

type InverseRoleKey = 'inverse-surface' | 'inverse-on-surface' | 'inverse-primary';

type ThemeKey =
	| PrimaryRolesKey
	| SecondaryRolesKey
	| TertiaryRolesKey
	| ErrorRolesKey
	| SurfaceRoleKey
	| OutlineRoleKey
	| InverseRoleKey
	| 'shadow'
	| 'scrim';

type Theme = {
	[key in ThemeKey]: PaletteTypeValue;
};
