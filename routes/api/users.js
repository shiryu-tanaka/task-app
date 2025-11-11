const express = require('express');
const router = express.Router();
const User = require('../../models/user'); // userモデル
// ログイン処理のルート
router.post('/login', async (req, res) => {
	// リクエストからユーザー名とパスワードを取得
	const { username, password } = req.body;
	try {
		// ユーザー名に一致するユーザーを検索
		const user = await User.findUserByUsername(username);
		// パスワードが一致するかを確認
		if (password === user.password) {
			// 一致する場合、セッションにユーザーIDを保存
			req.session.userId = user.id;
			// ログイン成功のレスポンスを返す
			res.status(200).json({ message: 'Login successful' });
		} else {
			// パスワードが一致しない場合、エラーを返す
			res.status(400).json({ error: 'Invalid password' });
		}
	} catch (err) {
		// エラーが発生した場合、エラーを返す
		res.status(500).json({ error: 'Failed to login' });
	}
});
// ログアウト処理のルート
router.post('/logout', (req, res) => {
	// セッションを破棄してログアウト処理を行う
	req.session.destroy(err => {
		if (err) {
			// セッション破棄に失敗した場合、エラーを返す
			return res.status(500).json({ error: 'Logout failed' });
		}
		// ログアウト成功のレスポンスを返す
		res.status(200).json({ message: 'Logout successful' });
	});
});
module.exports = router;
