runOnStartup(async runtime => runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime)));

async function OnBeforeProjectStart(runtime) {
	await justTestAjax();

	startScoring(runtime);
}

async function justTestAjax() {
	const response = await fetch('https://my-json-server.typicode.com/typicode/demo/posts');
	const result = await response.json();
	
	console.log('AJAX tested: ', result);
}

function startScoring(runtime) {
	let SCORE = 0;
	
	const PipeTop = runtime.objects.PipeTop;

	PipeTop.addEventListener('instancedestroy', ({ isEndingLayout, instance }) => {
		if (!isEndingLayout && instance.isVisible) {
			const { layout } = runtime;
			if (layout.name === 'Game') {
				SCORE++;
				
				const score = runtime.objects.Score.getFirstInstance();
				score.text = `SCORE: ${SCORE}`;
			}
		}
	});
	
	const Layouts = runtime.getAllLayouts();
	
	Layouts.forEach(Layout => Layout.addEventListener('beforelayoutstart', ({ layout }) => {
		if (layout.name === 'Game') {
			const score = runtime.objects.Score.getFirstInstance();
			score.text = `SCORE: ${SCORE}`;
		} else {
			if (layout.name === 'GameOver') {
				const result = runtime.objects.Result.getFirstInstance();
				result.text = `Your score: ${SCORE}`;
			}

			SCORE = 0;
		}
	}))
}