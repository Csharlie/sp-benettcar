<?php
/**
 * bc-brand field group — Brand logos section.
 *
 * P13.3: Slot-Based ACF Free Admin refactor.
 * Replaces repeater with Homepage-local slot fields (max 10 brands).
 * Legacy repeater removed from visible admin — data retained in DB.
 *
 * Contract: content-model.md §2.2
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// ── Slot field generator ─────────────────────────────────────────

$slot_fields = [];
$max_slots   = 10;

for ( $i = 1; $i <= $max_slots; $i++ ) {
	$slot_fields[] = [
		'key'     => 'field_bc_brand_sep_' . $i,
		'label'   => '',
		'name'    => '',
		'type'    => 'message',
		'message' => '<strong>--- Márka ' . $i . ' ---</strong>',
		'wrapper' => [ 'width' => '100' ],
	];

	$slot_fields[] = [
		'key'     => 'field_bc_brand_brand_' . $i . '_name',
		'label'   => 'Márka ' . $i . ' — Név',
		'name'    => 'bc_brand_brand_' . $i . '_name',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'           => 'field_bc_brand_brand_' . $i . '_logo',
		'label'         => 'Márka ' . $i . ' — Logó',
		'name'          => 'bc_brand_brand_' . $i . '_logo',
		'type'          => 'image',
		'return_format' => 'array',
		'preview_size'  => 'thumbnail',
		'wrapper'       => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_brand_brand_' . $i . '_alt',
		'label'   => 'Márka ' . $i . ' — Alt szöveg',
		'name'    => 'bc_brand_brand_' . $i . '_alt',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'           => 'field_bc_brand_brand_' . $i . '_invert',
		'label'         => 'Márka ' . $i . ' — Invertálás (sötét háttérhez)',
		'name'          => 'bc_brand_brand_' . $i . '_invert',
		'type'          => 'true_false',
		'default_value' => 0,
		'wrapper'       => [ 'width' => '50' ],
	];
}

// ── Field group definition ───────────────────────────────────────

return [
	'key'      => 'group_bc_brand',
	'title'    => 'Főoldal — Márkák',
	'fields'   => array_merge(
		[
			[
				'key'   => 'field_bc_brand_title',
				'label' => 'Cím',
				'name'  => 'bc_brand_title',
				'type'  => 'text',
			],
			[
				'key'   => 'field_bc_brand_description',
				'label' => 'Leírás',
				'name'  => 'bc_brand_description',
				'type'  => 'textarea',
				'rows'  => 3,
			],
			[
				'key'     => 'field_bc_brand_instructions',
				'label'   => '',
				'name'    => '',
				'type'    => 'message',
				'message' => 'Itt szerkeszthetők a márka logók (max 10).<br>'
					. 'Minden kitöltött slot egy márkaként jelenik meg.<br>'
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
	'menu_order' => 1,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
