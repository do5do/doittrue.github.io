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

