import readTableSub from './common/readTableSub'
//ジャンルテーブル内の全レコードを読み込んで配列へ格納
export default function readGenreTable() {
  const sql = 'SELECT * FROM genre_table';
  const results = readTableSub(sql);
  const dataArray = [];
  while (results.next()) {
    const row = { genreId: '', genreName: '' };
    row.genreId = results.getString("genre_id");
    row.genreName = results.getString("genre_name")
    dataArray.push(row);
    }
  return dataArray;
}
