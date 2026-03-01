            </div><!--#main-->
            <div id="footer">
                <div class="wrapper">
                    <span class="copyright">&copy; <?php echo date('Y'); ?><?php bloginfo('name'); ?>. All Rights Reserved.</span>
                    <span class="links" style="line-height:31px">
                        <a href="<?php bloginfo('rss2_url'); ?>" title="Syndicate this site using RSS" class="rss entries">Entries <abbr title="Really Simple Syndication">RSS</abbr></a>
                        <a href="<?php bloginfo('comments_rss2_url'); ?>" title="The latest comments to all posts in RSS" class="rss">Comments <abbr title="Really Simple Syndication">RSS</abbr></a>
                        <a href="<?php echo home_url(); ?>/wp-admin/" title="User Area" class="login">Login</a>
                        <a href="https://www.aoe.com/en/lp/wordpress-themes.html" title="AOE" class="powered"><img src="<?php echo get_template_directory_uri() ?>/img/cubes.gif" alt="" /></a>
                    </span>
                </div>
            </div><!--#footer-->
        </div><!--#root-->
        </div></div><!--end lines-->
        <div id="img-cache"><img src="<?php echo get_template_directory_uri(); ?>/img/archive-hover.gif" alt="" /><img src="<?php echo get_template_directory_uri(); ?>/img/blogroll-hover.gif" alt="" /><img src="<?php echo get_template_directory_uri(); ?>/img/popular-hover.gif" alt="" /><img src="<?php get_template_directory_uri(); ?>/img/nav-hover.gif" alt="" /><img src="<?php get_template_directory_uri(); ?>/img/cat-hover.gif" alt="" /></div>
	<?php wp_footer(); ?>
    </body>
</html>
