import { USER_NAME, PASSWORD, URL } from './common/dbParam'
// 登録されている書籍の情報を更新
export default function updateBook(
  bookId,
  title, 
  genreId, 
  purchaseDate, 
  purchaseName, 
  review
  ) {
  const connection = Jdbc.getCloudSqlConnection(URL, USER_NAME, PASSWORD);
  const sql = `
    UPDATE book_table
    SET
      title=?,
      genre_id=?,
      purchase_date=?,
      purchase_name=?,
      review=?
    WHERE book_id=?`
  const statement = connection.prepareStatement(sql);
  statement.setString(1, title);
  statement.setString(2, genreId);
  statement.setString(3, purchaseDate);
  statement.setString(4, purchaseName);
  statement.setString(5, review);
  statement.setInt(6, bookId);
  statement.executeUpdate();
  
  statement.close();
  connection.close();
}
