//SELECT文のWHERE句を編集
export default function makeWhere(title, genre) {
  const whereArray = []
  if (title) {
    whereArray.push(`A.title LIKE '%${title}%'`)
  }
  if (genre) {
    whereArray.push(`A.genre_id = '${genre}'`)
  }
  return `${whereArray.join(' AND ')}`
}
