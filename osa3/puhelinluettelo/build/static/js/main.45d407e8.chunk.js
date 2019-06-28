(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{15:function(e,n,t){e.exports=t(39)},38:function(e,n,t){},39:function(e,n,t){"use strict";t.r(n);var a=t(0),o=t.n(a),c=t(13),r=t.n(c),u=t(14),l=t(2),i=function(e){var n=e.person,t=e.handleRemoval;return o.a.createElement("div",null,n.name," ",n.number," ",o.a.createElement("button",{onClick:t},"delete"))},s=function(e){e.persons;var n=e.searchFilter,t=e.handleChange;return o.a.createElement("div",null,"filter shown with ",o.a.createElement("input",{value:n,onChange:t}))},m=function(e){var n=e.addPerson,t=e.newName,a=e.newNumber,c=e.handleNameChange,r=e.handleNumberChange;return o.a.createElement("form",{onSubmit:n},o.a.createElement("div",null,"name: ",o.a.createElement("input",{value:t,onChange:c})),o.a.createElement("div",null,"number: ",o.a.createElement("input",{value:a,onChange:r})),o.a.createElement("div",null,o.a.createElement("button",{type:"submit"},"add")))},f=function(e){var n=e.rows;return o.a.createElement("div",null,n())},d=t(3),h=t.n(d),v="/api/persons",b=function(e){return h.a.post(v,e).then(function(e){return e.data})},g=function(e,n){return h.a.put("".concat(v,"/").concat(e),n).then(function(e){return e.data})},p=function(e){return h.a.delete("".concat(v,"/").concat(e)).then(function(e){return e.data})},E=function(e){var n=e.message;return null===n?null:o.a.createElement("div",{className:"success"},n)},w=function(e){var n=e.message;return null===n?null:o.a.createElement("div",{className:"error"},n)},j=function(){var e=Object(a.useState)([]),n=Object(l.a)(e,2),t=n[0],c=n[1],r=Object(a.useState)(""),d=Object(l.a)(r,2),v=d[0],j=d[1],O=Object(a.useState)(""),C=Object(l.a)(O,2),N=C[0],y=C[1],S=Object(a.useState)(!0),k=Object(l.a)(S,2),T=k[0],L=k[1],A=Object(a.useState)(""),P=Object(l.a)(A,2),R=P[0],F=P[1],I=Object(a.useState)(null),J=Object(l.a)(I,2),x=J[0],B=J[1],D=Object(a.useState)(null),q=Object(l.a)(D,2),z=q[0],G=q[1];Object(a.useEffect)(function(){console.log("effect"),h.a.get("/api/persons").then(function(e){console.log("promise fulfilled"),c(e.data),B("Contacts  succesfully loaded"),setTimeout(function(){B(null)},5e3)})},[]);var H=T?t:t.filter(function(e){return e.name.toLocaleLowerCase().includes("".concat(R).toLocaleLowerCase())});return o.a.createElement("div",null,o.a.createElement("h2",null,"Phonebook"),o.a.createElement(E,{message:x}),o.a.createElement(w,{message:z}),o.a.createElement(s,{persons:t,searchFilter:R,handleChange:function(e){F(e.target.value),""!==e.target.value?(L(!1),console.log(!1)):(L(!0),console.log(!0)),console.log("".concat(R))}}),o.a.createElement("h2",null,"Add new contact"),o.a.createElement(m,{addPerson:function(e){e.preventDefault();var n={name:v,number:N};if(t.some(function(e){return e.name==="".concat(v)})){var a=t.find(function(e){return e.name===v});console.log(a),window.confirm("".concat(v," is already added to phonebook. Replace the old number with a new one?"))&&function(e){var n=t.find(function(n){return n.id===e}),a=Object(u.a)({},n,{number:N});console.log(a),g(e,a).then(function(n){console.log(n.data),c(t.map(function(n){return n.id!==e?n:a})),B("".concat(a.name," number changed")),setTimeout(function(){B(null)},5e3)}).catch(function(e){G("Information of ".concat(a.name," has already been removed from the server")),setTimeout(function(){G(null)},5e3)})}(a.id)}else b(n).then(function(e){c(t.concat(e)),B("Added ".concat(v," to contacts")),setTimeout(function(){B(null)},5e3)}).catch(function(e){G(e.response.data.error),setTimeout(function(){G(null)},5e3)}),j(""),y("")},handleNameChange:function(e){console.log(e.target.value),j(e.target.value)},handleNumberChange:function(e){console.log(e.target.value),y(e.target.value)}}),o.a.createElement("h2",null,"Numbers"),o.a.createElement(f,{rows:function(){return H.map(function(e){return o.a.createElement(i,{key:e.id,person:e,handleRemoval:function(){return function(e){var n=t.find(function(n){return n.id===e});window.confirm("Are you sure you want to remove ".concat(n.name," from contacts?"))&&(p(e),c(t.filter(function(n){return n.id!==e})),B("".concat(n.name," removed from contacts")),setTimeout(function(){B(null)},5e3),j(""),y(""))}(e.id)}})})}}))};t(38);r.a.render(o.a.createElement(j,null),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.45d407e8.chunk.js.map