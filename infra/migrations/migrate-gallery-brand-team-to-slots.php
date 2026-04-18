<?php
/**
 * Migration: Repeater → Slot-based ACF Free fields for bc-gallery, bc-brand, bc-team.
 *
 * Migrates 3 repeater fields to their slot-based equivalents:
 * - bc_gallery_images  → bc_gallery_image_{n}_src/alt/category/caption (max 10)
 * - bc_brand_brands    → bc_brand_brand_{n}_name/logo/alt/invert (max 10)
 * - bc_team_members    → bc_team_member_{n}_name/role/image/image_alt/phone/email (max 8)
 *
 * Image fields: stores attachment IDs (compatible with ACF image field return).
 *
 * Safe to run multiple times — overwrites target fields idempotently.
 * Does NOT delete repeater data from the database.
 *
 * Usage:
 *   wp eval-file migrate-gallery-brand-team-to-slots.php
 *   wp eval-file migrate-gallery-brand-team-to-slots.php -- verbose
 *
 * Phase: P13.3
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
WP_CLI::log( '' );

$total_migrated = 0;
$total_skipped  = 0;

/**
 * Resolve an ACF image field value to an attachment ID.
 *
 * Handles: array with 'id'/'ID' key, numeric attachment ID, or URL → attachment lookup.
 *
 * @param mixed $value ACF image field value.
 * @return int Attachment ID or 0.
 */
function spektra_migration_resolve_image_id( $value ): int {
	if ( empty( $value ) ) {
		return 0;
	}

	// ACF array format (return_format=array).
	if ( is_array( $value ) ) {
		return (int) ( $value['id'] ?? $value['ID'] ?? 0 );
	}

	// Numeric attachment ID.
	if ( is_numeric( $value ) ) {
		return (int) $value;
	}

	// URL → attachment ID lookup.
	if ( is_string( $value ) && str_starts_with( $value, 'http' ) ) {
		return (int) attachment_url_to_postid( $value );
	}

	return 0;
}

// ── 1. bc_gallery_images → bc_gallery_image_{n}_* ────────────────

WP_CLI::log( '=== bc_gallery_images → gallery image slots ===' );

$gallery_repeater = get_field( 'bc_gallery_images', $front_page_id );
$max_gallery      = 10;

if ( ! empty( $gallery_repeater ) && is_array( $gallery_repeater ) ) {
	$count = min( count( $gallery_repeater ), $max_gallery );

	for ( $i = 0; $i < $count; $i++ ) {
		$row  = $gallery_repeater[ $i ];
		$slot = $i + 1;

		// Image → attachment ID.
		$img_id = spektra_migration_resolve_image_id( $row['src'] ?? null );
		update_field( 'bc_gallery_image_' . $slot . '_src', $img_id, $front_page_id );
		update_field( 'bc_gallery_image_' . $slot . '_alt', $row['alt'] ?? '', $front_page_id );
		update_field( 'bc_gallery_image_' . $slot . '_category', $row['category'] ?? '', $front_page_id );
		update_field( 'bc_gallery_image_' . $slot . '_caption', $row['caption'] ?? '', $front_page_id );

		$total_migrated++;
		if ( $verbose ) {
			WP_CLI::log( "  Slot {$slot}: src=ID:{$img_id}, alt=\"" . ( $row['alt'] ?? '' ) . '"' );
		}
	}

	WP_CLI::success( "Migrated {$count} gallery images to slots." );

	if ( count( $gallery_repeater ) > $max_gallery ) {
		$overflow = count( $gallery_repeater ) - $max_gallery;
		WP_CLI::warning( "Truncated: {$overflow} image(s) exceeded max {$max_gallery} slots." );
	}
} else {
	WP_CLI::log( '  No gallery repeater data found — skipping.' );
	$total_skipped++;
}

WP_CLI::log( '' );

// ── 2. bc_brand_brands → bc_brand_brand_{n}_* ────────────────────

