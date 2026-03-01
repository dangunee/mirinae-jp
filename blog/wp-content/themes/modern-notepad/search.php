<?php
/* template name: Posts by Category! */
get_header(); ?>
 
        <div id="container" style='float:left;width:70%;'> 
            <div id="content" role="main">
<?php if(have_posts()){ 
	echo "<h1>Search Results</h1>";
   }else{
	echo "<h1>No Search Result</h1>";
  } 
 while (have_posts()) : the_post(); ?>
  <a href="<?php the_permalink() ?>">
  <h2><?php the_title(); ?></h2>
</a>
<p><?php the_excerpt(); ?></p><?php endwhile; ?>



            </div><!-- #content -->
        </div><!-- #container -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>