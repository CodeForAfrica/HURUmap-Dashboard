<?php

if (!defined('ABSPATH')) exit; // Exit if accessed directly

if (!class_exists('HURUmapData')) :

    class HURUmapData
    {

        function initialize()
        {
            add_action('init', array($this, 'register_post_types'));

            // Add filters.
            // add_filter('posts_where', array($this, 'posts_where'));
        }

        function register_post_types()
        {
            register_post_type('hurumap-visual', array(
                'labels'            => array(
                    'name'                    => __('Visual', 'hurumap'),
                    'singular_name'            => __('Visual', 'hurumap'),
                    'add_new'                => __('Add New', 'hurumap'),
                    'add_new_item'            => __('Add New Visual', 'hurumap'),
                    'edit_item'                => __('Edit Visual', 'hurumap'),
                    'new_item'                => __('New Visual', 'hurumap'),
                    'view_item'                => __('View Visual', 'hurumap'),
                    'search_items'            => __('Search Visuals', 'hurumap'),
                    'not_found'                => __('No Visuals found', 'hurumap'),
                    'not_found_in_trash'    => __('No Visuals found in Trash', 'hurumap'),
                ),
                'public'            => true,
                'hierarchical'        => true,
                'show_ui'            => true,
                'show_in_menu'        => false,
                '_builtin'            => false,
                'capability_type'    => 'post',
                'supports'             => array('title'),
                'rewrite'            => false,
                'query_var'            => false,
            ));

            register_post_type('hurumap-section', array(
                'labels'            => array(
                    'name'                    => __('Visuals Section', 'hurumap'),
                    'singular_name'            => __('Visuals Section', 'hurumap'),
                    'add_new'                => __('Add New', 'hurumap'),
                    'add_new_item'            => __('Add New Visuals Section', 'hurumap'),
                    'edit_item'                => __('Edit Visuals Section', 'hurumap'),
                    'new_item'                => __('New VisualsSection', 'hurumap'),
                    'view_item'                => __('View Visuals Section', 'hurumap'),
                    'search_items'            => __('Search Visual Sections', 'hurumap'),
                    'not_found'                => __('No Visual Sections found', 'hurumap'),
                    'not_found_in_trash'    => __('No Visual Sections found in Trash', 'hurumap'),
                ),
                'public'            => false,
                'hierarchical'        => true,
                'show_ui'            => true,
                'show_in_menu'        => false,
                '_builtin'            => false,
                'capability_type'    => 'post',
                'supports'             => array('title'),
                'rewrite'            => false,
                'query_var'            => false,
            ));
        }

    }

    function hurumap_data() {
        global $hurumap_data;

        if (!isset($hurumap_data)) {
            $hurumap_data = new HURUmapData;
            $hurumap_data->initialize();
        }
        return $hurumap_data;
    }

    hurumap_data();

endif;
