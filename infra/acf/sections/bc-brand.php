<?php
/**
 * bc-brand field group — Brand logos section.
 *
 * Contract: content-model.md §2.2
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [
	'key'      => 'group_bc_brand',
	'title'    => 'BC Brand',
	'fields'   => [
		[
			'key'   => 'field_bc_brand_title',
			'label' => 'Title',
			'name'  => 'bc_brand_title',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_brand_description',
			'label' => 'Description',
			'name'  => 'bc_brand_description',
			'type'  => 'textarea',
			'rows'  => 3,
		],
		[
			'key'        => 'field_bc_brand_brands',
			'label'      => 'Brands',
			'name'       => 'bc_brand_brands',
			'type'       => 'repeater',
			'required'   => 1,
			'min'        => 1,
			'layout'     => 'block',
			'sub_fields' => [
				[
					'key'      => 'field_bc_brand_brands_name',
					'label'    => 'Name',
					'name'     => 'name',
					'type'     => 'text',
					'required' => 1,
				],
				[
					'key'           => 'field_bc_brand_brands_logo',
					'label'         => 'Logo',
					'name'          => 'logo',
					'type'          => 'image',
					'return_format' => 'array',
					'preview_size'  => 'thumbnail',
				],
				[
					'key'   => 'field_bc_brand_brands_alt',
					'label' => 'Alt Text',
					'name'  => 'alt',
					'type'  => 'text',
				],
				[
					'key'           => 'field_bc_brand_brands_invert',
					'label'         => 'Invert (dark bg)',
					'name'          => 'invert',
					'type'          => 'true_false',
					'default_value' => 0,
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
	'menu_order' => 1,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
