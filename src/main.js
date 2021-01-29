


// console.log($('.test'))

// console.log($('.test').children().get(1))

// $('.test')
//   .find('.child')
//   // .each(n => console.log(n))
//   // .print()
//   .parent()
//   // .print()
//   .addClass('red')
//   .end().print()

let $x1 = $("<div>儿子儿子</div>")

// appendTO
let $x2 = $("#appendTo_")
// $('.test').appendTo($x2) //jquery
let a = document.querySelectorAll(".div1")[0]
// $('.test').appendTo(a) //a: Element

// append
let b = document.querySelectorAll(".div1")[2]
// $('.test').append(b) // b: Element
// $('.test').append($('.child')) // jquery

let c = document.querySelectorAll(".div1")
let d = document.getElementsByClassName(".div1")
console.log(c === d) //false
console.log(c instanceof HTMLCollection) //false
console.log(d instanceof HTMLCollection) //true
$('.test').append(d) // b: HTMLCollection






