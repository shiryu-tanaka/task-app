const express = require('express');
const session = require('express-session');
const app = express();

// ルートハンドラの読み込み
const pageRouter = require('./routes/pages');
const userApiRouter = require('./routes/api/users');
const taskApiRouter = require('./routes/api/tasks');

// テンプレートエンジンの設定
app.set('view engine', 'ejs');

// ミドルウェアの設定
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// セッション管理の設定
app.use(session({
  secret: 'secret',
  resave: 'false',
  saveUninitialized: 'false',
  cookie: { maxAge: 60 * 60 * 1000 * 3}
}));

// 静的ファイルの提供設定
app.use(express.static('public'));

// 各ルーターを特定のURLパスにバインド
app.use('/', pageRouter);
app.use('/api/users', userApiRouter);
app.use('/api/tasks', isLoggedIn, taskApiRouter);

// ユーザーがログインしているか確認するミドルウェア関数
// ログインしていない場合、401 Unauthorizedエラーを返す
function isLoggedIn(req, res, next) {
  if (req.session.userId) { // セッションにuserIdがあれば認証成功
    return next(); // 次のミドルウェアまたはルートハンドラに進む
  }
  // 認証失敗時に401ステータスを返す
  res.status(401).json({ error: 'Unauthorized'});
}

// サーバーをポート3000で起動
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
})
