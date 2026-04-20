<?php
/**
 * bc-gallery field group — Image gallery section.
 *
 * P13.3: Slot-Based ACF Free Admin refactor.
 * Replaces repeater with Homepage-local slot fields (max 10 images).
 * Legacy repeater removed from visible admin — data retained in DB.
 *
 * Contract: content-model.md §2.3
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// ── Slot field generator ─────────────────────────────────────────

$slot_fields = [];
$max_slots   = 10;

for ( $i = 1; $i <= $max_slots; $i++ ) {
	$slot_fields[] = [
		'key'          => 'field_bc_gallery_sep_' . $i,
		'label'        => 'Kép ' . $i,
		'type'         => 'accordion',
		'open'         => 0,
		'multi_expand' => 1,
		'endpoint'     => 0,
	];

	$slot_fields[] = [
		'key'           => 'field_bc_gallery_image_' . $i . '_src',
		'label'         => 'Kép ' . $i . ' — Képfájl',
		'name'          => 'bc_gallery_image_' . $i . '_src',
		'type'          => 'image',
		'return_format' => 'array',
		'preview_size'  => 'medium',
		'wrapper'       => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_gallery_image_' . $i . '_alt',
		'label'   => 'Kép ' . $i . ' — Alt szöveg',
		'name'    => 'bc_gallery_image_' . $i . '_alt',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_gallery_image_' . $i . '_category',
		'label'   => 'Kép ' . $i . ' — Kategória',
		'name'    => 'bc_gallery_image_' . $i . '_category',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_gallery_image_' . $i . '_caption',
		'label'   => 'Kép ' . $i . ' — Felirat',
		'name'    => 'bc_gallery_image_' . $i . '_caption',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
}

// ── Field group definition ───────────────────────────────────────

return [
	'key'      => 'group_bc_gallery',
	'title'    => 'Főoldal — Galéria',
	'fields'   => array_merge(
		[
			[
				'key'      => 'field_bc_gallery_title',
				'label'    => 'Cím',
				'name'     => 'bc_gallery_title',
				'type'     => 'text',
				'required' => 1,
			],
			[
				'key'   => 'field_bc_gallery_subtitle',
				'label' => 'Alcím',
				'name'  => 'bc_gallery_subtitle',
				'type'  => 'text',
			],
			[
				'key'           => 'field_bc_gallery_show_categories',
				'label'         => 'Kategóriák mutatása',
				'name'          => 'bc_gallery_show_categories',
				'type'          => 'true_false',
				'default_value' => 0,
			],
			[
				'key'     => 'field_bc_gallery_instructions',
				'label'   => '',
				'name'    => '',
				'type'    => 'message',
				'message' => 'Itt szerkeszthetők a galéria képei (max 10).<br>'
					. 'Minden kitöltött slot egy képként jelenik meg.<br>'
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
	'menu_order' => 2,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
