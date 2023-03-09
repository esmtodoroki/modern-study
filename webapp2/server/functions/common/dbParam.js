/**
 * CloudSQL接続情報
 */
const CONNECTION_NAME = 'esm-gcp-study:us-central1:modern-study';
const DATABASE_NAME = 'web_book_esmtodoroki';
export const USER_NAME = 'esm';
export const PASSWORD = 'esm';
export const URL = 'jdbc:google:mysql://' + CONNECTION_NAME + '/' + DATABASE_NAME;
