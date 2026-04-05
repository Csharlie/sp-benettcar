<?php
/**
 * bc-services field group — Services overview section.
 *
 * Contract: content-model.md §2.4
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [
	'key'      => 'group_bc_services',
	'title'    => 'BC Services',
	'fields'   => [
		[
			'key'      => 'field_bc_services_title',
			'label'    => 'Title',
			'name'     => 'bc_services_title',
			'type'     => 'text',
			'required' => 1,
		],
		[
			'key'   => 'field_bc_services_subtitle',
			'label' => 'Subtitle',
			'name'  => 'bc_services_subtitle',
			'type'  => 'text',
		],
		[
			'key'        => 'field_bc_services_services',
			'label'      => 'Services',
			'name'       => 'bc_services_services',
			'type'       => 'repeater',
			'required'   => 1,
			'min'        => 1,
			'layout'     => 'block',
			'sub_fields' => [
				[
					'key'      => 'field_bc_services_services_title',
					'label'    => 'Title',
					'name'     => 'title',
					'type'     => 'text',
					'required' => 1,
				],
				[
					'key'           => 'field_bc_services_services_icon',
					'label'         => 'Icon',
					'name'          => 'icon',
					'type'          => 'text',
					'required'      => 1,
					'instructions'  => 'Lucide icon name (e.g., Wrench, DollarSign, AlertCircle)',
				],
				[
					'key'      => 'field_bc_services_services_description',
					'label'    => 'Description',
					'name'     => 'description',
					'type'     => 'textarea',
					'required' => 1,
					'rows'     => 3,
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
	'menu_order' => 3,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
