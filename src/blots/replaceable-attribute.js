import Quill from 'quill'
const Embed = Quill.import('blots/embed')

class ReplaceableAttributeBlot extends Embed {
    constructor (scroll, domNode) {
        super(scroll, domNode)
    }

    static create (data) {
        const node = super.create()
        node.innerHTML = data.title
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