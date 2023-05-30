// SPDX-License-Identifier: MIT

// Copyright (c) 2023 Alejandro "HiPhish" Sanchez
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice (including the next
// paragraph) shall be included in all copies or substantial portions of the
// Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt Expat
'use strict'

/**
 * Object which acts as a facade to the modal DOM element.
 */
export class Modal {
	constructor(modal) {
		this.modal = modal;
		const container = modal.appendChild(document.createElement('div'));

		// Set up the previous/next buttons
		this.next_button = modal.appendChild(document.createElement('button'));
		this.prev_button = modal.appendChild(document.createElement('button'));
		this.prev_button.type = 'button';
		this.prev_button.id = 'gallery-modal-previous';
		this.prev_button.title = 'Previous';
		this.next_button.type = 'button';
		this.next_button.id = 'gallery-modal-next';
		this.next_button.title = 'Next';

		const close = container.appendChild(document.createElement('button'));
		close.type = 'button';
		close.className = 'gallery-modal-close';
		close.title = 'Close';
		close.textContent = '×';
		close.onclick = () => this.hide();


		const figure = container.appendChild(document.createElement('figure'));

		this.image = figure.appendChild(document.createElement('img'));
		this.caption = figure.appendChild(document.createElement('figcaption'));
		this.indicator = container.appendChild(document.createElement('p'))

		this.image.src = '';
		this.image.alt = '';

		// Set up event handlers on the modal and its elements
		modal.addEventListener('click', event => {
			if (event.target !== modal && event.target !== container) {
				return;
			}
			this.hide();
		});
	}

	show() {
		this.modal.classList = ['shown'];
	}

	hide() {
		this.modal.classList = ['hidden'];
	}

	set_display(item, counter) {
		this.image.src = item.url;
		this.image.alt = item.alt;
		this.caption.textContent = item.title;
		this.indicator.textContent = counter;
	}
}

export class Gallery {
	constructor(thumbnails, modal) {
		this.size = thumbnails.length;
		this.current = 0;
		this.modal = modal;

		this.items = thumbnails.map((thumbnail, i) => {
			const title = thumbnail.title;
			const url   = thumbnail.href;
			const alt   = thumbnail.childNodes[0].alt;
			const result = {title, url, alt};

			thumbnail.onclick = () => {
				this.current = i;
				this.modal.set_display(result, this.counter);
				this.modal.show();
				return false;  // Prevent the browser from following the link
			}

			return result;
		})

		// Set up callbacks for navigation
		modal
			.prev_button
			.addEventListener('click', () => this.prev());
		modal
			.next_button
			.addEventListener('click', () => this.next());
		document.addEventListener('keydown', event => {
			const key = event.key;
			switch (key) {
				case 'ArrowLeft' : this.prev(); break;
				case 'ArrowRight': this.next(); break;
			}
		})
	}

	get counter() {
		return `${this.current + 1} of ${this.size}`;
	}

	prev() {
		this.current = (this.current - 1 + this.size) % this.size;
		this.modal.set_display(this.items[this.current], this.counter);
	}

	next() {
		this.current = (this.current + 1) % this.size;
		this.modal.set_display(this.items[this.current], this.counter);
	}
}
// @license-end
