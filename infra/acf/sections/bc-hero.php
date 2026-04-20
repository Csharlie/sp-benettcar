<?php
/**
 * bc-hero field group — Hero section.
 *
 * Contract: content-model.md §2.1
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [
	'key'      => 'group_bc_hero',
	'title'    => 'Főoldal — Bevezető',
	'fields'   => [
		[
			'key'      => 'field_bc_hero_title',
			'label'    => 'Cím',
			'name'     => 'bc_hero_title',
			'type'     => 'text',
			'required' => 1,
		],
		[
			'key'   => 'field_bc_hero_subtitle',
			'label' => 'Alcím',
			'name'  => 'bc_hero_subtitle',
			'type'  => 'text',
		],
		[
			'key'      => 'field_bc_hero_description',
			'label'    => 'Leírás',
			'name'     => 'bc_hero_description',
			'type'     => 'textarea',
			'required' => 1,
			'rows'     => 3,
		],
		[
			'key'   => 'field_bc_hero_primary_cta_text',
			'label' => 'Elsődleges gomb felirat',
			'name'  => 'bc_hero_primary_cta_text',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_hero_primary_cta_href',
			'label' => 'Elsődleges gomb hivatkozás',
			'name'  => 'bc_hero_primary_cta_href',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_hero_secondary_cta_text',
			'label' => 'Másodlagos gomb felirat',
			'name'  => 'bc_hero_secondary_cta_text',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_hero_secondary_cta_href',
			'label' => 'Másodlagos gomb hivatkozás',
			'name'  => 'bc_hero_secondary_cta_href',
			'type'  => 'text',
		],
		[
			'key'           => 'field_bc_hero_background_image',
			'label'         => 'Háttérkép',
			'name'          => 'bc_hero_background_image',
			'type'          => 'image',
			'return_format' => 'array',
			'preview_size'  => 'medium',
		],
		[
			'key'   => 'field_bc_hero_background_image_alt',
			'label' => 'Háttérkép alt szöveg',
			'name'  => 'bc_hero_background_image_alt',
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
	'menu_order' => 0,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
