<script>
	import { onMount } from 'svelte';

	import Menu from "./Menu.svelte";
	import Foot from "./Foot.svelte";
	import Attr from "./Attr.svelte";
	import List from "./List.svelte";
	import Canvas from "./Canvas.svelte";

	export let appName = "LabelPrint";
	export let name = "LabelPrint";
	appName = name;

	let cols = [];
	let rows = [];

	let product;
	let scale = 1;
	
	function selectionChanged(e) {
		let prod = rows[e.detail.idx];
		product = { ...prod };
	}

	window.onload = function () {
		Split(['#a', '#b'], {
			gutterSize: 10,
			sizes: [25, 75],
			minSize: [100, 100],
			direction: "vertical"
		});
		Split(['#b1', '#b2'], {
			gutterSize: 10,
			sizes: [25, 75],
			minSize: [100, 100],
		});

		fabric.DPI = 112;
		//for lenovo t470, 1366*768@14inch
		//Math.sqrt(1366*1366+768*768)/14 = 112

		var json = {
			"objects": [
				{
					"type": "rect",
					"originX": "center",
					"originY": "center",
					"left": 100,
					"top": 150,
					"width": 150,
					"height": 250,
					"fill": "#29477F",
					"overlayFill": null,
					"stroke": null,
					"strokeWidth": 1,
					"strokeDashArray": null,
					"strokeLineCap": "butt",
					"strokeLineJoin": "miter",
					"strokeMiterLimit": 10,
					"scaleX": 1,
					"scaleY": 1,
					"angle": 0,
					"flipX": false,
					"flipY": false,
					"opacity": 1,
					"shadow": {
						"color": "rgba(94, 128, 191, 0.5)",
						"blur": 5,
						"offsetX": 10,
						"offsetY": 10
					},
					"visible": true,
					"clipTo": null,
					"rx": 0,
					"ry": 0,
					"x": 0,
					"y": 0
				},
				{
					"type": "circle",
					"originX": "center",
					"originY": "center",
					"left": 100,
					"top": 100,
					"width": 200,
					"height": 200,
					"fill": "rgb(166,111,213)",
					"overlayFill": null,
					"stroke": null,
					"strokeWidth": 1,
					"strokeDashArray": null,
					"strokeLineCap": "butt",
					"strokeLineJoin": "miter",
					"strokeMiterLimit": 10,
					"scaleX": 1,
					"scaleY": 1,
					"angle": 0,
					"flipX": false,
					"flipY": false,
					"opacity": 1,
					"shadow": {
						"color": "#5b238A",
						"blur": 20,
						"offsetX": -20,
						"offsetY": -10
					},
					"visible": true,
					"clipTo": null,
					"radius": 50
				}
			],
			"background": "blue",
			"width": fabric.util.parseUnit('11in'),
			"height": fabric.util.parseUnit('8.5in')
		};

		fabric.Object.prototype.set({
			transparentCorners: false,
			cornerColor: 'rgba(102,153,255,0.5)',
			cornerSize: 12,
			padding: 5
		});


		// initialize fabric canvas and assign to global windows object for debug
		scale = 1;
		var canvas = window._canvas = new fabric.Canvas('main-canvas');
		canvas.loadFromJSON(json, () => {
			console.log(`w=${json.width},h=${json.height}`);
			//canvas.setWidth(json.width);
			//canvas.setHeight(json.height);

			canvas.setDimensions({ width: json.width * scale, height: json.height * scale });
			canvas.setZoom(scale);
			canvas.renderAll.bind(canvas);
		}, (o, object) => {
			fabric.log(o, object);
		});
	}

	onMount(async () => {
		cols = [
			{
				name: 'Plu',
				field: 'plu',
				width: '100px'
			},
			{
				name: 'Name',
				field: 'name',
				width: '300px'
			},
			{
				name: '中文',
				field: 'alias',
				width: '300px'
			},
			{
				name: 'Price',
				field: 'price',
				width: '100px'
			},
			{
				name: 'Origin',
				field: 'origin',
				width: '200px'
			},
			{
				name: 'Department',
				field: 'department',
			},
		];

		rows = [
			{
				plu: 4131,
				name: 'Apple',
				alias: '苹果',
				price: 1.23,
				origin: 'China',
				department: 'Produce'
			},
			{
				plu: 4132,
				name: 'Apple',
				alias: '苹果',
				price: 1.23,
				origin: 'China',
				department: 'Produce'
			},
			{
				plu: 4133,
				name: 'Apple',
				alias: '苹果',
				price: 1.23,
				origin: 'China',
				department: 'Produce'
			},
			{
				plu: 4134,
				name: 'Apple',
				alias: '苹果',
				price: 1.23,
				origin: 'China',
				department: 'Produce'
			},
			{
				plu: 4135,
				name: 'Apple',
				alias: '苹果',
				price: 1.23,
				origin: 'China',
				department: 'Produce'
			},
			{
				plu: 4136,
				name: 'Apple',
				alias: '苹果',
				price: 1.23,
				origin: 'China',
				department: 'Produce'
			},
			{
				plu: 4137,
				name: 'Apple',
				alias: '苹果',
				price: 1.23,
				origin: 'China',
				department: 'Produce'
			},
			{
				plu: 4138,
				name: 'Apple',
				alias: '苹果',
				price: 1.23,
				origin: 'China',
				department: 'Produce'
			}
		];

		let prod = rows[0];
		product = { ...prod };

	});

</script>

<main>
	<Menu appName={appName} />

	<div class="split-AB">
		<div id="a">
			<List on:selectionChanged={selectionChanged} cols={cols} rows={rows} />
		</div>
		<div id="b">
			<div id="split-B1B2">
				<div id="b1">
					{#if product}
						<Attr bind:product={product} cols={cols}/>
					{/if}
				</div>
				<div id="b2">
					<Canvas product={product} cols={cols}/>
				</div>
			</div>
		</div>
	</div>

	<Foot />

</main>

<style>
	main {
		margin: 0;
		height: 100vh;
	}

	* {
		box-sizing: border-box;
	}


</style>