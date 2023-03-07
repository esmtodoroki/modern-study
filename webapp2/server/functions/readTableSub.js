/**
 * テーブル読み込み関数
 */
//テーブルリード用サブ関数
export default function readTableSub(sql) {
    const connection = Jdbc.getCloudSqlConnection(URL, USER_NAME, PASSWORD)
    return connection.createStatement().executeQuery(sql)
}
