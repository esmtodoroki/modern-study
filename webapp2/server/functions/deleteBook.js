import { USER_NAME, PASSWORD, URL } from './common/dbParam'
//書籍テーブルの書籍レコードを削除
export default function deleteBook(bookId)
 {
  const connection = Jdbc.getCloudSqlConnection(URL, USER_NAME, PASSWORD);
  const sql = `
    DELETE
    FROM book_table
    WHERE book_id=?`
  const statement = connection.prepareStatement(sql);
  statement.setInt(1, bookId);
  statement.executeUpdate();
  
  statement.close();
  connection.close();
}
