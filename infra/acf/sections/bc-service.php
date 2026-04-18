<?php
/**
 * bc-service field group — Single service detail section.
 *
 * P13.2: Repeaters replaced with ACF Free textarea fields.
 * - bc_service_services repeater → bc_service_services_text textarea (split by newline)
 * - bc_service_brands repeater → bc_service_brands_text textarea (split by newline)
 * Legacy repeater data retained in DB.
 *
 * Contract: content-model.md §2.5
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

return [
	'key'      => 'group_bc_service',
	'title'    => 'BC Service',
	'fields'   => [
		[
			'key'      => 'field_bc_service_title',
			'label'    => 'Title',
			'name'     => 'bc_service_title',
			'type'     => 'text',
			'required' => 1,
		],
		[
			'key'   => 'field_bc_service_subtitle',
			'label' => 'Subtitle',
			'name'  => 'bc_service_subtitle',
			'type'  => 'text',
		],
		[
			'key'      => 'field_bc_service_description',
			'label'    => 'Description',
			'name'     => 'bc_service_description',
			'type'     => 'textarea',
			'required' => 1,
			'rows'     => 3,
		],
		[
			'key'          => 'field_bc_service_services_text',
			'label'        => 'Service Items',
			'name'         => 'bc_service_services_text',
			'type'         => 'textarea',
			'required'     => 1,
			'rows'         => 8,
			'instructions' => 'Minden sor egy szolgáltatás elem (label). Üres sorok figyelmen kívül maradnak.',
		],
		[
			'key'          => 'field_bc_service_brands_text',
			'label'        => 'Brands',
			'name'         => 'bc_service_brands_text',
			'type'         => 'textarea',
			'required'     => 1,
			'rows'         => 8,
			'instructions' => 'Minden sor egy márkanév. Üres sorok figyelmen kívül maradnak.',
		],
		[
			'key'        => 'field_bc_service_contact',
			'label'      => 'Contact',
			'name'       => 'bc_service_contact',
			'type'       => 'group',
			'layout'     => 'block',
			'sub_fields' => [
				[
					'key'   => 'field_bc_service_contact_title',
					'label' => 'Title',
					'name'  => 'title',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_description',
					'label' => 'Description',
					'name'  => 'description',
					'type'  => 'textarea',
					'rows'  => 2,
				],
				[
					'key'   => 'field_bc_service_contact_phone',
					'label' => 'Phone',
					'name'  => 'phone',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_message_cta_text',
					'label' => 'Message CTA Text',
					'name'  => 'message_cta_text',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_message_cta_href',
					'label' => 'Message CTA Link',
					'name'  => 'message_cta_href',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_booking_note',
					'label' => 'Booking Note',
					'name'  => 'booking_note',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_hours',
					'label' => 'Hours',
					'name'  => 'hours',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_weekend_hours',
					'label' => 'Weekend Hours',
					'name'  => 'weekend_hours',
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
	'menu_order' => 4,
	'position'   => 'normal',
	'style'      => 'default',
	'active'     => true,
];
