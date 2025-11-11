const express = require('express');
const router = express.Router();
// ホームページのルート
router.get('/', (req, res) => {
	// ログインしているかをuserIdで確認
	if (req.session.userId) {
		// ログインしている場合、タスク管理ページに移動
		res.redirect('/tasks');
	} else {
		// ログインしていない場合、ログインページに移動 
		res.redirect('/login');
	}
});
// タスク管理ページのルート
router.get('/tasks', (req, res) => {
	// ログインしているかをuserIdで確認
	if (req.session.userId) {
		// ログインしている場合、tasksテンプレートを表示
		res.render('layout', {
			title: 'Task Manager', content: 'tasks'
		});
	} else {
		// ログインしていない場合、ログインページに移動
		res.redirect('/login');
	}
});

// ログインページのルート
router.get('/login', (req, res) => {
	// `login`テンプレートをレンダリング
	res.render('layout', {
		title: 'Login', content: 'login'
	});
});
module.exports = router;
