// Using a native custom element to make it "form-associated" (associable with labels, handled by FormData, etc.)
//   (window?.HTMLElement || Object) is a workaround to not break SSR while still having this class type available (without having to wrap everything in a if)
//   typescript assumes a browser environment, so type-wise it resolves to HTMLElement. Server-side it resolves to Object but the class is not instanced
export class InlineInput extends (window?.HTMLElement || Object) {
	static formAssociated = true;
	_internals: ElementInternals;
	_value: string;
	static observedAttributes = ['readonly'];
	_selectionStart: number | null;
	_selectionEnd: number | null;

	constructor() {
		super();
		this._onBeforeInput = this._onBeforeInput.bind(this);
		this._onContentUpdate = this._onContentUpdate.bind(this);
		this._checkSelection = this._checkSelection.bind(this);

		this._internals = this.attachInternals();
		this._internals.role = 'textbox';
		this._value = this.textContent || this.getAttribute('initial-value') || '';
		this._internals.setFormValue(this._value);

		this._selectionStart = null;
		this._selectionEnd = null;
	}

	get form() { return this._internals.form; }
	// get name() { return this.getAttribute('name'); }
	get type() { return 'text'; }
	get validity() { return this._internals.validity; }
	get validationMessage() { return this._internals.validationMessage; }
	get willValidate() { return this._internals.willValidate; }

	get value() { return this._value; }
	set value(v) {
		this._value = v;
		this._internals.setFormValue(v);
		if (this.textContent !== v) {
			const oldStart = this._selectionStart;
			const oldEnd = this._selectionEnd;
			this.textContent = v;
			const textNode = this.firstChild;
			if (textNode?.nodeType === Node.TEXT_NODE && oldStart !== null && oldEnd !== null) {
				const newRange = document.createRange();
				newRange.setStart(textNode, oldStart);
				newRange.setEnd(textNode, oldEnd);
				document.getSelection()?.removeAllRanges();
				document.getSelection()?.addRange(newRange);
			} else {
				document.getSelection()?.setPosition(this, 1);
			}
		}
	}

	get readonly() { return this.hasAttribute('readonly'); }
	set readonly(flag) { this.toggleAttribute('readonly', Boolean(flag)); }

	get selectionStart() { return this._selectionStart; }
	get selectionEnd() { return this._selectionEnd; }

	checkValidity() { return this._internals.checkValidity(); }
	reportValidity() { return this._internals.reportValidity(); }

	_onBeforeInput(e: InputEvent) {
		if (this.readonly || e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') {
			e.preventDefault();
		}
		if (e.data?.includes('\n')) {
			const range = document.getSelection()?.getRangeAt(0);
			if (range) {
				e.preventDefault();
				const toInsert = e.data.replace(/^\n+|\n+$/g, '').replace(/\n+/g, ' ');
				range.deleteContents();
				range.insertNode(document.createTextNode(toInsert));
				range.collapse();
				this.dispatchEvent(new Event('input'));
			}
		}
	}

	_onContentUpdate() {
		const rawValue = this.textContent || '';
		this.value = rawValue.replace(/\s+/g, ' ').trimStart();
	}

	_checkSelection() {
		const oldStart = this._selectionStart;
		const oldEnd = this._selectionEnd;
		const selection = document.getSelection();
		const range = selection && selection.rangeCount > 0 && selection.getRangeAt(0);
		if (!range || !this.contains(range.commonAncestorContainer)) {
			this._selectionStart = null;
			this._selectionEnd = null;
		} else {
			const counter = range.cloneRange();
			counter.selectNodeContents(this);
			counter.setEnd(range.startContainer, range.startOffset);
			this._selectionStart = Math.min(counter.toString().length, this._value.length);
			counter.setEnd(range.endContainer, range.endOffset);
			this._selectionEnd = Math.min(counter.toString().length, this._value.length);
		}
		if (oldStart !== this._selectionStart || oldEnd !== this._selectionEnd) {
			this.dispatchEvent(new CustomEvent('selectionchange'));
		}
	}

	connectedCallback() {
		this.contentEditable = 'plaintext-only';
		this.addEventListener('beforeinput', this._onBeforeInput);
		this.addEventListener('input', this._onContentUpdate, { capture: true });
		document.addEventListener('selectionchange', this._checkSelection);
	}

	disconnectedCallback() {
		this.removeEventListener('beforeinput', this._onBeforeInput);
		this.removeEventListener('input', this._onContentUpdate, { capture: true });
		document.removeEventListener('selectionchange', this._checkSelection);
	}
};

export function register() {
	if (typeof customElements !== 'undefined' && !customElements.get('inline-input')) {
		customElements.define('inline-input', InlineInput);
	}
}