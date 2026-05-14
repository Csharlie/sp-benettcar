<?php
/**
 * BenettCar admin menu extensions — P14 handover UX.
 *
 * Adds a "Főoldal szerkesztése" shortcut to the WP admin sidebar so the
 * client can reach the homepage edit screen in one click instead of
 * navigating Pages → Home → Edit.
 *
 * Implementation notes:
 *  - Uses `get_option('page_on_front')` to resolve the front page ID
 *    dynamically — no hardcoded post IDs.
 *  - Falls back to a translated admin notice if no static front page is
 *    configured (Settings → Reading → "A static page" not selected).
 *  - Redirect fires on `load-toplevel_page_*` before any output is sent,
 *    so headers are always safe.
 *  - The default Pages admin menu is intentionally left untouched.
 *
 * "Meta Boxes" label limitation:
 *  The "Meta Boxes" section heading visible above ACF field groups in the
 *  Gutenberg block editor is a WordPress core JavaScript string rendered
 *  by @wordpress/edit-post. It cannot be renamed via PHP gettext filters
 *  (JS strings are not passed through __()). A JavaScript DOM-manipulation
 *  approach would be fragile across WP updates, so it is left as-is.
 *  The ACF field group titles themselves ("Főoldal — Bevezető" etc.) are
 *  already in Hungarian and visible when each group is expanded.
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// ---------------------------------------------------------------------------
// Register the admin menu entry.
// ---------------------------------------------------------------------------

add_action( 'admin_menu', static function (): void {
	add_menu_page(
		'Főoldal',               // page <title>
		'Főoldal',               // sidebar label
		'edit_pages',            // required capability
		'bc-fooldal-szerkesztese', // slug (used by load hook below)
		'__return_empty_string', // content callback — page never renders, redirect fires first
		'dashicons-home',        // WP dashicon — house icon
		3                        // position: just below Dashboard, above separator
	);
} );

// ---------------------------------------------------------------------------
// Redirect (or show notice) when the menu item is clicked.
// The load-toplevel_page_* hook fires before headers are sent.
// ---------------------------------------------------------------------------

add_action( 'load-toplevel_page_bc-fooldal-szerkesztese', static function (): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'Nincs jogosultságod ehhez a művelethez.', 'spektra-bc' ) );
	}

	$front_page_id = (int) get_option( 'page_on_front' );

	if ( $front_page_id > 0 ) {
		wp_safe_redirect( admin_url( 'post.php?post=' . $front_page_id . '&action=edit' ) );
		exit;
	}

	// No static front page configured — show a helpful admin notice on the
	// otherwise-empty page (the __return_empty_string callback renders nothing).
	add_action( 'admin_notices', static function (): void {
		echo '<div class="notice notice-warning"><p>'
			. '<strong>Benett Car — Főoldal szerkesztése:</strong> '
			. 'Nincs beállítva statikus főoldal. '
			. 'Lépj ide: <a href="' . esc_url( admin_url( 'options-reading.php' ) ) . '">'
			. 'Beállítások → Olvasás</a>, és a <em>„A főoldal megjelenítése"</em> '
			. 'legyen <em>„Statikus oldal"</em>.'
			. '</p></div>';
	} );
} );
