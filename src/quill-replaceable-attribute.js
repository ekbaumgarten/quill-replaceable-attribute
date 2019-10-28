import './blots/replaceable-attribute'
import './styles.scss';

class ReplaceableAttribute {
    constructor (quill, options) {
        this.quill = quill;
        this.options = {
            attributesMenuClass: 'ql-replaceable-attributes-menu',
            attributesMenuListClass: 'ql-replaceable-attributes-menu-list',
            attributesMenuListContainerClass: 'ql-replaceable-attributes-menu-list-container',
            attributesListContainerClass: 'ql-replaceable-attributes-menu-container',
            toggleButtonClass: 'ql-replaceable-attributes-menu-toggle-button',
            menus: null
        };

        Object.assign(this.options, options);

        this.menu = null;
        this.menuOpened = false;
        this.menuDirection = 'below';
        this.attributesMenuContainer = document.createElement('div');
        this.attributesMenuContainer.className = this.options.attributesListContainerClass;// 'saipos-layout-editor-attributes-menu';
        this.attributesMenuContainer.style.display = 'none';
        
        this.listToggleBtn = document.createElement('button')
        this.listToggleBtn.className = this.options.toggleButtonClass
        this.listToggleBtn.appendChild(document.createElement('i'))
        this.listToggleBtn.onclick = this.listToggleButtonClick.bind(this)
        this.attributesMenuContainer.appendChild(this.listToggleBtn)
        
        this.attributesMenu = document.createElement('div');
        this.attributesMenu.className = this.options.attributesMenuClass;
        this.attributesMenuContainer.appendChild(this.attributesMenu);
        
        this.quill.container.appendChild(this.attributesMenuContainer);
        this.quill.on(Quill.events.EDITOR_CHANGE, this.onEditorChange.bind(this))
        
        this.closeMenuOnDocumentClick = this.closeMenuOnDocumentClick.bind(this);
        this.renderMenu(this.options.menus)
    }

    onEditorChange(eventType, range) {
        if (range === null || eventType !== Quill.events.SELECTION_CHANGE) return;
        
        if (range.length === 0) {
            const lineBounds = this.quill.getBounds(range);
            this.attributesMenuContainer.style.display = 'block';
            this.attributesMenuContainer.style.position = 'absolute';
            this.attributesMenuContainer.style.top = lineBounds.top + 'px';
        }
    }

    listToggleButtonClick(e) {
        this.quill.focus()
        this.openMenu()
    }

    closeMenuOnDocumentClick(e) {
        if (!this.attributesMenu.contains(e.target)) {
            this.closeMenu()
        }
    }

    openMenu() {
        this.menuOpened = true
        this.attributesMenu.classList.add( this.options.attributesMenuClass + '--opened' )
        this.setMenuPosition()
        document.addEventListener('click', this.closeMenuOnDocumentClick, true)
    }

    setMenuPosition() {
        if (!this.menuOpened) return
        const menuRect = this.attributesMenu.getBoundingClientRect()
        const spaceAbove = this.listToggleBtn.getBoundingClientRect().top
        const windowViewport = window.innerHeight
        const spaceBelow = windowViewport - menuRect.bottom
        
        this.attributesMenu.classList.remove( this.options.attributesMenuClass + '--opened--' + this.menuDirection )
        this.menuDirection = spaceBelow < 0 && spaceAbove > menuRect.height ? 'above' : 'below'
        this.attributesMenu.classList.add( this.options.attributesMenuClass + '--opened--' + this.menuDirection )
    }

    closeMenu() {
        this.menuOpened = false
        this.attributesMenu.classList.remove( this.options.attributesMenuClass + '--opened' )
        document.removeEventListener('click', this.closeMenuOnDocumentClick, true)
    }

    attributeClick(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        this.quill.focus();
        const range = quill.getSelection();
        const attribute = e.currentTarget;
        const tagPosition = range.index + range.length
        this.quill.insertEmbed(tagPosition, 'replaceableAttribute', {
            identifier: attribute.getAttribute('data-identifier'),
            title: attribute.getAttribute('data-title')
        }, Quill.sources.USER)
        
        this.quill.insertText(tagPosition + 1, ' ', Quill.sources.USER)
        this.quill.setSelection(tagPosition + 2, Quill.sources.USER)

        this.closeMenu()
        // console.log(attribute.getAttribute('data-identifier'), attribute.getAttribute('data-title'))
    }

    renderAttribute(attribute) {
        const element = document.createElement('li');
        element.innerText = attribute.title;
        element.setAttribute('data-identifier', attribute.identifier);
        element.setAttribute('data-title', attribute.title);
        // element.data.attribute = attribute;
        element.onclick = this.attributeClick.bind(this);
        
        return element;
    }

    renderGroup(group) {
        const element = document.createElement('div');
        element.className = this.options.attributesMenuListContainerClass
        const groupTitle = document.createElement('span');
        groupTitle.className = this.options.attributesMenuListClass + '-title'
        
        groupTitle.innerText = group.title;
        const attributesList = document.createElement('ul');
        attributesList.className = this.options.attributesMenuListClass
        for (let attribute of group.attributes) {
            attributesList.appendChild(
                this.renderAttribute(attribute)
            );
        }
        element.appendChild(groupTitle);
        element.appendChild(attributesList);
        return element;
    }

    renderMenu(data) {
        // console.log('renderMenu', data)
        // this.menuData = data;
        while (this.attributesMenu.lastElementChild) {
            this.attributesMenu.removeChild(this.attributesMenu.lastElementChild);
        }

        for (let group of data) {
            this.attributesMenu.appendChild(
                this.renderGroup(group)
            );
        }
    }
}

Quill.register('modules/replaceable-attribute', ReplaceableAttribute);

export default ReplaceableAttribute;