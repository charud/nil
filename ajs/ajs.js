// TODO: replace with parser, regexp won't be enough
// function transform(module) {
//   const out = module.replace(
//     /<([^\s]+)(\s[^>]*)?\/>/g,
//     (_, tagName, attributes) => {
//       console.log('attrs are', attributes);
//       console.log('attrs are split', attributes.split(/\s+/).filter());
//       const props = attributes.split(/\s+/).filter().reduce((obj, next) => {
//         console.log('next is', next);
//         const kv = next.split('=');
//         console.log('obj is', obj);
//         obj[kv[0]] = kv[1];
//         return obj;
//       }, {});
//       return `act('${tagName}', {}, ${JSON.stringify(obj)})`;
//     });
//   return out;
// }

function transform(module) {

   

}

module.exports = transform;