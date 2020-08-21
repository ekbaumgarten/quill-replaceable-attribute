import Quill from 'quill'
import './blots/replaceable-attribute'
import './styles.scss';

import { getEventComposedPath } from './utils/helpers'

const Module = Quill.import('core/module');
// const Delta = Quill.import('delta')
const ReplaceableAttributeBlot = Quill.import('formats/replaceableAttribute')

class ReplaceableAttribute extends Module {
    constructor (quill, options) {
        let defaultOptions = {
            attributesMenuClass: 'ql-replaceable-attributes-menu',
            attributesMenuListClass: 'ql-replaceable-attributes-menu-list',
            attributesMenuListContainerClass: 'ql-replaceable-attributes-menu-list-container',
            attributesListContainerClass: 'ql-replaceable-attributes-menu-container',
            toggleButtonClass: 'ql-replaceable-attributes-menu-toggle-button',
            menus: null
        };

        Object.assign(defaultOptions, options);
        super(quill, defaultOptions)

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
        // this.replaceAttribute = null

        this.quill.container.addEventListener('dblclick', (event) => {
            const attributeNode = this.getTargetNode(event)
            
            if (attributeNode) {
                const attributeBlot = Quill.find(attributeNode)
                const index = this.quill.getIndex(attributeBlot)
                this.quill.setSelection(index, 1, 'user')
                this.quill.theme.tooltip.show()
            }
        }, false)

        this.quill.container.addEventListener('mouseup', ( ) => {
            if (
                event.target.classList.contains('replaceable-attribute-label') || 
                event.target.classList.contains('replaceable-attribute-value')
            ){
                return
            }
            const attributeNode = this.getTargetNode(event)
            const selection = this.quill.getSelection()
            const documentSelection = document.getSelection()
            if (
                documentSelection.type === 'Range' && 
                documentSelection.rangeCount > 0 && 
                selection.length === 0
            ) {
                this.quill.setSelection(selection.index, 1, 'user')
            }
        }, false)
        
        // this.quill.container.addEventListener('click', (event) => {
        //     //event.path is undefined in Safari, FF, Micro Edge
        //     const path = getEventComposedPath(event)
        //     const attributeNode = path.filter(node => {
        //         return node.tagName &&
        //             node.tagName.toUpperCase() === 'SPAN' &&
        //             node.classList.contains('replaceable-attribute')
        //     })[0]

        //     if (attributeNode) {
        //         this.handleAttributeClick(attributeNode, event)
        //     }
        // }, false)

    }

    getTargetNode(event) {
        const path = getEventComposedPath(event)
        const attributeNode = path.filter(node => {
            return node.tagName &&
                node.tagName.toUpperCase() === 'SPAN' &&
                node.classList.contains('replaceable-attribute')
        })[0];
        return attributeNode
    }

    // listenAttribute(attribute) {
    //     const onAttributeClick = this.onAttributeClick.bind(this)
    //     this.quill.container
    //         .querySelector('.replaceable-attribute[data-identifier="' + attribute.identifier + '"]')
    //             .addEventListener('click', onAttributeClick)
    // }

    handleAttributeClick(attributeElement, event) {
        let b = {
            "title": 'Attr replace',
            "identifier": 'replace.identifier',
            "type": "attribute"
        }

        ReplaceableAttributeBlot.replace(attributeElement, b)
        // a.replace(b)
        // console.log(a.remove())
        // let range = this.quill.getSelection(true)
        // this.quill.focus()
        // this.replaceAttribute = a
        // this.openMenu()
        // this.quill.updateContents (new Delta().retain(range.index - 1).delete(1))
        // attributeElement.style.color = 'red'
        // attributeElement.remove()
        // this.quill.focus()
        // console.log(range)
    }

    setAttributesMenuContainerPosition(range) {
        const lineBounds = this.quill.getBounds(range);
        this.attributesMenuContainer.style.display = 'block';
        this.attributesMenuContainer.style.position = 'absolute';
        this.attributesMenuContainer.style.top = lineBounds.top + 'px';
    }

    onEditorChange(eventType, range) {
        if (range === null) this.attributesMenuContainer.style.display = 'none';
        if (range === null || eventType !== Quill.events.SELECTION_CHANGE) return

        this.setAttributesMenuContainerPosition(range)
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
        this.quill.container.classList.add( this.options.attributesMenuClass + '-opened' )
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
        // this.replaceAttribute = null
        this.menuOpened = false
        this.attributesMenu.classList.remove( this.options.attributesMenuClass + '--opened--' + this.menuDirection )
        this.attributesMenu.classList.remove( this.options.attributesMenuClass + '--opened' )
        this.quill.container.classList.remove( this.options.attributesMenuClass + '-opened' )
        document.removeEventListener('click', this.closeMenuOnDocumentClick, true)
    }

    onMenuItemClick(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        // this.quill.focus();
        // if (this.replaceAttribute) {
        //     this.replaceAttribute.remove()
        //     this.quill.update()
        // }
        const range = this.quill.getSelection(true);
        const attributeElement = e.currentTarget;
        let attribute = {}
        Object.assign(attribute, attributeElement.dataset)

        // const tagPosition = range.index + range.length
        // console.log(ReplaceableAttributeBlot);
        // let a = new ReplaceableAttributeBlot()
        // console.log(a)
        // if (this.replaceAttribute) {
        //     this.replaceAttribute.remove()
        //     // console.log(range)
        //     // this.quill.updateContents(new Delta().retain(range.index - 1).delete(1))
        // }
        this.quill.deleteText(range.index, range.length)
        this.quill.insertEmbed(range.index, 'replaceableAttribute', attribute, Quill.sources.USER)
        // this.listenAttribute(attribute)
        // this.quill.insertText(range.index + 1, ' ', Quill.sources.USER)
        this.quill.setSelection(range.index + 1, Quill.sources.USER)

        this.closeMenu()
        // console.log(attribute.getAttribute('data-identifier'), attribute.getAttribute('data-title'))
    }

    renderMenuItem(attribute) {
        const element = document.createElement('li');
        element.innerText = attribute.title;
        element.setAttribute('data-identifier', attribute.identifier);
        element.setAttribute('data-title', attribute.title);
        element.setAttribute('data-type', attribute.type || 'attribute');
        element.onclick = this.onMenuItemClick.bind(this);
        
        return element;
    }

    renderMenuGroup(group) {
        const element = document.createElement('div');
        element.className = this.options.attributesMenuListContainerClass
        const groupTitle = document.createElement('span');
        groupTitle.className = this.options.attributesMenuListClass + '-title'
        
        groupTitle.innerText = group.title;
        const attributesList = document.createElement('ul');
        attributesList.className = this.options.attributesMenuListClass
        for (let attribute of group.attributes) {
            attributesList.appendChild(
                this.renderMenuItem(attribute)
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
                this.renderMenuGroup(group)
            );
        }
    }
}

Quill.register('modules/replaceable-attribute', ReplaceableAttribute);

export default ReplaceableAttribute;