// Current index into the gallery items
let current = 0;

const node_to_item = item => {
	const title = item.childNodes[0].title;
	const url   = item.childNodes[0].href;
	const alt   = item.childNodes[0].childNodes[0].alt;
	return {
		title, url, alt
	};
};

const modal = document.querySelector('#gallery-modal')
const container = modal.querySelector('div')
const figure = modal.querySelector('figure');
const img = figure.querySelector('img');
const caption = figure.querySelector('figcaption');
const gallery = document.querySelector('#gallery');
const counter = modal.querySelector('p');

const items = Array
	.from(document.querySelectorAll('#gallery > li'))
	.map(node_to_item);

function set_display(i) {
	const item = items[i];
	img.src = item.url;
	img.alt = item.alt;
	caption.textContent = item.title;
	counter.textContent = `${current + 1} of ${items.length}`
}

for (const [i, a] of gallery.querySelectorAll('li > a').entries()) {
	const href = a.href;
	a.onclick = () => {
		set_display(i);
		current = i;
		show_modal(modal);
		return false;  // Prevent the browser from following the link
	};
}

function show_modal(modal) {
	modal.classList = ['shown']
}

function hide_modal(modal) {
	modal.classList = ['hidden']
}

function go_previous() {
	// Add one full rotation to prevent negative numbers
	current = (current - 1 + items.length) % items.length;
	set_display(current);
}

function go_next() {
	current = (current + 1) % items.length;
	set_display(current);
}

modal.querySelector('button').onclick = () => hide_modal(modal);
modal.addEventListener('click', event => {
	if (event.target !== modal && event.target !== container) {
		return;
	}
	hide_modal(modal);
});

modal
	.querySelector('button#gallery-modal-previous')
	.addEventListener('click', go_previous);

modal
	.querySelector('button#gallery-modal-next')
	.addEventListener('click', go_next);

document.addEventListener('keydown', event => {
	const key = event.key
	switch (key) {
		case 'ArrowLeft' : go_previous(); break;
		case 'ArrowRight': go_next();     break;
	}
})
