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
		'key'     => 'field_bc_team_sep_' . $i,
		'label'   => '',
		'name'    => '',
		'type'    => 'message',
		'message' => '<strong>--- Tag ' . $i . ' ---</strong>',
		'wrapper' => [ 'width' => '100' ],
	];

	$slot_fields[] = [
		'key'     => 'field_bc_team_member_' . $i . '_name',
		'label'   => 'Tag ' . $i . ' — Name',
		'name'    => 'bc_team_member_' . $i . '_name',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_team_member_' . $i . '_role',
		'label'   => 'Tag ' . $i . ' — Role',
		'name'    => 'bc_team_member_' . $i . '_role',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'           => 'field_bc_team_member_' . $i . '_image',
		'label'         => 'Tag ' . $i . ' — Image',
		'name'          => 'bc_team_member_' . $i . '_image',
		'type'          => 'image',
		'return_format' => 'array',
		'preview_size'  => 'thumbnail',
		'wrapper'       => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_team_member_' . $i . '_image_alt',
		'label'   => 'Tag ' . $i . ' — Image Alt Text',
		'name'    => 'bc_team_member_' . $i . '_image_alt',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_team_member_' . $i . '_phone',
		'label'   => 'Tag ' . $i . ' — Phone',
		'name'    => 'bc_team_member_' . $i . '_phone',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
	$slot_fields[] = [
		'key'     => 'field_bc_team_member_' . $i . '_email',
		'label'   => 'Tag ' . $i . ' — Email',
		'name'    => 'bc_team_member_' . $i . '_email',
		'type'    => 'text',
		'wrapper' => [ 'width' => '50' ],
	];
}

// ── Field group definition ───────────────────────────────────────

return [
	'key'      => 'group_bc_team',
	'title'    => 'BC Team',
	'fields'   => array_merge(
		[
			[
				'key'      => 'field_bc_team_title',
				'label'    => 'Title',
				'name'     => 'bc_team_title',
				'type'     => 'text',
				'required' => 1,
			],
			[
				'key'   => 'field_bc_team_subtitle',
				'label' => 'Subtitle',
				'name'  => 'bc_team_subtitle',
				'type'  => 'text',
			],
			[
				'key'   => 'field_bc_team_description',
				'label' => 'Description',
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
	'menu_order' => 6,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
