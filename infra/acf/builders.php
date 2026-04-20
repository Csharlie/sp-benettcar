<?php
/**
 * Benettcar (bc-*) section builders — client overlay.
 *
 * Registers all bc-* section builder functions with the generic
 * Spektra section builder registry (spektra_register_section_builder).
 *
 * Each builder reads ACF fields from the given post and returns a data array.
 *
 * Rules:
 * - Required field missing → return null (section skipped by caller)
 * - Optional field missing → key present with null/empty/default value
 * - Image fields normalized via spektra_normalize_media() → Media | null
 *   Gallery images[].src and brand brands[].logo resolved via
 *   spektra_resolve_image_url() → URL string (handles attachment IDs).
 * - Output keys are camelCase (matches platform TypeScript contracts)
 *
 * Depends on: helpers.php (spektra_get_field), media-helper.php (spektra_normalize_media).
 * Loaded by: spektra-api.php after sections.php (registry must exist).
 *
 * Phase history:
 *   P7.3: initial implementation (in sp-infra/acf/sections.php).
 *   P7.4: media normalization — ACF image → canonical Media shape.
 *   P7.4.1: bc-brand.logo rolled back to URL string (frontend contract).
 *   P11.2: moved from sp-infra to client overlay.
 *   P13.5d: legacy repeater/CPT fallbacks removed — slot-only source.
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// ── Shared helpers ───────────────────────────────────────────────

/**
 * Split a textarea value into a trimmed, non-empty string array.
 *
 * Same semantics as sp-exotica's spektra_split_textarea().
 * Kept client-local per extraction rule (extraction to sp-infra deferred
 * until a shared refactor step).
 *
 * @param string $text Raw textarea value (newline-separated).
 * @return string[] Non-empty trimmed lines.
 */
function spektra_bc_split_textarea( string $text ): array {
	if ( $text === '' ) {
		return [];
	}

	$lines = explode( "\n", $text );
	$lines = array_map( 'trim', $lines );
	$lines = array_filter( $lines, static fn( string $line ): bool => $line !== '' );

	return array_values( $lines );
}

// ── bc-hero ──────────────────────────────────────────────────────

/**
 * @param string $p   ACF field prefix (bc_hero_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_hero( string $p, int $pid ): ?array {
	$title = spektra_get_field( $p . 'title', $pid );
	$desc  = spektra_get_field( $p . 'description', $pid );

	if ( $title === null || $desc === null ) {
		return null;
	}

	$data = [
		'title'           => $title,
		'subtitle'        => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'description'     => $desc,
		'backgroundImage' => spektra_normalize_media(
			spektra_get_field( $p . 'background_image', $pid ),
			spektra_get_field( $p . 'background_image_alt', $pid, '' )
		),
	];

	$pct = spektra_get_field( $p . 'primary_cta_text', $pid );
	$pch = spektra_get_field( $p . 'primary_cta_href', $pid );
	if ( $pct !== null || $pch !== null ) {
		$data['primaryCTA'] = [
			'text' => $pct ?? '',
			'href' => $pch ?? '',
		];
	}

	$sct = spektra_get_field( $p . 'secondary_cta_text', $pid );
	$sch = spektra_get_field( $p . 'secondary_cta_href', $pid );
	if ( $sct !== null || $sch !== null ) {
		$data['secondaryCTA'] = [
			'text' => $sct ?? '',
			'href' => $sch ?? '',
		];
	}

	return $data;
}

// ── bc-brand ─────────────────────────────────────────────────────

/**
 * Load bc-brand items from Homepage slot-based ACF Free fields.
 *
 * P13.3: Primary source. Reads up to $max brand slots.
 * A slot is valid only if name is non-empty.
 *
 * @param string $p   ACF field prefix (bc_brand_).
 * @param int    $pid Post ID.
 * @param int    $max Maximum slot count.
 * @return array<int, array{name: string, logo: string, alt: string, invert: bool}>
 */
function spektra_bc_get_brand_slots( string $p, int $pid, int $max = 10 ): array {
	$items = [];

	for ( $i = 1; $i <= $max; $i++ ) {
		$name = trim( (string) spektra_get_field( $p . 'brand_' . $i . '_name', $pid, '' ) );

		if ( $name === '' ) {
			continue;
		}

		$items[] = [
			'name'   => $name,
			'logo'   => spektra_resolve_image_url( spektra_get_field( $p . 'brand_' . $i . '_logo', $pid ) ),
			'alt'    => trim( (string) spektra_get_field( $p . 'brand_' . $i . '_alt', $pid, '' ) ),
			'invert' => (bool) spektra_get_field( $p . 'brand_' . $i . '_invert', $pid, false ),
		];
	}

	return $items;
}

