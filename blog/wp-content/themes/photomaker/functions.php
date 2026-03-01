<?php
include_once get_template_directory() . '/functions/inkthemes-functions.php';
$functions_path = get_template_directory() . '/functions/';
require_once ($functions_path . 'define_template.php');
require_once ($functions_path . 'dynamic-image.php');
require_once ($functions_path . 'photomaker_metabox.php');
require_once($functions_path . 'custom-header.php' );
require_once ($functions_path . 'customizer.php');
require_once ($functions_path . 'themes-page.php');
/**
* Include welcome page
*/
require_once get_template_directory() . '/includes/features/feature-about-page.php';

add_theme_support( "custom-background");
/* ----------------------------------------------------------------------------------- */
/* Styles Enqueue */
/* ----------------------------------------------------------------------------------- */
function inkthemes_add_stylesheet() {
        if (!is_admin()) {
        wp_enqueue_style('photomaker_stylesheet', get_template_directory_uri() . "/style.css", '', '', 'all');
    } 
    
    wp_enqueue_style('Pretty_photo', get_template_directory_uri() . "/css/prettyPhoto.css", '', '', 'all');
    wp_enqueue_style('animate_css3', get_template_directory_uri() . "/css/animate.css", '', '', 'all');
    wp_enqueue_style('smart_scroll', get_template_directory_uri() . "/css/jquery.mCustomScrollbar.css", '', '', 'all');
    wp_enqueue_style('font_awosome', get_template_directory_uri() . "/fonts/font-awesome/css/font-awesome.css", '', '', 'all');
}
add_action('init', 'inkthemes_add_stylesheet');
/* ----------------------------------------------------------------------------------- */
/* jQuery Enqueue */
/* ----------------------------------------------------------------------------------- */
function inkthemes_wp_enqueue_scripts() {
    wp_enqueue_script('inkthemes-twitter-widget', 'http://platform.twitter.com/widgets.js', array(
        'jquery'));
    wp_enqueue_script('inkthemes-flex', get_template_directory_uri() . '/js/jquery.flexslider-min.js', array(
        'jquery'));
    wp_enqueue_script('inkthemes-prettyphoto', get_template_directory_uri() . '/js/jquery.prettyPhoto.js', array(
        'jquery'));
    wp_enqueue_script('inkthemes-imageloaded', get_template_directory_uri() . '/js/jquery.imagesloaded.js', array(
        'jquery'));
    wp_enqueue_script('inkthemes-wookmark', get_template_directory_uri() . '/js/jquery.wookmark.js', array(
        'jquery'));
    wp_enqueue_script('inkthemes-jquery.mCustomScrollbar.concat.min', get_template_directory_uri() . '/js/jquery.mCustomScrollbar.concat.min.js', array(
        'jquery'));
    wp_enqueue_script('inkthemes-custom', get_template_directory_uri() . '/js/custom.js', array(
        'jquery'));
    if (is_singular() and get_site_option('thread_comments')) {
        wp_print_scripts('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'inkthemes_wp_enqueue_scripts');

/*
* Redirect to about us page.
*/
if (is_admin() && isset($_GET['activated']) && $pagenow == "themes.php")
wp_redirect('themes.php?page=photomaker-welcome');

/* ----------------------------------------------------------------------------------- */
/* Custom Jqueries Enqueue */
/* ----------------------------------------------------------------------------------- */
//
function inkthemes_get_option($name) {
    $options = get_option('inkthemes_options');
    if (isset($options[$name]))
        return $options[$name];
}
function inkthemes_update_option($name, $value) {
    $options = get_option('inkthemes_options');
    $options[$name] = $value;
    return update_option('inkthemes_options', $options);
}
function inkthemes_delete_option($name) {
    $options = get_option('inkthemes_options');
    unset($options[$name]);
    return update_option('inkthemes_options', $options);
}
//Add plugin notification 
require_once(get_template_directory() . '/functions/plugin-activation.php');
require_once(get_template_directory() . '/functions/inkthemes-plugin-notify.php');
add_action('tgmpa_register', 'inkthemes_plugins_notify');

function photomaker_tracking_admin_notice() {
    global $current_user;
    $user_id = $current_user->ID;
    /* Check that the user hasn't already clicked to ignore the message */
    if (!get_user_meta($user_id, 'wp_email_tracking_ignore_notice')) {
        ?>
        <div class="updated um-admin-notice"><p><?php _e('Allow Photomaker theme to send you setup guide? Opt-in to our newsletter and we will immediately e-mail you a setup guide along with 20% discount which you can use to purchase any theme.', 'photomaker'); ?></p><p><a href="<?php echo get_template_directory_uri() . '/functions/smtp.php?wp_email_tracking=email_smtp_allow_tracking'; ?>" class="button button-primary"><?php _e('Allow Sending', 'photomaker'); ?></a>&nbsp;<a href="<?php echo get_template_directory_uri() . '/functions/smtp.php?wp_email_tracking=email_smtp_hide_tracking'; ?>" class="button-secondary"><?php _e('Do not allow', 'photomaker'); ?></a></p></div>
        <?php
    }
}

add_action('admin_notices', 'photomaker_tracking_admin_notice');


