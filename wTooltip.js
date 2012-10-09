/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This wTooltip jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @github			http://github.com/websanova/wTooltip
 * @version         Version 1.7.4
 *
 ******************************************/
(function($)
{
	$.fn.wTooltip = function(option, settings)
	{
		if(typeof option === 'object')
		{
			settings = option;
		}
		else if(typeof option === 'string')
		{
			var values = [];

			var elements = this.each(function()
			{
				var data = $(this).data('_wTooltip');

				if(data)
				{
					if(option === 'title') { data.settings.html ? data.content.html(settings) : data.content.text(settings); }
					else if($.fn.wTooltip.defaultSettings[option] !== undefined)
					{
						if(settings !== undefined) { data.settings[option] = settings; }
						else { values.push(data.settings[option]); }
					}
				}
			});

			if(values.length === 1) { return values[0]; }
			if(values.length > 0) { return values; }
			else { return elements; }
		}
		
		settings = $.extend({}, $.fn.wTooltip.defaultSettings, settings || {});

		return this.each(function()
		{
			var elem = $(this);
			
			var $settings = jQuery.extend(true, {}, settings);
			$settings.title = settings.title || elem.attr('title') || 'No title set';
			
			var eventScheduler = new EventScheduler();
			var tooltip = new Tooltip($settings, eventScheduler, elem);

			tooltip.generate();
			tooltip.appendToBody();

			//remove title attribute so that we don't have the browser title showing up
			elem.removeAttr('title')
			
			if(settings.position == 'default')
			{
				elem.mousestop(function(e){
					tooltip.move(e);//set proper position first
					tooltip.hoverOn();//display the tooltip
				},{
					timeToStop: settings.timeToStop,
					onMouseout: function(){ tooltip.hoverOff(); },
					onStopMove: function(){ tooltip.hoverOff(); }//this will hide tooltip once it's appeared and we move again
				});
			}
			else if(settings.position == 'mouse')
			{
				elem
				.mouseover(function(){ tooltip.hoverOn(); })
				.mouseout(function(){ tooltip.hoverOff(); })
				.mousemove(function(e){ tooltip.move(e); });
			}
			else//assume it's a set position, tc, bc, lm, etc...
			{
				elem
				.mouseover(function()
				{
					tooltip.setBestPosition(elem);
					tooltip.hoverOn();
				})
				.mouseout(function(){ tooltip.hoverOff(); })
			}
			
			elem.data('_wTooltip', tooltip);
		});
	}

	$.fn.wTooltip.defaultSettings =
	{
		position	: 'default',	// should the tooltip follow the mouse [default,mouse]
		timeToStop	: null,			// only works with position default - the time mouse has to stop before triggering display of tooltip
		theme		: 'cream', 		// allow custom with #FFAACC
		opacity		: 0.8,			// opacity level
		title		: null,			// manually set title
		fadeIn		: 0,			// time before tooltip appears in milliseconds
		fadeOut		: 0,			// time before tooltip fades in milliseconds
		delayIn		: 0,			// time before tooltip displays in milliseconds
		delayOut	: 0,			// time before tooltip begins to dissapear in milliseconds
		width		: null,			// define a set width for the tooltip
		height		: null,			// define a set height for the tooltip
		offsetX		: 8,			// x offset of mouse position
		offsetY		: 9,			// y offset of mouse position
		html		: true			// title is inserted as HTML rather than text
	};

	/**
	 * Event scheduler class definition
	 */
	function EventScheduler(){ return this; }
	
	EventScheduler.prototype =
	{
		set: function (func, timeout)
		{
			this.timer = setTimeout(func, timeout);
		},
		
		clear: function()
		{
			clearTimeout(this.timer);
		}
	}

	/**
	 * Tooltip class definition
	 */
	function Tooltip(settings, eventScheduler, elem)
	{
		this.tooltip = null;
		this.$elem = elem;
		this.content = null;
		
		this.hover = false;
		this.shown = false;

		this.settings = settings;
		this.eventScheduler = eventScheduler;
		
		return this;
	}
	
	Tooltip.prototype = 
	{
		generate: function()
		{
			if(this.tooltip) return this.tooltip;
						
			this.content = $('<div class="_wTooltip_content"></div>').css({width: this.settings.width || '', height: this.settings.height || '', whiteSpace: this.settings.width == null && this.settings.height == null ? 'nowrap' : 'normal'});
			this.settings.html ? this.content.html(this.settings.title) : this.content.text(this.settings.title);
					
			var bg = $('<div class="_wTooltip_bg"></div>').css({opacity: this.settings.opacity});
			
			this.tooltip =
			$('<div class="_wTooltip_holder"></div>')
			.append(
				$('<div class="_wTooltip_outer"></div>')
				.append(
					$('<div class="_wTooltip_inner"></div>')
					.append( bg )
					.append( this.content )
				)
			)
			.addClass('_wTooltip_' + this.settings.theme)

			return this.tooltip;
		},
		
		appendToBody: function()
		{
			$('body').append(this.tooltip);			
		},
		
		show: function()
		{
			var $this = this;

			this.tooltip.fadeIn(this.settings.fadeIn, function()
			{
				$this.shown = true;
			
				if(!$this.hover) $this.hide();
			});
		},
		
		hide: function()
		{
			var $this = this;

			$this.eventScheduler.set(function()
			{
				$this.tooltip.fadeOut($this.settings.fadeOut, function()
				{
					$this.shown = false;
				});
			},
			$this.settings.delayOut);
		},
		
		move: function(e)
		{
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			
			var offsetX = e.pageX + this.settings.offsetX;
			var offsetY = e.pageY + this.settings.offsetY;
			
			var tooltipWidth = this.tooltip.outerWidth();
			var tooltipHeight = this.tooltip.outerHeight();
			
			if(offsetX - $(window).scrollLeft() + tooltipWidth > windowWidth) offsetX = offsetX - this.settings.offsetX * 2 - tooltipWidth;
			if(offsetY - $(window).scrollTop() + tooltipHeight > windowHeight) offsetY = offsetY - this.settings.offsetY * 2  - tooltipHeight;
			
			this.tooltip.css({left: offsetX, top: offsetY});
		},

		isOverflow: function(left, top)
		{
			var rightWall = (left + this.settings.offsetX + this.tooltip.outerWidth()) - ($(window).scrollLeft() + $(window).width());
			var leftWall = left - $(window).scrollLeft();
			var bottomWall = (top + this.settings.offsetY + this.tooltip.outerHeight()) - ($(window).scrollTop() + $(window).height());
			var topWall = top - $(window).scrollTop();

			overflowTotal = 0;
			
			if(rightWall > 0) overflowTotal += rightWall;
			if(leftWall < 0) overflowTotal += Math.abs(leftWall);
			if(bottomWall > 0) overflowTotal += bottomWall;
			if(topWall < 0) overflowTotal += Math.abs(topWall)

			return overflowTotal;
		},
		
		getOffset: function(elem, position)
		{
			var first = position.substring(0, 1);
			var second = position.substring(1, 2);
			 
			var elem_offset = elem.offset();
			var elem_left = elem_offset.left;
			var elem_top = elem_offset.top;
			
			var elem_width = elem.outerWidth();
			var elem_height = elem.outerHeight();
			
			var window_width = $(window).width();
			var window_height = $(window).height();
			
			var tooltip_width = this.tooltip.outerWidth();
			var tooltip_height = this.tooltip.outerHeight();
			
			var left = null;
			var top = null;
			
			if(!(first == 'm' && second == 'm'))//manual set
			{
				//based on position
				if(first == 't') top = elem_top - tooltip_height - this.settings.offsetY;
				else if(first == 'b') top = elem_top + elem_height + this.settings.offsetY;
				else if(second == 't') top = elem_top + this.settings.offsetY;
				else if(second == 'b') top = elem_top + elem_height - tooltip_height - this.settings.offsetY;
				else if(second == 'm') top = elem_top - (tooltip_height - elem_height)/2;
				
				//get left position
				if(first == 'l') left = elem_left - tooltip_width - this.settings.offsetX;
				else if(first == 'r') left = elem_left + elem_width + this.settings.offsetX;
				else if(second == 'l') left = elem_left + this.settings.offsetX;
				else if(second == 'r') left = elem_left - (tooltip_width - elem_width) - this.settings.offsetX;
				else if(second == 'c') left = elem_left - (tooltip_width - elem_width)/2;
			}
			
			return {left: left, top: top};
		},

		setBestPosition: function(elem)
		{
			var positions_best_fit_map = {
				'lt': ['lt', 'lm', 'lb', 'rt', 'rm', 'rb', 'tl', 'tc', 'tr', 'bl', 'bc', 'br', 'mm'],
				'lm': ['lm', 'lt', 'lb', 'rm', 'rt', 'rb', 'tl', 'tc', 'tr', 'bl', 'bc', 'br', 'mm'],
				'lb': ['lb', 'lm', 'lt', 'rb', 'rm', 'rt', 'bl', 'bc', 'br', 'tl', 'tc', 'tr', 'mm'],
				'rt': ['rt', 'rm', 'rb', 'lt', 'lm', 'lb', 'tr', 'tc', 'tl', 'br', 'bc', 'bl', 'mm'],
				'rm': ['rm', 'rt', 'rb', 'lm', 'lt', 'lb', 'tr', 'tc', 'tl', 'br', 'bc', 'bl', 'mm'],
				'rb': ['rb', 'rm', 'rt', 'lb', 'lm', 'lt', 'br', 'bc', 'bl', 'tr', 'tc', 'tl', 'mm'],
				'tl': ['tl', 'tc', 'tr', 'bl', 'bc', 'br', 'lt', 'lm', 'lb', 'rt', 'rm', 'rb', 'mm'],
				'tc': ['tc', 'tl', 'tr', 'bc', 'bl', 'br', 'lt', 'lm', 'lb', 'rt', 'rm', 'rb', 'mm'],
				'tr': ['tr', 'tc', 'tl', 'br', 'bc', 'bl', 'rt', 'rm', 'rb', 'lt', 'lm', 'lb', 'mm'],
				'bl': ['bl', 'bc', 'br', 'tl', 'tc', 'tr', 'lb', 'lm', 'lt', 'rb', 'rm', 'rt', 'mm'],
				'bc': ['bc', 'bl', 'br', 'tc', 'tl', 'tr', 'lb', 'lm', 'lt', 'rb', 'rm', 'rt', 'mm'],
				'br': ['br', 'bc', 'bl', 'tr', 'tc', 'tl', 'rb', 'rm', 'rt', 'lb', 'lm', 'lt', 'mm']
			};
			
			var overflowTotal = null;
			var overflowPositionMin = null;
			var overflowTotalMin = null;
			
			var offset = null;
			var positions = positions_best_fit_map[this.settings.position];
			
			for(index in positions)
			{
				offset = this.getOffset(elem, positions[index]);
				overflowTotal = this.isOverflow(offset.left, offset.top);
				
				if(overflowTotalMin == null || overflowTotal < overflowTotalMin)
				{
				 	overflowPositionMin = positions[index];
					overflowTotalMin = overflowTotal;
				}
				
				if(!overflowTotal) break;
			}
			
			//manual override
			if(offset.left == null && offset.top == null) offset = this.getOffset(elem, overflowPositionMin);
			
			this.tooltip.css({left: offset.left, top: offset.top});
		},

		hoverOn: function()
		{
			var $this = this;
			
			this.hover = true;
			this.eventScheduler.set(function(){ $this.show(); }, this.settings.delayIn);
		},
		
		hoverOff: function(e)
		{
			this.hover = false;
			if(this.shown) this.hide();
		}
	}
})(jQuery);
/******************************************
 * Websanova.com
 *
 * Resources for web entrepreneurs
 *
 * @author          Websanova
 * @copyright       Copyright (c) 2012 Websanova.
 * @license         This mousestop jQuery plug-in is dual licensed under the MIT and GPL licenses.
 * @link            http://www.websanova.com
 * @github          http://github.com/websanova/mousestop
 * @version         Version 1.1.1
 *
 ******************************************/
