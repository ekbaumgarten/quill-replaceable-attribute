const Embed = Quill.import('blots/embed')

class ReplaceableAttributeBlot extends Embed {
    static create (data) {
        const node = super.create()
        const attributeContent = document.createElement('span')
        attributeContent.innerHTML = data.title
        attributeContent.contentEditable = false
        node.innerHTML = ' '
        node.appendChild(attributeContent)
        node.innerHTML += ' '
        // node.innerHTML += data.title
        node.contentEditable = false
        // console.log('node', node)
        // console.log('data', data)
        return ReplaceableAttributeBlot.setDataValues(node, data)
    }

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