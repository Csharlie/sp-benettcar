<?php
/**
 * Benettcar ACF field group registry.
 *
 * Loads all bc-* section field group definitions and registers them.
 * Each file in sections/ returns an acf_add_local_field_group() config array.
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// ── Front-page field groups ──────────────────────────────────────

/**
 * All bc-* ACF field group keys — used for registration and admin UX.
 */
define( 'SPEKTRA_BC_FIELD_GROUPS', [
	'bc-hero.php'       => 'group_bc_hero',
	'bc-brand.php'      => 'group_bc_brand',
	'bc-gallery.php'    => 'group_bc_gallery',
	'bc-services.php'   => 'group_bc_services',
	'bc-service.php'    => 'group_bc_service',
	'bc-about.php'      => 'group_bc_about',
	'bc-team.php'       => 'group_bc_team',
	'bc-assistance.php' => 'group_bc_assistance',
	'bc-contact.php'    => 'group_bc_contact',
	'bc-map.php'        => 'group_bc_map',
] );

add_action( 'acf/init', function () {
	$sections_dir = __DIR__ . '/sections';

	foreach ( SPEKTRA_BC_FIELD_GROUPS as $file => $group_key ) {
		$path = $sections_dir . '/' . $file;
		if ( file_exists( $path ) ) {
			$config = require $path;
			if ( is_array( $config ) ) {
				acf_add_local_field_group( $config );
			}
		}
	}
} );

// ── Collapsed-by-default for front page ──────────────────────────
// On first visit to the front-page editor, all bc-* metaboxes start
// collapsed. User can expand any group and WP remembers the choice.
// P13.5e: reduces scroll for non-technical admin users.
add_filter( 'get_user_option_closedpostboxes_page', function ( $closed ) {
	// Only act when no preference has been saved yet (first visit).
	if ( $closed !== false ) {
		return $closed;
	}

	// ACF metabox IDs = 'acf-' + group key.
	$defaults = array_map(
		static fn( string $key ): string => 'acf-' . $key,
		array_values( SPEKTRA_BC_FIELD_GROUPS )
	);

	return $defaults;
} );

// ── Front-page ACF UX helpers ───────────────────────────────────
// Adds compact previews (thumbnail/text) to slot accordions so editors
// can identify entries faster without opening each block.
add_action( 'admin_enqueue_scripts', function ( string $hook ): void {
	if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ], true ) ) {
		return;
	}

	if ( ! function_exists( 'get_current_screen' ) ) {
		return;
	}

	$screen = get_current_screen();
	if ( ! $screen || $screen->base !== 'post' || $screen->post_type !== 'page' ) {
		return;
	}

	$front_page_id = (int) get_option( 'page_on_front' );
	if ( $front_page_id <= 0 ) {
		return;
	}

	$post_id = 0;
	if ( isset( $_GET['post'] ) ) {
		$post_id = (int) $_GET['post'];
	} elseif ( isset( $_POST['post_ID'] ) ) {
		$post_id = (int) $_POST['post_ID'];
	}

	if ( $post_id > 0 && $post_id !== $front_page_id ) {
		return;
	}

	$asset_dir     = __DIR__ . '/admin';
	$script_path   = $asset_dir . '/accordion-preview.js';
	$style_path    = $asset_dir . '/accordion-preview.css';
	$content_dir   = wp_normalize_path( WP_CONTENT_DIR );
	$script_normal = wp_normalize_path( $script_path );
	$style_normal  = wp_normalize_path( $style_path );

	if ( ! file_exists( $script_path ) || ! str_starts_with( $script_normal, $content_dir ) ) {
		return;
	}

	if ( ! file_exists( $style_path ) || ! str_starts_with( $style_normal, $content_dir ) ) {
		return;
	}

	$script_url = content_url( str_replace( $content_dir, '', $script_normal ) );
	$style_url  = content_url( str_replace( $content_dir, '', $style_normal ) );

	wp_enqueue_style(
		'spektra-bc-acf-accordion-preview',
		$style_url,
		[],
		(string) filemtime( $style_path )
	);

	wp_enqueue_script(
		'spektra-bc-acf-accordion-preview',
		$script_url,
		[ 'jquery', 'acf-input' ],
		(string) filemtime( $script_path ),
		true
	);
} );
