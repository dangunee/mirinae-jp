<?php
/**
 * @package WordPress
 * @subpackage Drochilli_Theme
 */
?>
<div id="aside">

	<ul>

		<?php
		if ( is_active_sidebar('sidebar-1') ) {
		?>

		<?php dynamic_sidebar( 'sidebar-1' ); ?>

		<?php } ?>

	</ul>

</div>