
	<footer id="colophon" role="contentinfo">
		<div id="site-generator">
			<?php echo __('&copy; ', 'diginews' ) . esc_attr( get_bloginfo( 'name', 'display' ) );  ?>
            <?php if ( is_home() || is_front_page() ) : ?>
            <?php _e('- Built with ', 'diginews'); ?><a href="<?php echo esc_url( __( 'http://wordpress.org/', 'diginews' ) ); ?>" title="<?php esc_attr_e( 'Semantic Personal Publishing Platform', 'diginews' ); ?>" target="_blank"><?php _e('WordPress' ,'diginews'); ?></a>
        <?php _e(' and ', 'diginews'); ?><a href="<?php echo esc_url( __( 'https://citizenjournal.net/diginews-theme/', 'diginews' ) ); ?>" target="_blank"><?php _e('Diginews', 'diginews'); ?></a>
            <?php endif; ?>
		</div>
	</footer><!-- #colophon -->
</div><!-- #container -->

<?php wp_footer(); ?>

</body>
</html>