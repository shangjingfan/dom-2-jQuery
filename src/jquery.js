window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
  let elements
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === '<') {
      //创建div
      elements = [createElement(selectorOrArrayOrTemplate)]
    } else {
      //查找div
      elements = document.querySelectorAll(selectorOrArrayOrTemplate)
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArrayOrTemplate
  }

  function createElement(string) {
    const container = document.createElement('template')
    container.innerHTML = string.trim()
    return container.content.firstChild
  }

  // api可以操作elements
  // 不能这么写：api = {__proto__ : jQuery.prototype}
  // Object.create意思是创建一个对象api， api.__proto__ === jQuery.prototype
  const api = Object.create(jQuery.prototype)

  Object.assign(api, {
    elements: elements,
    oldApi: selectorOrArrayOrTemplate.oldApi // find函数return的时候传进来的
  })
  // 相当于
  // api.elements = elements;
  // api.oldApi = selectorOrArrayOrTemplate.oldApi
  return api
}

jQuery.fn = jQuery.prototype = { //两个等号，从右往左执行
  constructor: jQuery,
  jquery: true,
  on(eventType, selector, fn){ //委托函数
    let element = this.get(0)
    if(!(element instanceof Element)){
      element = document.querySelector(element)
    }
    element.addEventListener(eventType, e=>{
      let t = e.target
      while(!(t.matches(selector))){
        if (element === t) {
          t = null
          break
        }
        t = t.parentNode
      }
      t && fn.call(t, e, t)
    })
    return this
  },
  get(index) {
    // console.log(this.elements[1])
    return this.elements[index]
  },
  appendTo(node) {
    if (node instanceof Element) { // Element:元素
      console.log("appendTo---Element")
      this.each(el => node.appendChild(el))

    } else if (node.jquery === true) {// 意思是node是一个api
      console.log("appendTo---jquery")
      this.each(el => node.get(0).appendChild(el))
    }
  },
  append(children) {
    if (children instanceof Element) {
      console.log('append---Element') //
      this.get(0).appendChild(children)

    } else if (children instanceof HTMLCollection) {
      // 通过document.getElement...获取到的元素能让条件成立
      console.log('append---HTMLCollection') //
      for (let i = 0; i < children.length; i++) {
        this.get(0).appendChild(children[i])
      }

    } else if (children.jquery === true) {
      console.log('append---jquery') //
      children.each(node => this.get(0).appendChild(node))
    }
  },
  find(selector) {
    let array = []
    for (let i = 0; i < this.elements.length; i++) {
      const elements2 = Array.from(this.elements[i].querySelectorAll(selector))
      array = array.concat(elements2)
    }
    array.oldApi = this // this是旧api, 给数组添加属性oldApi，数组的原长度不变，只是在最后加了这个属性
    return jQuery(array) // 返回新api对象，这不是递归，不会自动调用本身
  },
  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i)
    }
    return this
  },
  parent() {
    const array = []
    this.each(node => {
      if (array.indexOf(node.parentNode) === -1) {
        array.push(node.parentNode)
      }
    })
    array.oldApi = this // 自己加的，不知道对不对
    return jQuery(array)
  },
  children() {
    const array = []
    this.each(node => {
      array.push(...node.children)
    })
    array.oldApi = this // 自己加的，不知道对不对
    return jQuery(array)
  },
  print() {
    console.log(this.elements)
    return this
  },
  addClass(className) {
    this.each(node => {
      node.classList.add(className)
    })
    return this
  },
  end() {
    return this.oldApi; //this是新api, 原因，预测是新api调用这个函数
  }

}