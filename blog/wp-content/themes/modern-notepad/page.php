<?php get_header(); ?>
<div id="main-block">
    <div id="content">
    	<?php if (have_posts()) : ?>
            <ul>
            	<?php while (have_posts()) : the_post(); ?>
                	<li class="post" id="post-<?php the_ID(); ?>">
                		<div class="content">
                            <div class="title">
                        	    <h2><a href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title_attribute( array('before' => 'Permalink to: ', 'after' => '')); ?>"><?php the_title(); ?></a></h2>
                            </div>
                    		<div class="entry">
                    		    <?php the_content('Read&nbsp;more...'); ?>
                    		</div>
                		</div>
                		<div class="footer"></div>
                	</li>
                        <?php if (comments_open()) : ?>
                            <li class="post">
                                <div class="content">
                                        <?php comments_template(); ?>
                                </div>
                                <div class="footer"></div>
                            </li>
                        <?php endif; ?>
                        
            	<?php endwhile; ?>
                 
             </ul>
        <?php else : ?>
        	<h2 class="t-center">Not Found</h2>
        	<p class="t-center">Sorry, but you are looking for something that isn't here.</p>
    	<?php endif; ?>
    </div><!--#content-->
</div><!--#main-block-->
<?php get_sidebar(); ?>
<?php get_footer(); ?>