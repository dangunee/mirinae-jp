<!-- The JavaScript -->		
<section id="dynamic_sidebar" style="right: 0;">
    <h2><a href="#"></a></h2>
    <?php if (current_user_can('manage_options')) { ?>
        <style>
            #dynamic_sidebar h2 a {
                position: absolute;
                left: -37px;
                top: 32px;
            }
        </style>
    <?php } ?>
    <div class="sidebar_container" id="content_1">
        <div class="menu_wrapper">
            <div id="MainNav">
                <?php inkthemes_nav(); ?>                       
            </div>
        </div>
        <?php get_sidebar(); ?>	
        <div class="sl_logos">
        <ul class="social_logos">	
        <?php 
        if (inkthemes_get_option('photomaker_facebook') != '') { ?>
            <li class="fb"><a href="<?php echo inkthemes_get_option('photomaker_facebook'); ?>" alt="Facebook" target="_blank" title="Facebook"></a></li>
        <?php }?>		
        <?php if (inkthemes_get_option('photomaker_rss') != '') { ?>
            <li class="rss"><a href="<?php echo inkthemes_get_option('photomaker_rss'); ?>" alt="RSS" title="RSS" target="_blank"></a></li>
        <?php } 
        if (inkthemes_get_option('photomaker_pinterest') != '') { ?>
            <li class="pn"><a href="<?php echo inkthemes_get_option('photomaker_pinterest'); ?>" alt="Pinterest" target="_blank" title="Pinterest"></a></li>
        <?php }
        if (inkthemes_get_option('photomaker_linkedin') != '') { ?>
            <li class="ln"><a href="<?php echo inkthemes_get_option('photomaker_linkedin'); ?>" alt="Linked In" target="_blank" title="Linked In"></a></li> 
        <?php } ?> 
        <?php if (inkthemes_get_option('photomaker_google') != '') { ?>
            <li class="gp"><a href="<?php echo inkthemes_get_option('photomaker_google'); ?>" alt="Google" title="Google" target="_blank"></a></li>
        <?php } 
        if (inkthemes_get_option('photomaker_instagram') != '') { ?>
            <li class="insta"><a href="<?php echo inkthemes_get_option('photomaker_instagram'); ?>" alt="Instagram" target="_blank" title="Instagram"></a></li>
        <?php }
        if (inkthemes_get_option('photomaker_twitter') != '') { ?>
            <li class="twitter"><a href="<?php echo inkthemes_get_option('photomaker_twitter'); ?>" alt="Twitter" target="_blank" title="Twitter"></a></li> 
        <?php } ?> 
        <?php if (inkthemes_get_option('photomaker_youtube') != '') { ?>
            <li class="yt"><a href="<?php echo inkthemes_get_option('photomaker_youtube'); ?>" alt="Youtube" title="Youtube" target="_blank"></a></li>
        <?php } 
        if (inkthemes_get_option('photomaker_tumblr') != '') { ?>
            <li class="tumblr"><a href="<?php echo inkthemes_get_option('photomaker_tumblr'); ?>" alt="Tumblr" target="_blank" title="Tumblr"></a></li>
        <?php }
        if (inkthemes_get_option('photomaker_flickr') != '') { ?>
            <li class="flikr"><a href="<?php echo inkthemes_get_option('photomaker_flickr'); ?>" alt="Flickr" target="_blank" title="Flickr"></a></li> 
        <?php } ?> 
       
    </ul> 

        </div>
        <div class="copyrightinfo">
            <p class="copyright"><a href="<?php echo esc_url('http://wordpress.org/'); ?>" rel="generator"><?php _e('Powered by WordPress', 'photomaker');
                ?></a>
                <span class="sep">&nbsp;|&nbsp;</span>
                <?php
                printf(__('%1$s by %2$s.', 'photomaker'), 'Photomaker', '<a href="'.esc_url('https://www.inkthemes.com/market/wordpress-photography-theme/') .'" rel="nofollow">InkThemes</a>');
                ?></p>
        </div>	
    </div>
</section>
<div id="dynamic_sidebar_small" style="right: -220px;">
    <h2><a href="#"></a></h2>
    <?php if (current_user_can('manage_options')) { ?>
        <style>
            #dynamic_sidebar h2 a {
                position: absolute;
                left: -37px;
                top: 32px;
            }
        </style>
    <?php } ?>
    <div class="sidebar_container" id="content_2">
        <div class="menu_wrapper mobile">
            <?php inkthemes_nav(); ?>                       
        </div>
        <?php get_sidebar('home'); ?>	

        <div class="copyrightinfo">
            <p class="copyright"><a href="<?php echo esc_url('http://wordpress.org/'); ?>" rel="generator"><?php _e('Powered by WordPress', 'photomaker');
        ?></a>
                <span class="sep">&nbsp;|&nbsp;</span>
                <?php
                printf(__('%1$s by %2$s.', 'photomaker'), 'Photomaker', '<a href="'.esc_url('https://www.inkthemes.com/market/wordpress-photography-theme/') .'" rel="nofollow">InkThemes</a>');
                ?></p>
        </div>	
    </div>
</div>
<?php wp_footer(); ?>
</body>
</html>