(function($)
{
	$.fn.mousestop = function(func, settings)
	{
		settings = $.extend({}, $.fn.mousestop.defaultSettings, settings || {});
		
		return this.each(function()
		{
			var elem = $(this);

			var movement = false;
			
			var displayTimer = null
			var movementTimer = null;
		
			//only need this piece if there is a time limit on when the mouse stop can occur.
			if(settings.timeToStop != null)
			{
				var x = null;
				var y = null;
		
				var counter = 0;
				var counterMax = Math.ceil(settings.timeToStop / 100);
				
				elem
				.mouseover(function(e)
				{
					movement = true;
					
					//check if movement has stopped to a maximum time of 100*counterMax, after that event will not run at all unless you re-mouseover
					displayTimer = setInterval(function()
					{
						counter++;
						
						if(counter < counterMax)
						{
							if(!movement)
							{
								clearTimeout(displayTimer);//clear the timeout to avoid any funkiness
								
								//set the coordinates for the event to the ones from the document event
								e.pageX = x;
								e.pageY = y;
								
								if(func) func.apply(this, [e]);
							}
							//else do nothing, just iterate
						}else movement = false;//we can turn this off to avoid using the timeout in the mousemove
					}, 100)
				})
			}
			
			elem
			.mouseout(function(e)
			{
				//kill this timers incase it's still running
				clearTimeout(displayTimer);
				clearTimeout(movementTimer);
				
				counter = 0;//reset counter for when we mouseover again
				movement = false;//set movement back to false
				
				if(settings.onMouseout) settings.onMouseout.apply(this, [e]);//call our mouseout
			})
			.mousemove(function(e)
			{
				x = e.pageX;
				y = e.pageY;
				
				if(movement)//if we have moused over this will be on
				{
					//clear timer and set again, this will determine our "stop" which will occur if mouse is in same position for the delayToStop time or more milliseconds
					clearTimeout(movementTimer);
					movementTimer = setTimeout(function()
					{
						movement = false;
						if(settings.timeToStop == null && func) func.apply(this, [e]);
					}, settings.delayToStop);
				}
				else
				{
					if(settings.onStopMove) settings.onStopMove.apply(this, [e]);//call our mousemove - this is after the stop
					movement = true;
				}
			});
		});
	}

	$.fn.mousestop.defaultSettings =
	{
		timeToStop		: null,			// the amount of time the stop event has to run before it will not run at all anymore
		delayToStop		: '300', 		// the delay for what is considered a "stop"
		onMouseout		: null,			// function to run when we mouseout of our element
		onStopMove		: null			// function to run when we start moving again after the stop
	};
})(jQuery);