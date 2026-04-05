<?php
/**
 * bc-gallery field group — Image gallery section.
 *
 * Contract: content-model.md §2.3
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [
	'key'      => 'group_bc_gallery',
	'title'    => 'BC Gallery',
	'fields'   => [
		[
			'key'      => 'field_bc_gallery_title',
			'label'    => 'Title',
			'name'     => 'bc_gallery_title',
			'type'     => 'text',
			'required' => 1,
		],
		[
			'key'   => 'field_bc_gallery_subtitle',
			'label' => 'Subtitle',
			'name'  => 'bc_gallery_subtitle',
			'type'  => 'text',
		],
		[
			'key'           => 'field_bc_gallery_show_categories',
			'label'         => 'Show Categories',
			'name'          => 'bc_gallery_show_categories',
			'type'          => 'true_false',
			'default_value' => 0,
		],
		[
			'key'        => 'field_bc_gallery_images',
			'label'      => 'Images',
			'name'       => 'bc_gallery_images',
			'type'       => 'repeater',
			'required'   => 1,
			'min'        => 1,
			'layout'     => 'block',
			'sub_fields' => [
				[
					'key'           => 'field_bc_gallery_images_src',
					'label'         => 'Image',
					'name'          => 'src',
					'type'          => 'image',
					'required'      => 1,
					'return_format' => 'array',
					'preview_size'  => 'medium',
				],
				[
					'key'      => 'field_bc_gallery_images_alt',
					'label'    => 'Alt Text',
					'name'     => 'alt',
					'type'     => 'text',
					'required' => 1,
				],
				[
					'key'   => 'field_bc_gallery_images_category',
					'label' => 'Category',
					'name'  => 'category',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_gallery_images_caption',
					'label' => 'Caption',
					'name'  => 'caption',
					'type'  => 'text',
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
	'menu_order' => 2,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
