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
		'message' => '<strong>--- Statisztika ' . $i . ' ---</strong>',
		'wrapper' => [ 'width' => '100' ],
	];
	$stat_slots[] = [
		'key'     => 'field_bc_about_stat_' . $i . '_value',
		'label'   => 'Statisztika ' . $i . ' — Érték',
		'name'    => 'bc_about_stat_' . $i . '_value',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$stat_slots[] = [
		'key'     => 'field_bc_about_stat_' . $i . '_label',
		'label'   => 'Statisztika ' . $i . ' — Felirat',
		'name'    => 'bc_about_stat_' . $i . '_label',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
}

// ── Field group definition ───────────────────────────────────────

return [
	'key'      => 'group_bc_about',
	'title'    => 'Főoldal — Rólunk',
	'fields'   => array_merge(
		[
			[
				'key'      => 'field_bc_about_title',
				'label'    => 'Cím',
				'name'     => 'bc_about_title',
				'type'     => 'text',
				'required' => 1,
			],
			[
				'key'   => 'field_bc_about_subtitle',
				'label' => 'Alcím',
				'name'  => 'bc_about_subtitle',
				'type'  => 'text',
			],
			[
				'key'          => 'field_bc_about_content_text',
				'label'        => 'Tartalom bekezdések',
				'name'         => 'bc_about_content_text',
				'type'         => 'textarea',
				'required'     => 1,
				'rows'         => 8,
				'instructions' => 'Minden sor egy önálló bekezdésként jelenik meg az oldalon. Üres sorok figyelmen kívül maradnak.',
			],
			[
				'key'           => 'field_bc_about_image',
				'label'         => 'Kép',
				'name'          => 'bc_about_image',
				'type'          => 'image',
				'return_format' => 'array',
				'preview_size'  => 'medium',
			],
			[
				'key'   => 'field_bc_about_image_alt',
				'label' => 'Kép alt szöveg',
				'name'  => 'bc_about_image_alt',
				'type'  => 'text',
			],
			[
				'key'           => 'field_bc_about_image_position',
				'label'         => 'Kép pozíció',
				'name'          => 'bc_about_image_position',
				'type'          => 'select',
				'choices'       => [
					'left'  => 'Bal oldalt',
					'right' => 'Jobb oldalt',
				],
				'default_value' => 'right',
			],
			[
				'key'     => 'field_bc_about_stats_instructions',
				'label'   => '',
				'name'    => '',
				'type'    => 'message',
				'message' => 'Statisztikák — minden kitöltött érték+felirat pár egy statisztika kártyaként jelenik meg. Üres slot nem jelenik meg.',
			],
		],
		$stat_slots,
		[
			[
				'key'   => 'field_bc_about_cta_text',
				'label' => 'Gomb felirat',
				'name'  => 'bc_about_cta_text',
				'type'  => 'text',
			],
			[
				'key'   => 'field_bc_about_cta_href',
				'label' => 'Gomb hivatkozás',
				'name'  => 'bc_about_cta_href',
				'type'  => 'text',
			],
			[
				'key'           => 'field_bc_about_color_scheme',
				'label'         => 'Színséma',
				'name'          => 'bc_about_color_scheme',
				'type'          => 'select',
				'choices'       => [
					'light' => 'Világos',
					'dark'  => 'Sötét',
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
