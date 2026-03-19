<?php
/** 
 * WordPress 基本設定
 *
 * このファイルは、MySQL、テーブル接頭辞、秘密鍵、言語、ABSPATH の設定を含みます。
 * より詳しい情報は {@link http://wpdocs.sourceforge.jp/wp-config.php_%E3%81%AE%E7%B7%A8%E9%9B%86 
 * wp-config.php の編集} を参照してください。MySQL の設定情報はホスティング先より入手できます。
 *
 * このファイルはインストール時に wp-config.php 作成ウィザードが利用します。
 * ウィザードを介さず、このファイルを "wp-config.php" という名前でコピーして直接編集し値を
 * 入力しても構いません。
 *
 * @package WordPress
 */

// 注意:
// Windows の "メモ帳" でこのファイルを編集しないでください !
// 問題なく使えるテキストエディタ
// (http://wpdocs.sourceforge.jp/Codex:%E8%AB%87%E8%A9%B1%E5%AE%A4 参照)
// を使用し必ず UTF-8 の BOM なし (UTF-8N) で保存してください。

// ** MySQL 設定 - こちらの情報はホスティング先から入手してください。 ** //
/** WordPress のデータベース名 */

// リクエスト元に応じてURLを切り替え（mirinae.jp経由＝リダイレクト防止、hippy.jp直接＝管理画面用）
$request_host = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? $_SERVER['HTTP_HOST'] ?? '';
$is_mirinae_jp = (strpos($request_host, 'mirinae.jp') !== false && strpos($request_host, 'hippy') === false);
if ($is_mirinae_jp) {
	define('WP_HOME', 'https://mirinae.jp/blog');
	define('WP_SITEURL', 'https://mirinae.jp/blog');
	define('WP_CONTENT_URL', 'https://mirinae.jp/blog/wp-content');
} else {
	define('WP_HOME', 'https://mirinae.hippy.jp/blog');
	define('WP_SITEURL', 'https://mirinae.hippy.jp/blog');
	define('WP_CONTENT_URL', 'https://mirinae.hippy.jp/blog/wp-content');
}
define('FORCE_SSL_ADMIN', true);
define('WP_CACHE', true);
define( 'WPCACHEHOME', '/home/users/0/hippy.jp-mirinae/web/blog/wp-content/plugins/wp-super-cache/' );
define('DB_NAME', 'LAA0556736-f3ko1j');

/** MySQL のユーザー名 */
define('DB_USER', 'LAA0556736');

/** MySQL のパスワード */
define('DB_PASSWORD', 'tlShHYYL');

/** MySQL のホスト名 (ほとんどの場合変更する必要はありません。) */
define('DB_HOST', 'mysql006.phy.lolipop.lan');

/** データベーステーブルのキャラクターセット (ほとんどの場合変更する必要はありません。) */
define('DB_CHARSET', 'utf8');

/** データベースの照合順序 (ほとんどの場合変更する必要はありません。) */
define('DB_COLLATE', '');

/**#@+
 * 認証用ユニークキー
 *
 * それぞれを異なるユニーク (一意) な文字列に変更してください。
 * {@link https://api.wordpress.org/secret-key/1.1/ WordPress.org の秘密鍵サービス}
 * で自動生成することもできます。
 * 後でいつでも変更して、既存のすべての cookie を無効にできます。これにより、
 * すべてのユーザーを強制的に再ログインさせることができます。
 *
 * @since 2.6.0
 */
define('AUTH_KEY', 'I}9ksuv-XH@T^HB9}47LJd)g+%:i]!~rfIhc=?R$q.mam"}:4]l{IY28!k]#TZsv');
define('SECURE_AUTH_KEY', '^|~^3ZY7Ni[#kI%Px-FJohkL7|@#^E}a>~/y?U|sv3qo8B:HLIjD:XQ};b5{XB$d');
define('LOGGED_IN_KEY', 'F#/+R^Eo=[7FE=I,k_]qCzejL@U1Db|*lCRRR*t5QG"nUQTvSGQvZ&JI3:Bq~![P');
define('NONCE_KEY', '3qV?Y60krbw`.#ACa|Jyg]JN+FMuqU?/Ej*?7c!"qDp[hi~hnKHxA_{3/H;5}K=O');
/**#@-*/

/**
 * WordPress データベーステーブルの接頭辞
 *
 * それぞれにユニーク (一意) な接頭辞を与えることで一つのデータベースに複数の WordPress を
 * インストールすることができます。半角英数字と下線のみを使用してください。
 */
$table_prefix  = 'wp1_';

/**
 * ローカル言語 - このパッケージでは初期値として 'ja' (日本語 UTF-8) が設定されています。
 *
 * WordPress のローカル言語を設定します。設定した言語に対応する MO ファイルが 
 * wp-content/languages にインストールされている必要があります。例えば de.mo を 
 * wp-content/languages にインストールし WPLANG を 'de' に設定することでドイツ語がサポートされます。
 */
define ('WPLANG', 'ja');

// 編集が必要なのはここまでです ! WordPress でブログをお楽しみください。

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

define( 'WP_DEBUG', true );
//Enable error logging.
@ini_set('log_errors', 'On');
@ini_set('error_log', '/home/users/0/hippy.jp-mirinae/web/blog/wp-content/elm-error-logs/php-errors.log');

//Don't show errors to site visitors.
@ini_set('display_errors', 'Off');
if ( !defined('WP_DEBUG_DISPLAY') ) {
	define('WP_DEBUG_DISPLAY', false);
}