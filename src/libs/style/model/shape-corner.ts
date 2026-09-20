import type { UnionToTuple } from 'type-fest';
import type { DimensionToken } from './design-token';
import { fromEntries } from '@ark/util';
import type { PenpotDimensionToken } from './penpot-tokens';

const SHAPE_CORNER = {
	NONE: 'none',
	EXTRA_SMALL: 'extra-small',
	SMALL: 'small',
	MEDIUM: 'medium',
	LARGE: 'large',
	LARGE_INCREASED: 'large-increased',
	EXTRA_LARGE: 'extra-large',
	EXTRA_LARGE_INCREASED: 'extra-large-increased',
	EXTRA_EXTRA_LARGE: 'extra-extra-large',
	FULL: 'full',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type ShapeCorner = (typeof SHAPE_CORNER)[keyof typeof SHAPE_CORNER];

export const SHAPE_CORNERS = [
	SHAPE_CORNER.NONE,
	SHAPE_CORNER.EXTRA_SMALL,
	SHAPE_CORNER.SMALL,
	SHAPE_CORNER.MEDIUM,
	SHAPE_CORNER.LARGE,
	SHAPE_CORNER.LARGE_INCREASED,
	SHAPE_CORNER.EXTRA_LARGE,
	SHAPE_CORNER.EXTRA_LARGE_INCREASED,
	SHAPE_CORNER.EXTRA_EXTRA_LARGE,
	SHAPE_CORNER.FULL,
] as const satisfies UnionToTuple<ShapeCorner>;

const SHAPE_CORNER_VALUE_MAP = {
	[SHAPE_CORNER.NONE]: 0,
	[SHAPE_CORNER.EXTRA_SMALL]: 4,
	[SHAPE_CORNER.SMALL]: 8,
	[SHAPE_CORNER.MEDIUM]: 12,
	[SHAPE_CORNER.LARGE]: 16,
	[SHAPE_CORNER.LARGE_INCREASED]: 20,
	[SHAPE_CORNER.EXTRA_LARGE]: 28,
	[SHAPE_CORNER.EXTRA_LARGE_INCREASED]: 32,
	[SHAPE_CORNER.EXTRA_EXTRA_LARGE]: 48,
	[SHAPE_CORNER.FULL]: 1e5,
} as const satisfies Record<ShapeCorner, number>;

export type ShapeCornerTokens = {
	[key in ShapeCorner]: DimensionToken;
};

export function getShapeCornerToken(shapeCorner: ShapeCorner): DimensionToken {
	return {
		$type: 'dimension',
		$value: {
			value: SHAPE_CORNER_VALUE_MAP[shapeCorner],
			unit: 'px',
		},
	};
}

export function getShapeCornerTokens(): ShapeCornerTokens {
	const shapeCornerTokensEntries: [ShapeCorner, DimensionToken][] = SHAPE_CORNERS.map(
		(shapeCorner) => [shapeCorner, getShapeCornerToken(shapeCorner)],
	);

	return fromEntries(shapeCornerTokensEntries);
}

export type PenpotShapeCornerTokens = {
	[key in ShapeCorner]: PenpotDimensionToken;
};

export function getPenpotShapeCornerToken(shapeCorner: ShapeCorner): PenpotDimensionToken {
	return {
		$type: 'dimension',
		$value: `${SHAPE_CORNER_VALUE_MAP[shapeCorner]}px`,
	};
}

export function getPenpotShapeCornerTokens(): PenpotShapeCornerTokens {
	const penpotShapeCornerTokensEntries: [ShapeCorner, PenpotDimensionToken][] = SHAPE_CORNERS.map(
		(shapeCorner) => [shapeCorner, getPenpotShapeCornerToken(shapeCorner)],
	);

	return fromEntries(penpotShapeCornerTokensEntries);
}
