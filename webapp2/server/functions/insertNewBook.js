/**
 * テーブル書き込み関数
 */
//書籍テーブルへ新しい書籍レコードを格納
import { USER_NAME, PASSWORD, URL } from './common/dbParam'
export default function insertNewBook(
  Title, 
  genreId, 
  purchaseDate, 
  purchaseName, 
  review
  ) {
  const connection = Jdbc.getCloudSqlConnection(URL, USER_NAME, PASSWORD);
  const sql = `
    INSERT INTO book_table (
      title,
      genre_id,
      purchase_date,
      purchase_name,
      review)
      values (?, ?, ?, ?, ?)`;
  const statement = connection.prepareStatement(sql);
  statement.setString(1, Title);
  statement.setString(2, genreId);
  statement.setString(3, purchaseDate);
  statement.setString(4, purchaseName);
  statement.setString(5, review);
  statement.executeUpdate();
  
  statement.close();
  connection.close();
}
