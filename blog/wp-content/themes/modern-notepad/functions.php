<?php

function modernnotepad_after_setup_theme() {
    global $content_width;

    if ( ! isset( $content_width ) ) {
        $content_width = 517;
    }

    add_editor_style('editor-style.css');

    add_theme_support('automatic-feed-links');
    add_theme_support('post-thumbnails');
	add_theme_support('custom-background', array(
		'wp-head-callback' => 'modernnotepad_custom_background',
	));
    add_theme_support('html5');

    register_nav_menu('main', 'Main navigation menu');
}
add_action('after_setup_theme', 'modernnotepad_after_setup_theme');

function modernnotepad_custom_background() {
	/* Get the background image. */
	$image = get_background_image();
	/* If there's an image, just call the normal WordPress callback. We won't do anything here. */
	if ( !empty( $image ) ) {
		_custom_background_cb();
		return;
	}
	/* Get the background color. */
	$color = get_background_color();
	/* If no background color, return. */
	if ( empty( $color ) )
			return;
	/* Use 'background' instead of 'background-color'. */
	$style = "background: #{$color};";
?>
<style type="text/css">body { <?php echo trim( $style ); ?> }</style>
<?php
}

function modernnotepad_styles(){
	wp_register_style('modernnotepad-print', get_template_directory_uri().'/print.css', '', 'false', 'print');
	wp_enqueue_style( 'modernnotepad-print');

	wp_register_style('modernnotepad-ie', get_template_directory_uri().'/ie.css');

	$GLOBALS['wp_styles']->add_data( 'modernnotepad-ie', 'conditional', 'lte IE 8' );

	wp_enqueue_style( 'modernnotepad-ie');

	wp_enqueue_style( 'modernnotepad-style', get_stylesheet_uri());

	if ( is_singular() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'modernnotepad_styles' );

add_action( 'widgets_init', 'modernnotepad_widgets_init' );
function modernnotepad_widgets_init() {
		register_sidebar( array(
			'name'  => 'Sidebar',
			'id'    => 'sidebar',
			'description'   => 'Right Sidebar',
			'before_title'=>'<div class="header"><h3>',
			'after_title'=>'</h3></div>',
			'before_widget'=>'<div class="box">',
			'after_widget'=>'</div>'
		) );
}


function modernnotepad_header_style() {
	if (get_header_image()!='') {
	?><style type="text/css">
		#headerimg {
			width: <?php echo HEADER_IMAGE_WIDTH; ?>px;
			height: <?php echo HEADER_IMAGE_HEIGHT; ?>px;
			background: #000 url(<?php header_image(); ?>) no-repeat;
			margin-bottom: 10px;
			margin-top: -5px;
		}
	</style><?php
	}
}

function modernnotepad_remove_width_attribute( $html ) {
   $html = preg_replace( '/(width|height)="\d*"\s/', "", $html );
   return $html;
}
add_filter( 'post_thumbnail_html', 'modernnotepad_remove_width_attribute', 10 );
add_filter( 'image_send_to_editor', 'modernnotepad_remove_width_attribute', 10 );

function modernnotepad_wp_title( $title, $sep ) {
    global $paged, $page;

    if ( is_feed() ) {
        return $title;
    }

    // Add the site name.
    $title .= get_bloginfo( 'name' );

    // Add the site description for the home/front page.
    $site_description = get_bloginfo( 'description', 'display' );
    if ( $site_description && ( is_home() || is_front_page() ) ) {
        $title = "$title $sep $site_description";
    }

    // Add a page number if necessary.
    if ( $paged >= 2 || $page >= 2 ) {
        $title = "$title $sep " . sprintf( __( 'Page %s', 'twentyfourteen' ), max( $paged, $page ) );
    }

    return $title;
}
add_filter( 'wp_title', 'modernnotepad_wp_title', 10, 2 );
