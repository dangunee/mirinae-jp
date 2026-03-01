<?php
/**
 * @package WordPress
 * @subpackage Drochilli_Theme
 */

// Do not delete these lines
if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
{
	die ('Please do not load this page directly. Thanks!');
}
// This post is password protected. Enter the password to view comments
if ( post_password_required() ) { ?>
	<p class="nocomments"><?php _e('This post is password protected. To view it please enter your password below', 'drochilli'); ?></p>
<?php
	return;
}
?>

<!-- You can start editing here. -->

<?php if ( have_comments() ) : ?>

	<h3 id="comments-title"><?php comments_number(); ?></h3>

	<ol class="commentlist">

		<?php wp_list_comments('callback=drochilli_comment'); ?>
	</ol>
	<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // are there comments to navigate through ?>
		<div class="navigation">
				<div class="alignleft"><?php previous_comments_link( __('&laquo; Previous', 'drochilli') ) ?></div>
				<div class="alignright"><?php next_comments_link( __('Next &raquo;', 'drochilli') ) ?></div>
		</div>
	<?php endif; // check for comment navigation ?>

<?php else : // this is displayed if there are no comments so far ?>

	<?php if ('open' == $post->comment_status) : ?>
		<!-- If comments are open, but there are no comments. -->

	 <?php else : // comments are closed ?>
		<!-- If comments are closed. -->
		<p class="nocomments"><?php _e('Sorry, comments are closed for this item.', 'drochilli'); ?></p>

	<?php endif; ?>

<?php endif; ?>


<?php if ('open' == $post->comment_status) : ?>

	<div class="commentrespond">
		

		<?php if ( get_option('comment_registration') && !$user_ID ) : ?>
			<p><a href="<?php echo get_site_url(); ?>/wp-login.php?redirect_to=<?php echo urlencode(get_permalink()); ?>"><?php _e('Sorry, you must be logged in to reply to a comment.', 'drochilli'); ?></a></p>
		<?php else : ?>

			<?php

				$commenter = wp_get_current_commenter();
				$req = get_option( 'require_name_email' );
				$aria_req = ( $req ? " aria-required='true'" : '' );

				$fields =  array(
					'author' => '<div class="c_item"><label for="author"><span>'. __('Name:', 'drochilli') .'</span></label><input class="inp_t" id="author" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) . '"  ' . $aria_req . '  size="22" tabindex="1" /><span class="req">' . ( $req ? __('(required)', 'drochilli') : '') .'</span></div>',
					
					'email'  => '<div class="c_item"><label for="email"><span>'. __('E-mail:', 'drochilli') .'</span></label><input class="inp_t" id="email" name="email" type="text" value="' . esc_attr(  $commenter['comment_author_email'] ) . ' " ' . $aria_req . ' size="22" tabindex="2" /><span class="req">'. ( $req ? __('(required)', 'drochilli')  .' ' . __('(will not be published)', 'drochilli') : '') .'</span></div>',

					'url' => '<div class="c_item"><label for="url"><span>'. __('URL:', 'drochilli') .'</span></label><input type="text" name="url" id="url" value="' . esc_attr(  $commenter['comment_author_url'] ) .'" size="22" tabindex="3" /></div>'	
					
				); ?>

				<?php $defaults = array(
					'fields'               => $fields,
					'comment_field'        => '<div class="c_item textarea"><label for="comment"><span>'. __('Your Comment', 'drochilli') .'</span></label><textarea id="comment" name="comment" cols="100%" rows="10" tabindex="4" aria-required="true"></textarea></div>',
					'must_log_in'          => '<div class="must-log-in">' .  sprintf( __( 'You must be <a href="%s">logged in</a> to post a comment.', 'drochilli' ), wp_login_url( apply_filters( 'the_permalink', get_permalink( $post->ID ) ) ) ) . '</div>',
					'logged_in_as'         => '<div class="logged-in-as">' . sprintf( __( 'Logged in as <a href="%1$s">%2$s</a>. <a href="%3$s" title="Log out of this account">Log out?</a>', 'drochilli' ), admin_url( 'profile.php' ), $user_identity, wp_logout_url( apply_filters( 'the_permalink', get_permalink( $post->ID ) ) ) ) . '</div>',
					'comment_notes_before' => '',
					'comment_notes_after'  => '',
					'id_form'              => 'commentform',
					'id_submit'            => 'submit',
					'title_reply'          => __( 'Leave a comment', 'drochilli' ),
					'title_reply_to'       => __( 'Leave a comment to %s', 'drochilli' ),
					'cancel_reply_link'    => __( 'Cancel reply', 'drochilli' ),
					'label_submit'         => __( 'Submit Comment', 'drochilli' )
				);
			?>


			<?php comment_form($defaults); ?>

		<?php endif; // If registration required and not logged in ?>

	</div>

<?php endif; // if you delete this the sky will fall on your head ?>