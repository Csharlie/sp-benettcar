<?php
/**
 * bc-map field group — Map embed section.
 *
 * Contract: content-model.md §2.10
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [
	'key'      => 'group_bc_map',
	'title'    => 'BC Map',
	'fields'   => [
		[
			'key'   => 'field_bc_map_title',
			'label' => 'Title',
			'name'  => 'bc_map_title',
			'type'  => 'text',
		],
		[
			'key'      => 'field_bc_map_query',
			'label'    => 'Map Query',
			'name'     => 'bc_map_query',
			'type'     => 'text',
			'required' => 1,
			'instructions' => 'Google Maps search query (e.g., "Benett Car Business KFT, Cegled")',
		],
		[
			'key'           => 'field_bc_map_height',
			'label'         => 'Map Height (px)',
			'name'          => 'bc_map_height',
			'type'          => 'number',
			'default_value' => 400,
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
	'menu_order' => 9,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
