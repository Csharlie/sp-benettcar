<?php
/**
 * sp_bc_service CPT registration + ACF field group.
 *
 * P12.6: First cpt_collection migration target for BenettCar.
 * P13.1: CPT hidden from admin — retained as legacy fallback only.
 *        Slot-based ACF Free Admin on Homepage supersedes CPT editing.
 *        Do NOT delete existing CPT posts or provenance meta.
 *        Future cleanup can remove this once slot-based parity is stable.
 *
 * Loaded by: field-groups.php (require_once).
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// ── CPT Registration ─────────────────────────────────────────────
// Kept registered for query stability (spektra_bc_get_services fallback).
// Hidden from editor-facing admin after P13.1 slot-based refactor.

add_action( 'init', function () {
	register_post_type( 'sp_bc_service', [
		'labels' => [
			'name'               => 'Szolgáltatások',
			'singular_name'      => 'Szolgáltatás',
			'add_new'            => 'Új szolgáltatás',
			'add_new_item'       => 'Új szolgáltatás hozzáadása',
			'edit_item'          => 'Szolgáltatás szerkesztése',
			'new_item'           => 'Új szolgáltatás',
			'view_item'          => 'Szolgáltatás megtekintése',
			'search_items'       => 'Szolgáltatás keresése',
			'not_found'          => 'Nem található szolgáltatás',
			'not_found_in_trash' => 'Nincs szolgáltatás a lomtárban',
			'menu_name'          => 'Services',
		],
		'public'       => false,
		'show_ui'      => false,
		'show_in_menu' => false,
		'show_in_rest' => true,
		'menu_icon'    => 'dashicons-hammer',
		'supports'     => [ 'title', 'page-attributes' ],
		'has_archive'  => false,
		'rewrite'      => false,
	] );
} );

// ── ACF Free field group for sp_bc_service items ─────────────────
// Icon and description are stored as ACF Free fields on each CPT post.
// post_title is used for the service title (no ACF field needed).

add_action( 'acf/init', function () {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	acf_add_local_field_group( [
		'key'    => 'group_sp_bc_service',
		'title'  => 'Service Details',
		'fields' => [
			[
				'key'          => 'field_bc_service_icon',
				'label'        => 'Icon',
				'name'         => 'bc_service_icon',
				'type'         => 'text',
				'required'     => 1,
				'instructions' => 'Lucide icon name (e.g., Wrench, DollarSign, AlertCircle)',
			],
			[
				'key'      => 'field_bc_service_description',
				'label'    => 'Description',
				'name'     => 'bc_service_description',
				'type'     => 'textarea',
				'required' => 1,
				'rows'     => 3,
			],
		],
		'location' => [
			[
				[
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'sp_bc_service',
				],
			],
		],
		'menu_order' => 0,
		'position'   => 'normal',
		'style'      => 'default',
		'active'     => true,
	] );
} );
