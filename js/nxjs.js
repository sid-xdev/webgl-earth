/*

PUBLIC DOMAIN
HTTP://WWW.NOXCAIN.COM

===========================================================
===========================================================

REQUIRES nx.js

*/

var NXJS = new function ()
{

	function mCreate()
	{
		var xmlHttp = null;

		if (typeof(XMLHttpRequest) != 'undefined')
		{
			xmlHttp = new XMLHttpRequest();
		}

		if (!xmlHttp)
		{
			try
			{
				xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
			}
			catch (e)
			{
				try
				{
					xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
				}
				catch (ex) { }
			}
		}

		return xmlHttp;
	}

	this.Supported = function ()
	{
		return ((mCreate()) ? true : false);
	}();

	this.Create = mCreate;

	this.OpenGET = function (pURL, pGetXML)
	{
		var xmlHttp = mCreate();

		if (xmlHttp)
		{
			xmlHttp.open('GET', pURL, false);
			xmlHttp.send();
			
			if (xmlHttp.status == 200)
			{
				if (pGetXML)
				{
					return xmlHttp.responseXML;
				}
				else
				{
					return xmlHttp.responseText;
				}
			}
		}

		return null;
	}

	this.OpenAsyncGET = function (pURL, pGetXML, pSuccessCallback, pErrorCallback, pCallbackObject)
	{
		var xmlHttp = mCreate();

		if (xmlHttp)
		{
			xmlHttp.open('GET', pURL, true);
			xmlHttp.onreadystatechange = function ()
			{
				if (xmlHttp.readyState == 4)
				{
					if (xmlHttp.status == 200)
					{
						if (nxCore.IsFunction(pSuccessCallback))
						{
							if (pGetXML)
							{
								pSuccessCallback(xmlHttp.responseXML, pCallbackObject);
							}
							else
							{
								pSuccessCallback(xmlHttp.responseText, pCallbackObject);
							}
						}
					}
					else
					{
						if (nxCore.IsFunction(pErrorCallback))
						{
							pErrorCallback(xmlHttp.statusText, pCallbackObject);
						}
					}
				}
			};

			xmlHttp.send();
		}
		else
		{
			if (nxCore.IsFunction(pErrorCallback))
			{
				pErrorCallback('Cannot create XMLHttpRequest', pCallbackObject);
			}
		}
	}

	this.OpenPOST = function (pURL, pPostParameters, pGetXML)
	{
		var xmlHttp = mCreate();

		if (xmlHttp)
		{
			xmlHttp.open('POST', pURL, false);
			xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			xmlHttp.send(pPostParameters);

			if (xmlHttp.status == 200)
			{
				if (pGetXML)
				{
					return xmlHttp.responseXML;
				}
				else
				{
					return xmlHttp.responseText;
				}
			}
		}

		return null;
	}

	this.OpenPOSTEx = function (pURL, pFormData, pGetXML)
	{
		var xmlHttp = mCreate();

		if (xmlHttp)
		{
			xmlHttp.open('POST', pURL, false);
			xmlHttp.send(pFormData);

			if (xmlHttp.status == 200)
			{
				if (pGetXML)
				{
					return xmlHttp.responseXML;
				}
				else
				{
					return xmlHttp.responseText;
				}
			}
		}

		return null;
	}

	this.OpenAsyncPOST = function (pURL, pPostParameters, pGetXML, pSuccessCallback, pErrorCallback, pCallbackObject)
	{
		var xmlHttp = mCreate();

		if (xmlHttp)
		{
			xmlHttp.open('POST', pURL, true);
			xmlHttp.onreadystatechange = function ()
			{
				if (xmlHttp.readyState == 4)
				{
					if (xmlHttp.status == 200)
					{
						if (nxCore.IsFunction(pSuccessCallback))
						{
							if (pGetXML)
							{
								pSuccessCallback(xmlHttp.responseXML, pCallbackObject);
							}
							else
							{
								pSuccessCallback(xmlHttp.responseText, pCallbackObject);
							}
						}
					}
					else
					{
						if (nxCore.IsFunction(pErrorCallback))
						{
							pErrorCallback(xmlHttp.statusText, pCallbackObject);
						}
					}
				}
			};

			xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			xmlHttp.send(pPostParameters);
		}
		else
		{
			if (nxCore.IsFunction(pErrorCallback))
			{
				pErrorCallback('Cannot create XMLHttpRequest', pCallbackObject);
			}
		}
	}

	this.OpenAsyncPOSTEx = function (pURL, pFormData, pGetXML, pSuccessCallback, pErrorCallback, pCallbackObject)
	{
		var xmlHttp = mCreate();

		if (xmlHttp)
		{
			xmlHttp.open('POST', pURL, true);
			xmlHttp.onreadystatechange = function ()
			{
				if (xmlHttp.readyState == 4)
				{
					if (xmlHttp.status == 200)
					{
						if (nxCore.IsFunction(pSuccessCallback))
						{
							if (pGetXML)
							{
								pSuccessCallback(xmlHttp.responseXML, pCallbackObject);
							}
							else
							{
								pSuccessCallback(xmlHttp.responseText, pCallbackObject);
							}
						}
					}
					else
					{
						if (nxCore.IsFunction(pErrorCallback))
						{
							pErrorCallback(xmlHttp.statusText, pCallbackObject);
						}
					}
				}
			};

			xmlHttp.send(pFormData);
		}
		else
		{
			if (nxCore.IsFunction(pErrorCallback))
			{
				pErrorCallback('Cannot create XMLHttpRequest', pCallbackObject);
			}
		}
	}

};