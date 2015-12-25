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
							if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
								e.preventDefault();
								$('#segment-modal div.timer-controls .btn.start').click();
							}
							break;

						case 37: /* ...left-arrow is for going to the previous segment */
							if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
								e.preventDefault();
								$('#segment-modal div.segment-controls .btn.previous').click();
							}
							break;

						case 39: /* ...right-arrow is for going to the next segment */
							if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
								e.preventDefault();
								$('#segment-modal div.segment-controls .btn.next').click();
							}
							break;

						case 191: /* ...question mark is for going to a random segment */
							if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
								e.preventDefault();
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
							if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
								e.preventDefault();
								$('#segment-modal div.timer-controls .btn.stop').click();
							}
							break;

						default: break;
					}
				}
				else if ($('#segment-modal div.timer-controls').hasClass('stopped')) {
					/* from the timer-stopped state... */
					switch (e.keyCode) {
						case 70: /* ...f is for saving a finished run */
							if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
								e.preventDefault();
								$('#segment-modal div.timer-controls .btn.success').click();
							}
							break;

						case 81: /* ...q is for saving an aborted run */
							if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
								e.preventDefault();
								$('#segment-modal div.timer-controls .btn.failure').click();
							}
							break;

						case 82: /* ...r is for resetting the timer without saving anything */
							if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
								e.preventDefault();
								$('#segment-modal div.timer-controls .btn.reset').click();
							}
							break;

						default:
							break;
					}
				}

			}
			else if (!$('body').hasClass('modal-open')) {
				switch (e.keyCode) {
					case 191: /* ...question mark is for going to a random segment */
						if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
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
			$('#segment-modal button.reset').click();
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
			var $this = $(e.target);
			var $segmentPanels = $('#segments div.segment-panel');

			$this.blur();

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
			var $this = $(e.target);
			var $segmentPanels = $('#segments div.segment-panel');
			var $segmentPanel = $segmentPanels.eq(Math.floor(Math.random() * $segmentPanels.length));

			$this.blur();
			$('body').data('segment', $segmentPanel.data('name'));

			goodGetter.updateModal();
		});

		$('#segment-modal').on('click', '.btn.next', function(e) {
			var $this = $(e.target);
			var $segmentPanels = $('#segments div.segment-panel');

			$this.blur();

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

	computeStats: function(history) {
		var stats = {};

		var totalTime = 0;
		var totalSuccesses = 0;
		var totalFailures = 0;
		var averageTime;
		var timeVarianceOffAverage = 0;
		var timeVarianceOffBest = 0;
		var timeVarianceOffMedian = 0;

		for (var i in history) {
			if (history[i] == null) {
				totalFailures++;
			}
			else {
				totalSuccesses++;
				totalTime += history[i];
			}

			if (history[i] != null && (!stats.best || history.indexOf(stats.best) == -1 || history[i] < stats.best)) {
				//console.log('updating ' + segmentId + ' from ' + millisecondsIntoTime(segment.best) + ' to ' + millisecondsIntoTime(history[i]));
				stats.best = history[i];
			}
		}

		if (totalSuccesses > 0) {
			var sortedSuccesses = [];

			for (var i in history) {
				if (history[i] != null) {
					sortedSuccesses.push(history[i]);
				}
			}

			sortedSuccesses.sort(function(a, b) {
				return a < b
			});

			var middle = Math.floor(sortedSuccesses.length / 2);

			averageTime = Math.round(totalTime / totalSuccesses);
			stats.average = { overall: averageTime };

			for (var i in history) {
				if (history[i] != null) {
					timeVarianceOffAverage += Math.pow(history[i] - stats.average.overall, 2);
					timeVarianceOffBest += Math.pow(history[i] - stats.best, 2);
				}
			}

			stats.average.offAverage = Math.round(Math.sqrt(timeVarianceOffAverage / totalSuccesses));

			if (totalSuccesses > 1) {
				stats.average.offBest = Math.round(Math.sqrt(timeVarianceOffBest / (totalSuccesses - 1)));
			}

			var interval = 1 / sortedSuccesses.length;
			stats.distribution = {
				best: sortedSuccesses[sortedSuccesses.length - 1],
				thirdQuartile: sortedSuccesses[Math.ceil(.75 / interval) - 1],
				secondQuartile: sortedSuccesses[Math.ceil(.50 / interval) - 1],
				firstQuartile: sortedSuccesses[Math.ceil(.25 / interval) - 1],
				worst: sortedSuccesses[0]
			};

		}

		stats.failureRate = totalFailures / (totalFailures + totalSuccesses);

		return stats;
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
		goodGetter.syncStats();
	},

	saveData: function() {
		localStorage.data = JSON.stringify(this.data);
	},

	showSegmentPanels: function(options) {
		var defaults = {
			game: $('body').data('game'),
			category: $('body').data('category'),
			sortBy: 'practice'
		};

		var options = {
			game: options && options.game ? options.game : defaults.game,
			category: options && options.category ? options.category : defaults.category,
			sortBy: options && options.sortBy ? options.sortBy : defaults.sortBy
		};

		$('#segments').empty();

		for (gameName in this.data) {
			if (gameName == options.game) {
				var categories = this.data[gameName];

				for (categoryName in categories) {
					if (!options.category || options.category == categoryName) {
						var segments = categories[categoryName];
						var segmentOrder = goodGetter.sortData({ by: options.sortBy, category: options.category, data: segments, game: options.game });

						for (var i in segmentOrder) {
							var segmentName = segmentOrder[i];
							var segment = segments[segmentName];
							var segmentPanel = new SegmentPanel({ name: segmentName, bestTime: segment.best, goalTime: segment.goal });

							$('#segments').append($(segmentPanel.toString()));
						}
					}
				}
			}
		}
	},

	sortData: function(options) {
		var defaults = {
			ascending: true,
			by: 'name',
			data: null
		};

		var options = {
			ascending: options && options.ascending ? options.ascending : defaults.ascending,
			by: options && options.by ? options.by : defaults.by,
			data: options && options.data ? options.data : defaults.data
		};

		var localCopy = {};
		var segmentList = [];

		for (var segmentName in options.data) {
			localCopy[segmentName] = options.data[segmentName];
			segmentList.push(segmentName);
		}

		var sortFunction;

		switch (options.by) {
			case 'average':
				sortFunction = function(a, b) {
					return localCopy[b].average.overall > localCopy[a].average.overall;
				};
				break;

			case 'best':
				sortFunction = function(a, b) {
					return localCopy[b].best > localCopy[a].best;
				};
				break;

			case 'name':
				sortFunction = function(a, b) {
					function chunkify(t) {
						var tz = [], x = 0, y = -1, n = 0, i, j;

						while (i = (j = t.charAt(x++)).charCodeAt(0)) {
							var m = (i == 46 || (i >= 48 && i <= 57));
							if (m !== n) {
								tz[++y] = '';
								n = m;
							}
							tz[y] += j;
						}
						return tz;
					}

					var aa = chunkify(a);
					var bb = chunkify(b);

					for (x = 0; aa[x] && bb[x]; x++) {
						if (aa[x] !== bb[x]) {
							var c = Number(aa[x]), d = Number(bb[x]);
							if (c == aa[x] && d == bb[x]) {
								return c - d;
							} else return (aa[x] > bb[x]) ? 1 : -1;
						}
					}
					return aa.length - bb.length;
				}
				break;

			case 'practice':
				sortFunction = function(a, b) {
					var aScore = 0, bScore = 0;

					if (localCopy[a].total && localCopy[a].total.distribution) {
						var totalScore = localCopy[a].total.distribution.firstQuartile - localCopy[a].total.distribution.thirdQuartile;

						if (localCopy[a].total.failureRate) {
							totalScore *= 1 + localCopy[a].total.failureRate;
						}

						aScore += totalScore;
					}

					if (localCopy[a].recent && localCopy[a].recent.distribution) {
						var recentScore = localCopy[a].recent.distribution.firstQuartile - localCopy[a].recent.distribution.thirdQuartile;

						if (localCopy[a].recent.failureRate) {
							recentScore *= 1 + localCopy[a].recent.failureRate;
						}

						aScore += recentScore;
					}

					if (localCopy[b].total && localCopy[b].total.distribution) {
						var totalScore = localCopy[b].total.distribution.firstQuartile - localCopy[b].total.distribution.thirdQuartile;

						if (localCopy[b].total.failureRate) {
							totalScore *= 1 + localCopy[b].total.failureRate;
						}

						bScore += totalScore;
					}

					if (localCopy[b].recent && localCopy[b].recent.distribution) {
						var recentScore = localCopy[b].recent.distribution.firstQuartile - localCopy[b].recent.distribution.thirdQuartile;

						if (localCopy[b].recent.failureRate) {
							recentScore *= 1 + localCopy[b].recent.failureRate;
						}

						bScore += recentScore;
					}

					return aScore < bScore;
				};
				break;

			case 'stdev':
				sortFunction = function(a, b) {
					return localCopy[b].average.offAverage > localCopy[a].average.offAverage;
				};
				break;

			case 'stdevBest':
				sortFunction = function(a, b) {
					return localCopy[b].average.offBest > localCopy[a].average.offBest;
				};
				break;

			default:
				break;
		}

		segmentList.sort(sortFunction);

		if (!options.ascending) {
			segmentList.reverse();
		}

		return segmentList;
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
						var recentHistoryStartIndex = Math.max(0, segment.history.length - 20);
						var recentHistory = segment.history.slice(recentHistoryStartIndex, Math.max(segment.history.length, recentHistoryStartIndex + 20));

						segment.total = goodGetter.computeStats(segment.history);
						segment.recent = goodGetter.computeStats(recentHistory);
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

		$modal.find('table.distribution tr.quartiles td').text('--');
		$modal.find('table.stats tr.best td').text('--');
		$modal.find('table.stats tr.average td').text('--');
		$modal.find('table.stats tr.stdev td').text('--');
		$modal.find('table.stats tr.stdevBest td').text('--');
		$modal.find('table.stats tr.failure td').text('--');

		if (segment.total) {
			if (segment.total.distribution) {
				$modal.find('table.distribution tr.total.quartiles td.best').text(millisecondsIntoTime(segment.total.distribution.best));
				$modal.find('table.distribution tr.total.quartiles td.third-quartile').text(millisecondsIntoTime(segment.total.distribution.thirdQuartile));
				$modal.find('table.distribution tr.total.quartiles td.second-quartile').text(millisecondsIntoTime(segment.total.distribution.secondQuartile));
				$modal.find('table.distribution tr.total.quartiles td.first-quartile').text(millisecondsIntoTime(segment.total.distribution.firstQuartile));
				$modal.find('table.distribution tr.total.quartiles td.worst').text(millisecondsIntoTime(segment.total.distribution.worst));
			}

			if (segment.total.best) {
				$modal.find('table.stats tr.best td.total').text(millisecondsIntoTime(segment.total.best));
			}

			if (segment.total.average && segment.total.average.overall) {
				$modal.find('table.stats tr.average td.total').text(millisecondsIntoTime(segment.total.average.overall));
			}

			if (segment.total.average && segment.total.average.offAverage) {
				$modal.find('table.stats tr.stdev td.total').text(millisecondsIntoTime(segment.total.average.offAverage));
			}

			if (segment.total.average && segment.total.average.offBest) {
				$modal.find('table.stats tr.stdevBest td.total').text(millisecondsIntoTime(segment.total.average.offBest));
			}

			if (segment.total.failureRate || segment.total.failureRate == 0) {
				$modal.find('table.stats tr.failure td.total').text(Math.round(segment.total.failureRate * 100) + '%');
			}
		}


		if (segment.recent) {
			if (segment.recent.distribution) {
				$modal.find('table.distribution tr.recent.quartiles td.best').text(millisecondsIntoTime(segment.recent.distribution.best));
				$modal.find('table.distribution tr.recent.quartiles td.third-quartile').text(millisecondsIntoTime(segment.recent.distribution.thirdQuartile));
				$modal.find('table.distribution tr.recent.quartiles td.second-quartile').text(millisecondsIntoTime(segment.recent.distribution.secondQuartile));
				$modal.find('table.distribution tr.recent.quartiles td.first-quartile').text(millisecondsIntoTime(segment.recent.distribution.firstQuartile));
				$modal.find('table.distribution tr.recent.quartiles td.worst').text(millisecondsIntoTime(segment.recent.distribution.worst));
			}

			if (segment.recent.best) {
				$modal.find('table.stats tr.best td.recent').text(millisecondsIntoTime(segment.recent.best));
			}

			if (segment.recent.average && segment.recent.average.overall) {
				$modal.find('table.stats tr.average td.recent').text(millisecondsIntoTime(segment.recent.average.overall));
			}

			if (segment.recent.average && segment.recent.average.offAverage) {
				$modal.find('table.stats tr.stdev td.recent').text(millisecondsIntoTime(segment.recent.average.offAverage));
			}

			if (segment.recent.average && segment.recent.average.offBest) {
				$modal.find('table.stats tr.stdevBest td.recent').text(millisecondsIntoTime(segment.recent.average.offBest));
			}

			if (segment.recent.failureRate || segment.recent.failureRate == 0) {
				$modal.find('table.stats tr.failure td.recent').text(Math.round(segment.recent.failureRate * 100) + '%');
			}
		}
	},

	goof: function() {
		var yosh = goodGetter.data['Super Mario World 2: Yoshi\'s Island']['Warpless'];
		var sum = {
			best: 0,
			thirdQuartile: 0,
			secondQuartile: 0,
			firstQuartile: 0,
			worst: 0
		};

		for (var segment in yosh) {
			sum.best += yosh[segment].distribution.best;
			sum.thirdQuartile += yosh[segment].distribution.thirdQuartile;
			sum.secondQuartile += yosh[segment].distribution.secondQuartile;
			sum.firstQuartile += yosh[segment].distribution.firstQuartile;
			sum.worst += yosh[segment].distribution.worst;
		}

		sum.best = millisecondsIntoTime(sum.best);
		sum.thirdQuartile = millisecondsIntoTime(sum.thirdQuartile);
		sum.secondQuartile = millisecondsIntoTime(sum.secondQuartile);
		sum.firstQuartile = millisecondsIntoTime(sum.firstQuartile);
		sum.worst = millisecondsIntoTime(sum.worst);

		console.log(sum);
	},

	goof2: function() {
		var yosh = goodGetter.data['Super Mario World 2: Yoshi\'s Island']['Warpless'];

		for (var segment in yosh) {
			console.log(segment + ': ' + yosh[segment].history.length);
		}
	},

	goof3: function() {
		var yosh = goodGetter.data['Super Mario World 2: Yoshi\'s Island']['Warpless'];
		var sortedSegments = [];

		for (var segment in yosh) {
			sortedSegments.push(segment);
		}

		sortedSegments.sort(function(a, b) {
			var aScore = 0, bScore = 0;

			aScore += (yosh[a].distribution.secondQuartile - yosh[a].distribution.best);
			aScore += (yosh[a].distribution.thirdQuartile - yosh[a].distribution.best);

			bScore += (yosh[b].distribution.secondQuartile - yosh[b].distribution.best);
			bScore += (yosh[b].distribution.thirdQuartile - yosh[b].distribution.best);

			return aScore < bScore;
		});

		console.log(sortedSegments);
	}
};

$(document).ready(goodGetter.init);
