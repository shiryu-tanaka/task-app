const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
// SQLite3データベースに接続する関数
async function openDb() {
	return open({
		filename: './db.sqlite',
		driver: sqlite3.Database
	});
}
// 即時実行関数でデータベース接続しテーブルを作成
(async () => {
	const db = await openDb(); // データベースに接続
	// `tasks`テーブルの作成
	// テーブルが存在しない場合にのみ作成される
	await db.run(`CREATE TABLE IF NOT EXISTS tasks (
	id INTEGER PRIMARY KEY,
	description TEXT,
	userId INTEGER,
	deadline DATETIME)`);
})();
// 新しいタスクを作成する非同期関数
async function createTask(description, userId, deadline) {
	const db = await openDb(); // データベースに接続
	try {
		// タスクを挿入するSQLクエリ
		const query = `INSERT INTO tasks (
	description, userId, deadline
	) VALUES (?, ?, ?)`;
		// クエリを実行してタスクを追加
		await db.run(query, description, userId, deadline);
	} catch (err) {
		// エラーが発生した場合、エラーメッセージを出力
		console.error(err);
	}
}// 指定されたユーザーIDの全タスクを取得する非同期関数
async function getTasksByUserId(userId) {
	const db = await openDb(); // データベースに接続
	try {
		// ユーザーIDからタスクを取得し、締め切りの降順で並べ替え
		return await db.all(`SELECT * FROM tasks
WHERE userId = ? ORDER BY deadline DESC`, userId);
	} catch (err) {
		// エラーが発生した場合、エラーメッセージを出力
		console.error(err);
	}
}
// 指定されたIDのタスクを削除する非同期関数
async function deleteTaskById(id) {
	try {
		const db = await openDb(); // データベースに接続
		// 指定されたIDのタスクを削除
		return await db.run("DELETE FROM tasks WHERE id = ?", id);
	} catch (err) {
		// エラーが発生した場合、エラーメッセージを出力
		console.error(err);
	}
}
// 指定されたユーザーIDの全タスクを取得する非同期関数
async function getTasksByUserId(userId) {
	const db = await openDb(); // データベースに接続
	try {
		// ユーザーIDからタスクを取得し、締め切りの降順で並べ替え
		return await db.all(`SELECT * FROM tasks
	WHERE userId = ? ORDER BY deadline DESC`, userId);
	} catch (err) {
		// エラーが発生した場合、エラーメッセージを出力
		console.error(err);
	}
}
// 指定されたIDのタスクを削除する非同期関数
async function deleteTaskById(id) {
	try {
		const db = await openDb(); // データベースに接続
		// 指定されたIDのタスクを削除
		return await db.run("DELETE FROM tasks WHERE id = ?", id);
	} catch (err) {
		// エラーが発生した場合、エラーメッセージを出力
		console.error(err);
	}
}
// タスク作成、取得、削除の各関数をモジュールとしてエクスポート
module.exports = { createTask, getTasksByUserId, deleteTaskById };
