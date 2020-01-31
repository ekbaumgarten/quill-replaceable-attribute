import Quill from 'quill'
const Embed = Quill.import('blots/embed')

class ReplaceableAttributeBlot extends Embed {
    constructor (blot) {
        super(blot)
    }

    static create (data) {
        const node = super.create()
        const label = document.createElement('span')
        const value = document.createElement('span')
        if (data.label === undefined) {
            data.label = data.title
        }

        data.label = data.label === null ? "" : data.label

        label.innerHTML = data.label
        label.setAttribute('contentEditable', true)
        label.className = 'replaceable-attribute-label'
        label.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'enter') {
                event.preventDefault()
                return false
            }
        })
        label.addEventListener('keyup', (event) => {
            const element = event.target
            const text = element.innerText
            node.dataset['label'] = text
            if (text) {
                element.classList.remove('replaceable-attribute-label-empty')
            } else {
                element.classList.add('replaceable-attribute-label-empty')
            }
        })
        node.appendChild(label)

        label.addEventListener('drop', (event) => {
            event.preventDefault()
        })

        value.innerHTML = data.title
        value.setAttribute('contentEditable', false)
        value.className = 'replaceable-attribute-value'
        node.appendChild(value)
        // console.log(super(firstChild))
        return this.setDataValues(node, data)
    }

    //TBD
    // static replace (element, data) {
    //     // const node = super.create()
    //     // element.appendChild()´
    //     element.children[0].innerHTML += data.title
    //     // console.log(element.children[])
    //     return this.setDataValues(element, data)
    // }

    static setDataValues (element, data) {
        const domNode = element
        Object.keys(data).forEach((key) => {
            domNode.dataset[key] = data[key]
        });
        return domNode
    }

    static value (domNode) {
        return domNode.dataset
    }
}

ReplaceableAttributeBlot.blotName = 'replaceableAttribute'
ReplaceableAttributeBlot.tagName = 'span'
ReplaceableAttributeBlot.className = 'replaceable-attribute'

Quill.register(ReplaceableAttributeBlot)