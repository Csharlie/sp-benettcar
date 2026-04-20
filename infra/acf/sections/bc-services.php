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
	$slot_fields[] = [
		'key'          => 'field_bc_services_sep_' . $i,
		'label'        => 'Szolgáltatás ' . $i,
		'type'         => 'accordion',
		'open'         => 0,
		'multi_expand' => 1,
		'endpoint'     => 0,
	];

	$slot_fields[] = [
		'key'      => 'field_bc_services_service_' . $i . '_title',
		'label'    => 'Szolgáltatás ' . $i . ' — Cím',
		'name'     => 'bc_services_service_' . $i . '_title',
		'type'     => 'text',
		'wrapper'  => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'          => 'field_bc_services_service_' . $i . '_icon',
		'label'        => 'Szolgáltatás ' . $i . ' — Ikon',
		'name'         => 'bc_services_service_' . $i . '_icon',
		'type'         => 'text',
		'instructions' => 'Ikon neve — elérhető ikonok: Wrench (csavarkulcs), DollarSign (dollárjel), AlertCircle (felkiáltójel). Pontosan így írja be, kis-nagybetű számít.',
		'wrapper'      => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_services_service_' . $i . '_description',
		'label'   => 'Szolgáltatás ' . $i . ' — Leírás',
		'name'    => 'bc_services_service_' . $i . '_description',
		'type'    => 'textarea',
		'rows'    => 3,
		'wrapper' => [ 'width' => '100' ],
	];
}

// ── Field group definition ───────────────────────────────────────

return [
	'key'      => 'group_bc_services',
	'title'    => 'Főoldal — Szolgáltatások (kártyák)',
	'fields'   => array_merge(
		[
			[
				'key'      => 'field_bc_services_title',
				'label'    => 'Cím',
				'name'     => 'bc_services_title',
				'type'     => 'text',
				'required' => 1,
			],
			[
				'key'   => 'field_bc_services_subtitle',
				'label' => 'Alcím',
				'name'  => 'bc_services_subtitle',
				'type'  => 'text',
			],
			[
				'key'     => 'field_bc_services_instructions',
				'label'   => '',
				'name'    => '',
				'type'    => 'message',
				'message' => 'Itt szerkeszthetők a szolgáltatás kártyák.<br>'
					. 'Minden kitöltött slot egy kártyaként jelenik meg az oldalon.<br>'
					. 'Üres slot nem jelenik meg.',
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
