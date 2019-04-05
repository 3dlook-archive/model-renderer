# Model Renderer

3D model renderer library based on three.js

## Installation

You can install this module as npm package using the following command:

```sh
npm install --save @3dlook/model-renderer
```

## Example of usage

You need to create a container for canvas renderer

```html
<div class="canvas-container"></div>
```

And also specify styles for this element

```css
.canvas-container {
  width: 1280;
  height: 720px;
}
```

Then you can import ModelRenderer class into your javascript file, create a class instance and init renderer:

```js
import ModelRenderer from '@3dlook/model-renderer';

const renderer = new ModelRenderer({
  // container element CSS selector
  container: '.canvas-container',
  // 3d model url
  model: 'https://example.com/3d-model-file.obj',
});

// initialize renderer
renderer.init();

renderer.loadModel()
  .then(model => renderer.displayModel(model))
  .catch(err => alert(err.message));
```

# API

<a name="ModelRenderer"></a>

## ModelRenderer
ModelRenderer class

**Kind**: global class  

* [ModelRenderer](#ModelRenderer)
    * [new ModelRenderer(options)](#new_ModelRenderer_new)
    * [.init()](#ModelRenderer+init)
    * [.loadModel([url])](#ModelRenderer+loadModel)
    * [.displayModel(object)](#ModelRenderer+displayModel)

<a name="new_ModelRenderer_new"></a>

### new ModelRenderer(options)
ModelRenderer constructor


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | options |

<a name="ModelRenderer+init"></a>

### modelRenderer.init()
Model render screen initializer

**Kind**: instance method of [<code>ModelRenderer</code>](#ModelRenderer)  
<a name="ModelRenderer+loadModel"></a>

### modelRenderer.loadModel([url])
Load .obj model file

**Kind**: instance method of [<code>ModelRenderer</code>](#ModelRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| [url] | <code>string</code> | url to obj file. Default value is set in the constructor options |

<a name="ModelRenderer+displayModel"></a>

### modelRenderer.displayModel(object)
Display model on canvas

**Kind**: instance method of [<code>ModelRenderer</code>](#ModelRenderer)  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>any</code> | = obj file data |

