<?php
/**
 * Migration: bc_services_services Repeater → sp_bc_service CPT posts.
 *
 * Copies existing ACF Repeater rows from the front page into individual
 * sp_bc_service CPT posts. Safe to run multiple times — cleans up previous
 * migration-owned posts before re-creating.
 *
 * Usage:
 *   wp eval-file migrate-services-to-cpt.php
 *   wp eval-file migrate-services-to-cpt.php -- verbose
 *
 * Phase: P12.3b / P12.6
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

$verbose = in_array( '--verbose', $args ?? [], true ) || in_array( 'verbose', $args ?? [], true );

// ── Resolve front page ───────────────────────────────────────────

$front_page_id = (int) get_option( 'page_on_front' );
if ( $front_page_id <= 0 ) {
	WP_CLI::error( 'No static front page configured (Settings → Reading).' );
}

WP_CLI::log( "Front page ID: {$front_page_id}" );

// ── Read current repeater data ───────────────────────────────────

$services = get_field( 'bc_services_services', $front_page_id );

if ( empty( $services ) || ! is_array( $services ) ) {
	WP_CLI::error( 'No repeater rows found for bc_services_services on the front page.' );
}

$row_count = count( $services );
WP_CLI::log( "Found {$row_count} repeater rows to migrate." );

// ── Clean up previous migration-owned posts ──────────────────────
// Uses a stable meta key to identify posts created by this migration.

$existing = get_posts( [
	'post_type'      => 'sp_bc_service',
	'posts_per_page' => -1,
	'post_status'    => 'any',
	'meta_key'       => '_sp_migrated_from',
	'meta_value'     => 'bc_services_services',
	'fields'         => 'ids',
] );

if ( ! empty( $existing ) ) {
	WP_CLI::log( 'Deleting ' . count( $existing ) . ' previously migrated posts...' );
	foreach ( $existing as $post_id ) {
		wp_delete_post( $post_id, true );
	}
}

// ── Create CPT posts ─────────────────────────────────────────────

$created = 0;
$errors  = 0;

foreach ( $services as $index => $row ) {
	$title       = trim( $row['title'] ?? '' );
	$icon        = trim( $row['icon'] ?? '' );
	$description = trim( $row['description'] ?? '' );

	if ( $title === '' ) {
		WP_CLI::warning( "[SKIP] Row {$index} — empty title." );
		$errors++;
		continue;
	}

	$post_id = wp_insert_post( [
		'post_type'   => 'sp_bc_service',
		'post_title'  => $title,
		'post_status' => 'publish',
		'menu_order'  => $index,
	], true );

	if ( is_wp_error( $post_id ) ) {
		WP_CLI::warning( "[FAIL] Row {$index} ({$title}) — " . $post_id->get_error_message() );
		$errors++;
		continue;
	}

	update_field( 'bc_service_icon', $icon, $post_id );
	update_field( 'bc_service_description', $description, $post_id );

	// Migration provenance marker — enables safe re-run.
	update_post_meta( $post_id, '_sp_migrated_from', 'bc_services_services' );
	update_post_meta( $post_id, '_sp_migrated_row_index', $index );

	if ( $verbose ) {
		WP_CLI::log( "[OK] #{$post_id} menu_order={$index} title=\"{$title}\" icon=\"{$icon}\"" );
	}

	$created++;
}

// ── Summary ──────────────────────────────────────────────────────

WP_CLI::log( '' );
if ( $errors === 0 ) {
	WP_CLI::success( "Migration complete: {$created} CPT posts created from {$row_count} repeater rows." );
} else {
	WP_CLI::warning( "Migration finished with errors: {$created} created, {$errors} failed/skipped out of {$row_count} rows." );
}

// ── Verification ─────────────────────────────────────────────────

$verify = get_posts( [
	'post_type'      => 'sp_bc_service',
	'posts_per_page' => -1,
	'orderby'        => [ 'menu_order' => 'ASC', 'ID' => 'ASC' ],
	'post_status'    => 'publish',
] );

WP_CLI::log( '' );
WP_CLI::log( '── Verification ──' );
WP_CLI::log( 'CPT posts in database: ' . count( $verify ) );
foreach ( $verify as $vp ) {
	$icon = get_field( 'bc_service_icon', $vp->ID );
	$desc = get_field( 'bc_service_description', $vp->ID );
	WP_CLI::log( sprintf(
		'  #%d [order=%d] "%s" icon="%s" desc="%s"',
		$vp->ID,
		$vp->menu_order,
		$vp->post_title,
		$icon,
		mb_substr( $desc, 0, 50 ) . ( mb_strlen( $desc ) > 50 ? '...' : '' )
	) );
}
