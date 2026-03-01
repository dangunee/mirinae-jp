<?php get_header(); ?>
<div id="main-block">
    <div id="content">
    	<?php if (have_posts()) : ?>
            <ul>
            	<?php while (have_posts()) : the_post(); ?>
                	<li <?php post_class() ?> id="post-<?php the_ID(); ?>">
                		<div class="content">
                            <div class="title">
                        	    <h2><a href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title_attribute( array('before' => 'Permalink to: ', 'after' => '')); ?>"><?php the_title(); ?></a></h2>
                            </div>
                            <div class="postdata">
                                <span class="category"><?php the_category(', ') ?></span>
                                <span class="date"><?php the_time('d.m.Y') ?></span>
                                <span class="comments"><?php comments_popup_link('No Comments', '1 Comment', '% Comments'); ?></span>
                            </div><!--.postdata-->
                    		<div class="entry">
				<?php the_post_thumbnail() ?>
                    		    <?php the_content('Read&nbsp;more...'); ?>
                    		</div>
                                <?php wp_link_pages() ?>
                    		<?php the_tags( '<p>Tags: ', ', ', '</p>'); ?>
                                <p class="permalink"><a href="<?php the_permalink();?>">Permalink</a></p>
                		</div>
                		<div class="footer"></div>
                	</li>
            	<?php endwhile; ?>
             </ul>
             <div class="nav-entries">
        		<span class="prev"><?php next_posts_link('<span>&laquo; Previous Entries</span>') ?></span>
				<span class="next"><?php previous_posts_link('<span>Next Entries &raquo;</span>') ?></span>
			 </div>
        <?php else : ?>
        	<h2 class="t-center">Not Found</h2>
        	<p class="t-center">Sorry, but you are looking for something that isn't here.</p>
    	<?php endif; ?>
    </div><!--#content-->
</div><!--#main-block-->
<?php get_sidebar(); ?>
<?php get_footer(); ?>
