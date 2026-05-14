<?php
/**
 * Plugin Name: Spektra Config — Benett Car
 * Description: Benettcar client overlay for the Spektra API plugin. Provides
 *              CORS configuration, ACF builders, and now CF7-namespace CORS
 *              extension for the P14.6 contact form. The spektra-api plugin
 *              picks up SPEKTRA_CLIENT_CONFIG from this overlay automatically.
 * Version:     1.0.0
 * Author:      Spektra
 *
 * Deploy target: /wp-content/plugins/spektra-config/spektra-config-bootstrap.php
 * Companion files in the same directory:
 *   - config.php          (returns the SPEKTRA_CLIENT_CONFIG array)
 *   - acf/builders.php    (registers BC ACF field groups)
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// Admin UX extensions (P14 handover): "Főoldal szerkesztése" menu shortcut.
require_once __DIR__ . '/admin-menu.php';

// CMS login gateway: branded login screen at wp.benettcar.hu root.
require_once __DIR__ . '/cms-gateway.php';

// ---------------------------------------------------------------------------
// CF7 CORS filter — mirror of spektra-api/includes/class-cors.php behavior
// for the /contact-form-7/ REST namespace.
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', static function (): void {
	add_filter(
		'rest_pre_serve_request',
		'spektra_bc_extra_cors_filter',
		// Run AFTER the spektra-api CORS filter (priority 100) so we don't
		// stomp on its headers. Same priority is fine — different routes.
		100,
		4
	);
} );

/**
 * Apply CORS headers to extra REST namespaces declared in the overlay config
 * (e.g. /wp-json/contact-form-7/). Honors the same `allowed_origins` list as
 * the spektra-api plugin to keep one source of truth.
 *
 * @param bool              $served
 * @param \WP_REST_Response $result
 * @param \WP_REST_Request  $request
 * @param \WP_REST_Server   $server
 * @return bool
 */
function spektra_bc_extra_cors_filter(
	bool $served,
	\WP_REST_Response $result,
	\WP_REST_Request $request,
	\WP_REST_Server $server
): bool {
	if ( ! defined( 'SPEKTRA_CLIENT_CONFIG' ) ) {
		return $served;
	}
	$cfg = SPEKTRA_CLIENT_CONFIG;

	$extra_namespaces = $cfg['cors_extra_namespaces'] ?? [];
	if ( empty( $extra_namespaces ) ) {
		return $served;
	}

	$route = $request->get_route();
	$match = false;
	foreach ( $extra_namespaces as $ns ) {
		if ( strpos( $route, (string) $ns ) === 0 ) {
			$match = true;
			break;
		}
	}
	if ( ! $match ) {
		return $served;
	}

	$origin = $request->get_header( 'origin' );
	if ( ! $origin ) {
		return $served;
	}

	$allowed = $cfg['allowed_origins'] ?? [];
	if ( ! in_array( $origin, $allowed, true ) ) {
		header_remove( 'Access-Control-Allow-Origin' );
		header_remove( 'Access-Control-Allow-Methods' );
		header_remove( 'Access-Control-Allow-Credentials' );
		header( 'Vary: Origin' );
		return $served;
	}

	// Origin allowed — emit CORS headers.
	header( 'Access-Control-Allow-Origin: ' . $origin );
	header( 'Vary: Origin' );

	// CF7 needs POST (form submission). Preflight is OPTIONS.
	if ( $request->get_method() === 'OPTIONS' ) {
		header( 'Access-Control-Allow-Methods: POST, OPTIONS' );
		header( 'Access-Control-Allow-Headers: Content-Type, Accept' );
		header( 'Access-Control-Max-Age: 86400' );
		status_header( 204 );
		$served = true;
	}

	return $served;
}
