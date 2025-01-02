// Create utility functions for managing favorite colors
export function getFavoriteColors(): string[] {
  if (typeof window === 'undefined') return []
  const favorites = localStorage.getItem('favoriteColors')
  return favorites ? JSON.parse(favorites) : []
}

export function addFavoriteColor(color: string): void {
  const favorites = getFavoriteColors()
  if (!favorites.includes(color)) {
    favorites.push(color)
    localStorage.setItem('favoriteColors', JSON.stringify(favorites))
  }
}

export function removeFavoriteColor(color: string): void {
  const favorites = getFavoriteColors()
  const newFavorites = favorites.filter(c => c !== color)
  localStorage.setItem('favoriteColors', JSON.stringify(newFavorites))
}

export function isFavoriteColor(color: string): boolean {
  const favorites = getFavoriteColors()
  return favorites.includes(color)
}

