/*

PUBLIC DOMAIN
HTTP://WWW.NOXCAIN.COM

*/

if (typeof(window.onmousewheel) != 'undefined')
{
	window.onmousewheel = nxEventsScrollExtensionHandle;
}
else if (typeof(document.onmousewheel) != 'undefined')
{
	document.onmousewheel = nxEventsScrollExtensionHandle;
}
else if (window.addEventListener)
{
	window.addEventListener('DOMMouseScroll', nxEventsScrollExtensionHandle, false);
}

function nxEventsScrollExtensionHandle(pEvent)
{
	if (window.onnxmousescroll)
	{
		var delta = 0;

		if (!pEvent)
		{
			pEvent = window.event;
		}

		if (pEvent.wheelDelta)
		{
			delta = pEvent.wheelDelta / 120;
		}
		else if (pEvent.detail)
		{
			delta = -pEvent.detail / 3;
		}

		if (delta)
		{
			window.onnxmousescroll(new nxEventsScrollExtensionEvent(delta));
		}

		if (pEvent.preventDefault)
		{
			pEvent.preventDefault();
		}

		pEvent.returnValue = false;
	}
}

function nxEventsScrollExtensionEvent(pDelta)
{
	this.delta = pDelta;
	this.type = 'nxmousescroll';
}