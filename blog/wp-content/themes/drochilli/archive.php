<?php
/**
 * @package WordPress
 * @subpackage Drochilli_Theme
 */
get_header(); ?>

<div id="content">

	<?php if (have_posts()) : ?>

	<?php $post = $posts[0]; // Hack. Set $post so that the_date() works. ?>
	<?php /* If this is a category archive */ if (is_category()) { ?>
	<h2 class="pagetitle">Archive for the &#8216;<?php single_cat_title(); ?>&#8217; Category</h2>
	<?php /* If this is a tag archive */ } elseif( is_tag() ) { ?>
	<h2 class="pagetitle">Posts Tagged &#8216;<?php single_tag_title(); ?>&#8217;</h2>
	<?php /* If this is a daily archive */ } elseif (is_day()) { ?>
	<h2 class="pagetitle">Archive for <?php echo get_the_time('F jS, Y'); ?></h2>
	<?php /* If this is a monthly archive */ } elseif (is_month()) { ?>
	<h2 class="pagetitle">Archive for <?php echo get_the_time('F, Y'); ?></h2>
	<?php /* If this is a yearly archive */ } elseif (is_year()) { ?>
	<h2 class="pagetitle">Archive for <?php echo get_the_time('Y'); ?></h2>
	<?php /* If this is an author archive */ } elseif (is_author()) { ?>
	<h2 class="pagetitle">Author Archive</h2>
	<?php /* If this is a paged archive */ } elseif (isset($_GET['paged']) && !empty($_GET['paged'])) { ?>
	<h2 class="pagetitle">Blog Archives</h2>
	<?php } ?>

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