// This file should already exist in this location. If it doesn't, here's the content:

const colorNames: Record<string, string> = {
  '274060': 'Indigo dye',
  '335C81': 'Lapis Lazuli',
  '65AFFF': 'Argentinian Blue',
  '1B2845': 'Space cadet',
  '5899E2': 'United Nations Blue',
}

export const getColorName = (hex: string): string => {
  return colorNames[hex.toUpperCase()] || 'Custom color'
}

const colorBlindnessMatrices: Record<string, number[][]> = {
  'protanopia': [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758]
  ],
  'deuteranopia': [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7]
  ],
  'tritanopia': [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525]
  ],
  'achromatopsia': [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114]
  ],
  'protanomaly': [
    [0.817, 0.183, 0],
    [0.333, 0.667, 0],
    [0, 0.125, 0.875]
  ],
  'deuteranomaly': [
    [0.8, 0.2, 0],
    [0.258, 0.742, 0],
    [0, 0.142, 0.858]
  ],
  'tritanomaly': [
    [0.967, 0.033, 0],
    [0, 0.733, 0.267],
    [0, 0.183, 0.817]
  ],
  'achromatomaly': [
    [0.618, 0.320, 0.062],
    [0.163, 0.775, 0.062],
    [0.163, 0.320, 0.516]
  ]
}

export const simulateColorBlindness = (hex: string, type: string): string => {
  const matrix = colorBlindnessMatrices[type.toLowerCase()]
  if (!matrix) return hex

  const [r, g, b] = hexToRgb(hex)
  const newR = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2]
  const newG = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2]
  const newB = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2]

  return rgbToHex(newR, newG, newB)
}

export const generateShades = (hex: string, steps: number = 20): string[] => {
  const shades: string[] = []
  for (let i = -10; i <= 10; i++) {
    const percent = i * 10
    const color = adjustColor(hex, percent)
    shades.push(color)
  }
  return shades
}

export const adjustColor = (hex: string, percent: number): string => {
  const [r, g, b] = hexToRgb(hex)
  const amount = Math.round(2.55 * percent)
  const newR = Math.max(0, Math.min(255, r + amount))
  const newG = Math.max(0, Math.min(255, g + amount))
  const newB = Math.max(0, Math.min(255, b + amount))
  return rgbToHex(newR, newG, newB)
}

export const exportPalette = async (colors: string[], format: string): Promise<string> => {
  switch (format) {
    case 'url':
      return `${typeof window !== 'undefined' ? window.location.origin : ''}/palette/${colors.join('-')}`
    case 'css':
      return `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`
    case 'svg':
      return `<svg width="500" height="100" xmlns="http://www.w3.org/2000/svg">${
        colors.map((c, i) => `<rect x="${i * 100}" y="0" width="100" height="100" fill="${c}"/>`)
      }</svg>`
    case 'text':
      return colors.join(', ')
    case 'json':
      return JSON.stringify(colors)
    case 'embed':
      return `<iframe src="${await exportPalette(colors, 'url')}" style="width: 100%; height: 100px; border: none;"></iframe>`
    default:
      return colors.join(', ')
  }
}

export const generatePalette = (count: number): string[] => {
  return Array(count).fill(0).map(() => 
    '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
  )
}

export const extractColorsFromImage = async (imageUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = extractDominantColors(imageData.data, 5);
      resolve(colors);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = imageUrl;
  });
};

function extractDominantColors(pixels: Uint8ClampedArray, colorCount: number): string[] {
  const colorMap: { [key: string]: number } = {};
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const rgb = `${r},${g},${b}`;
    colorMap[rgb] = (colorMap[rgb] || 0) + 1;
  }
  const sortedColors = Object.entries(colorMap).sort((a, b) => b[1] - a[1]);
  return sortedColors.slice(0, colorCount).map(([rgb]) => {
    const [r, g, b] = rgb.split(',').map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  });
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0]
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

