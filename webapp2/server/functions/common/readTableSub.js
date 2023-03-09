/**
 * テーブル読み込み関数
 */
//テーブルリード用サブ関数
import { USER_NAME, PASSWORD, URL } from './dbParam'
export default function readTableSub(sql) {
    const connection = Jdbc.getCloudSqlConnection(URL, USER_NAME, PASSWORD)
    return connection.createStatement().executeQuery(sql)
}
