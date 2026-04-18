<?php
/**
 * Migration: CPT/Repeater → Slot-based ACF Free fields.
 *
 * Populates bc_services_service_{n}_{title|icon|description} slot fields
 * on the front page from the best available source.
 *
 * Source priority:
 * 1. sp_bc_service CPT posts (if present)
 * 2. bc_services_services repeater (if CPT is empty)
 *
 * Safe to run multiple times — overwrites slot values idempotently.
 * Does NOT delete CPT posts or repeater data.
 *
 * Usage:
 *   wp eval-file migrate-services-to-slots.php
 *   wp eval-file migrate-services-to-slots.php -- verbose
 *
 * Phase: P13.1
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

$verbose   = in_array( '--verbose', $args ?? [], true ) || in_array( 'verbose', $args ?? [], true );
$max_slots = 6;
$prefix    = 'bc_services_';

// ── Resolve front page ───────────────────────────────────────────

$front_page_id = (int) get_option( 'page_on_front' );
if ( $front_page_id <= 0 ) {
	WP_CLI::error( 'No static front page configured (Settings → Reading).' );
}

WP_CLI::log( "Front page ID: {$front_page_id}" );

// ── Resolve source ───────────────────────────────────────────────

$source_name = '';
$items       = [];

// 1. Try CPT posts.
$posts = get_posts( [
	'post_type'      => 'sp_bc_service',
	'posts_per_page' => -1,
	'orderby'        => [ 'menu_order' => 'ASC', 'ID' => 'ASC' ],
	'post_status'    => 'publish',
] );

if ( ! empty( $posts ) ) {
	$source_name = 'sp_bc_service CPT';
	foreach ( $posts as $post ) {
		$title       = trim( $post->post_title );
		$icon        = trim( (string) get_field( 'bc_service_icon', $post->ID ) );
		$description = trim( (string) get_field( 'bc_service_description', $post->ID ) );

		if ( $title === '' || $icon === '' || $description === '' ) {
			WP_CLI::warning( "[SKIP] CPT #{$post->ID} — incomplete (title=\"{$title}\", icon=\"{$icon}\")." );
			continue;
		}

		$items[] = [
			'title'       => $title,
			'icon'        => $icon,
			'description' => $description,
		];
	}
}

// 2. Fallback: repeater.
if ( empty( $items ) ) {
	$repeater = get_field( $prefix . 'services', $front_page_id );
	if ( ! empty( $repeater ) && is_array( $repeater ) ) {
		$source_name = 'bc_services_services repeater';
		foreach ( $repeater as $row ) {
			$title       = trim( $row['title'] ?? '' );
			$icon        = trim( $row['icon'] ?? '' );
			$description = trim( $row['description'] ?? '' );

			if ( $title === '' || $icon === '' || $description === '' ) {
				WP_CLI::warning( '[SKIP] Repeater row — incomplete.' );
				continue;
			}

			$items[] = [
				'title'       => $title,
				'icon'        => $icon,
				'description' => $description,
			];
		}
	}
}

if ( empty( $items ) ) {
	WP_CLI::error( 'No valid service items found in CPT or repeater.' );
}

$found_count   = count( $items );
$skipped_count = 0;

if ( $found_count > $max_slots ) {
	WP_CLI::warning( "Found {$found_count} items but max slots is {$max_slots}. Only first {$max_slots} will be migrated." );
	$skipped_count = $found_count - $max_slots;
	$items         = array_slice( $items, 0, $max_slots );
}

WP_CLI::log( "Source: {$source_name}" );
WP_CLI::log( "Items found: {$found_count}" );

// ── Write slot fields ────────────────────────────────────────────

$written = 0;

foreach ( $items as $index => $item ) {
	$slot = $index + 1;

	update_field( $prefix . 'service_' . $slot . '_title', $item['title'], $front_page_id );
	update_field( $prefix . 'service_' . $slot . '_icon', $item['icon'], $front_page_id );
	update_field( $prefix . 'service_' . $slot . '_description', $item['description'], $front_page_id );

	if ( $verbose ) {
		WP_CLI::log( "[OK] Slot {$slot}: title=\"{$item['title']}\" icon=\"{$item['icon']}\"" );
	}

	$written++;
}

// ── Clear unused slots ───────────────────────────────────────────

$cleared = 0;

for ( $i = $written + 1; $i <= $max_slots; $i++ ) {
	update_field( $prefix . 'service_' . $i . '_title', '', $front_page_id );
	update_field( $prefix . 'service_' . $i . '_icon', '', $front_page_id );
	update_field( $prefix . 'service_' . $i . '_description', '', $front_page_id );
	$cleared++;

	if ( $verbose ) {
		WP_CLI::log( "[CLEAR] Slot {$i}: emptied." );
	}
}

// ── Summary ──────────────────────────────────────────────────────

WP_CLI::log( '' );
WP_CLI::log( "Source used:    {$source_name}" );
WP_CLI::log( "Items found:    {$found_count}" );
WP_CLI::log( "Slots written:  {$written}" );
WP_CLI::log( "Slots cleared:  {$cleared}" );
if ( $skipped_count > 0 ) {
	WP_CLI::log( "Items skipped:  {$skipped_count} (exceeded max {$max_slots} slots)" );
}
WP_CLI::success( "Slot migration complete." );
