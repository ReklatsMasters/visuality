export const FFT = 256;

/**
 * Извлекает waveform из аудиопотока
 * @param {HTMLMediaElement} audioNode - элемент audio, с потока которого будем снимать характеристики
 * @param {Function} draw - обработчик получаемых данных
 */
export default function waveform(audioNode) {
	// configure analizer
	var context = new AudioContext();
	var processor = context.createScriptProcessor(2048, 1, 1);
	var analyser = context.createAnalyser();
	var interval = null;

	analyser.smoothingTimeConstant = 0.3;	// ???
	analyser.fftSize = FFT;

	var bands = new Uint8Array(analyser.frequencyBinCount);

	// отправляем на обработку в  AudioContext и получаем источник
	var source = context.createMediaElementSource(audioNode);
	//связываем источник и анализатором
	source.connect(analyser);
	//связываем анализатор с интерфейсом, из которого он будет получать данные
	analyser.connect(processor);

	//Связываем все с выходом
	processor.connect(context.destination);
	source.connect(context.destination);

	var start = function(draw, time = 25) {
		if (interval) { return; }	// already started

		interval = setInterval(function () {
			if (audioNode.paused) {
					clearInterval(interval);
					interval = null;
					return;
			}

			analyser.getByteFrequencyData(bands);
			draw(bands);
		}, time);
	}

	var stop = function() {
		if (!interval) { return; }

		clearInterval(interval);
		interval = null;
	}

	// TODO: method for disconnect analyzer

	return { start, stop }
}