WP_CLI::log( '=== bc_brand_brands → brand slots ===' );

$brand_repeater = get_field( 'bc_brand_brands', $front_page_id );
$max_brand      = 10;

if ( ! empty( $brand_repeater ) && is_array( $brand_repeater ) ) {
	$count = min( count( $brand_repeater ), $max_brand );

	for ( $i = 0; $i < $count; $i++ ) {
		$row  = $brand_repeater[ $i ];
		$slot = $i + 1;

		$img_id = spektra_migration_resolve_image_id( $row['logo'] ?? null );
		update_field( 'bc_brand_brand_' . $slot . '_name', $row['name'] ?? '', $front_page_id );
		update_field( 'bc_brand_brand_' . $slot . '_logo', $img_id, $front_page_id );
		update_field( 'bc_brand_brand_' . $slot . '_alt', $row['alt'] ?? '', $front_page_id );
		update_field( 'bc_brand_brand_' . $slot . '_invert', ( $row['invert'] ?? false ) ? 1 : 0, $front_page_id );

		$total_migrated++;
		if ( $verbose ) {
			WP_CLI::log( "  Slot {$slot}: name=\"" . ( $row['name'] ?? '' ) . "\", logo=ID:{$img_id}" );
		}
	}

	WP_CLI::success( "Migrated {$count} brands to slots." );

	if ( count( $brand_repeater ) > $max_brand ) {
		$overflow = count( $brand_repeater ) - $max_brand;
		WP_CLI::warning( "Truncated: {$overflow} brand(s) exceeded max {$max_brand} slots." );
	}
} else {
	WP_CLI::log( '  No brand repeater data found — skipping.' );
	$total_skipped++;
}

WP_CLI::log( '' );

// ── 3. bc_team_members → bc_team_member_{n}_* ────────────────────

WP_CLI::log( '=== bc_team_members → team member slots ===' );

$team_repeater = get_field( 'bc_team_members', $front_page_id );
$max_team      = 8;

if ( ! empty( $team_repeater ) && is_array( $team_repeater ) ) {
	$count = min( count( $team_repeater ), $max_team );

	for ( $i = 0; $i < $count; $i++ ) {
		$row  = $team_repeater[ $i ];
		$slot = $i + 1;

		$img_id = spektra_migration_resolve_image_id( $row['image'] ?? null );
		update_field( 'bc_team_member_' . $slot . '_name', $row['name'] ?? '', $front_page_id );
		update_field( 'bc_team_member_' . $slot . '_role', $row['role'] ?? '', $front_page_id );
		update_field( 'bc_team_member_' . $slot . '_image', $img_id, $front_page_id );
		update_field( 'bc_team_member_' . $slot . '_image_alt', $row['image_alt'] ?? '', $front_page_id );
		update_field( 'bc_team_member_' . $slot . '_phone', $row['phone'] ?? '', $front_page_id );
		update_field( 'bc_team_member_' . $slot . '_email', $row['email'] ?? '', $front_page_id );

		$total_migrated++;
		if ( $verbose ) {
			WP_CLI::log( "  Slot {$slot}: name=\"" . ( $row['name'] ?? '' ) . "\", image=ID:{$img_id}" );
		}
	}

	WP_CLI::success( "Migrated {$count} team members to slots." );

	if ( count( $team_repeater ) > $max_team ) {
		$overflow = count( $team_repeater ) - $max_team;
		WP_CLI::warning( "Truncated: {$overflow} member(s) exceeded max {$max_team} slots." );
	}
} else {
	WP_CLI::log( '  No team repeater data found — skipping.' );
	$total_skipped++;
}

WP_CLI::log( '' );

// ── Summary ──────────────────────────────────────────────────────

WP_CLI::log( '=== Summary ===' );
WP_CLI::log( "Total items migrated: {$total_migrated}" );
WP_CLI::log( "Sections skipped:     {$total_skipped}" );
WP_CLI::success( 'P13.3 migration complete.' );
