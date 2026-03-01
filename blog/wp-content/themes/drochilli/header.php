<?php
/**
 * @package WordPress
 * @subpackage Drochilli_Theme
 */



?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" <?php language_attributes(); ?>>

<head>

	<meta charset="<?php bloginfo( 'charset' ); ?>" />

	<title><?php wp_title( '|', true, 'right' ); ?></title>

	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

	<?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>


<div id="wrapper">

	<div id="header">

		<div class="headerwrap">

			<div id="logo">
				<?php if(is_home() && !is_paged()) { ?>
				<h1><?php bloginfo('name'); ?></h1>
				<?php } else { ?>
				<h2><a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php bloginfo('description'); ?>"><?php bloginfo('name'); ?></a></h2>
				<?php } ?>
			</div>

			<div id="search">
				<?php get_search_form(); ?>
			</div>

			<div id="description">
				<h3><?php bloginfo('description'); ?></h3>
			</div>

		</div>

	</div>

	<div id="page">

		<div class="columns">