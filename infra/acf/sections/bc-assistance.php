<?php
/**
 * bc-assistance field group — Roadside assistance section.
 *
 * Contract: content-model.md §2.8
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [
	'key'      => 'group_bc_assistance',
	'title'    => 'Főoldal — Útmenti segítség',
	'fields'   => [
		[
			'key'      => 'field_bc_assistance_title',
			'label'    => 'Cím',
			'name'     => 'bc_assistance_title',
			'type'     => 'text',
			'required' => 1,
		],
		[
			'key'   => 'field_bc_assistance_subtitle',
			'label' => 'Alcím',
			'name'  => 'bc_assistance_subtitle',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_assistance_description',
			'label' => 'Leírás',
			'name'  => 'bc_assistance_description',
			'type'  => 'textarea',
			'rows'  => 3,
		],
		[
			'key'   => 'field_bc_assistance_request_label',
			'label' => 'Kérés gomb felirat',
			'name'  => 'bc_assistance_request_label',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_assistance_request_href',
			'label' => 'Kérés gomb hivatkozás',
			'name'  => 'bc_assistance_request_href',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_assistance_service_area',
			'label' => 'Szolgáltatási terület',
			'name'  => 'bc_assistance_service_area',
			'type'  => 'text',
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
	'menu_order' => 7,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
