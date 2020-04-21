/*

PUBLIC DOMAIN
HTTP://WWW.NOXCAIN.COM

*/

var NXEV = new function ()
{

	function mArrayContains(pEventArray, pEventHandler)
	{
		for (var i = 0; i < pEventArray.length; i++)
		{
			if (pEventArray[i][0] === pEventHandler)
			{
				return i;
			}
		}

		return -1;
	}

	function mArrayAdd(pEventArray, pEventHandler, pCallbackObject)
	{
		var i = mArrayContains(pEventArray, pEventHandler);

		if (i >= 0)
		{
			pEventArray[i][0] = pEventHandler;
			pEventArray[i][1] = pCallbackObject;
		}
		else
		{
			pEventArray.push(new Array(pEventHandler, pCallbackObject));
		}
	}

	function mArrayRemove(pEventArray, pEventHandler)
	{
		var i = mArrayContains(pEventArray, pEventHandler);

		if (i >= 0)
		{
			pEventArray.splice(i, 1);
		}
	}

	function mHandleWithReturn(pObject, pEvent)
	{
		var eventArray = pObject['nxaon' + pEvent.type];
		var ret = true;

		for (var i = 0; i < eventArray.length; i++)
		{
			ret = ret && eventArray[i][0](pObject, pEvent, eventArray[i][1]);
		}

		return ret;
	}

	function mHandle(pObject, pEvent)
	{
		var eventArray = pObject['nxaon' + pEvent.type];

		for (var i = 0; i < eventArray.length; i++)
		{
			eventArray[i][0](pObject, pEvent, eventArray[i][1]);
		}
	}

	this.Init = function (pObject, pEvent)
	{
		this.InitEx(pObject, pEvent, false);
	}

	this.InitEx = function (pObject, pEvent, pHandleReturn)
	{
		var evtlist = 'nxa' + pEvent;
		pObject[evtlist] = new Array();
		if (pHandleReturn)
		{
			pObject[pEvent] = function (pEvent) { return mHandleWithReturn(this, pEvent || window.event); };
		}
		else
		{
			pObject[pEvent] = function (pEvent) { mHandle(this, pEvent || window.event); };
		}
	}

	this.Uninit = function (pObject, pEvent)
	{
		var evtlist = 'nxa' + pEvent;
		delete (pObject[evtlist]);
		delete (pObject[pEvent]);
	}

	this.Add = function (pObject, pEvent, pEventHandler, pCallbackObject)
	{
		this.AddEx(pObject, pEvent, pEventHandler, pCallbackObject, false);
	}

	this.AddEx = function (pObject, pEvent, pEventHandler, pCallbackObject, pHandleReturn)
	{
		var evtlist = 'nxa' + pEvent;

		if (!pObject[evtlist])
		{
			this.InitEx(pObject, pEvent, pHandleReturn);
		}

		mArrayAdd(pObject[evtlist], pEventHandler, pCallbackObject);
	}

	this.Remove = function (pObject, pEvent, pEventHandler)
	{
		this.RemoveEx(pObject, pEvent, pEventHandler, false);
	}

	this.RemoveEx = function (pObject, pEvent, pEventHandler, pRemoveHandler)
	{
		var evtlist = 'nxa' + pEvent;

		if (pObject[evtlist])
		{
			mArrayRemove(pObject[evtlist], pEventHandler);

			if (pRemoveHandler && pObject[evtlist].length == 0)
			{
				this.Uninit(pObject, pEvent);
			}
		}
	}

};