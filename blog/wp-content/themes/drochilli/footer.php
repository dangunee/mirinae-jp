<?php
/**
 * @package WordPress
 * @subpackage Drochilli_Theme
 */
?>

		</div>

	</div>

	<div id="footer">

		<div class="columns">
			<div class="right">
				<p>&copy; <?php echo date('Y') ?> <?php bloginfo('name'); ?> &middot; WordPress theme desigined by <a href="<?php echo esc_url( __( 'http://www.dizzain.com/', 'drochilli' ) ); ?>" title="Dizzain.com">Dizzain.com</a> &middot; Subscribe: <a href="<?php bloginfo('rss2_url'); ?>"><?php _e('RSS', 'drochilli'); ?></a></p>
			</div>
			<?php
			/* <div class="left">
			*	 <p>WordPress theme desigined by <a href="<?php echo esc_url( __( 'http://www.dizzain.com/', 'drochilli' ) ); ?>" title="Dizzain.com">Dizzain.com</a></p>
			* </div>
			*/
			?>
		</div>

	</div>

</div>

<?php wp_footer(); ?>

</body>
</html>

<!-- <?php echo get_num_queries(); ?> queries. <?php timer_stop(1); ?> seconds. -->