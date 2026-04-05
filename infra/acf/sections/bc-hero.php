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
	'title'    => 'BC Hero',
	'fields'   => [
		[
			'key'      => 'field_bc_hero_title',
			'label'    => 'Title',
			'name'     => 'bc_hero_title',
			'type'     => 'text',
			'required' => 1,
		],
		[
			'key'   => 'field_bc_hero_subtitle',
			'label' => 'Subtitle',
			'name'  => 'bc_hero_subtitle',
			'type'  => 'text',
		],
		[
			'key'      => 'field_bc_hero_description',
			'label'    => 'Description',
			'name'     => 'bc_hero_description',
			'type'     => 'textarea',
			'required' => 1,
			'rows'     => 3,
		],
		[
			'key'   => 'field_bc_hero_primary_cta_text',
			'label' => 'Primary CTA Text',
			'name'  => 'bc_hero_primary_cta_text',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_hero_primary_cta_href',
			'label' => 'Primary CTA Link',
			'name'  => 'bc_hero_primary_cta_href',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_hero_secondary_cta_text',
			'label' => 'Secondary CTA Text',
			'name'  => 'bc_hero_secondary_cta_text',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_hero_secondary_cta_href',
			'label' => 'Secondary CTA Link',
			'name'  => 'bc_hero_secondary_cta_href',
			'type'  => 'text',
		],
		[
			'key'           => 'field_bc_hero_background_image',
			'label'         => 'Background Image',
			'name'          => 'bc_hero_background_image',
			'type'          => 'image',
			'return_format' => 'array',
			'preview_size'  => 'medium',
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
