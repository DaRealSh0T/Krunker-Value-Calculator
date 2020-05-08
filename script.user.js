// ==UserScript==
// @name         Market Item Value Calculator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shows the real value of items on Krunker market
// @author       Lemons & DaRealSh0T
// @match        *://krunker.io/social.html*
// @run-at       document-start
// @grant        none
// ==/UserScript==

var krValue = {
	300: 0.99,
	600: 1.79,
	2600: 2.49,
	7000: 15.99,
	20000: 34.99,
	60000: 99.99
};

const observer = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		mutation.addedNodes.forEach(node => {
			let { children } = node,
				elem,
				tmp,
				currentKR = (tmp = document.getElementById('profileKR')) ? +tmp.innerText.replace(' KR', '') : 0,
				keys = Object.keys(krValue).map(a => +a).sort((a, b) => b - a),
				price = totalKRNeeded = value = remaining = priceOfItem = num = 0;

			if (children && (elem = [...children].find(child => child.className == 'marketPrice'))) {
				priceOfItem = +elem.innerText.replace(/[^0-9]/g, '');
				num = Math.max(priceOfItem - currentKR, 0);
				
				for (let ammount of keys) {
					let multiplier = ~~(num / ammount);
					price += krValue[ammount] * multiplier;
					num -= ammount * multiplier;
					totalKRNeeded += ammount * multiplier;
				}

				if (num > 0) price += krValue[300], totalKRNeeded += 300;
				remaining = (currentKR + totalKRNeeded) - priceOfItem;

				value = (price.toFixed(2)).toLocaleString();
				node.attributes.style.value += ';height:289px';
				node.insertAdjacentHTML('beforeend', `<div style="margin-top:37px;" class="marketPrice">$${value}<span style="color:#fff"> USD</span>`);
				node.insertAdjacentHTML('beforeend', `<div style="margin-top:74px;" class="marketPrice">${remaining}<span style="color:#fff"> KR</span> left over</div>`);
			}
		});
	});
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true
});
