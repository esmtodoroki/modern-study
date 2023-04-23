import readTableSub from './common/readTableSub'
//書籍テーブル内の指定されたジャンルに一致するレコードを読み込んで配列へ格納
export default function readBookTableFilteringGenre(genreId) {
  let sql = "";
    sql += "SELECT ";
    sql += "A.*,";
    sql += "B.genre_name ";
    sql += "FROM ";
    sql += "book_table AS A ";
    sql += "LEFT OUTER JOIN genre_table AS B ";
    sql += "ON A.genre_id = B.genre_id ";
    sql += "WHERE ";
    sql += "A.genre_id = ";
    sql += genreId;
  const results = readTableSub(sql);
  const dataArray = [];
  while (results.next()) {
    const row = {
      bookId: '',
      title: '',
      genreId: '',
      genreName: '',
      purchaseDate: '',
      purchaseName: '',
      review: '' 
    };
    row.bookId = results.getInt("book_id");
    row.title = results.getString("title");
    row.genreId = results.getString("genre_id");
    row.genreName = results.getString("genre_name");
    row.purchaseDate = results.getString("purchase_date");
    row.purchaseName = results.getString("purchase_name");
    row.review = results.getString("review");
    dataArray.push(row);
    }
  return dataArray;
}
