const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
// SQLite3データベースに接続する関数
// データベースファイルを指定し、ドライバにsqlite3を使用
async function openDb() {
	return open({
		filename: './db.sqlite', // データベースファイルのパス
		driver: sqlite3.Database // 使用するドライバ（sqlite3）
	});
}
// 即時実行関数でデータベースに接続しテーブルを作成
(async () => {
	// データベースに接続
	const db = await openDb();
	// `users`テーブルの作成
	// テーブルが存在しない場合にのみ作成される
	await db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE,password TEXT)`);

	// 'user1'というユーザーが存在するかをチェック
	const userExists = await db.get(`SELECT * FROM users WHERE username = ?`, ['user1']);
	// 'user1'が存在しない場合、ユーザーをデータベースに追加
	if (!userExists) {
		const query = "INSERT INTO users (username, password) VALUES (?, ?)";
		// 各ユーザーをテーブルに挿入
		await db.run(query, ['user1', 'sample']);
		await db.run(query, ['taro', 'yamada']);
		await db.run(query, ['hanako', 'flower']);
		await db.run(query, ['sachiko', 'happy']);
	}
})();

// ユーザー名でユーザーを検索する関数
// 指定されたユーザー名に一致するユーザーをデータベースから取得
async function findUserByUsername(username) {
	const db = await openDb(); // データベースに接続
	return await db.get(
		"SELECT * FROM users WHERE username = ?", username);
}
// ユーザーIDでユーザーを検索する関数 
// 指定されたIDに一致するユーザーをデータベースから取得
async function findUserById(id) {
	const db = await openDb(); // データベースに接続
	return await db.get( // クエリを実行してユーザーを取得
		"SELECT * FROM users WHERE id = ?", id);
}
// findUserByUsername と findUserById 関数を
// モジュールとしてエクスポート
module.exports = { findUserByUsername, findUserById };
