// Squishy definitions for our cute companions
export interface SquishyType {
  name: string;
  eye: string;
}

export const SQUISHY_TYPES: SquishyType[] = [
  { name: 'Sqiggly', eye: '•' }, // Small dot
  { name: 'Wiggly', eye: '◕' },  // Highlighted circle
  { name: 'Jiggly', eye: 'o' },  // Hollow circle
  { name: 'Miggly', eye: '°' }   // Tiny upper circle (slightly different)
];

// Subtle, water-balloon/mochi shapes
export const BLOB_SHAPES: string[] = [
  // Shape 0: Slightly bottom-heavy
  "48% 52% 51% 49% / 50% 48% 55% 45%",
  // Shape 1: Slightly wider
  "55% 45% 49% 51% / 48% 52% 50% 52%",
  // Shape 2: Slightly taller
  "50% 50% 52% 48% / 55% 45% 48% 52%",
  // Shape 3: Slightly top-heavy
  "49% 51% 48% 52% / 45% 55% 51% 49%",
];
