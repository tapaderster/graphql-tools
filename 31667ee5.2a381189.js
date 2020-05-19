(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{146:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return c})),r.d(t,"rightToc",(function(){return s})),r.d(t,"default",(function(){return p}));var n=r(2),o=r(9),a=(r(0),r(167)),i={id:"directive-resolvers",title:"Directive resolvers",description:"A set of utilities to build your JavaScript GraphQL schema in a concise and powerful way."},c={id:"directive-resolvers",title:"Directive resolvers",description:"A set of utilities to build your JavaScript GraphQL schema in a concise and powerful way.",source:"@site/docs/directive-resolvers.md",permalink:"/docs/directive-resolvers",editUrl:"https://github.com/ardatan/graphql-tools/edit/master/website/docs/directive-resolvers.md",sidebar:"someSidebar",previous:{title:"Schema directives",permalink:"/docs/schema-directives"},next:{title:"Schema delegation",permalink:"/docs/schema-delegation"}},s=[{value:"Directive example",id:"directive-example",children:[]},{value:"Multi-Directives example",id:"multi-directives-example",children:[]},{value:"API",id:"api",children:[{value:"directiveResolvers option",id:"directiveresolvers-option",children:[]},{value:"attachDirectiveResolvers",id:"attachdirectiveresolvers",children:[]}]}],l={rightToc:s};function p(e){var t=e.components,r=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(n.a)({},l,r,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h2",{id:"directive-example"},"Directive example"),Object(a.b)("p",null,"Let's take a look at how we can create ",Object(a.b)("inlineCode",{parentName:"p"},"@upper")," Directive to upper-case a string returned from resolve on Field"),Object(a.b)("p",null,"To start, let's grab the schema definition string from the ",Object(a.b)("inlineCode",{parentName:"p"},"makeExecutableSchema")," example ",Object(a.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/generate-schema/#example"}),'in the "Generating a schema" article'),"."),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"import { makeExecutableSchema } from 'graphql-tools';\nimport { graphql } from 'graphql';\n\n// Construct a schema, using GraphQL schema language\nconst typeDefs = `\n  directive @upper on FIELD_DEFINITION\n\n  type Query {\n    hello: String @upper\n  }\n`;\n\n// Implement resolvers for out custom Directive\nconst directiveResolvers = {\n  upper(\n    next,\n    src,\n    args,\n    context,\n  ) {\n    return next().then((str) => {\n      if (typeof(str) === 'string') {\n        return str.toUpperCase();\n      }\n      return str;\n    });\n  },\n}\n\n// Provide resolver functions for your schema fields\nconst resolvers = {\n  Query: {\n    hello: (root, args, context) => {\n      return 'Hello world!';\n    },\n  },\n};\n\nexport const schema = makeExecutableSchema({\n  typeDefs,\n  resolvers,\n  directiveResolvers,\n});\n\nconst query = `\nquery UPPER_HELLO {\n  hello\n}\n`;\n\ngraphql(schema, query).then((result) => console.log('Got result', result));\n")),Object(a.b)("blockquote",null,Object(a.b)("p",{parentName:"blockquote"},"Note: next() always return a Promise for consistency, resolved with original resolver value or rejected with an error.")),Object(a.b)("h2",{id:"multi-directives-example"},"Multi-Directives example"),Object(a.b)("p",null,"Multi-Directives on a field will be apply with LTR order."),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"// graphql-tools combines a schema string with resolvers.\nimport { makeExecutableSchema } from 'graphql-tools';\n\n// Construct a schema, using GraphQL schema language\nconst typeDefs = `\n  directive @upper on FIELD_DEFINITION\n  directive @concat(value: String!) on FIELD_DEFINITION\n\n  type Query {\n    foo: String @concat(value: \"@gmail.com\") @upper\n  }\n`;\n\n// Customs directives, check https://github.com/ardatan/graphql-tools/pull/518\n// for more examples\nconst directiveResolvers = {\n  upper(\n    next,\n    src,\n    args,\n    context,\n  ) {\n    return next().then((str) => {\n      if (typeof(str) === 'string') {\n        return str.toUpperCase();\n      }\n      return str;\n    });\n  },\n  concat(\n    next,\n    src,\n    args,\n    context,\n  ) {\n    return next().then((str) => {\n      if (typeof(str) !== 'undefined') {\n        return `${str}${args.value}`;\n      }\n      return str;\n    });\n  },\n}\n\n// Provide resolver functions for your schema fields\nconst resolvers = {\n  Query: {\n    foo: (root, args, context) => {\n      return 'foo';\n    },\n  },\n};\n\n// Required: Export the GraphQL.js schema object as \"schema\"\nexport const schema = makeExecutableSchema({\n  typeDefs,\n  resolvers,\n  directiveResolvers,\n});\n")),Object(a.b)("p",null,"The result with query ",Object(a.b)("inlineCode",{parentName:"p"},"{foo}")," will be:"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-json"}),'{\n  "data": {\n    "foo": "FOO@GMAIL.COM"\n  }\n}\n')),Object(a.b)("h2",{id:"api"},"API"),Object(a.b)("h3",{id:"directiveresolvers-option"},"directiveResolvers option"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"import { makeExecutableSchema } from 'graphql-tools';\n\nconst directiveResolvers = {\n  // directive resolvers implement\n};\n\nconst schema = makeExecutableSchema({\n  // ... other options\n  directiveResolvers,\n})\n")),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"makeExecutableSchema")," has new option field is ",Object(a.b)("inlineCode",{parentName:"p"},"directiveResolvers"),", a map object for custom Directive's resolvers."),Object(a.b)("h3",{id:"attachdirectiveresolvers"},"attachDirectiveResolvers"),Object(a.b)("pre",null,Object(a.b)("code",Object(n.a)({parentName:"pre"},{className:"language-js"}),"import { attachDirectiveResolvers } from 'graphql-tools';\n\nconst directiveResolvers = {\n  // directive resolvers implement\n};\n\nattachDirectiveResolvers(\n  schema,\n  directiveResolvers,\n);\n")),Object(a.b)("p",null,"Given an instance of GraphQLSchema and a ",Object(a.b)("inlineCode",{parentName:"p"},"directiveResolvers")," map object, ",Object(a.b)("inlineCode",{parentName:"p"},"attachDirectiveResolvers")," wrap all field's resolver with directive resolvers."))}p.isMDXComponent=!0},167:function(e,t,r){"use strict";r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return v}));var n=r(0),o=r.n(n);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=o.a.createContext({}),p=function(e){var t=o.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):c({},t,{},e)),r},u=function(e){var t=p(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=Object(n.forwardRef)((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(r),d=n,v=u["".concat(i,".").concat(d)]||u[d]||m[d]||a;return r?o.a.createElement(v,c({ref:t},l,{components:r})):o.a.createElement(v,c({ref:t},l))}));function v(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,i=new Array(a);i[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:n,i[1]=c;for(var l=2;l<a;l++)i[l]=r[l];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,r)}d.displayName="MDXCreateElement"}}]);