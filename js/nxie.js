/*

PUBLIC DOMAIN
HTTP://WWW.NOXCAIN.COM

===========================================================
===========================================================

REQUIRES nx.js
REQUIRES nxev.js

*/

var NXIE = new function ()
{

	this.Load = function (pImage, pMinWidth, pMinHeight, pLockRatio, pCustomStyles)
	{
		this.LoadEx(pImage, pMinWidth, pMinHeight, pLockRatio, pCustomStyles, null);
	}

	this.LoadEx = function (pImage, pMinWidth, pMinHeight, pLockRatio, pCustomStyles, pCallback)
	{
		var imgParent = pImage.parentNode;

		var tempbb = document.createElement('div');
		tempbb.innerHTML = '<table nxid="NXIE_BORDERBASE" class="NXIE_BB" cellpadding="0" cellspacing="0" border="0">' +
							'<tr>' +
								'<td nxid="NXIE_BORDERBASEINNER" class="NXIE_BBI"></td>' +
							'</tr>' +
							'</table>';

		var bbelems = nxCore.GetAll(tempbb);
		var bbid = null;

		for (var i = 0; i < bbelems.length; i++)
		{
			bbid = bbelems[i].getAttribute('nxid') || '';

			switch (bbid)
			{
				case 'NXIE_BORDERBASE':
					pImage.NXIE_BORDERBASE = bbelems[i];
					break;
				case 'NXIE_BORDERBASEINNER':
					pImage.NXIE_BORDERBASEINNER = bbelems[i];
					break;
			}

			bbelems[i].removeAttribute('nxid');
		}

		tempbb.removeChild(pImage.NXIE_BORDERBASE);
		delete (tempbb);

		imgParent.insertBefore(pImage.NXIE_BORDERBASE, pImage);
		imgParent.removeChild(pImage);

		pImage.NXIE_SELECTORBASE = document.createElement('div');
		pImage.NXIE_SELECTORBASE.style.position = 'relative';
		pImage.NXIE_BORDERBASEINNER.appendChild(pImage.NXIE_SELECTORBASE);

		pImage.style = '';
		pImage.style.position = 'relative';
		pImage.style.display = 'block';
		pImage.NXIE_SELECTORBASE.appendChild(pImage);

		pImage.NXIE_SELECTOR = document.createElement('div');
		pImage.NXIE_SELECTOR.style.position = 'absolute';
		pImage.NXIE_SELECTOR.style.left = '0px';
		pImage.NXIE_SELECTOR.style.top = '0px';
		pImage.NXIE_SELECTOR.style.width = pMinWidth + 'px';
		pImage.NXIE_SELECTOR.style.height = pMinHeight + 'px';
		pImage.NXIE_SELECTORBASE.appendChild(pImage.NXIE_SELECTOR);

		var divtemp = document.createElement('div');
		divtemp.style.position = 'relative';
		divtemp.style.left = '0px';
		divtemp.style.top = '0px';
		divtemp.style.width = '100%';
		divtemp.style.height = '100%';
		pImage.NXIE_SELECTOR.appendChild(divtemp);

		divtemp.innerHTML = '<table nxid="NXIE_RBASE" class="NXIE_RBASE" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">' +
							'<tr>' +
								'<td nxid="NXIE_RNW" class="NXIE_RNW" style="font-size: 1px;">&nbsp;</td>' +
								'<td class="NXIE_RNL" style="font-size: 1px;">&nbsp;</td>' +
								'<td nxid="NXIE_RN" class="NXIE_RN" style="font-size: 1px;">&nbsp;</td>' +
								'<td class="NXIE_RNR" style="font-size: 1px;">&nbsp;</td>' +
								'<td nxid="NXIE_RNE" class="NXIE_RNE" style="font-size: 1px;">&nbsp;</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="NXIE_RWT" style="font-size: 1px;">&nbsp;</td>' +
								'<td nxid="NXIE_MOVER" class="NXIE_MOVER" colspan="3" rowspan="3" style="font-size: 1px;">&nbsp;</td>' +
								'<td class="NXIE_RET" style="font-size: 1px;">&nbsp;</td>' +
							'</tr>' +
							'<tr>' +
								'<td nxid="NXIE_RW" class="NXIE_RW" style="font-size: 1px;">&nbsp;</td>' +
								'<td nxid="NXIE_RE" class="NXIE_RE" style="font-size: 1px;">&nbsp;</td>' +
							'</tr>' +
							'<tr>' +
								'<td class="NXIE_RWB" style="font-size: 1px;">&nbsp;</td>' +
								'<td class="NXIE_REB" style="font-size: 1px;">&nbsp;</td>' +
							'</tr>' +
							'<tr>' +
								'<td nxid="NXIE_RSW" class="NXIE_RSW" style="font-size: 1px;">&nbsp;</td>' +
								'<td class="NXIE_RSL" style="font-size: 1px;">&nbsp;</td>' +
								'<td nxid="NXIE_RS" class="NXIE_RS" style="font-size: 1px;">&nbsp;</td>' +
								'<td class="NXIE_RSR" style="font-size: 1px;">&nbsp;</td>' +
								'<td nxid="NXIE_RSE" class="NXIE_RSE" style="font-size: 1px;">&nbsp;</td>' +
							'</tr>' +
						'</table>';

		pImage.NXIE_RBASE = null;
		pImage.NXIE_MOVER = null;
		pImage.NXIE_RNW = null;
		pImage.NXIE_RN = null;
		pImage.NXIE_RNE = null;
		pImage.NXIE_RW = null;
		pImage.NXIE_RE = null;
		pImage.NXIE_RSW = null;
		pImage.NXIE_RS = null;
		pImage.NXIE_RSE = null;

		var allelems = nxCore.GetAll(divtemp);
		var allid = null;

		for (var i = 0; i < allelems.length; i++)
		{
			allid = allelems[i].getAttribute('nxid') || '';

			switch (allid)
			{
				case 'NXIE_RBASE': pImage.NXIE_RBASE = allelems[i]; break;
				case 'NXIE_MOVER': pImage.NXIE_MOVER = allelems[i]; break;
				case 'NXIE_RNW': pImage.NXIE_RNW = allelems[i]; break;
				case 'NXIE_RN': pImage.NXIE_RN = allelems[i]; break;
				case 'NXIE_RNE': pImage.NXIE_RNE = allelems[i]; break;
				case 'NXIE_RW': pImage.NXIE_RW = allelems[i]; break;
				case 'NXIE_RE': pImage.NXIE_RE = allelems[i]; break;
				case 'NXIE_RSW': pImage.NXIE_RSW = allelems[i]; break;
				case 'NXIE_RS': pImage.NXIE_RS = allelems[i]; break;
				case 'NXIE_RSE': pImage.NXIE_RSE = allelems[i]; break;
			}

			allelems[i].removeAttribute('nxid');
		}

		if (!pCustomStyles)
		{
			pImage.NXIE_RBASE.style.border = 'dashed 1px #3377DD';

			pImage.NXIE_MOVER.style.cursor = 'move';
			pImage.NXIE_MOVER.style.backgroundColor = '#3377DD';
			pImage.NXIE_MOVER.style.opacity = '0.01';

			pImage.NXIE_RNW.style.cursor = 'nw-resize';
			pImage.NXIE_RNW.style.width = '6px';
			pImage.NXIE_RNW.style.height = '6px';
			pImage.NXIE_RNW.style.backgroundColor = '#3377DD';

			pImage.NXIE_RN.style.cursor = 'n-resize';
			pImage.NXIE_RN.style.width = '6px';
			pImage.NXIE_RN.style.height = '6px';
			pImage.NXIE_RN.style.backgroundColor = '#3377DD';

			pImage.NXIE_RNE.style.cursor = 'ne-resize';
			pImage.NXIE_RNE.style.width = '6px';
			pImage.NXIE_RNE.style.height = '6px';
			pImage.NXIE_RNE.style.backgroundColor = '#3377DD';

			pImage.NXIE_RW.style.cursor = 'w-resize';
			pImage.NXIE_RW.style.width = '6px';
			pImage.NXIE_RW.style.height = '6px';
			pImage.NXIE_RW.style.backgroundColor = '#3377DD';

			pImage.NXIE_RE.style.cursor = 'e-resize';
			pImage.NXIE_RE.style.width = '6px';
			pImage.NXIE_RE.style.height = '6px';
			pImage.NXIE_RE.style.backgroundColor = '#3377DD';

			pImage.NXIE_RSW.style.cursor = 'sw-resize';
			pImage.NXIE_RSW.style.width = '6px';
			pImage.NXIE_RSW.style.height = '6px';
			pImage.NXIE_RSW.style.backgroundColor = '#3377DD';

			pImage.NXIE_RS.style.cursor = 's-resize';
			pImage.NXIE_RS.style.width = '6px';
			pImage.NXIE_RS.style.height = '6px';
			pImage.NXIE_RS.style.backgroundColor = '#3377DD';

			pImage.NXIE_RSE.style.cursor = 'se-resize';
			pImage.NXIE_RSE.style.width = '6px';
			pImage.NXIE_RSE.style.height = '6px';
			pImage.NXIE_RSE.style.backgroundColor = '#3377DD';
		}

		pImage.NXIE_IMGW = pImage.NXIE_SELECTORBASE.offsetWidth;
		pImage.NXIE_IMGH = pImage.NXIE_SELECTORBASE.offsetHeight;

		pImage.NXIE_SELW = pImage.NXIE_SELECTOR.offsetWidth;
		pImage.NXIE_SELH = pImage.NXIE_SELECTOR.offsetHeight;

		pImage.NXIE_MSX = 0;
		pImage.NXIE_MSY = 0;
		pImage.NXIE_SELMOUSEDOWN = false;
		pImage.NXIE_SELRESIZEDOWN = false;
		pImage.NXIE_SELMW = 0;
		pImage.NXIE_SELMH = 0;
		pImage.NXIE_SELX = 0;
		pImage.NXIE_SELY = 0;
		pImage.NXIE_SELMX = 0;
		pImage.NXIE_SELMY = 0;
		pImage.NXIE_LASTMX = 0;
		pImage.NXIE_LASTMY = 0;
		pImage.NXIE_RESIZEW = 0;
		pImage.NXIE_RESIZEH = 0;
		pImage.NXIE_MINW = pMinWidth;
		pImage.NXIE_MINH = pMinHeight;
		pImage.NXIE_SELRATIO = pMinWidth / pMinHeight;
		pImage.NXIE_LOCKRATIO = (pLockRatio) ? true : false;
		pImage.NXIE_RESIZEPROC = null;

		if (nxCore.IsFunction(pCallback))
		{
			pImage.NXIE_CALLBACK = pCallback;
			pImage.NXIE_MOVEPROC = MoveInternalWithCallback;
			pImage.NXIE_RESIZESETPROC = ResizeSetWithCallback;
		}
		else
		{
			pImage.NXIE_MOVEPROC = MoveInternal;
			pImage.NXIE_RESIZESETPROC = ResizeSet;
		}

		nxEvents.AddEx(pImage.NXIE_MOVER, 'onmousedown', MoveMouseDown, pImage, true);
		nxEvents.AddEx(pImage.NXIE_RNW, 'onmousedown', ResizeMouseDownNorthWest, pImage, true);
		nxEvents.AddEx(pImage.NXIE_RN, 'onmousedown', ResizeMouseDownNorth, pImage, true);
		nxEvents.AddEx(pImage.NXIE_RNE, 'onmousedown', ResizeMouseDownNorthEast, pImage, true);
		nxEvents.AddEx(pImage.NXIE_RW, 'onmousedown', ResizeMouseDownWest, pImage, true);
		nxEvents.AddEx(pImage.NXIE_RE, 'onmousedown', ResizeMouseDownEast, pImage, true);
		nxEvents.AddEx(pImage.NXIE_RSW, 'onmousedown', ResizeMouseDownSouthWest, pImage, true);
		nxEvents.AddEx(pImage.NXIE_RS, 'onmousedown', ResizeMouseDownSouth, pImage, true);
		nxEvents.AddEx(pImage.NXIE_RSE, 'onmousedown', ResizeMouseDownSouthEast, pImage, true);

		pImage.NXIE_WINDOWMOUSEUP = function (xxo, xxe, xxi) { MouseUp(xxo, xxe, xxi); };
		pImage.NXIE_WINDOWMOUSEMOVE = function (xxo, xxe, xxi) { Move(xxo, xxe, xxi); };

		nxEvents.Add(window, 'onmouseup', pImage.NXIE_WINDOWMOUSEUP, pImage);
		nxEvents.Add(window, 'onmousemove', pImage.NXIE_WINDOWMOUSEMOVE, pImage);
	}

	this.Unload = function (pImage)
	{
		var imgParent = pImage.NXIE_BORDERBASE.parentNode;
		imgParent.insertBefore(pImage, pImage.NXIE_BORDERBASE);
		imgParent.removeChild(pImage.NXIE_BORDERBASE);

		nxEvents.Remove(window, 'onmouseup', pImage.NXIE_WINDOWMOUSEUP);
		nxEvents.Remove(window, 'onmousemove', pImage.NXIE_WINDOWMOUSEMOVE);

		delete (pImage.NXIE_BORDERBASE);
		delete (pImage.NXIE_BORDERBASEINNER);
		delete (pImage.NXIE_SELECTORBASE);
		delete (pImage.NXIE_SELECTOR);
		delete (pImage.NXIE_RBASE);
		delete (pImage.NXIE_MOVER);
		delete (pImage.NXIE_RNW);
		delete (pImage.NXIE_RN);
		delete (pImage.NXIE_RNE);
		delete (pImage.NXIE_RW);
		delete (pImage.NXIE_RE);
		delete (pImage.NXIE_RSW);
		delete (pImage.NXIE_RS);
		delete (pImage.NXIE_RSE);
		delete (pImage.NXIE_IMGW);
		delete (pImage.NXIE_IMGH);
		delete (pImage.NXIE_SELW);
		delete (pImage.NXIE_SELH);
		delete (pImage.NXIE_MSX);
		delete (pImage.NXIE_MSY);
		delete (pImage.NXIE_SELMOUSEDOWN);
		delete (pImage.NXIE_SELRESIZEDOWN);
		delete (pImage.NXIE_SELW);
		delete (pImage.NXIE_SELH);
		delete (pImage.NXIE_SELMW);
		delete (pImage.NXIE_SELMH);
		delete (pImage.NXIE_SELX);
		delete (pImage.NXIE_SELY);
		delete (pImage.NXIE_SELMX);
		delete (pImage.NXIE_SELMY);
		delete (pImage.NXIE_LASTMX);
		delete (pImage.NXIE_LASTMY);
		delete (pImage.NXIE_RESIZEW);
		delete (pImage.NXIE_RESIZEH);
		delete (pImage.NXIE_MINW);
		delete (pImage.NXIE_MINH);
		delete (pImage.NXIE_SELRATIO);
		delete (pImage.NXIE_LOCKRATIO);
		delete (pImage.NXIE_RESIZEPROC);

		if (pImage.NXIE_CALLBACK)
		{
			delete (pImage.NXIE_CALLBACK);
		}

		delete (pImage.NXIE_MOVEPROC);
		delete (pImage.NXIE_RESIZESETPROC);
		delete (pImage.NXIE_WINDOWMOUSEUP);
		delete (pImage.NXIE_WINDOWMOUSEMOVE);
	}

	function ResizeMouseDownNorthWest(pObject, pEvent, pImage)
	{
		ResizeMouseDown(pImage);
		pImage.NXIE_RESIZEPROC = ResizeInternalNorthWest;
		return false;
	}

	function ResizeInternalNorthWest(pImage)
	{
		ResizeNorth(pImage);
		ResizeWest(pImage);

		if (pImage.NXIE_LOCKRATIO)
		{
			if (pImage.NXIE_SELW > (pImage.NXIE_SELH * pImage.NXIE_SELRATIO))
			{
				pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
				pImage.NXIE_SELY = pImage.NXIE_SELMY - (pImage.NXIE_SELH - pImage.NXIE_SELMH);
				if (pImage.NXIE_SELY < 0)
				{
					pImage.NXIE_SELY = 0;
					pImage.NXIE_SELH = pImage.NXIE_SELMY + pImage.NXIE_SELMH;
					pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
					pImage.NXIE_SELX = pImage.NXIE_SELMX - (pImage.NXIE_SELW - pImage.NXIE_SELMW);
				}
			}
			else
			{
				pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
				pImage.NXIE_SELX = pImage.NXIE_SELMX - (pImage.NXIE_SELW - pImage.NXIE_SELMW);
				if (pImage.NXIE_SELX < 0)
				{
					pImage.NXIE_SELX = 0;
					pImage.NXIE_SELW = pImage.NXIE_SELMX + pImage.NXIE_SELMW;
					pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
					pImage.NXIE_SELY = pImage.NXIE_SELMY - (pImage.NXIE_SELH - pImage.NXIE_SELMH);
				}
			}
		}

		pImage.NXIE_RESIZESETPROC(pImage);
	}

	function ResizeMouseDownNorth(pObject, pEvent, pImage)
	{
		ResizeMouseDown(pImage);
		pImage.NXIE_RESIZEPROC = ResizeInternalNorth;
		return false;
	}

	function ResizeInternalNorth(pImage)
	{
		ResizeNorth(pImage);

		if (pImage.NXIE_LOCKRATIO)
		{
			pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
			pImage.NXIE_SELX = pImage.NXIE_SELMX - ((pImage.NXIE_SELW - pImage.NXIE_SELMW) / 2);
			if (pImage.NXIE_SELX + pImage.NXIE_SELW > pImage.NXIE_IMGW)
			{
				pImage.NXIE_SELX = pImage.NXIE_IMGW - pImage.NXIE_SELW;
				if (pImage.NXIE_SELX < 0)
				{
					pImage.NXIE_SELX = 0;
					pImage.NXIE_SELW = pImage.NXIE_IMGW;
					pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
					pImage.NXIE_SELY = pImage.NXIE_SELMY + pImage.NXIE_SELMH - pImage.NXIE_SELH;
				}
			}
			else if (pImage.NXIE_SELX < 0)
			{
				pImage.NXIE_SELX = 0;
				if (pImage.NXIE_SELW > pImage.NXIE_IMGW)
				{
					pImage.NXIE_SELW = pImage.NXIE_IMGW;
					pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
					pImage.NXIE_SELY = pImage.NXIE_SELMY + pImage.NXIE_SELMH - pImage.NXIE_SELH;
				}
			}
		}

		pImage.NXIE_RESIZESETPROC(pImage);
	}

	function ResizeMouseDownNorthEast(pObject, pEvent, pImage)
	{
		ResizeMouseDown(pImage);
		pImage.NXIE_RESIZEPROC = ResizeInternalNorthEast;
		return false;
	}

	function ResizeInternalNorthEast(pImage)
	{
		ResizeNorth(pImage);
		ResizeEast(pImage);

		if (pImage.NXIE_LOCKRATIO)
		{
			if (pImage.NXIE_SELW > (pImage.NXIE_SELH * pImage.NXIE_SELRATIO))
			{
				pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
				pImage.NXIE_SELY = pImage.NXIE_SELMY - (pImage.NXIE_SELH - pImage.NXIE_SELMH);
				if (pImage.NXIE_SELY < 0)
				{
					pImage.NXIE_SELY = 0;
					pImage.NXIE_SELH = pImage.NXIE_SELMY + pImage.NXIE_SELMH;
					pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
				}
			}
			else
			{
				pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
				if (pImage.NXIE_SELX + pImage.NXIE_SELW > pImage.NXIE_IMGW)
				{
					pImage.NXIE_SELW = pImage.NXIE_IMGW - pImage.NXIE_SELX;
					pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
					pImage.NXIE_SELY = pImage.NXIE_SELMY - (pImage.NXIE_SELH - pImage.NXIE_SELMH);
				}
			}
		}

		pImage.NXIE_RESIZESETPROC(pImage);
	}

	function ResizeMouseDownWest(pObject, pEvent, pImage)
	{
		ResizeMouseDown(pImage);
		pImage.NXIE_RESIZEPROC = ResizeInternalWest;
		return false;
	}

	function ResizeInternalWest(pImage)
	{
		ResizeWest(pImage);

		if (pImage.NXIE_LOCKRATIO)
		{
			pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
			pImage.NXIE_SELY = pImage.NXIE_SELMY - ((pImage.NXIE_SELH - pImage.NXIE_SELMH) / 2);
			if (pImage.NXIE_SELY + pImage.NXIE_SELH > pImage.NXIE_IMGH)
			{
				pImage.NXIE_SELY = pImage.NXIE_IMGH - pImage.NXIE_SELH;
				if (pImage.NXIE_SELY < 0)
				{
					pImage.NXIE_SELY = 0;
					pImage.NXIE_SELH = pImage.NXIE_IMGH;
					pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
					pImage.NXIE_SELX = pImage.NXIE_SELMX + pImage.NXIE_SELMW - pImage.NXIE_SELW;
				}
			}
			else if (pImage.NXIE_SELY < 0)
			{
				pImage.NXIE_SELY = 0;
				if (pImage.NXIE_SELH > pImage.NXIE_IMGH)
				{
					pImage.NXIE_SELH = pImage.NXIE_IMGH;
					pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
					pImage.NXIE_SELX = pImage.NXIE_SELMX + pImage.NXIE_SELMW - pImage.NXIE_SELW;
				}
			}
		}

		pImage.NXIE_RESIZESETPROC(pImage);
	}

	function ResizeMouseDownEast(pObject, pEvent, pImage)
	{
		ResizeMouseDown(pImage);
		pImage.NXIE_RESIZEPROC = ResizeInternalEast;
		return false;
	}

	function ResizeInternalEast(pImage)
	{
		ResizeEast(pImage);

		if (pImage.NXIE_LOCKRATIO)
		{
			pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
			pImage.NXIE_SELY = pImage.NXIE_SELMY - ((pImage.NXIE_SELH - pImage.NXIE_SELMH) / 2);
			if (pImage.NXIE_SELY + pImage.NXIE_SELH > pImage.NXIE_IMGH)
			{
				pImage.NXIE_SELY = pImage.NXIE_IMGH - pImage.NXIE_SELH;
				if (pImage.NXIE_SELY < 0)
				{
					pImage.NXIE_SELY = 0;
					pImage.NXIE_SELH = pImage.NXIE_IMGH;
					pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
				}
			}
			else if (pImage.NXIE_SELY < 0)
			{
				pImage.NXIE_SELY = 0;
				if (pImage.NXIE_SELH > pImage.NXIE_IMGH)
				{
					pImage.NXIE_SELH = pImage.NXIE_IMGH;
					pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
				}
			}
		}

		pImage.NXIE_RESIZESETPROC(pImage);
	}

	function ResizeMouseDownSouthWest(pObject, pEvent, pImage)
	{
		ResizeMouseDown(pImage);
		pImage.NXIE_RESIZEPROC = ResizeInternalSouthWest;
		return false;
	}

	function ResizeInternalSouthWest(pImage)
	{
		ResizeSouth(pImage);
		ResizeWest(pImage);

		if (pImage.NXIE_LOCKRATIO)
		{
			if (pImage.NXIE_SELW > (pImage.NXIE_SELH * pImage.NXIE_SELRATIO))
			{
				pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
				if (pImage.NXIE_SELY + pImage.NXIE_SELH > pImage.NXIE_IMGH)
				{
					pImage.NXIE_SELH = pImage.NXIE_IMGH - pImage.NXIE_SELY;
					pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
					pImage.NXIE_SELX = pImage.NXIE_SELMX - (pImage.NXIE_SELW - pImage.NXIE_SELMW);
				}
			}
			else
			{
				pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
				pImage.NXIE_SELX = pImage.NXIE_SELMX - (pImage.NXIE_SELW - pImage.NXIE_SELMW);
				if (pImage.NXIE_SELX < 0)
				{
					pImage.NXIE_SELX = 0;
					pImage.NXIE_SELW = pImage.NXIE_SELMX + pImage.NXIE_SELMW;
					pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
				}
			}
		}

		pImage.NXIE_RESIZESETPROC(pImage);
	}

	function ResizeMouseDownSouth(pObject, pEvent, pImage)
	{
		ResizeMouseDown(pImage);
		pImage.NXIE_RESIZEPROC = ResizeInternalSouth;
		return false;
	}

	function ResizeInternalSouth(pImage)
	{
		ResizeSouth(pImage);

		if (pImage.NXIE_LOCKRATIO)
		{
			pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
			pImage.NXIE_SELX = pImage.NXIE_SELMX - ((pImage.NXIE_SELW - pImage.NXIE_SELMW) / 2);
			if (pImage.NXIE_SELX + pImage.NXIE_SELW > pImage.NXIE_IMGW)
			{
				pImage.NXIE_SELX = pImage.NXIE_IMGW - pImage.NXIE_SELW;
				if (pImage.NXIE_SELX < 0)
				{
					pImage.NXIE_SELX = 0;
					pImage.NXIE_SELW = pImage.NXIE_IMGW;
					pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
				}
			}
			else if (pImage.NXIE_SELX < 0)
			{
				pImage.NXIE_SELX = 0;
				if (pImage.NXIE_SELW > pImage.NXIE_IMGW)
				{
					pImage.NXIE_SELW = pImage.NXIE_IMGW;
					pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
				}
			}
		}

		pImage.NXIE_RESIZESETPROC(pImage);
	}

	function ResizeMouseDownSouthEast(pObject, pEvent, pImage)
	{
		ResizeMouseDown(pImage);
		pImage.NXIE_RESIZEPROC = ResizeInternalSouthEast;
		return false;
	}

	function ResizeInternalSouthEast(pImage)
	{
		ResizeSouth(pImage);
		ResizeEast(pImage);

		if (pImage.NXIE_LOCKRATIO)
		{
			if (pImage.NXIE_SELW > (pImage.NXIE_SELH * pImage.NXIE_SELRATIO))
			{
				pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
				if (pImage.NXIE_SELY + pImage.NXIE_SELH > pImage.NXIE_IMGH)
				{
					pImage.NXIE_SELH = pImage.NXIE_IMGH - pImage.NXIE_SELY;
					pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
				}
			}
			else
			{
				pImage.NXIE_SELW = pImage.NXIE_SELH * pImage.NXIE_SELRATIO;
				if (pImage.NXIE_SELX + pImage.NXIE_SELW > pImage.NXIE_IMGW)
				{
					pImage.NXIE_SELW = pImage.NXIE_IMGW - pImage.NXIE_SELX;
					pImage.NXIE_SELH = pImage.NXIE_SELW / pImage.NXIE_SELRATIO;
				}
			}
		}

		pImage.NXIE_RESIZESETPROC(pImage);
	}

	function ResizeSet(pImage)
	{
		pImage.NXIE_SELECTOR.style.left = pImage.NXIE_SELX + 'px';
		pImage.NXIE_SELECTOR.style.width = pImage.NXIE_SELW + 'px';
		pImage.NXIE_SELECTOR.style.top = pImage.NXIE_SELY + 'px';
		pImage.NXIE_SELECTOR.style.height = pImage.NXIE_SELH + 'px';
	}

	function ResizeSetWithCallback(pImage)
	{
		ResizeSet(pImage);
		pImage.NXIE_CALLBACK(pImage);
	}

	function MoveMouseDown(pObject, pEvent, pImage)
	{
		pImage.NXIE_SELMOUSEDOWN = true;
		MouseDown(pImage);
		return false;
	}

	function ResizeMouseDown(pImage)
	{
		pImage.NXIE_SELRESIZEDOWN = true;
		MouseDown(pImage);
	}

	function MouseDown(pImage)
	{
		pImage.NXIE_SELMX = pImage.NXIE_SELX;
		pImage.NXIE_SELMY = pImage.NXIE_SELY;
		pImage.NXIE_SELMW = pImage.NXIE_SELW;
		pImage.NXIE_SELMH = pImage.NXIE_SELH;
		pImage.NXIE_LASTMX = pImage.NXIE_MSX;
		pImage.NXIE_LASTMY = pImage.NXIE_MSY;
	}

	function MouseUp(pObject, pEvent, pImage)
	{
		pImage.NXIE_SELMOUSEDOWN = false;
		pImage.NXIE_SELRESIZEDOWN = false;
	}

	function Move(pObject, pEvent, pImage)
	{
		pImage.NXIE_MSX = ((pEvent.pageX) ? pEvent.pageX : pEvent.clientX);
		pImage.NXIE_MSY = ((pEvent.pageY) ? pEvent.pageY : pEvent.clientY);

		if (pImage.NXIE_SELRESIZEDOWN)
		{
			ResizeInternal(pImage);
			return;
		}

		if (pImage.NXIE_SELMOUSEDOWN)
		{
			pImage.NXIE_MOVEPROC(pImage);
			return;
		}
	}

	function ResizeInternal(pImage)
	{
		pImage.NXIE_RESIZEW = pImage.NXIE_MSX - pImage.NXIE_LASTMX;
		pImage.NXIE_RESIZEH = pImage.NXIE_MSY - pImage.NXIE_LASTMY;
		pImage.NXIE_RESIZEPROC(pImage);
	}

	function MoveInternal(pImage)
	{
		pImage.NXIE_SELX = pImage.NXIE_SELMX + (pImage.NXIE_MSX - pImage.NXIE_LASTMX);
		pImage.NXIE_SELY = pImage.NXIE_SELMY + (pImage.NXIE_MSY - pImage.NXIE_LASTMY);

		if (pImage.NXIE_SELX < 0)
		{
			pImage.NXIE_SELX = 0;
		}
		else if (pImage.NXIE_SELX > (pImage.NXIE_IMGW - pImage.NXIE_SELW))
		{
			pImage.NXIE_SELX = (pImage.NXIE_IMGW - pImage.NXIE_SELW);
		}

		pImage.NXIE_SELECTOR.style.left = pImage.NXIE_SELX + 'px';

		if (pImage.NXIE_SELY < 0)
		{
			pImage.NXIE_SELY = 0;
		}
		else if (pImage.NXIE_SELY > (pImage.NXIE_IMGH - pImage.NXIE_SELH))
		{
			pImage.NXIE_SELY = (pImage.NXIE_IMGH - pImage.NXIE_SELH);
		}

		pImage.NXIE_SELECTOR.style.top = pImage.NXIE_SELY + 'px';
	}

	function MoveInternalWithCallback(pImage)
	{
		MoveInternal(pImage);
		pImage.NXIE_CALLBACK(pImage);
	}

	function ResizeNorth(pImage)
	{
		pImage.NXIE_SELY = pImage.NXIE_SELMY + pImage.NXIE_RESIZEH;
		if (pImage.NXIE_SELY < 0) pImage.NXIE_SELY = 0;
		pImage.NXIE_SELH = pImage.NXIE_SELMH - (pImage.NXIE_SELY - pImage.NXIE_SELMY);
		if (pImage.NXIE_SELH < pImage.NXIE_MINH)
		{
			pImage.NXIE_SELH = pImage.NXIE_MINH;
			pImage.NXIE_SELY = pImage.NXIE_SELMY + pImage.NXIE_SELMH - pImage.NXIE_SELH;
		}
	}

	function ResizeSouth(pImage)
	{
		pImage.NXIE_SELH = pImage.NXIE_SELMH + pImage.NXIE_RESIZEH;
		if (pImage.NXIE_SELY + pImage.NXIE_SELH > pImage.NXIE_IMGH)
		{
			pImage.NXIE_SELH = pImage.NXIE_IMGH - pImage.NXIE_SELY;
		}
		if (pImage.NXIE_SELH < pImage.NXIE_MINH)
		{
			pImage.NXIE_SELH = pImage.NXIE_MINH;
		}
	}

	function ResizeWest(pImage)
	{
		pImage.NXIE_SELX = pImage.NXIE_SELMX + pImage.NXIE_RESIZEW;
		if (pImage.NXIE_SELX < 0) pImage.NXIE_SELX = 0;
		pImage.NXIE_SELW = pImage.NXIE_SELMW - (pImage.NXIE_SELX - pImage.NXIE_SELMX);
		if (pImage.NXIE_SELW < pImage.NXIE_MINW)
		{
			pImage.NXIE_SELW = pImage.NXIE_MINW;
			pImage.NXIE_SELX = pImage.NXIE_SELMX + pImage.NXIE_SELMW - pImage.NXIE_SELW;
		}
	}

	function ResizeEast(pImage)
	{
		pImage.NXIE_SELW = pImage.NXIE_SELMW + pImage.NXIE_RESIZEW;
		if (pImage.NXIE_SELX + pImage.NXIE_SELW > pImage.NXIE_IMGW)
		{
			pImage.NXIE_SELW = pImage.NXIE_IMGW - pImage.NXIE_SELX;
		}
		if (pImage.NXIE_SELW < pImage.NXIE_MINW)
		{
			pImage.NXIE_SELW = pImage.NXIE_MINW;
		}
	}

};