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
	'title'    => 'BC Contact',
	'fields'   => [
		[
			'key'      => 'field_bc_contact_title',
			'label'    => 'Title',
			'name'     => 'bc_contact_title',
			'type'     => 'text',
			'required' => 1,
		],
		[
			'key'   => 'field_bc_contact_subtitle',
			'label' => 'Subtitle',
			'name'  => 'bc_contact_subtitle',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_contact_description',
			'label' => 'Description',
			'name'  => 'bc_contact_description',
			'type'  => 'textarea',
			'rows'  => 3,
		],
		[
			'key'        => 'field_bc_contact_info',
			'label'      => 'Contact Info',
			'name'       => 'bc_contact_info',
			'type'       => 'group',
			'layout'     => 'block',
			'sub_fields' => [
				[
					'key'   => 'field_bc_contact_info_phone',
					'label' => 'Phone',
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
					'label' => 'Address',
					'name'  => 'address',
					'type'  => 'textarea',
					'rows'  => 2,
				],
			],
		],
		[
			'key'           => 'field_bc_contact_color_scheme',
			'label'         => 'Color Scheme',
			'name'          => 'bc_contact_color_scheme',
			'type'          => 'select',
			'choices'       => [
				'light' => 'Light',
				'dark'  => 'Dark',
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
