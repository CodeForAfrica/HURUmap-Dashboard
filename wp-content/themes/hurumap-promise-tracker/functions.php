<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

// BEGIN ENQUEUE PARENT ACTION
// AUTO GENERATED - Do not modify or remove comment markers above or below:

if ( !function_exists( 'chld_thm_cfg_locale_css' ) ):
    function chld_thm_cfg_locale_css( $uri ){
        if ( empty( $uri ) && is_rtl() && file_exists( get_template_directory() . '/rtl.css' ) )
            $uri = get_template_directory_uri() . '/rtl.css';
        return $uri;
    }
endif;
add_filter( 'locale_stylesheet_uri', 'chld_thm_cfg_locale_css' );
         
if ( !function_exists( 'child_theme_configurator_css' ) ):
    function child_theme_configurator_css() {
        wp_enqueue_style( 'chld_thm_cfg_child', trailingslashit( get_stylesheet_directory_uri() ) . 'style.css', array(  ) );
    }
endif;
add_action( 'wp_enqueue_scripts', 'child_theme_configurator_css', 10 );

// END ENQUEUE PARENT ACTION

function custom_preview_page_link($link) {
	$id = get_the_ID();
	$nonce = wp_create_nonce( 'wp_rest' );
	$link = 'http://localhost/promisetracker/wp-json/acf/api/wp/v2/pages/'. $id. '/revisions/?_wpnonce='. $nonce;
	return $link;
}
add_filter('preview_post_link', 'custom_preview_page_link');

//add custom preview post

function custom_preview_post_link($link) {
	$id = get_the_ID();
	$nonce = wp_create_nonce( 'wp_rest' );
	$link = 'http://localhost/promisetracker/wp-json/acf/api/wp/v2/pages/'. $id. '/revisions/?_wpnonce='. $nonce;
	return $link;
}
add_filter('preview_post_link', 'custom_preview_page_link');
