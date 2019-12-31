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
$(function () {
	//getDataWeight();
	// 디바이스 감지
	deviceDetector ();
	
	// 데이터 웨이트 함수
	function getDataWeight () {
		dataWeight = $('.select-list').find('li.selected').data('weight').split(','); // split이 배열로 담
		var dataWeightMin = dataWeight.length - dataWeight.length;
		var dataWeightMax = dataWeight.length - 1;

		$('[data-range="weight"]').attr('min', dataWeightMin);
		$('[data-range="weight"]').attr('max', dataWeightMax);
	}

	// modal open
	$('[data-target]').on('click', function () {
		$('[data-modal]').hide();
		//$('html, body').css('overflow', 'hidden');
	});

	// modal close
	$('[data-close]').on('click', function () {
		$('[data-modal]').hide();
		//$('html, body').css('overflow', 'auto');
	});

	// modal dimmed close
	$('[data-modal]').on('click', function (e) {
		// if (! e.target.closest('.modal-content')) {
		if (e.target === this) {
			$(this).hide();
			//$('html, body').css('overflow', 'auto');
		}
	});

	// 서체 선택 modal open
	$('[data-target="modal"]').on('click', function () {
		var selectedUl = $('.select-list').find('li.selected').closest('ul').index();
		$('.select-list').hide();
		$('.tab').removeClass('selected');

		$('.tab-0' + selectedUl).addClass('selected');
		$('.select-list__0' + selectedUl).show();

		$('[data-modal="select"]').show();
	});

	// 서체 선택 modal tab toggle
	$('[data-tab]').on('click', function () {
		$('[data-tab]').removeClass('selected');
		$(this).addClass('selected');

		// select list change
		var tabIndex = $(this).index() + 1;

		$('.select-list').hide();
		$('.select-list__0' + tabIndex).show();

		/*if ($(this).data('tab') === 'myungjo') {
			$('.select-list').hide();
			$('.myungjo').show();
		} else {
			$('.select-list').hide();
			$('.gothic').show();
		}*/
	});

	// 서체 선택 select list 선택
	$('.select-list li').on('click', function () {
		$('.select-list li').removeClass('selected');
		$(this).addClass('selected');
		
		// 서체 변경
		var fontDate = $(this).data('font');
		//getDataWeight();

		$('.text-value, textarea').css('font-family', fontDate);
	});

	// 디바이스 감지, 서체 select list 변경
	function deviceDetector () {
		var isMobile = {
			Android: function () {
				return navigator.userAgent.match(/Android/i) == null ? false : true;
			},
			iOS: function () {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
			},
			any: function () {
				return (isMobile.Android() || isMobile.iOS());
			}
		};

		if(isMobile.any()) {
			if (isMobile.Android()) {
				$('[data-font="Apple SD Gothic Neo"]').hide();
				$('[data-font="Noto Sans KR"]').addClass('selected');
			} else if (isMobile.iOS()) {
				$('[data-font="Apple SD Gothic Neo"]').show();
			}
		}
	}

	// 정렬 바꿔주기
	$('.align-box').on('click', function () {
		if ($(this).css('text-align') === 'left') {
			$(this).css('text-align', 'center');
			$('.text-value, textarea').css('text-align', 'center');

		} else if ($(this).css('text-align') === 'center') {
			$(this).css('text-align', 'right');
			$('.text-value, textarea').css('text-align', 'right');

		} else {
			$(this).css('text-align', 'left');
			$('.text-value, textarea').css('text-align', 'left');
		}
	});

	// 글자 모달 open
	$('[data-target="text"]').on('click', function () {
		$('[data-modal="text"]').show();
	});

	// 배경 색상 피커 모달 open
	$('[data-target="bg-color"]').on('click', function () {
		$('[data-modal="bg-color"]').show();
	});

	// 글자 색상 피커 모달 open
	$('[data-target="tx-color"]').on('click', function () {
		$('[data-modal="tx-color"]').show();
	});

	// 글자 크기 조절
	$('[data-range="size"]').on('input', function () {
		var inputValue = $(this).val();

		$('.text-value').css('font-size', inputValue + 'px');
		$('textarea').css('font-size', inputValue + 'px');
	});

	// 두께 조절
	$('[data-range="weight"]').on('input', function () {
		var inputValue = $(this).val();

		$('.text-value').css('font-weight', inputValue);
		$('textarea').css('font-weight', inputValue);
	});

	// 행간 조절
	$('[data-range="line-height"]').on('input', function () {
		var inputValue = $(this).val();

		$('.text-value').css('line-height', inputValue + 'px');
		$('textarea').css('line-height', inputValue + 'px');
	})
});

