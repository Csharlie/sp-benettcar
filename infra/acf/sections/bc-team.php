<?php
/**
 * bc-team field group — Team members section.
 *
 * Contract: content-model.md §2.7
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [
	'key'      => 'group_bc_team',
	'title'    => 'BC Team',
	'fields'   => [
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
			'key'        => 'field_bc_team_members',
			'label'      => 'Members',
			'name'       => 'bc_team_members',
			'type'       => 'repeater',
			'required'   => 1,
			'min'        => 1,
			'layout'     => 'block',
			'sub_fields' => [
				[
					'key'      => 'field_bc_team_members_name',
					'label'    => 'Name',
					'name'     => 'name',
					'type'     => 'text',
					'required' => 1,
				],
				[
					'key'      => 'field_bc_team_members_role',
					'label'    => 'Role',
					'name'     => 'role',
					'type'     => 'text',
					'required' => 1,
				],
				[
					'key'           => 'field_bc_team_members_image',
					'label'         => 'Photo',
					'name'          => 'image',
					'type'          => 'image',
					'return_format' => 'array',
					'preview_size'  => 'thumbnail',
				],
				[
					'key'   => 'field_bc_team_members_image_alt',
					'label' => 'Photo Alt Text',
					'name'  => 'image_alt',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_team_members_phone',
					'label' => 'Phone',
					'name'  => 'phone',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_team_members_email',
					'label' => 'Email',
					'name'  => 'email',
					'type'  => 'text',
				],
			],
		],
	],
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
