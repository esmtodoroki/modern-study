import readTableSub from './common/readTableSub'
//書籍テーブル内の指定された検索条件に一致するレコードを読み込んで配列へ格納
export default function readBookTableFiltering(title, genre) {
  let sql = `
    SELECT
      A.*,
      B.genre_name
    FROM
      book_table AS A
      LEFT OUTER JOIN genre_table AS B
        ON A.genre_id = B.genre_id
    WHERE `
  const addSqlFilterTitle = `
    A.title LIKE '%${title}%'`;
  const addSqlFilterGenre = `
    A.genre_id = '${genre}'`;
  const addSqlFilterTitleAndGenre = `
    A.title LIKE '%${title}%' AND
    A.genre_id = '${genre}'`;
  if (title === '') {
    sql += addSqlFilterGenre;
  } else if (genre === '') {
    sql += addSqlFilterTitle;
  } else {
    sql += addSqlFilterTitleAndGenre;
  }
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