var el = function (selector) {
	return document.querySelector(selector);
};

var elAll = function (selector) {
	return document.querySelectorAll(selector);
};

// 배경 색상 피커 모달 커스텀
var colorPicker = new iro.ColorPicker('#color-picker-container', {
	width: 280,
	sliderMargin: 20,
	color: "#fff",
});

// 글자 색상 피커 모달 커스텀
var colorPickerText = new iro.ColorPicker('#color-picker-container__02', {
	width: 280,
	sliderMargin: 20,
	color: "#000",
});

var hex = colorPicker.color.hexString;
var hex2 = colorPickerText.color.hexString;

// bg 컬러 변경
function onColorChange(color, changes) {
	el('[data-target="bg-color"] .circle').style.background = color.hexString;
	el('.background').style.background = color.hexString;

	if (color.hsv.v <= 25) {
		handleNavColor('#fff');
	} else {
		handleNavColor('#000');
	}
}

// text 컬러 변경
function onColorChangeText(color, changes) {
	el('[data-target="tx-color"] .circle').style.background = color.hexString;
	el('.text-value').style.color = color.hexString;
	el('textarea').style.color = color.hexString;
}

function handleNavColor(color) {
	// header
	el('header').style.color = color;
	elAll('.align-box .align').forEach (function (elem) {
		elem.style.background = color;
	});
	elAll('.plus').forEach(function (ele) {
		ele.style.background = color;
	});
	el('[data-target="bg-color"] .stroke').style.borderColor = color;
	//footer
	el('footer').style.color = color;
	elAll('footer svg .cls-1').forEach(function (ele) {
		ele.style.stroke = color;
	});
	elAll('footer svg .cls-2').forEach(function (ele) {
		ele.style.stroke = color;
	});
	elAll('.dim-box svg path').forEach(function (ele) {
		ele.style.fill = color;
	});
	elAll('.dim-box svg rect').forEach(function (ele) {
		ele.style.fill = color;
	});
}

colorPicker.on('color:change', onColorChange);
colorPickerText.on('color:change', onColorChangeText);


// input range
var settings = {
	fill: '#000',
	background: 'rgba(0, 0, 0, 0.1)'
};

var sliders = document.querySelectorAll('.range__box');

Array.prototype.forEach.call(sliders,function (slider) {
	slider.querySelector('input').addEventListener('input', function (event) {
		applyFill(event.target);
	});
	applyFill(slider.querySelector('input'));
});

function applyFill(slider) {
	var percentage = 100 * (slider.value - slider.min) / (slider.max - slider.min);
	var bg = 'linear-gradient(90deg,' + settings.fill + ' ' + percentage + '%,' + settings.background + ' ' + (percentage + 0.1) + '%)';
	slider.style.background = bg;
}



// Preloader
var delayFunc = function (callback, time) {

    if (time === undefined) {
        time = 0;
    }

    var startTime = new Date().valueOf();

    setTimeout(function () {

        var endTime = new Date().valueOf();

        if ((endTime - startTime) > (time + 10)) {
            delayFunc(callback, time);
        } else {
            callback();
        }
    }, time);
};

// For Mozilla, Opera, Webkit
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function () {
        document.removeEventListener("DOMContentLoaded", arguments.callee, false);
        delayFunc(function () {
            $("#page-preloader").fadeOut(500);
            $('body').css('overflow', 'auto');
        }, 100);
    }, false);
}
// For Internet Explorer
else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", function () {
        if (document.readyState === "complete") {
            document.detachEvent("onreadystatechange", arguments.callee);
            delayFunc(function () {
                $("#page-preloader").fadeOut(500);
                $('body').css('overflow', 'auto');
            }, 100);
        }
    });
}