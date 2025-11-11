const express = require('express');
const router = express.Router();
// タスクの作成、取得、削除に関する関数をインポート
const {
	createTask,
	getTasksByUserId,
	deleteTaskById
} = require('../../models/task');
//　新しいタスクを作成するエンドポイント
router.post('/', async (req, res) => {
	// リクエストのボディからタスクの説明と期限を取得
	const { description, deadline } = req.body;
	try {
		// タスクを作成。ユーザーIDはセッションから取得
		await createTask(description, req.session.userId, deadline);
		// 成功時にステータス201と成功メッセージを返す
		res.status(201).json({ message: 'Task added' });
	} catch (err) {
		// エラー時にはステータス500でエラーメッセージを返す
		res.status(500).json({ error: 'Failed to add task' });
	}
});
// ユーザーIDに基づきタスクを取得するエンドポイント
router.get('/', async (req, res) => {
	try {
		// ユーザーIDに基づいてタスクを取得
		const tasks = await getTasksByUserId(req.session.userId);
		// 現在の時間をISO形式で取得（日本標準時の9時間を加算）
		const currentTime = new Date(new Date().getTime()
			+ 9 * 60 * 60 * 1000).toISOString();
		// 期限が現在の時間よりも前のタスクを得る
		const pastTasks = tasks.filter(
			tasks => tasks.deadline < currentTime);
		// 期限が現在の時間と同じかそれより後のタスクを得る
		const futureTasks = tasks.filter(
			tasks => tasks.deadline >= currentTime);
		// 過去と未来のタスクをレスポンスとして返す
		return res.status(200).json({ futureTasks, pastTasks });
	} catch (err) {
		// エラー時にはステータス500でエラーメッセージを返す
		res.status(500).json({ error: 'Failed to retrieve tasks' });
	}
});

// 指定されたIDのタスクを削除するエンドポイント
router.delete('/:id', async (req, res) => {
	try {
		// パラメータからタスクのIDを取得してタスクを削除
		await deleteTaskById(req.params.id);
		// 成功時にステータス200と成功メッセージを返す
		res.status(200).json({ message: 'Task deleted' });
	} catch (err) {
		// エラー時にはステータス500でエラーメッセージを返す
		res.status(500).json({ error: 'Failed to delete task' });
	}
});
// ルーターをモジュールとしてエクスポート
module.exports = router;
