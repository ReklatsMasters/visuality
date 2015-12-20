/* global History */

import {FrequencyAnalyser} from '../lib/analyser';
import {ColumnChart} from '../lib/chart';

let id = ['jp_audio_0', 'jp_audio_1'];
let audios = id.map(e => document.getElementById(e));

const rootNode = visualizerNode();
insertNode(rootNode);

// this version history.js does not trigger `popstate` event correctly
History.Adapter.bind(window, 'statechange', () => insertNode(rootNode));

const width = parseInt(getComputedStyle(rootNode).width);

const analyser = new FrequencyAnalyser(visualize);
const chart = new ColumnChart(rootNode, { width, dataLength: analyser.dataCount });

function visualize(uint8data) {
	chart.draw(Array.from(uint8data).map((y, x) => ({ x, y })));
}

audios.forEach(audio => {
  analyser.add(audio);

  audio.addEventListener('canplay', function oncanplay() {
    analyser.disconnect();
    analyser.connect(audio);
  });
})

/* создаёт блок-обёртку в котором будет располагаться визуализатор */
function visualizerNode() {
	var wrapper = document.createElement('div');
	wrapper.classList.add('visualizer_block');
	wrapper.style.marginTop = "20px";

	return wrapper;
}

function insertNode(node) {
  if (document.contains(node)) { return; }
  
  var anchor = document.querySelector('.carusel_block');
  anchor.parentNode.insertBefore(node, anchor.nextElementSibling);
}