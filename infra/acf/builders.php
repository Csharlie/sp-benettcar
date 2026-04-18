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
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

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
 * @param string $p   ACF field prefix (bc_brand_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_brand( string $p, int $pid ): ?array {
	$brands = spektra_get_field( $p . 'brands', $pid );

	if ( empty( $brands ) || ! is_array( $brands ) ) {
		return null;
	}

	return [
		'title'       => spektra_get_field( $p . 'title', $pid, '' ),
		'description' => spektra_get_field( $p . 'description', $pid, '' ),
		'brands'      => array_map( function ( array $row ): array {
			return [
				'name'   => $row['name'] ?? '',
				'logo'   => spektra_resolve_image_url( $row['logo'] ?? null ),
				'alt'    => $row['alt'] ?? '',
				'invert' => (bool) ( $row['invert'] ?? false ),
			];
		}, $brands ),
	];
}

// ── bc-gallery ───────────────────────────────────────────────────

/**
 * @param string $p   ACF field prefix (bc_gallery_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_gallery( string $p, int $pid ): ?array {
	$title  = spektra_get_field( $p . 'title', $pid );
	$images = spektra_get_field( $p . 'images', $pid );

	if ( $title === null || empty( $images ) || ! is_array( $images ) ) {
		return null;
	}

	return [
		'title'          => $title,
		'subtitle'       => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'showCategories' => (bool) spektra_get_field( $p . 'show_categories', $pid, false ),
		'images'         => array_map( function ( array $row ): array {
			return [
				'src'      => spektra_resolve_image_url( $row['src'] ?? null ),
				'alt'      => $row['alt'] ?? '',
				'category' => $row['category'] ?? '',
				'caption'  => $row['caption'] ?? '',
			];
		}, $images ),
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
 * Load bc-services items from hidden sp_bc_service CPT posts (legacy fallback).
 *
 * P12.6 implementation retained as secondary fallback after P13.1 slot refactor.
 * CPT is hidden from admin (show_ui: false) but posts remain queryable.
 *
 * @return array<int, array{title: string, icon: string, description: string}>
 */
function spektra_bc_get_services(): array {
	$posts = get_posts( [
		'post_type'      => 'sp_bc_service',
		'posts_per_page' => -1,
		'orderby'        => [ 'menu_order' => 'ASC', 'ID' => 'ASC' ],
		'post_status'    => 'publish',
	] );

	if ( empty( $posts ) ) {
		return [];
	}

	$items = [];
	foreach ( $posts as $post ) {
		$title       = trim( $post->post_title );
		$icon        = trim( (string) spektra_get_field( 'bc_service_icon', $post->ID, '' ) );
		$description = trim( (string) spektra_get_field( 'bc_service_description', $post->ID, '' ) );

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
 * Source priority (P13.1):
 * 1. Slot-based fields from Homepage
 * 2. Hidden legacy CPT posts (sp_bc_service)
 * 3. Legacy repeater fallback (bc_services_services)
 * 4. null if no valid services
 *
 * @param string $p   ACF field prefix (bc_services_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_services( string $p, int $pid ): ?array {
	$title = spektra_get_field( $p . 'title', $pid );

	if ( $title === null ) {
		return null;
	}

	// 1. Slot-based fields (P13.1 primary source).
	$services = spektra_bc_get_service_slots( $p, $pid );

	// 2. Hidden CPT fallback (P12.6 legacy).
	if ( empty( $services ) ) {
		$services = spektra_bc_get_services();
	}

	// 3. Legacy repeater fallback (pre-P12.6).
	if ( empty( $services ) ) {
		$repeater = spektra_get_field( $p . 'services', $pid );
		if ( ! empty( $repeater ) && is_array( $repeater ) ) {
			$services = array_map( function ( array $row ): array {
				return [
					'title'       => $row['title'] ?? '',
					'icon'        => $row['icon'] ?? '',
					'description' => $row['description'] ?? '',
				];
			}, $repeater );
		}
	}

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
	$services = spektra_get_field( $p . 'services', $pid );
	$brands   = spektra_get_field( $p . 'brands', $pid );

	if ( $title === null || $desc === null ) {
		return null;
	}
	if ( empty( $services ) || ! is_array( $services ) ) {
		return null;
	}
	if ( empty( $brands ) || ! is_array( $brands ) ) {
		return null;
	}

	$data = [
		'title'       => $title,
		'subtitle'    => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'description' => $desc,
		'services'    => array_map( function ( array $row ): array {
			return [ 'label' => $row['label'] ?? '' ];
		}, $services ),
		'brands'      => array_map( function ( array $row ): string {
			return $row['name'] ?? '';
		}, $brands ),
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
 * @param string $p   ACF field prefix (bc_about_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_about( string $p, int $pid ): ?array {
	$title   = spektra_get_field( $p . 'title', $pid );
	$content = spektra_get_field( $p . 'content', $pid );

	if ( $title === null || empty( $content ) || ! is_array( $content ) ) {
		return null;
	}

	$data = [
		'title'         => $title,
		'subtitle'      => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'content'       => array_map( function ( array $row ): string {
			return $row['paragraph'] ?? '';
		}, $content ),
		'image'         => spektra_normalize_media(
			spektra_get_field( $p . 'image', $pid ),
			spektra_get_field( $p . 'image_alt', $pid, '' )
		),
		'imagePosition' => spektra_get_field( $p . 'image_position', $pid, 'right' ),
		'colorScheme'   => spektra_get_field( $p . 'color_scheme', $pid, 'light' ),
	];

	$stats = spektra_get_field( $p . 'stats', $pid );
	$data['stats'] = is_array( $stats ) ? array_map( function ( array $row ): array {
		return [
			'value' => $row['value'] ?? '',
			'label' => $row['label'] ?? '',
		];
	}, $stats ) : [];

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
 * @param string $p   ACF field prefix (bc_team_).
 * @param int    $pid Post ID.
 */
function spektra_build_bc_team( string $p, int $pid ): ?array {
	$title   = spektra_get_field( $p . 'title', $pid );
	$members = spektra_get_field( $p . 'members', $pid );

	if ( $title === null || empty( $members ) || ! is_array( $members ) ) {
		return null;
	}

	return [
		'title'       => $title,
		'subtitle'    => spektra_get_field( $p . 'subtitle', $pid, '' ),
		'description' => spektra_get_field( $p . 'description', $pid, '' ),
		'members'     => array_map( function ( array $row ): array {
			return [
				'name'  => $row['name'] ?? '',
				'role'  => $row['role'] ?? '',
				'image' => spektra_normalize_media(
					$row['image'] ?? null,
					$row['image_alt'] ?? ''
				),
				'phone' => $row['phone'] ?? '',
				'email' => $row['email'] ?? '',
			];
		}, $members ),
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
