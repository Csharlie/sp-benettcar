<?php
/**
 * Migration: Repeater → ACF Free fields for bc-about + bc-service.
 *
 * Migrates 4 repeater fields to their ACF Free equivalents:
 * - bc_about_content  → bc_about_content_text (textarea, newline-joined)
 * - bc_about_stats    → bc_about_stat_{n}_value / bc_about_stat_{n}_label (slot pairs)
 * - bc_service_services → bc_service_services_text (textarea, newline-joined)
 * - bc_service_brands   → bc_service_brands_text (textarea, newline-joined)
 *
 * Safe to run multiple times — overwrites target fields idempotently.
 * Does NOT delete repeater data from the database.
 *
 * Usage:
 *   wp eval-file migrate-about-service-to-free.php
 *   wp eval-file migrate-about-service-to-free.php -- verbose
 *
 * Phase: P13.2
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

$verbose    = in_array( '--verbose', $args ?? [], true ) || in_array( 'verbose', $args ?? [], true );
$max_stats  = 6;

// ── Resolve front page ───────────────────────────────────────────

$front_page_id = (int) get_option( 'page_on_front' );
if ( $front_page_id <= 0 ) {
	WP_CLI::error( 'No static front page configured (Settings → Reading).' );
}

WP_CLI::log( "Front page ID: {$front_page_id}" );
WP_CLI::log( '' );

$total_migrated = 0;
$total_skipped  = 0;

// ── 1. bc_about_content → bc_about_content_text ──────────────────

WP_CLI::log( '=== bc_about_content → bc_about_content_text ===' );

$content_repeater = get_field( 'bc_about_content', $front_page_id );

if ( ! empty( $content_repeater ) && is_array( $content_repeater ) ) {
	$paragraphs = [];
	foreach ( $content_repeater as $row ) {
		$p = trim( $row['paragraph'] ?? '' );
		if ( $p !== '' ) {
			$paragraphs[] = $p;
		}
	}

	$text = implode( "\n", $paragraphs );
	update_field( 'bc_about_content_text', $text, $front_page_id );

	WP_CLI::log( "Source: repeater ({$front_page_id})" );
	WP_CLI::log( "Paragraphs found: " . count( $paragraphs ) );

	if ( $verbose ) {
		foreach ( $paragraphs as $i => $p ) {
			WP_CLI::log( "  [" . ( $i + 1 ) . "] " . mb_substr( $p, 0, 60 ) . '...' );
		}
	}

	$total_migrated++;
} else {
	WP_CLI::warning( 'No repeater data found for bc_about_content — skipped.' );
	$total_skipped++;
}

WP_CLI::log( '' );

// ── 2. bc_about_stats → bc_about_stat_{n}_value/label ────────────

WP_CLI::log( '=== bc_about_stats → stat slot fields ===' );

$stats_repeater = get_field( 'bc_about_stats', $front_page_id );

if ( ! empty( $stats_repeater ) && is_array( $stats_repeater ) ) {
	$stats_count = count( $stats_repeater );

	if ( $stats_count > $max_stats ) {
		WP_CLI::warning( "Found {$stats_count} stats but max slots is {$max_stats}. Only first {$max_stats} will be migrated." );
	}

	$written = 0;
	foreach ( $stats_repeater as $index => $row ) {
		$slot = $index + 1;
		if ( $slot > $max_stats ) {
			break;
		}

		$value = trim( $row['value'] ?? '' );
		$label = trim( $row['label'] ?? '' );

		if ( $value === '' || $label === '' ) {
			WP_CLI::warning( "[SKIP] Stat {$slot} — incomplete (value=\"{$value}\", label=\"{$label}\")." );
			continue;
		}

		update_field( 'bc_about_stat_' . $slot . '_value', $value, $front_page_id );
		update_field( 'bc_about_stat_' . $slot . '_label', $label, $front_page_id );
		$written++;

		if ( $verbose ) {
			WP_CLI::log( "  [OK] Slot {$slot}: value=\"{$value}\" label=\"" . mb_substr( $label, 0, 40 ) . '"' );
		}
	}

	// Clear unused slots.
	$cleared = 0;
	for ( $i = $written + 1; $i <= $max_stats; $i++ ) {
		update_field( 'bc_about_stat_' . $i . '_value', '', $front_page_id );
		update_field( 'bc_about_stat_' . $i . '_label', '', $front_page_id );
		$cleared++;
	}

	WP_CLI::log( "Source: repeater ({$front_page_id})" );
	WP_CLI::log( "Stats found: {$stats_count}, slots written: {$written}, slots cleared: {$cleared}" );
	$total_migrated++;
} else {
	WP_CLI::warning( 'No repeater data found for bc_about_stats — skipped.' );
	$total_skipped++;
}

WP_CLI::log( '' );

// ── 3. bc_service_services → bc_service_services_text ────────────

WP_CLI::log( '=== bc_service_services → bc_service_services_text ===' );

$services_repeater = get_field( 'bc_service_services', $front_page_id );

if ( ! empty( $services_repeater ) && is_array( $services_repeater ) ) {
	$labels = [];
	foreach ( $services_repeater as $row ) {
		$l = trim( $row['label'] ?? '' );
		if ( $l !== '' ) {
			$labels[] = $l;
		}
	}

	$text = implode( "\n", $labels );
	update_field( 'bc_service_services_text', $text, $front_page_id );

	WP_CLI::log( "Source: repeater ({$front_page_id})" );
	WP_CLI::log( "Service items found: " . count( $labels ) );

	if ( $verbose ) {
		foreach ( $labels as $i => $l ) {
			WP_CLI::log( "  [" . ( $i + 1 ) . "] {$l}" );
		}
	}

	$total_migrated++;
} else {
	WP_CLI::warning( 'No repeater data found for bc_service_services — skipped.' );
	$total_skipped++;
}

WP_CLI::log( '' );

// ── 4. bc_service_brands → bc_service_brands_text ────────────────

WP_CLI::log( '=== bc_service_brands → bc_service_brands_text ===' );

$brands_repeater = get_field( 'bc_service_brands', $front_page_id );

if ( ! empty( $brands_repeater ) && is_array( $brands_repeater ) ) {
	$names = [];
	foreach ( $brands_repeater as $row ) {
		$n = trim( $row['name'] ?? '' );
		if ( $n !== '' ) {
			$names[] = $n;
		}
	}

	$text = implode( "\n", $names );
	update_field( 'bc_service_brands_text', $text, $front_page_id );

	WP_CLI::log( "Source: repeater ({$front_page_id})" );
	WP_CLI::log( "Brand names found: " . count( $names ) );

	if ( $verbose ) {
		foreach ( $names as $i => $n ) {
			WP_CLI::log( "  [" . ( $i + 1 ) . "] {$n}" );
		}
	}

	$total_migrated++;
} else {
	WP_CLI::warning( 'No repeater data found for bc_service_brands — skipped.' );
	$total_skipped++;
}

// ── Summary ──────────────────────────────────────────────────────

WP_CLI::log( '' );
WP_CLI::log( "Fields migrated: {$total_migrated}" );
WP_CLI::log( "Fields skipped:  {$total_skipped}" );
WP_CLI::success( 'Migration complete.' );
