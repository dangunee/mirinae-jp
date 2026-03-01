<?php
/**
 * @package WordPress
 * @subpackage Drochilli_Theme
 */
get_header(); ?>

<div id="content">

	<?php if (have_posts()) : ?>

	<div class="posts">

		<?php while (have_posts()) : the_post(); ?>

		<div <?php post_class() ?> id="post-<?php the_ID(); ?>">

			<div class="title">
				<h2><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2>
			</div>

			<div class="meta">
				<p>Posted by <?php the_author(); ?> at <?php the_time(get_option( 'date_format' )); ?></p>
				<p><?php _e('Category:', 'drochilli'); ?> <?php the_category(', ') ?></p>
				<?php the_tags( '<p>' . __('Tags: ', 'drochilli'), ', ', '</p>' ); ?>
			</div>

			<div class="entry">
				<?php the_content(); ?>
			</div>

			<div class="link">
				<a href="<?php the_permalink(); ?>#respond"><?php comments_number(); ?></a>
			</div>

		</div>

		<?php endwhile; ?>

		<div class="navigation">
			<?php
			if(function_exists('wp_pagenavi')) {
				wp_pagenavi();
			} else { ?>
				<div class="alignleft"><?php next_posts_link( __('&laquo; Previous', 'drochilli') ) ?></div>
				<div class="alignright"><?php previous_posts_link( __('Next &raquo;', 'drochilli') ) ?></div>
			<?php } ?>
		</div>

	</div>

<?php else : ?>

	<?php get_template_part('error'); ?>

<?php endif; ?>

</div>

<?php get_sidebar(); ?>
<?php get_footer(); ?>