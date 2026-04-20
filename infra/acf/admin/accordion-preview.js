(function ($) {
	'use strict';

	const EMPTY_LABEL = 'Üres tartalom';

	const imageSlots = [];
	const textSlots = [];

	for (let i = 1; i <= 10; i += 1) {
		imageSlots.push({
			accordionKey: `field_bc_brand_sep_${i}`,
			imageName: `bc_brand_brand_${i}_logo`,
			textName: `bc_brand_brand_${i}_name`,
			slotLabel: `Márka ${i}`,
			kind: 'brand',
		});
		imageSlots.push({
			accordionKey: `field_bc_gallery_sep_${i}`,
			imageName: `bc_gallery_image_${i}_src`,
			textName: `bc_gallery_image_${i}_caption`,
			altTextName: `bc_gallery_image_${i}_alt`,
			slotLabel: `Kép ${i}`,
			kind: 'gallery',
		});
	}

	for (let i = 1; i <= 8; i += 1) {
		imageSlots.push({
			accordionKey: `field_bc_team_sep_${i}`,
			imageName: `bc_team_member_${i}_image`,
			textName: `bc_team_member_${i}_name`,
			slotLabel: `Csapattag ${i}`,
			kind: 'team',
		});
	}

	for (let i = 1; i <= 6; i += 1) {
		textSlots.push({
			accordionKey: `field_bc_services_sep_${i}`,
			primaryTextName: `bc_services_service_${i}_title`,
			secondaryTextName: `bc_services_service_${i}_icon`,
			slotLabel: `Szolgáltatás ${i}`,
			kind: 'service',
		});
		textSlots.push({
			accordionKey: `field_bc_about_stat_sep_${i}`,
			primaryTextName: `bc_about_stat_${i}_value`,
			secondaryTextName: `bc_about_stat_${i}_label`,
			slotLabel: `Statisztika ${i}`,
			kind: 'stat',
		});
	}

	function findAccordionTitle(accordionKey) {
		const $accordion = $(`.acf-field-accordion[data-key="${accordionKey}"]`).first();
		if (!$accordion.length) {
			return $();
		}

		const $title = $accordion.children('.acf-accordion-title').first();
		if ($title.length) {
			return $title;
		}

		return $accordion.find('.acf-accordion-title').first();
	}

	function findFieldByName(name) {
		return $(`.acf-field[data-name="${name}"]`).first();
	}

	function readTextValue(name) {
		if (!name) {
			return '';
		}

		const $field = findFieldByName(name);
		if (!$field.length) {
			return '';
		}

		const $input = $field.find('input[type="text"], textarea').first();
		if (!$input.length) {
			return '';
		}

		return String($input.val() || '').trim();
	}

	function readImageSrc(name) {
		const $field = findFieldByName(name);
		if (!$field.length) {
			return '';
		}

		const $img = $field.find('.acf-image-uploader .image-wrap img').first();
		if ($img.length) {
			return String($img.attr('src') || '').trim();
		}

		return '';
	}

	function ensureMount($title) {
		let $mount = $title.find('> .spk-acf-preview');
		if ($mount.length) {
			$mount.empty();
			$title.addClass('spk-has-preview');
			return $mount;
		}

		$mount = $('<span class="spk-acf-preview" />');
		$title.prepend($mount);
		$title.addClass('spk-has-preview');
		return $mount;
	}

	function addText($mount, text) {
		if (!text) {
			return;
		}

		$mount.append(
			$('<span class="spk-acf-preview-text" />').text(text)
		);
	}

	function addThumb($mount, src, kind) {
		const $thumb = $('<span class="spk-acf-preview-thumb" />').attr('data-kind', kind || '');
		if (src) {
			$thumb.append($('<img alt="" />').attr('src', src));
		} else {
			$thumb.addClass('is-empty');
		}
		$mount.append($thumb);
	}

	function composeSlotText(slotLabel, primary, secondary) {
		const value = primary || secondary || EMPTY_LABEL;
		return `${slotLabel} - ${value}`;
	}

	function updateImageSlot(slot) {
		const $title = findAccordionTitle(slot.accordionKey);
		if (!$title.length) {
			return;
		}

		const $mount = ensureMount($title);
		const imageSrc = readImageSrc(slot.imageName);
		addThumb($mount, imageSrc, slot.kind);

		const primary = readTextValue(slot.textName);
		const secondary = readTextValue(slot.altTextName);
		addText($mount, composeSlotText(slot.slotLabel, primary, secondary));
	}

	function updateTextSlot(slot) {
		const $title = findAccordionTitle(slot.accordionKey);
		if (!$title.length) {
			return;
		}

		const $mount = ensureMount($title);
		const primary = readTextValue(slot.primaryTextName);
		const secondary = readTextValue(slot.secondaryTextName);
		const text = [primary, secondary].filter(Boolean).join(' · ');
		addText($mount, `${slot.slotLabel} - ${text || EMPTY_LABEL}`);
	}

	function refreshAll() {
		imageSlots.forEach(updateImageSlot);
		textSlots.forEach(updateTextSlot);
	}

	let refreshTimer = null;
	function scheduleRefresh() {
		if (refreshTimer) {
			window.clearTimeout(refreshTimer);
		}
		refreshTimer = window.setTimeout(refreshAll, 50);
	}

	$(document).on(
		'change keyup input',
		'.acf-field input, .acf-field textarea, .acf-field select',
		scheduleRefresh
	);

	if (window.acf && typeof window.acf.addAction === 'function') {
		window.acf.addAction('ready', scheduleRefresh);
		window.acf.addAction('append', scheduleRefresh);
		window.acf.addAction('show_field', scheduleRefresh);
	}

	const observer = new MutationObserver(scheduleRefresh);
	observer.observe(document.body, {
		attributes: true,
		childList: true,
		subtree: true,
		attributeFilter: ['src', 'class'],
	});

	scheduleRefresh();
})(jQuery);
