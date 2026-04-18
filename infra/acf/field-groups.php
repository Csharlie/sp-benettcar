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

// ── CPT registrations ────────────────────────────────────────────
// Load CPT + ACF field groups for collection-based sections.
// These hook into 'init' (CPT) and 'acf/init' (field groups) internally.
require_once __DIR__ . '/cpt-service.php';

// ── Front-page field groups ──────────────────────────────────────
add_action( 'acf/init', function () {
	$sections_dir = __DIR__ . '/sections';

	$section_files = [
		'bc-hero.php',
		'bc-brand.php',
		'bc-gallery.php',
		'bc-services.php',
		'bc-service.php',
		'bc-about.php',
		'bc-team.php',
		'bc-assistance.php',
		'bc-contact.php',
		'bc-map.php',
	];

	foreach ( $section_files as $file ) {
		$path = $sections_dir . '/' . $file;
		if ( file_exists( $path ) ) {
			$config = require $path;
			if ( is_array( $config ) ) {
				acf_add_local_field_group( $config );
			}
		}
	}
} );
