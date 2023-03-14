/**
 * テーブル読み込み関数
 */
//書籍テーブル内の全レコードを読み込んで配列へ格納
import readTableSub from './common/readTableSub'
export default function readBookTableAll() {
    var sql = 'SELECT * FROM book_table';
    var results = readTableSub(sql);
    var dataArray = [];
    while (results.next()) {
      var row = { book_id: '', title:'', genre_id:'', purchase_date:'', purchase_name:'', review:'' };
      row.book_id = results.getInt("book_id");
      row.title = results.getString("title");
      row.genre_id = results.getString("genre_id");
      row.purchase_date = results.getString("purchase_date");
      row.purchase_name = results.getString("purchase_name");
      row.review = results.getString("review");
      dataArray.push(row);
      }
    return dataArray;
}
