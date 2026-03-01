	<div class="posts">

		<div <?php post_class() ?> id="post-<?php the_ID(); ?>">

			<div class="title">
				<h1><?php the_title(); ?></h1>
			</div>

			<div class="meta">
				<p>Posted by <?php the_author(); ?> at <?php the_time(get_option( 'date_format' )); ?></p>
				<p><?php _e('Category:', 'drochilli'); ?> <?php the_category(', ') ?></p>
				<?php the_tags( '<p>' . __('Tags: ', 'drochilli'), ', ', '</p>' ); ?>
			</div>

			<div class="entry">
				<?php the_content('Read the rest of this entry &raquo;'); ?>
				<?php edit_post_link( __('Edit This', 'drochilli' ), '<p>', '</p>'); ?>
			</div>

		</div>

	</div>

	<div class="comments">
		<?php comments_template(); ?>
	</div>