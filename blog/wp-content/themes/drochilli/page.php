<?php
/**
 * @package WordPress
 * @subpackage Drochilli_Theme
 */
get_header(); ?>

<div id="content">

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

	<div class="posts">

		<div class="post" id="post-<?php the_ID(); ?>">
			
			<div class="title">
				<h2><?php the_title(); ?></h2>
			</div>

			<div class="entry">
				<?php the_content(); ?>
				<?php wp_link_pages(); ?>
				<?php edit_post_link( __('Edit This', 'drochilli') , '<p>', '</p>'); ?>
			</div>
		</div>

	</div>

	<?php if ( comments_open() ) { ?>
	<div class="comments">
		<?php comments_template(); ?>
	</div>
	<?php } ?>

<?php endwhile; ?>

<?php else : ?>

	<?php get_template_part('error'); ?>

<?php endif; ?>

</div>

<?php get_sidebar(); ?>

<?php get_footer(); ?>