/**
 * @param string $p   ACF field prefix (bc_brand_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_brand( string $p, int $pid ): ?array {
	$brands = spektra_bc_get_brand_slots( $p, $pid );

	if ( empty( $brands ) ) {
		return null;
	}

	return [
		'title'       => spektra_get_field( $p . 'title', $pid, '' ),
		'description' => spektra_get_field( $p . 'description', $pid, '' ),
		'brands'      => $brands,
	];
}

// ── bc-gallery ───────────────────────────────────────────────────

/**
 * Load bc-gallery images from Homepage slot-based ACF Free fields.
 *
 * P13.3: Primary source. Reads up to $max image slots.
 * A slot is valid only if src (image) is non-empty.
 *
 * @param string $p   ACF field prefix (bc_gallery_).
 * @param int    $pid Post ID.
 * @param int    $max Maximum slot count.
 * @return array<int, array{src: string, alt: string, category: string, caption: string}>
 */
function spektra_bc_get_gallery_slots( string $p, int $pid, int $max = 10 ): array {
	$items = [];

	for ( $i = 1; $i <= $max; $i++ ) {
		$src = spektra_resolve_image_url( spektra_get_field( $p . 'image_' . $i . '_src', $pid ) );

		if ( $src === '' ) {
			continue;
		}

		$items[] = [
			'src'      => $src,
			'alt'      => trim( (string) spektra_get_field( $p . 'image_' . $i . '_alt', $pid, '' ) ),
			'category' => trim( (string) spektra_get_field( $p . 'image_' . $i . '_category', $pid, '' ) ),
			'caption'  => trim( (string) spektra_get_field( $p . 'image_' . $i . '_caption', $pid, '' ) ),
		];
	}

	return $items;
}

/**
 * @param string $p   ACF field prefix (bc_gallery_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_gallery( string $p, int $pid ): ?array {
	$title = spektra_get_field( $p . 'title', $pid );

	if ( $title === null ) {
		return null;
	}

	$images = spektra_bc_get_gallery_slots( $p, $pid );

	if ( empty( $images ) ) {
		return null;
	}

	return [
		'title'          => $title,
		'subtitle'       => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'showCategories' => (bool) spektra_get_field( $p . 'show_categories', $pid, false ),
		'images'         => $images,
	];
}

// ── bc-services ──────────────────────────────────────────────────

/**
 * Load bc-services items from Homepage slot-based ACF Free fields.
 *
 * Reads up to $max slot triplets (title/icon/description) from the front page.
 * A slot is valid only if all three values are non-empty after trim.
 * Invalid/empty slots are silently skipped.
 *
 * P13.1: Primary source for bc-services items.
 *
 * @param string $p   ACF field prefix (bc_services_).
 * @param int    $pid Post ID (front page).
 * @param int    $max Maximum slot count.
 * @return array<int, array{title: string, icon: string, description: string}>
 */
function spektra_bc_get_service_slots( string $p, int $pid, int $max = 6 ): array {
	$items = [];

	for ( $i = 1; $i <= $max; $i++ ) {
		$title       = trim( (string) spektra_get_field( $p . 'service_' . $i . '_title', $pid, '' ) );
		$icon        = trim( (string) spektra_get_field( $p . 'service_' . $i . '_icon', $pid, '' ) );
		$description = trim( (string) spektra_get_field( $p . 'service_' . $i . '_description', $pid, '' ) );

		if ( $title === '' || $icon === '' || $description === '' ) {
			continue;
		}

		$items[] = [
			'title'       => $title,
			'icon'        => $icon,
			'description' => $description,
		];
	}

	return $items;
}

