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
	'title'    => 'Főoldal — Szerviz részletek',
	'fields'   => [
		[
			'key'      => 'field_bc_service_title',
			'label'    => 'Cím',
			'name'     => 'bc_service_title',
			'type'     => 'text',
			'required' => 1,
		],
		[
			'key'   => 'field_bc_service_subtitle',
			'label' => 'Alcím',
			'name'  => 'bc_service_subtitle',
			'type'  => 'text',
		],
		[
			'key'      => 'field_bc_service_description',
			'label'    => 'Leírás',
			'name'     => 'bc_service_description',
			'type'     => 'textarea',
			'required' => 1,
			'rows'     => 3,
		],
		[
			'key'          => 'field_bc_service_services_text',
			'label'        => 'Szolgáltatás tételek',
			'name'         => 'bc_service_services_text',
			'type'         => 'textarea',
			'required'     => 1,
			'rows'         => 8,
			'instructions' => 'Minden sor egy szolgáltatás elem (label). Üres sorok figyelmen kívül maradnak.',
		],
		[
			'key'          => 'field_bc_service_brands_text',
			'label'        => 'Márkák',
			'name'         => 'bc_service_brands_text',
			'type'         => 'textarea',
			'required'     => 1,
			'rows'         => 8,
			'instructions' => 'Minden sor egy márkanév. Üres sorok figyelmen kívül maradnak.',
		],
		[
			'key'        => 'field_bc_service_contact',
			'label'      => 'Kapcsolat',
			'name'       => 'bc_service_contact',
			'type'       => 'group',
			'layout'     => 'block',
			'sub_fields' => [
				[
					'key'   => 'field_bc_service_contact_title',
					'label' => 'Cím',
					'name'  => 'title',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_description',
					'label' => 'Leírás',
					'name'  => 'description',
					'type'  => 'textarea',
					'rows'  => 2,
				],
				[
					'key'   => 'field_bc_service_contact_phone',
					'label' => 'Telefon',
					'name'  => 'phone',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_message_cta_text',
					'label' => 'Üzenet gomb felirat',
					'name'  => 'message_cta_text',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_message_cta_href',
					'label' => 'Üzenet gomb hivatkozás',
					'name'  => 'message_cta_href',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_booking_note',
					'label' => 'Foglalási megjegyzés',
					'name'  => 'booking_note',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_hours',
					'label' => 'Nyitvatartás',
					'name'  => 'hours',
					'type'  => 'text',
				],
				[
					'key'   => 'field_bc_service_contact_weekend_hours',
					'label' => 'Hétvégi nyitvatartás',
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
