//SELECT文のWHERE句を編集
export default function makeWhere(title, genre) {
  const whereArray = []
  if (title) {
    whereArray.push(`A.title LIKE '%${title}%'`)
  }
  if (genre) {
    whereArray.push(`A.genre_id = '${genre}'`)
  }
  return (whereArray.length === 2) ?
    `WHERE ${whereArray.join(' AND ')}` :
    `WHERE ${whereArray}`
}
