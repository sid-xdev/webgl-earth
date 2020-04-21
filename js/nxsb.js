/*

PUBLIC DOMAIN
HTTP://WWW.NOXCAIN.COM

===========================================================
===========================================================

REQUIRES nxev.js
REQUIRES nxevms.js

*/

var NXSB = new function ()
{

	this.Load = function (pScrollButton, pScrollArea, pScrollContent)
	{
		pScrollButton.NXSB_AREA = pScrollArea;
		pScrollButton.NXSB_CONTENT = pScrollContent;
		pScrollButton.NXSB_WINDOWMOUSEMOVE = function (xxs, xxe, xxo) { MouseMove(xxs, xxe, xxo); };
		pScrollButton.NXSB_WINDOWMOUSEUP = function (xxs, xxe, xxo) { MouseUp(xxs, xxe, xxo); };
		pScrollButton.NXSB_SCROLLMOUSEDOWN = function (xxs, xxe, xxo) { return MouseDown(xxs, xxe, xxo); };
		pScrollButton.NXSB_RESIZE = function (xxs, xxe, xxo) { ArrangeWindow(xxs, xxe, xxo); };
		pScrollButton.NXSB_MOUSESCROLL = function (xxs, xxe, xxo) { MouseScroll(xxs, xxe, xxo); };
		pScrollButton.NXSB_MOUSEOVER = function (xxs, xxe, xxo) { MouseOver(xxs, xxe, xxo); };
		pScrollButton.NXSB_MOUSEOUT = function (xxs, xxe, xxo) { MouseOut(xxs, xxe, xxo); };
		pScrollButton.NXSB_MY = 0;
		pScrollButton.NXSB_LASTMY = 0;
		pScrollButton.NXSB_ISMOUSEDOWN = false;
		pScrollButton.NXSB_ISMOUSEOVER = false;
		pScrollButton.NXSB_TOP = 0;
		pScrollButton.NXSB_RATIO = 0;

		nxEvents.Add(window, 'onmouseup', pScrollButton.NXSB_WINDOWMOUSEUP, pScrollButton);
		nxEvents.Add(window, 'onmousemove', pScrollButton.NXSB_WINDOWMOUSEMOVE, pScrollButton);
		nxEvents.AddEx(pScrollButton, 'onmousedown', pScrollButton.NXSB_SCROLLMOUSEDOWN, pScrollButton, true);
		nxEvents.Add(window, 'onresize', pScrollButton.NXSB_RESIZE, pScrollButton);
		nxEvents.Add(window, 'onnxmousescroll', pScrollButton.NXSB_MOUSESCROLL, pScrollButton);
		nxEvents.Add(pScrollArea, 'onmouseover', pScrollButton.NXSB_MOUSEOVER, pScrollButton);
		nxEvents.Add(pScrollArea, 'onmouseout', pScrollButton.NXSB_MOUSEOUT, pScrollButton);

		Update(pScrollButton);
	}

	this.Unload = function (pObject)
	{
		nxEvents.Remove(window, 'onmouseup', pObject.NXSB_WINDOWMOUSEUP);
		nxEvents.Remove(window, 'onmousemove', pObject.NXSB_WINDOWMOUSEMOVE);
		nxEvents.Remove(pObject, 'onmousedown', pObject.NXSB_SCROLLMOUSEDOWN);
		nxEvents.Remove(window, 'onresize', pObject.NXSB_RESIZE);
		nxEvents.Remove(window, 'onnxmousescroll', pObject.NXSB_MOUSESCROLL);
		nxEvents.Remove(pObject.NXSB_AREA, 'onmouseover', pObject.NXSB_MOUSEOVER);
		nxEvents.Remove(pObject.NXSB_AREA, 'onmouseout', pObject.NXSB_MOUSEOUT);

		delete (pObject.NXSB_AREA);
		delete (pObject.NXSB_CONTENT);
		delete (pObject.NXSB_WINDOWMOUSEMOVE);
		delete (pObject.NXSB_WINDOWMOUSEUP);
		delete (pObject.NXSB_SCROLLMOUSEDOWN);
		delete (pObject.NXSB_RESIZE);
		delete (pObject.NXSB_MOUSESCROLL);
		delete (pObject.NXSB_MOUSEOVER);
		delete (pObject.NXSB_MOUSEOUT);
		delete (pObject.NXSB_MY);
		delete (pObject.NXSB_LASTMY);
		delete (pObject.NXSB_ISMOUSEDOWN);
		delete (pObject.NXSB_ISMOUSEOVER);
		delete (pObject.NXSB_TOP);
		delete (pObject.NXSB_RATIO);
	}

	function Update(pObject)
	{
		if (pObject.NXSB_CONTENT.offsetHeight > 0)
		{
			var x = pObject.NXSB_AREA.offsetHeight / pObject.NXSB_CONTENT.offsetHeight;

			if (x > 0 && x < 1)
			{
				pObject.style.display = '';
				pObject.style.height = (x * pObject.NXSB_AREA.offsetHeight) + 'px';
				pObject.NXSB_RATIO = (pObject.NXSB_CONTENT.offsetHeight - pObject.NXSB_AREA.offsetHeight) / (pObject.NXSB_AREA.offsetHeight - pObject.offsetHeight);
				var fx = pObject.NXSB_CONTENT.offsetTop / -pObject.NXSB_RATIO;
				AlignButton(pObject, fx);
			}
			else
			{
				pObject.style.display = 'none';
				pObject.NXSB_CONTENT.style.top = '0px';
			}
		}
	}

	function MouseMove(pSender, pEvent, pObject)
	{
		pObject.NXSB_MY = ((pEvent.pageY) ? pEvent.pageY : pEvent.clientY);

		if (pObject.NXSB_ISMOUSEDOWN)
		{
			var x = pObject.NXSB_TOP + (pObject.NXSB_MY - pObject.NXSB_LASTMY);
			AlignButton(pObject, x);
		}
	}

	function AlignButton(pObject, x)
	{
		if (x < 0) x = 0;
		else if ((x + pObject.offsetHeight) > pObject.NXSB_AREA.offsetHeight) x = pObject.NXSB_AREA.offsetHeight - pObject.offsetHeight;
		pObject.style.top = x + 'px';
		pObject.NXSB_CONTENT.style.top = (-x * pObject.NXSB_RATIO) + 'px';
	}

	function MouseUp(pSender, pEvent, pObject)
	{
		pObject.NXSB_ISMOUSEDOWN = false;
	}

	function MouseDown(pSender, pEvent, pObject)
	{
		pObject.NXSB_ISMOUSEDOWN = true;
		pObject.NXSB_LASTMY = pObject.NXSB_MY;
		pObject.NXSB_TOP = pObject.offsetTop;
		return false;
	}

	function ArrangeWindow(pSender, pEvent, pObject)
	{
		Update(pObject);
	}

	function MouseScroll(pSender, pEvent, pObject)
	{
		if (pObject.NXSB_ISMOUSEOVER && !pObject.NXSB_ISMOUSEDOWN)
		{
			var x = pObject.offsetTop - (pEvent.delta * 30);
			AlignButton(pObject, x);
		}
	}

	function MouseOver(pSender, pEvent, pObject)
	{
		pObject.NXSB_ISMOUSEOVER = true;
	}

	function MouseOut(pSender, pEvent, pObject)
	{
		pObject.NXSB_ISMOUSEOVER = false;
	}

};