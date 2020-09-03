import {Component, ElementRef, EventEmitter, Output, Input, OnChanges, SimpleChanges} from "@angular/core";
import {Keys} from "@sinequa/core/base";
import { AutocompleteItem } from '@sinequa/components/autocomplete';

/**
 * Component containing a form, radio buttons and autocomplete to search
 * through the list labels according to a specific type (public/private) and select one(s) of them
 *
 * The component can be used as custom component in the Action
 * menu's modals.
 */

@Component({
    selector: "sq-labels-autocomplete",
    templateUrl: "./labels-autocomplete.component.html",
    styles: [`
        .sq-dropdown-form {
            min-width: 13rem;
        }
        .input-autocomplete{
            border: none;
            width: 100%;
        }
        .input-autocomplete:focus {
            outline: none;
        }
        .disabled {
            cursor: not-allowed;
        }
    `]
})
export class BsLabelsAutocompleteComponent implements OnChanges {

    /** Event synchronizing the list of selected labels and label's type in the parent component */
    @Output() labelsUpdate = new EventEmitter<string[]>();

    @Input() public: boolean; /** Whether labels are public/private */
    @Input() disableAutocomplete: boolean = false /** Whether the autocomplete input is disabled or not */;
    @Input() allowNewLabels: boolean; /** Define if the user can select public labels out of the suggestions or not */

    constructor(private elementRef: ElementRef) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.public) {
            this.public = changes.public.currentValue;
        }
    }

    private getDropdownItem(): HTMLElement | null {
        if (this.elementRef) {
            let current: HTMLElement | null = this.elementRef.nativeElement as HTMLElement;
            while (current && !current.classList.contains("dropdown-item")) {
                current = current.parentElement;
            }
            return current;
        }
        return null;
    }

    keydown(event: KeyboardEvent) {
        // Intercept tab and set focus to surrounding dropdown-item
        if (event.keyCode === Keys.tab) {
            const dropdownItem = this.getDropdownItem();
            if (dropdownItem) {
                dropdownItem.focus();
                event.preventDefault();
                return false;
            }
        }
        return undefined;
    }

    keypress(event: KeyboardEvent) {
        if (event.keyCode === Keys.enter) {
            // Stop click event firing on surrounding anchor (Firefox)
            event.preventDefault();
            return false;
        }
        return undefined;
    }

    onLabelsItemsChanged(labelsItems: AutocompleteItem[]) {
        this.labelsUpdate.next(labelsItems.map((item => item.display)))
    }
}
