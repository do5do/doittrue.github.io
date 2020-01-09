$(function () {
	// ratio canvas 그려주기
	drawRatioCanvas ();

	// 이미지 저장
	$('[data-save]').on('mousedown', function () {
		$('header').css('opacity', '0');
		$('footer').css('opacity', '0');
		drawCanvas();
	});

	$('[data-save]').on('mouseup', function () {
		$('header').css('opacity', '1');
		$('footer').css('opacity', '1');
	});

	// 이미지 업로드
	$('#upload-input').on('change', function () {
		var reader = new FileReader();

		reader.onload = function () {
			var image = new Image();

			image.src = reader.result;
			image.onload = function () {
				cropImage(image)
			};
		};

		reader.readAsDataURL($(this)[0].files[0]);

		$('[data-target="bg-color"] .circle.stroke').css('background', 'transparent');
		$('header').css('background', 'rgba(225, 225, 225, 0.46)');
		$('footer').css('background', 'rgba(225, 225, 225, 0.46)');
		handleNavColor('#000');

		// 삭제 버튼으로 체인지
		if ($('.upload-img').css('display') === 'block') {
				$('.upload-img').hide();
				$('.delete-img').show();
				$('.dim-box').show();
			} else {
				$('.delete-img').hide();
				$('.upload-img').show();
				$('.dim-box').hide();
			}
	});

	// 이미지 삭제
	$('.delete-img').on('click', function () {
		var textColor = $('[data-target="tx-color"] .circle').css('background');
		var bgColor = $('[data-target="bg-color"] .circle').css('background');

		$('.upload-thumb').remove();

		// 인풋의 value(이미지 src)를 비워줌!
		$('#upload-input').val('');
		// ratio canvas 다시 그려주기
		drawRatioCanvas();

		$(this).hide();
		$('.upload-img').show();
		$('.dim-box').hide();

		$('[data-target="bg-color"] .circle').css('background', bgColor);
		$('header').css('background', 'transparent');
		$('footer').css('background', 'transparent');

		$('.text-value, textarea').css({
			'text-shadow': 'none',
			color: textColor,
		});
	});

	// dimmed
	$('.dim').on('click', function () {
		$('.upload-thumb').prepend('<div class="dimmed-bg"></div>');
		$('.text-value, textarea').css({
			'text-shadow': '1px 1px 8px rgba(0, 0, 0, 0.3)',
			color: '#fff',
		});
		$(this).hide();
		$('.transparent').show();
	});

	// transparent
	$('.transparent').on('click', function () {
		var textColor = $('[data-target="tx-color"] .circle').css('background');

		$('.dimmed-bg').remove();
		$(this).hide();
		$('.text-value, textarea').css({
			'text-shadow': 'none',
			color: textColor,
		});
		$('.dim').show();
	})
});

// 이미지 크롭
function cropImage (image) {
	drawCanvasTag();
	var canvas = $('#canvas')[0];
	var ratioImage = $('#ratioImage')[0];
	var ctx = canvas.getContext('2d');
	var ctxRatio = ratioImage.getContext('2d');

	// 디바이스 비율과 이미지 비율 비교
	if (canvas.offsetWidth / canvas.offsetHeight <= image.width / image.height) {
		var ratioHeight = canvas.offsetHeight;
		var ratioWidth = ratioHeight / image.height * image.width;

		ratioImage.width = ratioWidth;
		ratioImage.height = ratioHeight;

		// 디바이스에 맞춘 비율 이미지 생성
		ctxRatio.drawImage(image, 0, 0, image.width, image.height, 0,0, ratioWidth, ratioHeight);

	} else if (canvas.offsetWidth / canvas.offsetHeight > image.width / image.height) {
		// 세로가 심하게 긴
		var ratioWidth2 = canvas.offsetWidth;
		var ratioHeight2 = ratioWidth2 / image.width * image.height;

		ratioImage.width = ratioWidth2;
		ratioImage.height = ratioHeight2;

		ctxRatio.drawImage(image, 0, 0, image.width, image.height, 0, 0, ratioWidth2, ratioHeight2);
	}

	// 비율 이미지 url
	var changeImage = ratioImage.toDataURL();
	$('#ratioImage').remove();

	// 최종 랜더 이미지
	var finalImage = new Image();

	finalImage.src = changeImage;
	finalImage.onload = function () {
		var cw = canvas.offsetWidth;
		var ch = canvas.offsetHeight;

		if (canvas.offsetWidth / canvas.offsetHeight <= image.width / image.height) {
			ctx.drawImage(finalImage, (finalImage.width / 2) - (canvas.offsetWidth / 2), 0, cw, ch, 0, 0, cw, ch);
		} else if (canvas.offsetWidth / canvas.offsetHeight > image.width / image.height) {
			// 세로가 심하게 긴
			ctx.drawImage(finalImage, 0, (finalImage.height / 2) - (canvas.offsetHeight / 2), cw, ch, 0, 0, cw, ch);
		}

		var base64ImageData = canvas.toDataURL();
		$('#canvas').remove();
		$('.background').prepend('<div class="upload-thumb"><img src="' + base64ImageData + '"></div>')
	}
}

function drawCanvasTag () {
	var bgW = $(window).width();
	var bgH = $(window).height();
	$('body').append('<canvas id="canvas" width="' + bgW + '" height="' + bgH + '"></canvas>');
}

function drawRatioCanvas () {
	$('body').append('<canvas id="ratioImage"></canvas>');
}

// 저장
function drawCanvas () {
	html2canvas($('.background')[0], {
		backgroundColor: '#fff',
		backgroundImage: 'url(/assets/images/body-noise.png)',
		scale: 3,
	}).then(function (canvas) {
		// var a = document.createElement('a');
		// a.href = canvas.toDataURL("image/png");
		// a.download = 'myfile.png';
		// a.click();
		canvas.toBlob(function(blob) {
			//saveAs(blob, 'image.png');
			download(blob, 'image.png', 'image/png');
		})
	})
}