function SegmentPanel(options) {
	this.timeSave = options.timeSave;
	this.name = options.name;
}

SegmentPanel.prototype.toString = function() {
	var panelString = '';

	panelString += '<div class="segment-panel btn btn-default col-xs-12 col-sm-4 col-md-4 col-lg-3" role="button" data-toggle="modal" data-target="#segmentModal" data-name="' + this.name + '">';

	if (this.name) {
		panelString += '<h5>' + this.name + '</h5>';
	}

	panelString += '<p>' + this.timeSave + '</p>';
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
	dropdownString += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + ((this.values && this.values.length == 1) ? this.values[0] : this.headerValue) + ' <span class="caret"></span></a>';

	if (this.values && this.values.length > 0) {
		dropdownString += '<ul class="dropdown-menu">';

		for (i in this.values) {
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

			var $target = $(e.target);
			var gameName = $target.html();

			$('#gameDropdown a.dropdown-toggle').html(gameName + ' ' + caretIcon).data('value', gameName);
			goodGetter.addDropdown({ id: 'categoryDropdown', headerValue: 'Pick a Category', values: Object.keys(goodGetter.data[gameName]) });
			goodGetter.showSegmentSegmentPanels({ game: gameName });
		});

		$('.navbar-nav').on('click', '#categoryDropdown ul li', function(e) {
			e.preventDefault();

			var $target = $(e.target);
			var categoryName = $target.html();
			var gameName = $('#gameDropdown a.dropdown-toggle').data('value');

			$('#categoryDropdown a.dropdown-toggle').html(categoryName + ' ' + caretIcon);
			goodGetter.showSegmentSegmentPanels({ game: gameName, category: categoryName });
		});
	},

	bindModalEvent: function() {
		$('#segmentModal').on('show.bs.modal', function (e) {
			var $segment = $(e.relatedTarget);
			var segmentName = $segment.data('name');

			var $modal = $(this);
			$modal.find('.modal-title').text(segmentName);
		});
	},

	data: {
		'Super Mario 64': {
			'16-Star': {
				'BOB': {},
				'BLJs': {}
			},
			'70-Star': {
				'BOB': {},
				'BBH': {}
			}
		},
		'Super Mario World 2: Yoshi\'s Island': {
			'Warpless': {
				'1-1: Make Eggs, Throw Eggs': {
					best: 46030,
					goal: 43590
				},
				'1-2: Watch Out Below!': {
					best: 44530,
					goal: 43760
				},
				'1-3: The Cave of Chomp Rock': {
					best: 65620,
					goal: 64510
				},
				'1-4: Burt the Bashful\'s Fort': {
					best: 132570,
					goal: 128010
				},
				'1-5: Hop! Hop! Donut Lifts': {
					best: 170020,
					goal: 170020
				},
				'1-6: Shy-Guys on Stilts': {
					best: 77420,
					goal: 73810
				},
				'1-7: Touch Fuzzy, Get Dizzy': {
					best: 58270,
					goal: 55670
				},
				'1-8: Salvo the Slime\'s Castle': {
					best: 129970,
					goal: 113490
				},
				'2-1: Visit Koopa and Para-Koopa': {
					best: 110390,
					goal: 106870
				},
				'2-2: The Baseball Boys': {
					best: 127480,
					goal: 119450
				},
				'2-3: What\'s Gusty Taste Like?': {
					best: 85500,
					goal: 81170
				},
				'2-4: Bigger Boo\'s Fort': {
					best: 116530,
					goal: 110590
				},
				'2-5: Watch Out for Lakitu!': {
					best: 63700,
					goal: 62880
				},
				'2-6: The Cave of the Mystery Maze': {
					best: 80420,
					goal: 77520
				},
				'2-7: Lakitu\'s Wall': {
					best: 97210,
					goal: 87790
				},
				'2-8: The Potted Ghost\'s Castle': {
					best: 221810,
					goal: 207160
				},
				'3-1: Welcome to Monkey World!': {
					best: 84640,
					goal: 82040
				},
				'3-2: Jungle Rhythm...': {
					best: 62790,
					goal: 59320
				},
				'3-3: Nep-Enut\'s Domain': {
					best: 163910,
					goal: 156610
				},
				'3-4: Prince Froggy\'s Fort': {
					best: 173110,
					goal: 168260
				},
				'3-5: Jammin\' through the Trees': {
					best: 77480,
					goal: 73400
				},
				'3-6: The Cave of Harry Hedgehog': {
					best: 66750,
					goal: 62530
				},
				'3-7: Monkeys\' Favorite Lake': {
					best: 93030,
					goal: 87960
				},
				'3-8: Naval Piranha\'s Castle': {
					best: 114740,
					goal: 100030
				},
				'4-1: GO! GO! MARIO!!': {
					best: 102270,
					goal: 96320
				},
				'4-2: The Cave of the Lakitus': {
					best: 72230,
					goal: 68980
				},
				'4-3: Don\'t Look Back!': {
					best: 79170,
					goal: 75880
				},
				'4-4: Marching Milde\'s Fort': {
					best: 307160,
					goal: 298900
				},
				'4-5: Chomp Rock Zone': {
					best: 76690,
					goal: 74280
				},
				'4-6: Lake Shore Paradise': {
					best: 96230,
					goal: 92860
				},
				'4-7: Ride like the Wind': {
					best: 77820,
					goal: 74150
				},
				'4-8: Hookbill the Koopa\'s Castle': {
					best: 193100,
					goal: 168580
				},
				'5-1: BLIZZARD!!!': {
					best: 105000,
					goal: 96460
				},
				'5-2: Ride the Sky Lifts': {
					best: 90510,
					goal: 84110
				},
				'5-3: Danger - Icy Conditions Ahead': {
					best: 174710,
					goal: 165760
				},
				'5-4: Sluggy the Unshaven\'s Fort': {
					best: 302060,
					goal: 207490
				},
				'5-5: Goonie Rides!': {
					best: 110610,
					goal: 104590
				},
				'5-6: Welcome to Cloud World': {
					best: 251840,
					goal: 247280
				},
				'5-7: Shifting Platforms Ahead': {
					best: 99080,
					goal: 95620
				},
				'5-8: Raphael the Raven\'s Castle': {
					best: 181210,
					goal: 167320
				},
				'6-1: Scary Skeleton Goonies!': {
					best: 102940,
					goal: 102640
				},
				'6-2: The Cave of the Bandits': {
					best: 102960,
					goal: 94910
				},
				'6-3: Beware the Spinning Logs': {
					best: 70100,
					goal: 68390
				},
				'6-4: Tap-Tap the Red Nose\'s Fort': {
					best: 184710,
					goal: 162530
				},
				'6-5: The Very Loooooong Cave': {
					best: 260040,
					goal: 250500
				},
				'6-6: The Deep, Underground Maze': {
					best: 85180,
					goal: 66380
				},
				'6-7: KEEP MOVING!!!!': {
					best: 202240,
					goal: 183640
				},
				'6-8: King Bowser\'s Castle': {
					best: 323940,
					goal: 307200
				}
			}
		}
	},

	init: function() {
		goodGetter.addDropdown({ id: 'gameDropdown', headerValue: 'Pick a Game', values: Object.keys(goodGetter.data) });
		goodGetter.bindDropdownEvents();
		goodGetter.bindModalEvent();
	},

	showSegmentSegmentPanels: function(options) {
		$('#segments').empty();

		for (gameName in this.data) {
			if (gameName == options.game) {
				var categories = this.data[gameName];

				for (categoryName in categories) {
					if (!options.category || options.category == categoryName) {
						var segments = categories[categoryName];

						for (segmentName in segments) {
							var segment = segments[segmentName];
							var segmentPanel = new SegmentPanel({ name: segmentName, timeSave: millisecondsIntoTime(segment.best - segment.goal) });

							$('#segments').append($(segmentPanel.toString()));
						}
					}
				}
			}
		}
	}
};

$(document).ready(goodGetter.init);
