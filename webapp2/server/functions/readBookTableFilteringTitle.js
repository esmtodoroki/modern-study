import readTableSub from './common/readTableSub'
//書籍テーブル内の指定された書籍名に一致するレコードを読み込んで配列へ格納
export default function readBookTableFilteringTitle(title) {
  let sql = `
    SELECT
      A.*,
      B.genre_name
    FROM
      book_table AS A
      LEFT OUTER JOIN genre_table AS B
        ON A.genre_id = B.genre_id
    WHERE
      A.title LIKE '%${title}%'`;
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
