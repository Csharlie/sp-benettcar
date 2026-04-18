<?php
/**
 * bc-services field group — Services overview section.
 *
 * P13.1: Slot-Based ACF Free Admin refactor.
 * Replaces CPT collection editing with Homepage-local slot fields.
 * Legacy repeater removed from visible admin — data retained in DB.
 *
 * Contract: content-model.md §2.4
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// ── Slot field generator ─────────────────────────────────────────

$slot_fields = [];
$max_slots   = 6;

for ( $i = 1; $i <= $max_slots; $i++ ) {
	// Message separator for admin readability (ACF Free compatible).
	$slot_fields[] = [
		'key'     => 'field_bc_services_sep_' . $i,
		'label'   => '',
		'name'    => '',
		'type'    => 'message',
		'message' => '<strong>--- Szolgáltatás ' . $i . ' ---</strong>',
		'wrapper' => [ 'width' => '100' ],
	];

	$slot_fields[] = [
		'key'      => 'field_bc_services_service_' . $i . '_title',
		'label'    => 'Szolgáltatás ' . $i . ' — Title',
		'name'     => 'bc_services_service_' . $i . '_title',
		'type'     => 'text',
		'wrapper'  => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'          => 'field_bc_services_service_' . $i . '_icon',
		'label'        => 'Szolgáltatás ' . $i . ' — Icon',
		'name'         => 'bc_services_service_' . $i . '_icon',
		'type'         => 'text',
		'instructions' => 'Lucide icon name (e.g., Wrench, DollarSign, AlertCircle)',
		'wrapper'      => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_services_service_' . $i . '_description',
		'label'   => 'Szolgáltatás ' . $i . ' — Description',
		'name'    => 'bc_services_service_' . $i . '_description',
		'type'    => 'textarea',
		'rows'    => 3,
		'wrapper' => [ 'width' => '100' ],
	];
}

// ── Field group definition ───────────────────────────────────────

return [
	'key'      => 'group_bc_services',
	'title'    => 'BC Services',
	'fields'   => array_merge(
		[
			[
				'key'      => 'field_bc_services_title',
				'label'    => 'Title',
				'name'     => 'bc_services_title',
				'type'     => 'text',
				'required' => 1,
			],
			[
				'key'   => 'field_bc_services_subtitle',
				'label' => 'Subtitle',
				'name'  => 'bc_services_subtitle',
				'type'  => 'text',
			],
			[
				'key'     => 'field_bc_services_instructions',
				'label'   => '',
				'name'    => '',
				'type'    => 'message',
				'message' => 'Itt szerkeszthetők a Services section kártyái.<br>'
					. 'Minden kitöltött slot egy szolgáltatás kártyaként jelenik meg.<br>'
					. 'Üres slot nem jelenik meg az oldalon.',
			],
		],
		$slot_fields
	),
	'location' => [
		[
			[
				'param'    => 'page_type',
				'operator' => '==',
				'value'    => 'front_page',
			],
		],
	],
	'menu_order' => 3,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
