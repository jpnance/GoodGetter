function SegmentPanel(options) {
	this.bestTime = options.bestTime;
	this.goalTime = options.goalTime;
	this.saveableTime = this.bestTime - this.goalTime;
	this.name = options.name;
}

SegmentPanel.prototype.toString = function() {
	var panelString = '';

	panelString += '<div class="segment-panel btn btn-default col-xs-12 col-sm-4 col-md-4 col-lg-3" role="button" data-toggle="modal" data-target="#segment-modal" data-name="' + this.name + '">';

	if (this.name) {
		panelString += '<h5><strong>' + this.name + '</strong></h5>';
	}

	/*
	panelString += '<div class="row"><div class="text-right col-xs-6 col-sm-6 col-md-6 col-lg-6">Best</div><div class="text-right col-xs-4 col-sm-4 col-md-4 col-lg-4">' + millisecondsIntoTime(this.bestTime) + '</div></div>';
	panelString += '<div class="row"><div class="text-right col-xs-6 col-sm-6 col-md-6 col-lg-6">Goal</div><div class="text-right col-xs-4 col-sm-4 col-md-4 col-lg-4">' + millisecondsIntoTime(this.goalTime) + '</div></div>';
	panelString += '<div class="row"><div class="text-right col-xs-6 col-sm-6 col-md-6 col-lg-6">Saveable</div><div class="text-right col-xs-4 col-sm-4 col-md-4 col-lg-4">' + millisecondsIntoTime(this.saveableTime) + '</div></div>';
	*/

	panelString += '</div>';

	return panelString;
};

function Dropdown(id, headerValue, values) {
	this.id = id;
	this.headerValue = headerValue;
	this.values = values;
}

Dropdown.prototype.toString = function() {
	var dropdownString = '';

	dropdownString += '<li id="' + this.id + '" class="dropdown">';
	dropdownString += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + this.headerValue + ' <span class="caret"></span></a>';

	if (this.values && this.values.length > 0) {
		dropdownString += '<ul class="dropdown-menu">';

		for (var i in this.values) {
			dropdownString += '<li><a href="#">' + this.values[i] + '</a></li>';
		}

		dropdownString += '</ul>';
	}

	dropdownString += '</li>';

	return dropdownString;
};

var caretIcon = '<span class="caret"></span>';

function timeIntoMilliseconds(time) {
	var components = time.split(/:|\./);
	var multipliers = [10, 1000, 60 * 1000, 60 * 60 * 1000];

	components = components.reverse();

	var milliseconds = 0;

	for (var id in components) {
		milliseconds += components[id] * multipliers[id];
	}

	return milliseconds;
}

function millisecondsIntoTime(milliseconds, explicitSign) {
	milliseconds = Math.round(milliseconds / 10) * 10;

	var sign = (milliseconds < 0) ? '-' : (explicitSign ? '+' : '');

	milliseconds = Math.abs(milliseconds);

	var hours = Math.floor(milliseconds / (1000 * 60 * 60));
	var minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
	var seconds = Math.floor(milliseconds / 1000) % 60;
	var centiseconds = Math.floor((milliseconds % 1000) / 10);

	var formattedTime;

	if (centiseconds < 10) {
		centiseconds = '0' + centiseconds;
	}

	if (centiseconds == 100) {
		centiseconds = '00';
	}

	formattedTime = centiseconds;

	if (seconds > 0) {
		if ((minutes > 0 || hours > 0) && seconds < 10) {
			seconds = '0' + seconds;
		}

		formattedTime = seconds + '.' + formattedTime;
	}
	else if (seconds == 0) {
		if (minutes > 0 || hours > 0) {
			formattedTime = '00' + '.' + formattedTime;
		}
		else {
			formattedTime = '0' + '.' + formattedTime;
		}
	}

	if (minutes > 0) {
		if (hours > 0 && minutes < 10) {
			minutes = '0' + minutes;
		}

		formattedTime = minutes + ':' + formattedTime;
	}
	else if (minutes == 0) {
		if (hours > 0) {
			formattedTime = '00' + ':' + formattedTime;
		}
	}

	if (hours > 0) {
		formattedTime = hours + ':' + formattedTime;
	}

	return sign + formattedTime;
}

