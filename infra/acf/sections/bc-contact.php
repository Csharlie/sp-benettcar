<?php
/**
 * bc-contact field group — Contact section.
 *
 * Contract: content-model.md §2.9
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [
	'key'      => 'group_bc_contact',
	'title'    => 'Főoldal — Kapcsolat',
	'fields'   => [
		[
			'key'      => 'field_bc_contact_title',
			'label'    => 'Cím',
			'name'     => 'bc_contact_title',
			'type'     => 'text',
			'required' => 1,
		],
		[
			'key'   => 'field_bc_contact_subtitle',
			'label' => 'Alcím',
			'name'  => 'bc_contact_subtitle',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_contact_description',
			'label' => 'Leírás',
			'name'  => 'bc_contact_description',
			'type'  => 'textarea',
			'rows'  => 3,
		],
		[
			'key'        => 'field_bc_contact_info',
			'label'      => 'Kapcsolati adatok',
			'name'       => 'bc_contact_info',
			'type'       => 'group',
			'layout'     => 'block',
			'sub_fields' => [
				[
					'key'   => 'field_bc_contact_info_phone',
					'label' => 'Telefon',
					'name'  => 'phone',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_contact_info_email',
					'label' => 'Email',
					'name'  => 'email',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_contact_info_address',
					'label' => 'Postacím',
					'name'  => 'address',
					'type'  => 'textarea',
					'rows'  => 2,
				],
			],
		],
		[
			'key'           => 'field_bc_contact_color_scheme',
			'label'         => 'Színséma',
			'name'          => 'bc_contact_color_scheme',
			'type'          => 'select',
			'choices'       => [
				'light' => 'Világos',
				'dark'  => 'Sötét',
			],
			'default_value' => 'light',
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
	'menu_order' => 8,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
