<?php
/**
 * @package WordPress
 * @subpackage Drochilli_Theme
 */



/**
 * Set the content width based on the theme's design and stylesheet.
 */
if ( ! isset( $content_width ) )
	$content_width = 584;

function drochilli_setup() {
	// Add default posts and comments RSS feed links to <head>.
	add_theme_support( 'automatic-feed-links' );

	// This theme styles the visual editor with editor-style.css to match the theme style.
	add_editor_style();	

}


add_action( 'after_setup_theme', 'drochilli_setup' );

function drochilli_widgets_init() {
	register_sidebar( array(
		'name' => 'Main Sidebar',
		'id' => 'sidebar-1',
		'before_widget' => '<li id="%1$s" class="widget %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widgettitle">',
		'after_title' => '<span><!-- --></span></h3>',
	) );

}	

add_action( 'widgets_init', 'drochilli_widgets_init' );

add_theme_support( "post-thumbnails" );

/**
 * Enqueues scripts and styles for front-end.
 */
function drochilli_scripts_styles() {
	global $wp_styles;

	/*
	 * Adds JavaScript to pages with the comment form to support
	 * sites with threaded comments (when in use).
	 */
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) )
		wp_enqueue_script( 'comment-reply' );

	// Include theme stylesheet
	wp_register_style('style', get_stylesheet_directory_uri() .'/style.css');
	wp_enqueue_style('style');	

}

add_action( 'wp_enqueue_scripts', 'drochilli_scripts_styles' );

function drochilli_wp_title( $title, $sep ) {
	global $paged, $page;

	if ( is_feed() )
		return $title;

	// Add the site name.
	$title .= get_bloginfo( 'name' );

	// Add the site description for the home/front page.
	$site_description = get_bloginfo( 'description', 'display' );
	if ( $site_description && ( is_home() || is_front_page() ) )
		$title = "$title $sep $site_description";

	// Add a page number if necessary.
	if ( $paged >= 2 || $page >= 2 )
		$title = "$title $sep " . sprintf( __( 'Page %s', 'drochilli' ), max( $paged, $page ) );

	return $title;
}
add_filter( 'wp_title', 'drochilli_wp_title', 10, 2 );

function drochilli_comment($comment, $args, $depth) {
	$GLOBALS['comment'] = $comment; ?>

	<li <?php comment_class(); ?> id="comment-<?php comment_ID() ?>">
		<div id="div-comment-<?php comment_ID() ?>" class="comment-body">
			<div class="comment-meta">
				<div class="comment-author">
				<a href="#comment-<?php comment_ID() ?>"></a><cite class="fn"><?php comment_author_link() ?></cite> <span class="says">says</span> <span class="commentmetadata">(<?php comment_date('j.m.Y') ?> at <?php comment_time() ?>):</span></div>
				<div class="comment-avatar"><?php echo get_avatar( $comment, 42 ); ?></div>
			</div>
			<div class="comment-text">
				<?php if ($comment->comment_approved == '0') : ?><em><?php _e('Your comment is awaiting moderation.', 'drochilli'); ?></em><?php endif; ?>
				<?php comment_text(); ?>
				<?php echo comment_reply_link(array('add_below' => 'div-comment', 'depth' => $depth, 'max_depth' => $args['max_depth']));  ?>	
			</div>
		</div>
<?php }
