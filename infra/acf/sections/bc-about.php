<?php
/**
 * bc-about field group — About section.
 *
 * P13.2: Repeaters replaced with ACF Free fields.
 * - bc_about_content repeater → bc_about_content_text textarea (split by newline)
 * - bc_about_stats repeater → 6 slot pairs (value + label)
 * Legacy repeater data retained in DB.
 *
 * Contract: content-model.md §2.6
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// ── Stats slot field generator ───────────────────────────────────

$stat_slots  = [];
$max_stats   = 6;

for ( $i = 1; $i <= $max_stats; $i++ ) {
	$stat_slots[] = [
		'key'     => 'field_bc_about_stat_sep_' . $i,
		'label'   => '',
		'name'    => '',
		'type'    => 'message',
		'message' => '<strong>--- Stat ' . $i . ' ---</strong>',
		'wrapper' => [ 'width' => '100' ],
	];
	$stat_slots[] = [
		'key'     => 'field_bc_about_stat_' . $i . '_value',
		'label'   => 'Stat ' . $i . ' — Value',
		'name'    => 'bc_about_stat_' . $i . '_value',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$stat_slots[] = [
		'key'     => 'field_bc_about_stat_' . $i . '_label',
		'label'   => 'Stat ' . $i . ' — Label',
		'name'    => 'bc_about_stat_' . $i . '_label',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
}

// ── Field group definition ───────────────────────────────────────

return [
	'key'      => 'group_bc_about',
	'title'    => 'BC About',
	'fields'   => array_merge(
		[
			[
				'key'      => 'field_bc_about_title',
				'label'    => 'Title',
				'name'     => 'bc_about_title',
				'type'     => 'text',
				'required' => 1,
			],
			[
				'key'   => 'field_bc_about_subtitle',
				'label' => 'Subtitle',
				'name'  => 'bc_about_subtitle',
				'type'  => 'text',
			],
			[
				'key'          => 'field_bc_about_content_text',
				'label'        => 'Content Paragraphs',
				'name'         => 'bc_about_content_text',
				'type'         => 'textarea',
				'required'     => 1,
				'rows'         => 8,
				'instructions' => 'Minden sor egy önálló bekezdésként jelenik meg az oldalon. Üres sorok figyelmen kívül maradnak.',
			],
			[
				'key'           => 'field_bc_about_image',
				'label'         => 'Image',
				'name'          => 'bc_about_image',
				'type'          => 'image',
				'return_format' => 'array',
				'preview_size'  => 'medium',
			],
			[
				'key'   => 'field_bc_about_image_alt',
				'label' => 'Image Alt Text',
				'name'  => 'bc_about_image_alt',
				'type'  => 'text',
			],
			[
				'key'           => 'field_bc_about_image_position',
				'label'         => 'Image Position',
				'name'          => 'bc_about_image_position',
				'type'          => 'select',
				'choices'       => [
					'left'  => 'Left',
					'right' => 'Right',
				],
				'default_value' => 'right',
			],
			[
				'key'     => 'field_bc_about_stats_instructions',
				'label'   => '',
				'name'    => '',
				'type'    => 'message',
				'message' => 'Statisztikák — minden kitöltött value+label pár egy stat kártyaként jelenik meg. Üres slot nem jelenik meg.',
			],
		],
		$stat_slots,
		[
			[
				'key'   => 'field_bc_about_cta_text',
				'label' => 'CTA Text',
				'name'  => 'bc_about_cta_text',
				'type'  => 'text',
			],
			[
				'key'   => 'field_bc_about_cta_href',
				'label' => 'CTA Link',
				'name'  => 'bc_about_cta_href',
				'type'  => 'text',
			],
			[
				'key'           => 'field_bc_about_color_scheme',
				'label'         => 'Color Scheme',
				'name'          => 'bc_about_color_scheme',
				'type'          => 'select',
				'choices'       => [
					'light' => 'Light',
					'dark'  => 'Dark',
				],
				'default_value' => 'light',
			],
		]
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
	'menu_order' => 5,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
