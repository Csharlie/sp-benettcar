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
