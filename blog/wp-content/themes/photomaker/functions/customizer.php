<?php
class Photomaker_Customizer {
    public static function Photomaker_Register($wp_customize) {
        self::Photomaker_Sections($wp_customize);
        self::Photomaker_Controls($wp_customize);
    }
    public static function Photomaker_Sections($wp_customize) {
        /**
         * Style Section
         */
        $wp_customize->add_section('style_section', array(
            'title' => __('General Settings', 'photomaker'),
            'description' => __('Allows you to setup General Settings Section Text for Photomaker Theme.', 'photomaker'),
            'panel' => '',
            'priority' => '12',
            'capability' => 'edit_theme_options'
        )
    );
        /**
         * Social Icons
         */

        $wp_customize->add_section('social_icon_settings', array(
            'title' => __('Social Icons', 'photomaker'),
            'description' => __('Allows you to setup social site link for Photomaker Theme.', 'photomaker'),
            'panel' => '',
            'priority' => '14',
            'capability' => 'edit_theme_options'
        )
        );
         $wp_customize->remove_section("colors");
    }
    public static function Photomaker_Section_Content() {
        $section_content = array(
             'style_section' => array(
             'inkthemes_customcss'
             ),
             'social_icon_settings' => array(
                'photomaker_facebook',
                'photomaker_twitter',
                'photomaker_yahoo',
                'photomaker_rss',
                'photomaker_digg',
                'photomaker_pinterest',
                'photomaker_linkedin',
                'photomaker_instagram',
                'photomaker_google',
               'photomaker_youtube',
               'photomaker_tumblr',
               'photomaker_flickr'
            )

        );
        return $section_content;
    }
    public static function Photomaker_Settings() {
        $harrington_settings = array( 
            'inkthemes_customcss' => array(
                'id' => 'inkthemes_options[inkthemes_customcss]',
                'label' => __('Custom CSS', 'photomaker'),
                'description' => __('Quickly add your custom CSS code to your theme by writing the code in this block.', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'textarea',
                'default' => ''
            ),
            'photomaker_facebook' => array(
                'id' => 'inkthemes_options[photomaker_facebook]',
                'label' => __('Facebook URL', 'photomaker'),
                'description' => __('Enter your Facebook URL if you have one.', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_twitter' => array(
                'id' => 'inkthemes_options[photomaker_twitter]',
                'label' => __('Twitter URL', 'photomaker'),
                'description' => __('Enter your Twitter URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_yahoo' => array(
                'id' => 'inkthemes_options[photomaker_yahoo]',
                'label' => __('Yahoo URL', 'photomaker'),
                'description' => __('Enter your Yahoo Feed URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_rss' => array(
                'id' => 'inkthemes_options[photomaker_rss]',
                'label' => __('Rss URL', 'photomaker'),
                'description' => __('Enter your Rss URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_digg' => array(
                'id' => 'inkthemes_options[photomaker_digg]',
                'label' => __('Digg URL', 'photomaker'),
                'description' => __('Enter your Digg URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_pinterest' => array(
                'id' => 'inkthemes_options[photomaker_pinterest]',
                'label' => __('Pinterest URL', 'photomaker'),
                'description' => __('Enter your Pinterest URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_linkedin' => array(
                'id' => 'inkthemes_options[photomaker_linkedin]',
                'label' => __('Linkedin URL', 'photomaker'),
                'description' => __('Enter your Linkedin URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_google' => array(
                'id' => 'inkthemes_options[photomaker_google]',
                'label' => __('Google URL', 'photomaker'),
                'description' => __('Enter your Google URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_instagram' => array(
                'id' => 'inkthemes_options[photomaker_instagram]',
                'label' => __('Instagram URL', 'photomaker'),
                'description' => __('Enter your Instagram URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_youtube' => array(
                'id' => 'inkthemes_options[photomaker_youtube]',
                'label' => __('Youtube URL', 'photomaker'),
                'description' => __('Enter your Youtube URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_tumblr' => array(
                'id' => 'inkthemes_options[photomaker_tumblr]',
                'label' => __('Tumblr URL', 'photomaker'),
                'description' => __('Enter your Tumblr URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            ),
            'photomaker_flickr' => array(
                'id' => 'inkthemes_options[photomaker_flickr]',
                'label' => __('Flickr URL', 'photomaker'),
                'description' => __('Enter your Flickr URL if you have one', 'photomaker'),
                'type' => 'option',
                'setting_type' => 'link',
                'default' => '#'
            )
            
         );
        return $harrington_settings;
    }
    public static function Photomaker_Controls($wp_customize) {
        $sections = self::Photomaker_Section_Content();
        $settings = self::Photomaker_Settings();
        foreach ($sections as $section_id => $section_content) {
            foreach ($section_content as $section_content_id) {
                switch ($settings[$section_content_id]['setting_type']) {
                    case 'image':
                        self::add_setting($wp_customize, $settings[$section_content_id]['id'], $settings[$section_content_id]['default'], $settings[$section_content_id]['type'], 'harrington_sanitize_url');
                        $wp_customize->add_control(new WP_Customize_Image_Control(
                                $wp_customize, $settings[$section_content_id]['id'], array(
                            'label' => $settings[$section_content_id]['label'],
                            'description' => $settings[$section_content_id]['description'],
                            'section' => $section_id,
                            'settings' => $settings[$section_content_id]['id']
                                )
                        ));
                        break;
                    case 'text':
                        self::add_setting($wp_customize, $settings[$section_content_id]['id'], $settings[$section_content_id]['default'], $settings[$section_content_id]['type'], 'harrington_sanitize_text');
                        $wp_customize->add_control(new WP_Customize_Control(
                                $wp_customize, $settings[$section_content_id]['id'], array(
                            'label' => $settings[$section_content_id]['label'],
                            'description' => $settings[$section_content_id]['description'],
                            'section' => $section_id,
                            'settings' => $settings[$section_content_id]['id'],
                            'type' => 'text'
                                )
                        ));
                        break;
                    case 'textarea':
                        self::add_setting($wp_customize, $settings[$section_content_id]['id'], $settings[$section_content_id]['default'], $settings[$section_content_id]['type'], 'harrington_sanitize_textarea');

                        $wp_customize->add_control(new WP_Customize_Control(
                                $wp_customize, $settings[$section_content_id]['id'], array(
                            'label' => $settings[$section_content_id]['label'],
                            'description' => $settings[$section_content_id]['description'],
                            'section' => $section_id,
                            'settings' => $settings[$section_content_id]['id'],
                            'type' => 'textarea'
                                )
                        ));
                        break;
                    case 'link':

                        self::add_setting($wp_customize, $settings[$section_content_id]['id'], $settings[$section_content_id]['default'], $settings[$section_content_id]['type'], 'harrington_sanitize_url');

                        $wp_customize->add_control(new WP_Customize_Control(
                                $wp_customize, $settings[$section_content_id]['id'], array(
                            'label' => $settings[$section_content_id]['label'],
                            'description' => $settings[$section_content_id]['description'],
                            'section' => $section_id,
                            'settings' => $settings[$section_content_id]['id'],
                            'type' => 'text'
                                )
                        ));

                        break;
                    default:
                        break;
                }
            }
        }
    }
  public static function add_setting($wp_customize, $setting_id, $default, $type, $sanitize_callback) {
        $wp_customize->add_setting($setting_id, array(
            'default' => $default,
            'capability' => 'edit_theme_options',
            'sanitize_callback' => array('Photomaker_Customizer', $sanitize_callback),
            'type' => $type
                )
        );
    }
    /**
     * adds sanitization callback funtion : textarea
     * @package Photomaker
     */
    public static function harrington_sanitize_textarea($value) {
        $value = esc_html($value);
        return $value;
    }
    /**
     * adds sanitization callback funtion : url
     * @package Photomaker
     */
    public static function harrington_sanitize_url($value) {
        $value = esc_url($value);
        return $value;
    }
    /**
     * adds sanitization callback funtion : text
     * @package Photomaker
     */
    public static function harrington_sanitize_text($value) {
        $value = sanitize_text_field($value);
        return $value;
    }
    /**
     * adds sanitization callback funtion : email
     * @package Photomaker
     */
    public static function harrington_sanitize_email($value) {
        $value = sanitize_email($value);
        return $value;
    }
    /**
     * adds sanitization callback funtion : number
     * @package Photomaker
     */
    public static function harrington_sanitize_number($value) {
        $value = preg_replace("/[^0-9+ ]/", "", $value);
        return $value;
    }
}
// Setup the Theme Customizer settings and controls...
add_action('customize_register', array('Photomaker_Customizer', 'Photomaker_Register'));
function inkthemes_registers() {
          wp_register_script( 'inkthemes_jquery_ui', '//code.jquery.com/ui/1.11.0/jquery-ui.js', array("jquery"), true  );
	wp_register_script( 'inkthemes_customizer_script', get_template_directory_uri() . '/js/inkthemes_customizer.js', array("jquery","inkthemes_jquery_ui"), true  );
	wp_enqueue_script( 'inkthemes_customizer_script' );
	wp_localize_script( 'inkthemes_customizer_script', 'ink_advert', array(
            'pro' => __('View PRO version', 'photomaker'),
            'url' => esc_url('https://www.inkthemes.com/market/wordpress-photography-theme/'),
            'support_text' => __('Need Help!','photomaker'),
		    'support_url' => esc_url('https://www.inkthemes.com/contact-us/')
            )
            );
}
add_action( 'customize_controls_enqueue_scripts', 'inkthemes_registers' );