/**
 * Build bc-services section data.
 *
 * Reads slot-based fields from Homepage (P13.1).
 * Returns null if no valid services.
 *
 * @param string $p   ACF field prefix (bc_services_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_services( string $p, int $pid ): ?array {
	$title = spektra_get_field( $p . 'title', $pid );

	if ( $title === null ) {
		return null;
	}

	$services = spektra_bc_get_service_slots( $p, $pid );

	if ( empty( $services ) ) {
		return null;
	}

	return [
		'title'    => $title,
		'subtitle' => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'services' => $services,
	];
}

// ── bc-service ───────────────────────────────────────────────────

/**
 * @param string $p   ACF field prefix (bc_service_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_service( string $p, int $pid ): ?array {
	$title    = spektra_get_field( $p . 'title', $pid );
	$desc     = spektra_get_field( $p . 'description', $pid );

	if ( $title === null || $desc === null ) {
		return null;
	}

	$services_lines = spektra_bc_split_textarea( (string) spektra_get_field( $p . 'services_text', $pid, '' ) );
	$services = array_map( static fn( string $line ): array => [ 'label' => $line ], $services_lines );

	if ( empty( $services ) ) {
		return null;
	}

	$brands = spektra_bc_split_textarea( (string) spektra_get_field( $p . 'brands_text', $pid, '' ) );

	if ( empty( $brands ) ) {
		return null;
	}

	$data = [
		'title'       => $title,
		'subtitle'    => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'description' => $desc,
		'services'    => $services,
		'brands'      => $brands,
	];

	$contact = spektra_get_field( $p . 'contact', $pid );
	if ( is_array( $contact ) ) {
		$c = [
			'title'        => $contact['title'] ?? '',
			'description'  => $contact['description'] ?? '',
			'phone'        => $contact['phone'] ?? '',
			'bookingNote'  => $contact['booking_note'] ?? '',
			'hours'        => $contact['hours'] ?? '',
			'weekendHours' => $contact['weekend_hours'] ?? '',
		];

		$mct = $contact['message_cta_text'] ?? null;
		$mch = $contact['message_cta_href'] ?? null;
		if ( $mct !== null || $mch !== null ) {
			$c['messageCta'] = [
				'text' => $mct ?? '',
				'href' => $mch ?? '',
			];
		}

		$data['contact'] = $c;
	}

	return $data;
}

// ── bc-about ─────────────────────────────────────────────────────

/**
 * Read bc-about stat slots from front page.
 *
 * @param string $p   ACF field prefix (bc_about_).
 * @param int    $pid Post ID.
 * @param int    $max Maximum slot count.
 * @return array<int, array{value: string, label: string}>
 */
function spektra_bc_get_stat_slots( string $p, int $pid, int $max = 6 ): array {
	$items = [];

	for ( $i = 1; $i <= $max; $i++ ) {
		$value = trim( (string) spektra_get_field( $p . 'stat_' . $i . '_value', $pid, '' ) );
		$label = trim( (string) spektra_get_field( $p . 'stat_' . $i . '_label', $pid, '' ) );

		if ( $value === '' || $label === '' ) {
			continue;
		}

		$items[] = [
			'value' => $value,
			'label' => $label,
		];
	}

	return $items;
}

/**
 * @param string $p   ACF field prefix (bc_about_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_about( string $p, int $pid ): ?array {
	$title = spektra_get_field( $p . 'title', $pid );

	if ( $title === null ) {
		return null;
	}

	$content = spektra_bc_split_textarea( (string) spektra_get_field( $p . 'content_text', $pid, '' ) );

	if ( empty( $content ) ) {
		return null;
	}

	$data = [
		'title'         => $title,
		'subtitle'      => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'content'       => $content,
		'image'         => spektra_normalize_media(
			spektra_get_field( $p . 'image', $pid ),
			spektra_get_field( $p . 'image_alt', $pid, '' )
		),
		'imagePosition' => spektra_get_field( $p . 'image_position', $pid, 'right' ),
		'colorScheme'   => spektra_get_field( $p . 'color_scheme', $pid, 'light' ),
	];

	$stats = spektra_bc_get_stat_slots( $p, $pid );

	$data['stats'] = $stats;

	$cta_text = spektra_get_field( $p . 'cta_text', $pid );
	$cta_href = spektra_get_field( $p . 'cta_href', $pid );
	if ( $cta_text !== null || $cta_href !== null ) {
		$data['cta'] = [
			'text' => $cta_text ?? '',
			'href' => $cta_href ?? '',
		];
	}

	return $data;
}

// ── bc-team ──────────────────────────────────────────────────────

/**
 * Load bc-team members from Homepage slot-based ACF Free fields.
 *
 * P13.3: Primary source. Reads up to $max member slots.
 * A slot is valid only if name is non-empty.
 *
 * @param string $p   ACF field prefix (bc_team_).
 * @param int    $pid Post ID.
 * @param int    $max Maximum slot count.
 * @return array<int, array{name: string, role: string, image: ?array, phone: string, email: string}>
 */
