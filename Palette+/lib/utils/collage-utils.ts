export async function generateCollage(colors: string[]): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 1200;
  canvas.height = 630;
  const rectWidth = canvas.width / colors.length;
  
  colors.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(index * rectWidth, 0, rectWidth, canvas.height);
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

