<?php

/**

* The main template file.

*

* This is the most generic template file in a WordPress theme

* and one of the two required files for a theme (the other being style.css).

* It is used to display a page when nothing more specific matches a query.

* E.g., it puts together the home page when no home.php file exists.

* Learn more: http://codex.wordpress.org/Template_Hierarchy

*

* @package Kirumo

*/

 

get_header(); ?>

 

<div id=”primary” class=”content-area”>

<main id=”main” class=”site-main” role=”main”>

<h3>

<?php  single_cat_title(“Category List : “); ?>

</h3><br><ol>

<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

<div class=”jb-post-list”>

<h4>

<li><a href=”<?php the_permalink(); ?>”><?php the_title(); ?></a></li>

</h4>

</div>

<?php endwhile; else: ?>

<img src=https://lh5.googleusercontent.com/-BFPXms30Ivo/U095QTVpgLI/AAAAAAAA19k/gr8zD58fOMA/w862-h545-no/20140417-154816.png alt=”해당 페이지를 찾을수 없습니다”>

<p><?php _e( ‘해당 페이지가 존재하지 않습니다…T_T;;’, ‘kirumo’ ); ?></p>

<?php _e( ‘아래에서 글을 검색해 주시면 감사하겠습니다~’, ‘kirumo’ ); ?></p>

<?php get_search_form(); ?>

 

<?php the_widget( ‘WP_Widget_Recent_Posts’); ?>

<?php endif; ?>

</ol>

<?php

global $wp_query;

$big = 999999999;

echo paginate_links( array(

‘base’ => str_replace( $big, ‘%#%’, esc_url( get_pagenum_link( $big ) ) ),

‘format’ => ‘?paged=%#%’,

‘current’ => max( 1, get_query_var(‘paged’) ),

‘total’ => $wp_query->max_num_pages,

) );

?>

 

</main><!– #main –>

</div><!– #primary –>

 

<?php get_sidebar(); ?>

<?php get_footer(); ?>