function spektra_bc_get_team_slots( string $p, int $pid, int $max = 8 ): array {
	$items = [];

	for ( $i = 1; $i <= $max; $i++ ) {
		$name = trim( (string) spektra_get_field( $p . 'member_' . $i . '_name', $pid, '' ) );

		if ( $name === '' ) {
			continue;
		}

		$items[] = [
			'name'  => $name,
			'role'  => trim( (string) spektra_get_field( $p . 'member_' . $i . '_role', $pid, '' ) ),
			'image' => spektra_normalize_media(
				spektra_get_field( $p . 'member_' . $i . '_image', $pid ),
				trim( (string) spektra_get_field( $p . 'member_' . $i . '_image_alt', $pid, '' ) )
			),
			'phone' => trim( (string) spektra_get_field( $p . 'member_' . $i . '_phone', $pid, '' ) ),
			'email' => trim( (string) spektra_get_field( $p . 'member_' . $i . '_email', $pid, '' ) ),
		];
	}

	return $items;
}

/**
 * @param string $p   ACF field prefix (bc_team_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_team( string $p, int $pid ): ?array {
	$title = spektra_get_field( $p . 'title', $pid );

	if ( $title === null ) {
		return null;
	}

	$members = spektra_bc_get_team_slots( $p, $pid );

	if ( empty( $members ) ) {
		return null;
	}

	return [
		'title'       => $title,
		'subtitle'    => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'description' => spektra_get_field( $p . 'description', $pid, '' ),
		'members'     => $members,
	];
}

// ── bc-assistance ────────────────────────────────────────────────

/**
 * @param string $p   ACF field prefix (bc_assistance_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_assistance( string $p, int $pid ): ?array {
	$title = spektra_get_field( $p . 'title', $pid );

	if ( $title === null ) {
		return null;
	}

	$data = [
		'title'       => $title,
		'subtitle'    => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'description' => spektra_get_field( $p . 'description', $pid, '' ),
		'serviceArea' => spektra_get_field( $p . 'service_area', $pid, '' ),
	];

	$data['requestLabel'] = spektra_get_field( $p . 'request_label', $pid, '' );
	$data['requestHref']  = spektra_get_field( $p . 'request_href', $pid, '' );

	return $data;
}

// ── bc-contact ───────────────────────────────────────────────────

/**
 * @param string $p   ACF field prefix (bc_contact_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_contact( string $p, int $pid ): ?array {
	$title = spektra_get_field( $p . 'title', $pid );

	if ( $title === null ) {
		return null;
	}

	$data = [
		'title'       => $title,
		'subtitle'    => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'description' => spektra_get_field( $p . 'description', $pid, '' ),
		'colorScheme' => spektra_get_field( $p . 'color_scheme', $pid, 'light' ),
	];

	$info = spektra_get_field( $p . 'info', $pid );
	if ( is_array( $info ) ) {
		$data['contactInfo'] = [
			'phone'   => $info['phone'] ?? '',
			'email'   => $info['email'] ?? '',
			'address' => $info['address'] ?? '',
		];
	}

	return $data;
}

// ── bc-map ───────────────────────────────────────────────────────

/**
 * @param string $p   ACF field prefix (bc_map_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_map( string $p, int $pid ): ?array {
	$query = spektra_get_field( $p . 'query', $pid );

	if ( $query === null ) {
		return null;
	}

	return [
		'title'  => spektra_get_field( $p . 'title', $pid, '' ),
		'query'  => $query,
		'height' => (int) spektra_get_field( $p . 'height', $pid, 400 ),
	];
}

// ── Registration ─────────────────────────────────────────────────

spektra_register_section_builder( 'bc-hero', 'spektra_build_bc_hero' );
spektra_register_section_builder( 'bc-brand', 'spektra_build_bc_brand' );
spektra_register_section_builder( 'bc-gallery', 'spektra_build_bc_gallery' );
spektra_register_section_builder( 'bc-services', 'spektra_build_bc_services' );
spektra_register_section_builder( 'bc-service', 'spektra_build_bc_service' );
spektra_register_section_builder( 'bc-about', 'spektra_build_bc_about' );
spektra_register_section_builder( 'bc-team', 'spektra_build_bc_team' );
spektra_register_section_builder( 'bc-assistance', 'spektra_build_bc_assistance' );
spektra_register_section_builder( 'bc-contact', 'spektra_build_bc_contact' );
spektra_register_section_builder( 'bc-map', 'spektra_build_bc_map' );
