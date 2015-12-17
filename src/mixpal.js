import waveform from '../lib/waveform';
import {ColumnChart} from '../lib/chart';

const id = 'jp_audio_0';
const audio = document.getElementById(id);

const rootNode = makeWrapper();
const width = parseInt(getComputedStyle(rootNode).width);

const chart = new ColumnChart(rootNode, {width});

function visualize(uint8data) {
	chart.draw(Array.from(uint8data).map((y, x) => ({ x, y })));
}

// обрабатываем данные при проигрывании
audio.addEventListener('canplay', ev => {
	waveform(ev.target).start(visualize);
});

/* создаёт блок-обёртку в котором будет располагаться визуализатор */
function makeWrapper() {
	var anchor = document.querySelector('.carusel_block');

	var wrapper = document.createElement('div');
	wrapper.classList.add('visualizer_block');
	wrapper.style.marginTop = "20px";

	anchor.parentNode.insertBefore(wrapper, anchor.nextElementSibling);

	return wrapper;
}
