/**
 * テーブル読み込み関数
 */
//ジャンルテーブル内の全レコードを読み込んで配列へ格納
import readTableSub from './common/readTableSub'
export default function readGenreTable() {
  const sql = 'SELECT * FROM genre_table';
  const results = readTableSub(sql);
  let dataArray = [];
  while (results.next()) {
    let row = { genreId: '', genreName: '' };
    row.genreId = results.getString("genre_id");
    row.genreName = results.getString("genre_name")
    dataArray.push(row);
    }
  return dataArray;
}
