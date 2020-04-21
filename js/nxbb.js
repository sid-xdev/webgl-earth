/*

PUBLIC DOMAIN
HTTP://WWW.NOXCAIN.COM

*/

var NXBB = new function ()
{

	this.Image = function (pImage)
	{
		pImage.orgWidth = pImage.width;
		this.AdjustImage(pImage);
	}

	this.AdjustImage = function (pImage)
	{
		if (pImage.orgWidth)
		{
			if (pImage.orgWidth > pImage.parentNode.offsetWidth)
			{
				pImage.style.width = '100%';
			}
			else
			{
				pImage.style.width = pImage.orgWidth + 'px';
			}
		}
	}

	this.Load = function (bbCode)
	{
		var txt = bbCode;
		// '&' is a special character; replace only '&' which encodes html
		txt = txt.replace(/&(.+?);/gi, '&amp;$1;');

		// deactivate user html (html is not allowed within posts)
		txt = txt.replace(/</gi, '&lt;');
		txt = txt.replace(/>/gi, '&gt;');

		// replace line breaks
		txt = txt.replace(/\n/gi, '<br>');
		txt = txt.replace(/\r/gi, '');

		// convert bbcode to html
		txt = txt.replace(/\[b\](.+?)\[\/b\]/gi, '<b>$1</b>');
		txt = txt.replace(/\[i\](.+?)\[\/i\]/gi, '<i>$1</i>');
		txt = txt.replace(/\[u\](.+?)\[\/u\]/gi, '<u>$1</u>');
		txt = txt.replace(/\[list\](.+?)\[\/list\]/gi, '<ul>$1</ul>');

		// custom bbcode replacement
		txt = txt.replace(/\[listitem\](.+?)\[\/listitem\]/gi, '<li>$1</li>');
		txt = txt.replace(/\[code\](.+?)\[\/code\]/gi, '<code>$1</code>');
		txt = txt.replace(/\[img\]((?:http|s:\/\/(?:[0-9a-z-]+\.)*[0-9a-z-]+\.[a-z]{2,4})?(?:[^"']+?))\[\/img\]/gi, '<img src="$1" border="0" alt="" onload="NXBB.Image(this);" />');
		txt = txt.replace(/\[url\]((?:http|s:\/\/(?:[0-9a-z-]+\.)*[0-9a-z-]+\.[a-z]{2,4})?(?:[^"']+?))\[\/url\]/gi, '<a href="$1" target="_blank">$1</a>');
		txt = txt.replace(/\[url=(?:|")((?:http|s:\/\/(?:[0-9a-z-]+\.)*[0-9a-z-]+\.[a-z]{2,4})?(?:[^"']+?))(?:|")\](.+?)\[\/url\]/gi, '<a href="$1" target="_blank">$2</a>');
		txt = txt.replace(/\[font=(?:|")([a-z0-9_-]+( [a-z0-9_-]+)*?)(?:|")\](.+?)\[\/font\]/gi, '<span style="font-family:$1;">$2</span>');
		txt = txt.replace(/\[color=(?:|")([a-z]+?|#[0-9a-f]{1,6}?)(?:|")\](.+?)\[\/color\]/gi, '<span style="color:$1;">$2</span>');
		txt = txt.replace(/\[size=(?:|")([0-9]+?)(?:|")\](.+?)\[\/size\]/gi, '<span style="font-size:$1pt">$2</span>');

		txt = txt.replace(/(^|\s)((:?(?:[a-z]+?):\/\/)*?[\w\-]+\.[\w\-]+\.(?:com|net|info|org|(?:[a-z]{2}))[^\>\<\|\\"\s\[\]]*)/gi, '$1<a href="http://$2" target="_blank">$2</a>');
		txt = txt.replace(/http:\/\/((?:[a-z]+):\/\/)/gi, '$1');

		$patt = /\[quote\](.+?)\[\/quote\]/gi;

		while (txt.match($patt))
		{
			txt = txt.replace($patt, '<div class="enquote"><div class="enquotetitle">Quote:</div><div class="enquotemsg">$1</div></div>');
		}

		$patt = /\[quote=(?:|")([^"\[\]]+?)(?:|")\](.+?)\[\/quote\]/gi;

		while (txt.match($patt, txt))
		{
			txt = txt.replace($patt, '<div class="enquote"><div class="enquotetitle">Zitat von $1:</div><div class="enquotemsg">$2</div></div>');
		}

		return txt;
	}

};