<?php
/**
 * bc-team field group — Team/contact section.
 *
 * P13.3: Slot-Based ACF Free Admin refactor.
 * Replaces repeater with Homepage-local slot fields (max 8 members).
 * Legacy repeater removed from visible admin — data retained in DB.
 *
 * Contract: content-model.md §2.7
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// ── Slot field generator ─────────────────────────────────────────

$slot_fields = [];
$max_slots   = 8;

for ( $i = 1; $i <= $max_slots; $i++ ) {
	$slot_fields[] = [
		'key'          => 'field_bc_team_sep_' . $i,
		'label'        => 'Csapattag ' . $i,
		'type'         => 'accordion',
		'open'         => 0,
		'multi_expand' => 1,
		'endpoint'     => 0,
	];

	$slot_fields[] = [
		'key'     => 'field_bc_team_member_' . $i . '_name',
		'label'   => 'Csapattag ' . $i . ' — Név',
		'name'    => 'bc_team_member_' . $i . '_name',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_team_member_' . $i . '_role',
		'label'   => 'Csapattag ' . $i . ' — Pozíció',
		'name'    => 'bc_team_member_' . $i . '_role',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'           => 'field_bc_team_member_' . $i . '_image',
		'label'         => 'Csapattag ' . $i . ' — Kép',
		'name'          => 'bc_team_member_' . $i . '_image',
		'type'          => 'image',
		'return_format' => 'array',
		'preview_size'  => 'thumbnail',
		'wrapper'       => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_team_member_' . $i . '_image_alt',
		'label'   => 'Csapattag ' . $i . ' — Kép alt szöveg',
		'name'    => 'bc_team_member_' . $i . '_image_alt',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_team_member_' . $i . '_phone',
		'label'   => 'Csapattag ' . $i . ' — Telefon',
		'name'    => 'bc_team_member_' . $i . '_phone',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_team_member_' . $i . '_email',
		'label'   => 'Csapattag ' . $i . ' — Email',
		'name'    => 'bc_team_member_' . $i . '_email',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
}

// ── Field group definition ───────────────────────────────────────

return [
	'key'      => 'group_bc_team',
	'title'    => 'Főoldal — Csapat',
	'fields'   => array_merge(
		[
			[
				'key'      => 'field_bc_team_title',
				'label'    => 'Cím',
				'name'     => 'bc_team_title',
				'type'     => 'text',
				'required' => 1,
			],
			[
				'key'   => 'field_bc_team_subtitle',
				'label' => 'Alcím',
				'name'  => 'bc_team_subtitle',
				'type'  => 'text',
			],
			[
				'key'   => 'field_bc_team_description',
				'label' => 'Leírás',
				'name'  => 'bc_team_description',
				'type'  => 'textarea',
				'rows'  => 3,
			],
			[
				'key'     => 'field_bc_team_instructions',
				'label'   => '',
				'name'    => '',
				'type'    => 'message',
				'message' => 'Itt szerkeszthetők a csapattagok (max 8).<br>'
					. 'Minden kitöltött slot egy tagként jelenik meg.<br>'
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
	'menu_order' => 6,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
