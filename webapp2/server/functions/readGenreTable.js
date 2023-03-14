/**
 * テーブル読み込み関数
 */
//ジャンルテーブル内の全レコードを読み込んで配列へ格納
import readTableSub from './common/readTableSub'
export default function readGenreTable() {
  var sql = 'SELECT * FROM genre_table';
  var results = readTableSub(sql);
  var dataArray = [];
  while (results.next()) {
    var row = { genre_id: '', genre_name:'' };
    row.genre_id = results.getString("genre_id");
    row.genre_name = results.getString("genre_name")
    dataArray.push(row);
    }
  return dataArray;
}
