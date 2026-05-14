<?php
/**
 * BenettCar CMS login gateway — branded front-end for wp.benettcar.hu root.
 *
 * Replaces the raw WordPress frontend at the site root with a branded
 * login page for logged-out visitors, and redirects logged-in users
 * directly to /wp-admin/.
 *
 * Hooks into `template_redirect` (priority 1) — fires before any theme
 * template is loaded, so no theme output leaks through.
 *
 * NOT affected by this module:
 *   /wp-admin/*, /wp-login.php, /wp-json/*, /wp-content/*, /wp-cron.php
 *   WP-CLI contexts
 *
 * Design mirrors the benettcar.hu/v2 login gate (graphite-950 / neon-blue).
 *
 * @package Spektra\Client\Benettcar
 */

defined( 'ABSPATH' ) || exit;

// ---------------------------------------------------------------------------
// Intercept the root front page only.
// ---------------------------------------------------------------------------

add_action( 'template_redirect', static function (): void {
	// Skip WP-CLI — never render a gateway page in CLI context.
	if ( defined( 'WP_CLI' ) && WP_CLI ) {
		return;
	}

	// Only intercept the site root front page.
	// is_front_page() covers both "Your latest posts" and "A static page" modes.
	// is_home() covers the blog index when it IS the front page.
	if ( ! is_front_page() && ! is_home() ) {
		return;
	}

	if ( is_user_logged_in() ) {
		// Logged-in user hitting the root → send straight to the dashboard.
		wp_safe_redirect( admin_url() );
		exit;
	}

	// Logged-out user — render the branded CMS gateway.
	status_header( 200 );
	header( 'Content-Type: text/html; charset=utf-8' );
	header( 'X-Robots-Tag: noindex, nofollow' );

	// wp_login_form() generates a WP-native <form> that POSTs to wp-login.php.
	// Authentication, nonce validation, and cookies are handled by WordPress core.
	$login_html = wp_login_form( [
		'echo'           => false,
		'redirect'       => admin_url(),
		'label_username' => 'Felhasználónév',
		'label_password' => 'Jelszó',
		'label_remember' => 'Emlékezz rám',
		'label_log_in'   => 'Bejelentkezés',
		'remember'       => true,
	] );

	spektra_bc_render_cms_gateway( $login_html );
	exit;

}, 1 );

// ---------------------------------------------------------------------------
// Gateway HTML renderer.
// ---------------------------------------------------------------------------

/**
 * Output the full branded CMS gateway HTML document.
 *
 * @param string $login_html Output of wp_login_form( ['echo' => false, ...] ).
 */
function spektra_bc_render_cms_gateway( string $login_html ): void {
	?>
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>BenettCar CMS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* --- Reset & base ------------------------------------------------------- */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #fff;
    }

    /* --- Page background — graphite-950 + neon-blue radial glow ------------- */
    .bc-page {
      min-height: 100vh;
      background:
        radial-gradient(ellipse at top, rgba(0, 212, 224, 0.08) 0%, transparent 50%),
        linear-gradient(180deg, #0f0f14 0%, #08080c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    /* --- Card --------------------------------------------------------------- */
    .bc-card {
      background-color: #1a1a24;
      border: 1px solid #40404f;
      border-radius: 0.5rem;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,.12), 0 8px 10px -6px rgba(0,0,0,.1);
      padding: 2rem;
      width: 100%;
      max-width: 28rem;
    }

    /* --- Header ------------------------------------------------------------- */
    .bc-header { text-align: center; margin-bottom: 2rem; }

    .bc-badge {
      display: inline-block;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #00D4E0;
      background: rgba(0, 212, 224, 0.1);
      border: 1px solid rgba(0, 212, 224, 0.25);
      border-radius: 9999px;
      padding: 0.2rem 0.65rem;
      margin-bottom: 0.875rem;
    }

    .bc-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .bc-subtitle {
      color: #9ca3af;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    /* --- wp_login_form() output styling ------------------------------------- */
    /* WP wraps each field group in a <p> tag */
    #loginform p { margin-bottom: 1.25rem; }
    #loginform p:last-child { margin-bottom: 0; }

    /* Labels above each input */
    #loginform label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #d1d5db;
      margin-bottom: 0.5rem;
    }

    /* Text / password inputs */
    #loginform input[type="text"],
    #loginform input[type="password"] {
      width: 100%;
      padding: 0.5rem 1rem;
      background-color: #12121a;
      border: 1px solid #4a4a5a;
      color: #fff;
      border-radius: 0.5rem;
      outline: none;
      font-family: inherit;
      font-size: 1rem;
      line-height: 1.5;
      transition: border-color .15s, box-shadow .15s;
    }
    #loginform input[type="text"]::placeholder,
    #loginform input[type="password"]::placeholder { color: #6b7280; }
    #loginform input[type="text"]:focus,
    #loginform input[type="password"]:focus {
      border-color: transparent;
      box-shadow: 0 0 0 2px #00D4E0;
    }

    /* "Emlékezz rám" checkbox row */
    .forgetmenot { display: flex !important; align-items: center; }
    .forgetmenot label {
      display: flex !important;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0 !important;
      font-weight: 400;
      color: #9ca3af;
      cursor: pointer;
    }
    #rememberme {
      accent-color: #00D4E0;
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
      cursor: pointer;
    }

    /* Submit button — wp_login_form() generates <input type="submit" id="wp-submit"> */
    .submit { margin-top: 1.5rem !important; }
    #wp-submit {
      width: 100%;
      background-color: #00D4E0;
      color: #0f0f14;
      font-weight: 600;
      padding: 0.75rem;
      border: none;
      border-radius: 0.5rem;
      font-family: inherit;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color .15s;
    }
    #wp-submit:hover { background-color: #33dde6; }

    /* --- Footer link -------------------------------------------------------- */
    .bc-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #2a2a38;
    }
    .bc-footer a {
      color: #6b7280;
      font-size: 0.875rem;
      text-decoration: none;
      transition: color .15s;
    }
    .bc-footer a:hover { color: #fff; }
  </style>
</head>
<body>
  <div class="bc-page">
    <div class="bc-card">

      <div class="bc-header">
        <div class="bc-badge">Tartalomkezelő</div>
        <h1 class="bc-title">BenettCar CMS</h1>
        <p class="bc-subtitle">Ez a BenettCar tartalomkezelő felülete.</p>
      </div>

      <?php echo $login_html; ?>

      <div class="bc-footer">
        <a href="https://benettcar.hu" target="_blank" rel="noopener noreferrer">
          ↗ Publikus weboldal megnyitása
        </a>
      </div>

    </div>
  </div>
</body>
</html>
	<?php
}
