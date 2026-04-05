<?php
/**
 * bc-about field group — About section.
 *
 * Contract: content-model.md §2.6
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [
	'key'      => 'group_bc_about',
	'title'    => 'BC About',
	'fields'   => [
		[
			'key'      => 'field_bc_about_title',
			'label'    => 'Title',
			'name'     => 'bc_about_title',
			'type'     => 'text',
			'required' => 1,
		],
		[
			'key'   => 'field_bc_about_subtitle',
			'label' => 'Subtitle',
			'name'  => 'bc_about_subtitle',
			'type'  => 'text',
		],
		[
			'key'        => 'field_bc_about_content',
			'label'      => 'Content Paragraphs',
			'name'       => 'bc_about_content',
			'type'       => 'repeater',
			'required'   => 1,
			'min'        => 1,
			'layout'     => 'block',
			'sub_fields' => [
				[
					'key'      => 'field_bc_about_content_paragraph',
					'label'    => 'Paragraph',
					'name'     => 'paragraph',
					'type'     => 'textarea',
					'required' => 1,
					'rows'     => 4,
				],
			],
		],
		[
			'key'           => 'field_bc_about_image',
			'label'         => 'Image',
			'name'          => 'bc_about_image',
			'type'          => 'image',
			'return_format' => 'array',
			'preview_size'  => 'medium',
		],
		[
			'key'           => 'field_bc_about_image_position',
			'label'         => 'Image Position',
			'name'          => 'bc_about_image_position',
			'type'          => 'select',
			'choices'       => [
				'left'  => 'Left',
				'right' => 'Right',
			],
			'default_value' => 'right',
		],
		[
			'key'        => 'field_bc_about_stats',
			'label'      => 'Stats',
			'name'       => 'bc_about_stats',
			'type'       => 'repeater',
			'layout'     => 'table',
			'sub_fields' => [
				[
					'key'      => 'field_bc_about_stats_value',
					'label'    => 'Value',
					'name'     => 'value',
					'type'     => 'text',
					'required' => 1,
				],
				[
					'key'      => 'field_bc_about_stats_label',
					'label'    => 'Label',
					'name'     => 'label',
					'type'     => 'text',
					'required' => 1,
				],
			],
		],
		[
			'key'   => 'field_bc_about_cta_text',
			'label' => 'CTA Text',
			'name'  => 'bc_about_cta_text',
			'type'  => 'text',
		],
		[
			'key'   => 'field_bc_about_cta_href',
			'label' => 'CTA Link',
			'name'  => 'bc_about_cta_href',
			'type'  => 'text',
		],
		[
			'key'           => 'field_bc_about_color_scheme',
			'label'         => 'Color Scheme',
			'name'          => 'bc_about_color_scheme',
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
	'menu_order' => 5,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
