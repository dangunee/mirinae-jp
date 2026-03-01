<?php
/**
 * @package WordPress
 * @subpackage Drochilli_Theme
 */
?>

<div class="posts">
	<div class="post">
		<div class="title">
			<h2><?php _e('Page not found', 'drochilli'); ?></h2>
		</div>
		<div class="entry">
			<?php
			if ( is_category() ) {
				printf("<p>Sorry, but there aren't any posts in the %s category yet.</p>", single_cat_title('',false));
			} else if ( is_date() ) {
				echo '<p>Sorry, but there aren\'t any posts with this date.</p>';
			} else if ( is_author() ) {
				$userdata = get_userdatabylogin(get_query_var('author_name'));
				printf("<p>Sorry, but there aren't any posts by %s yet.</p>", $userdata->display_name);
			} else if(is_search()) {
				echo '<p>No posts found. Try a different search?</p>';
			} else {
				echo '<p>' . __('Sorry, no posts matched your criteria.', 'drochilli') . '</p>';
			}
			?>
		</div>
	</div>
</div>