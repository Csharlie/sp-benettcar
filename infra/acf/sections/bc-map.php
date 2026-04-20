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
	'title'    => 'Főoldal — Térkép',
	'fields'   => [
		[
			'key'   => 'field_bc_map_title',
			'label' => 'Cím',
			'name'  => 'bc_map_title',
			'type'  => 'text',
		],
		[
			'key'      => 'field_bc_map_query',
			'label'    => 'Google Maps keresőkifejezés',
			'name'     => 'bc_map_query',
			'type'     => 'text',
			'required' => 1,
			'instructions' => 'Google Maps keresési kifejezés (pl. "Benett Car Business KFT, Cegléd")',
		],
		[
			'key'           => 'field_bc_map_height',
			'label'         => 'Térkép magasság (képpont)',
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