var goodGetter = {
	addDropdown: function(options) {
		var dropdown = new Dropdown(options.id, options.headerValue, options.values);

		var $navBar = $('.navbar-nav');
		$navBar.append($(dropdown.toString()));
	},

	bindDropdownEvents: function() {
		$('.navbar-nav').on('click', '#gameDropdown ul li', function(e) {
			e.preventDefault();

			$('#categoryDropdown').remove();
			$('body').data('game', gameName);

			var $target = $(e.target);
			var gameName = $target.html();

			$('body').data('game', gameName);

			$('#gameDropdown a.dropdown-toggle').html(gameName + ' ' + caretIcon).data('value', gameName);
			goodGetter.addDropdown({ id: 'categoryDropdown', headerValue: 'Pick a Category', values: Object.keys(goodGetter.data[gameName]) });
			goodGetter.showSegmentPanels({ game: gameName });

			if ($('#categoryDropdown ul.dropdown-menu li').length == 1) {
				$('#categoryDropdown ul.dropdown-menu li:first a').click();
			}
		});

		$('.navbar-nav').on('click', '#categoryDropdown ul li', function(e) {
			e.preventDefault();

			var $target = $(e.target);
			var categoryName = $target.html();
			var gameName = $('body').data('game');

			$('body').data('game', gameName);
			$('body').data('category', categoryName);

			$('#categoryDropdown a.dropdown-toggle').html(categoryName + ' ' + caretIcon);
			goodGetter.showSegmentPanels({ game: gameName, category: categoryName });
		});
	},

	bindKeyEvents: function() {
		$('body').keydown(function(e) {
			//console.log(e);

			if ($('body').hasClass('modal-open')) {
				if ($('#segment-modal div.timer-controls').hasClass('reset')) {
					/* from the timer reset state... */
					switch (e.keyCode) {
						case 32: /* ...spacebar is for starting the timer */
							$('#segment-modal div.timer-controls .btn.start').click();
							break;

						case 37: /* ...left-arrow is for going to the previous segment */
							$('#segment-modal div.segment-controls .btn.previous').click();
							break;

						case 39: /* ...right-arrow is for going to the next segment */
							$('#segment-modal div.segment-controls .btn.next').click();
							break;

						case 191: /* ...question mark is for going to a random segment */
							if (e.shiftKey) {
								$('#segment-modal div.segment-controls .btn.random').click();
							}
							break;

						default:
							break;
					}

				}
				else if ($('#segment-modal div.timer-controls').hasClass('started')) {
					/* from the timer-started state... */
					switch (e.keyCode) {
						case 32: /* ...spacebar is for stopping the timer */
							$('#segment-modal div.timer-controls .btn.stop').click();
							break;

						default: break;
					}
				}
				else if ($('#segment-modal div.timer-controls').hasClass('stopped')) {
					/* from the timer-stopped state... */
					switch (e.keyCode) {
						case 70: /* ...f is for saving a finished run */
							$('#segment-modal div.timer-controls .btn.success').click();
							break;

						case 81: /* ...q is for saving an aborted run */
							$('#segment-modal div.timer-controls .btn.failure').click();
							break;

						case 82: /* ...r is for resetting the timer without saving anything */
							$('#segment-modal div.timer-controls .btn.reset').click();
							break;

						default:
							break;
					}
				}

			}
			else if (!$('body').hasClass('modal-open')) {
				switch (e.keyCode) {
					case 191: /* ...question mark is for going to a random segment */
						if (e.shiftKey) {
							var $segmentPanels = $('#segments div.segment-panel');
							$segmentPanels[Math.floor(Math.random() * $segmentPanels.length)].click();
						}
						break;

					default:
						break;
				}
			}
		});
	},

	bindModalEvents: function() {
		$('#segment-modal').on('show.bs.modal', goodGetter.updateModal);

		$('#segment-modal').on('hide.bs.modal', function (e) {
			clearInterval(goodGetter.timer.timerInterval);
			$('#segment-modal div.timer').html('0.00');
			$('#segment-modal table.stats tbody tr td').html('--');
		});

		$('#segment-modal').on('click', '.btn.start', function(e) {
			goodGetter.timer.started = Date.now();

			clearInterval(goodGetter.timer.timerInterval);
			goodGetter.timer.timerInterval = setInterval(function() {
				$('#segment-modal div.timer').html(millisecondsIntoTime(Date.now() - goodGetter.timer.started));
			}, 1);

			$('#segment-modal .modal-body .timer-controls').removeClass('reset').addClass('started');
		}); 

		$('#segment-modal').on('click', '.btn.stop', function(e) {
			goodGetter.timer.stopped = Date.now();

			clearInterval(goodGetter.timer.timerInterval);

			$('#segment-modal div.timer').html(millisecondsIntoTime(goodGetter.timer.stopped - goodGetter.timer.started));
			$('#segment-modal .modal-body .timer-controls').removeClass('started').addClass('stopped');
		});

		$('#segment-modal').on('click', '.btn.reset', function(e) {
			$('#segment-modal div.timer').html('0.00');
			$('#segment-modal .modal-body .timer-controls').removeClass('stopped').addClass('reset');
		});

		$('#segment-modal').on('click', '.btn.success', function(e) {
			goodGetter.submitSegmentTime({ time: goodGetter.timer.stopped - goodGetter.timer.started });
			goodGetter.syncStats();
			goodGetter.saveData();
			goodGetter.updateModal();
			$('#segment-modal button.reset').click();
		});

		$('#segment-modal').on('click', '.btn.failure', function(e) {
			goodGetter.submitSegmentTime({ time: null });
			goodGetter.syncStats();
			goodGetter.saveData();
			goodGetter.updateModal();
			$('#segment-modal button.reset').click();
		});

		$('#segment-modal').on('click', '.btn.previous', function(e) {
			var $segmentPanels = $('#segments div.segment-panel');

			for (var i = 0; i < $segmentPanels.length; i++) {
				var $this = $segmentPanels.eq(i);

				if ($this.data('name') == $('body').data('segment')) {
					$('body').data('segment', $this.prev().data('name'));
					goodGetter.updateModal();

					break;
				}
			}
		});

		$('#segment-modal').on('click', '.btn.random', function(e) {
			var $segmentPanels = $('#segments div.segment-panel');
			var $segmentPanel = $segmentPanels.eq(Math.floor(Math.random() * $segmentPanels.length));

			$('body').data('segment', $segmentPanel.data('name'));

			goodGetter.updateModal();
		});

		$('#segment-modal').on('click', '.btn.next', function(e) {
			var $segmentPanels = $('#segments div.segment-panel');

			for (var i = 0; i < $segmentPanels.length; i++) {
				var $this = $segmentPanels.eq(i);

				if ($this.data('name') == $('body').data('segment')) {
					$('body').data('segment', $this.next().data('name'));
					goodGetter.updateModal();

					break;
				}
			}
		});
	},

	bindWindowEvents: function() {
		$(window).on('beforeunload', function(e) {
			if (JSON.stringify(goodGetter.data) != localStorage.data) {
				e.preventDefault();
			}
		});
	},

	data: JSON.parse(localStorage.data),

	init: function() {
		goodGetter.addDropdown({ id: 'gameDropdown', headerValue: 'Pick a Game', values: Object.keys(goodGetter.data) });
		goodGetter.bindDropdownEvents();
		goodGetter.bindKeyEvents();
		goodGetter.bindModalEvents();
		goodGetter.bindWindowEvents();

		$('body').on('click', 'div.segment-panel', function(e) {
			var $segmentPanel = $(e.currentTarget);
			$('body').data('segment', $segmentPanel.data('name'));
		});

		/*
		$('body').on('click', 'div.row .btn.random', function(e) {
			var $segmentPanels = $('#segments div.segment-panel');
			$segmentPanels[Math.floor(Math.random() * $segmentPanels.length)].click();
		});
		*/

		$('#gameDropdown ul li:last a').click();
	},

	saveData: function() {
		localStorage.data = JSON.stringify(this.data);
	},

	showSegmentPanels: function(options) {
		$('#segments').empty();

		for (gameName in this.data) {
			if (gameName == options.game) {
				var categories = this.data[gameName];

				for (categoryName in categories) {
					if (!options.category || options.category == categoryName) {
						var segments = categories[categoryName];

						for (segmentName in segments) {
							var segment = segments[segmentName];
							var segmentPanel = new SegmentPanel({ name: segmentName, bestTime: segment.best, goalTime: segment.goal });

							$('#segments').append($(segmentPanel.toString()));
						}
					}
				}
			}
		}
	},

	submitSegmentTime: function(options) {
		var defaults = {
			game: $('body').data('game'),
			category: $('body').data('category'),
			segment: $('body').data('segment')
		};

		var options = {
			game: options.game ? options.game : defaults.game,
			category: options.category ? options.category : defaults.category,
			segment: options.segment ? options.segment : defaults.segment,
			time: options.time
		};

		var game = options.game;
		var category = options.category;
		var segment = options.segment;
		var time = options.time;

		if (!this.data[game][category][segment].history) {
			this.data[game][category][segment].history = [];
		}

		this.data[game][category][segment].history.push(time);
	},

	syncStats: function() {
		for (var gameId in goodGetter.data) {
			for (var categoryId in goodGetter.data[gameId]) {
				for (var segmentId in goodGetter.data[gameId][categoryId]) {
					var segment = goodGetter.data[gameId][categoryId][segmentId];

					if (segment.history) {
						var totalTime = 0;
						var totalSuccesses = 0;
						var totalFailures = 0;
						var averageTime;
						var timeVarianceOffAverage = 0;
						var timeVarianceOffBest = 0;

						for (var i in segment.history) {
							if (segment.history[i] == null) {
								totalFailures++;
							}
							else {
								totalSuccesses++;
								totalTime += segment.history[i];
							}

							if (segment.history[i] != null && (!segment.best || segment.history[i] < segment.best)) {
								//console.log('updating ' + segmentId + ' from ' + millisecondsIntoTime(segment.best) + ' to ' + millisecondsIntoTime(segment.history[i]));
								segment.best = segment.history[i];
							}
						}

						if (totalSuccesses > 0) {
							averageTime = Math.round(totalTime / totalSuccesses);
							segment.average = { overall: averageTime };

							for (var i in segment.history) {
								if (segment.history[i] != null) {
									timeVarianceOffAverage += Math.pow(segment.history[i] - segment.average.overall, 2);
									timeVarianceOffBest += Math.pow(segment.history[i] - segment.best, 2);
								}
							}

							segment.average.offAverage = Math.round(Math.sqrt(timeVarianceOffAverage / totalSuccesses));

							if (totalSuccesses > 1) {
								segment.average.offBest = Math.round(Math.sqrt(timeVarianceOffBest / (totalSuccesses - 1)));
							}
						}

						segment.failureRate = totalFailures / (totalFailures + totalSuccesses);
					}
				}
			}
		}
	},

	timer: {
		started: null,
		stopped: null,
		timerInterval: null,
	},

	updateModal: function() {
		var gameName = $('body').data('game');
		var categoryName = $('body').data('category');
		var segmentName = $('body').data('segment');

		var segment = goodGetter.data[gameName][categoryName][segmentName];
		var $modal = $('#segment-modal');

		$modal.find('.modal-title').text(segmentName);

		if (segment.best) {
			$modal.find('table.stats tr.best td').text(millisecondsIntoTime(segment.best));
		}
		else {
			$modal.find('table.stats tr.best td').text('--');
		}

		if (segment.average && segment.average.overall) {
			$modal.find('table.stats tr.average td').text(millisecondsIntoTime(segment.average.overall));
		}
		else {
			$modal.find('table.stats tr.average td').text('--');
		}

		if (segment.average && segment.average.offAverage) {
			$modal.find('table.stats tr.stdev td').text(millisecondsIntoTime(segment.average.offAverage));
		}
		else {
			$modal.find('table.stats tr.stdev td').text('--');
		}

		if (segment.average && segment.average.offBest) {
			$modal.find('table.stats tr.stdevBest td').text(millisecondsIntoTime(segment.average.offBest));
		}
		else {
			$modal.find('table.stats tr.stdevBest td').text('--');
		}

		if (segment.failureRate || segment.failureRate == 0) {
			$modal.find('table.stats tr.failure td').text(Math.round(segment.failureRate * 100) + '%');
		}
		else {
			$modal.find('table.stats tr.failure td').text('--');
		}
	}
};

$(document).ready(goodGetter.init);
