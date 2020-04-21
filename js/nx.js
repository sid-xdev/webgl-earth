/*

PUBLIC DOMAIN
HTTP://WWW.NOXCAIN.COM

*/

var $ = function (id)
{
	return document.getElementById(id);
};

var NX = new function ()
{
	
	this.GetIFrameDocument = function (pIframe)
	{
		var doc = pIframe.contentWindow || pIframe.contentDocument;
		
		if (doc.document)
		{
			doc = doc.document;
		}
		
		return doc;
	}
	
	this.GetFilename = function (pFilename)
	{
		try
		{
			return pFilename.split(/(\\|\/)/g).pop()
		}
		catch (e)
		{
			return null;
		}
	}
	
	this.GetExtension = function (pFilename)
	{
		try
		{
			return pFilename.split(/(\.)/g).pop()
		}
		catch (e)
		{
			return null;
		}
	}

	this.SupportsDragAndDrop = function ()
	{
		var div = document.createElement('div');
		
		var hasDrag = !!('ondragover' in div && 'ondragenter' in div && 'ondrop' in div);
		
		delete div;
		
		return hasDrag;
	}();
	
	this.SupportsFileAPI = function ()
	{
		return !!(window.File && window.FileReader && window.FileList && window.Blob && window.FormData);
	}();
	
	this.GetByTag = function (pElement, pName)
	{
		return pElement.getElementsByTagName(pName);
	}
	
	this.GetByName = function (pName)
	{
		return this.GetByNameFrom(document, pName);
	}
	
	this.GetByNameFrom = function (pElement, pName)
	{
		var arr = new Array();
		
		var res = this.GetAll(pElement);
		
		for (var i = 0; i < res.length; i++)
		{
			if (res[i].getAttribute('name') == pName)
			{
				arr.push(res[i]);
			}
		}
		
		return arr;
	}
	
	this.GetAll = function (pElement)
	{
		return (pElement.all) ? pElement.all : pElement.getElementsByTagName('*');
	}
	
	this.GetHash = function ()
	{
		return window.location.hash;
	}
	
	this.Encode = function (pString)
	{
		return encodeURIComponent(pString);
	}
	
	this.Decode = function (pString)
	{
		return decodeURIComponent(pString);
	}
	
	this.Reload = function ()
	{
		window.location.reload();
	}
	
	this.Random = function (pMin, pMax)
	{
		return (pMin + parseInt(Math.random() * (pMax - pMin + 1)));
	}
	
	this.StartsWith = function (pString, pValue)
	{
		return (pString.indexOf(pValue) == 0);
	}
	
	this.InsertString = function (pString, pIndex, pValue)
	{
		return pString.substr(0, pIndex) + pValue + pString.substr(pIndex);
	}
	
	this.IsFunction = function (pFunction)
	{
		return (pFunction != null && typeof (pFunction) == 'function');
	}
	
	this.GetHashItems = function ()
	{
		var hash = this.GetHash();
		
		if (hash)
		{
			if (hash.match(/^#/))
			{
				hash = hash.substr(1, hash.length - 1);
			}
			
			var res = hash.match(/[^\/]+/gi);
			
			if (res && res.length > 0)
			{
				var arr = new Array();
				
				for (var i = 0; i < res.length; i++)
				{
					arr.push(res[i]);
				}
				
				return arr;
			}
		}
		
		return null;
	}
	
	this.Relocate = function (pURL)
	{
		window.location.href = pURL;
	}
	
	this.CssRemove = function (pElement, pClass)
	{
		var reg = new RegExp('[ ]*' + pClass.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + '[ ]*', 'g');
		pElement.className = pElement.className.replace(reg, ' ').trim();
	}
};

if (!String.prototype.trim)
{
	String.prototype.trim = function()
	{
		return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	};
}