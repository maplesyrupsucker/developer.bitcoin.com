var balanceBaseURL = 'https://blockchain.info/q/addressbalance/';
var exchangeRateURL = 'https://blockchain.info/ticker';

var btcsum = 0;
var usdsum = 0;
var usdtotal = 0;

var balances = {};

function onExchangeRateUpdated(result)
{
  exchangeRates = result;
  doBalanceUpdateAll();
}

function convertSatsToBTC(sats)
{
  btc = sats * .00000001;
  return btc.toFixed(4);
}

function convertSatsToUSD(sats)
{
  usd = sats * .00000001 * exchangeRates.USD['15m'];
  return '' + Number(usd.toFixed(0)).toLocaleString('en');
}

function convertSumToUSD(sats)
{
  usd = sats * .00000001 * exchangeRates.USD['15m'];
  return '' + Number(usd).toFixed(2);
}

function doBalanceUpdateAll()
{
  elements = $('[data-btcbalance=true]');

  elements.each(
    function(index, element)
    {
      addr = $(element).attr('data-btcaddress')
      balances[index] = {
        addr: addr,
        element: element
      };
      doBalanceUpdate(addr, function(result) { onBalanceUpdated(index, result) });
    }
  );
}

function onBalanceUpdated(index, result)
{
  var target = $(balances[index].element);
  var output = '<i class="fa fa-btc" aria-hidden="true"></i><span class="btcval">' + convertSatsToBTC(result) + '</span> <i class="fa fa-usd" aria-hidden="true"></i><span class="usdval">' + convertSatsToUSD(result) + '</span>';
  target.text('');
  target.append(output);

  btcsum += parseFloat(convertSatsToBTC(result));


    console.log('btc grand-total = '+btcsum);
    $('.btctotal').html('<i class="fa fa-btc" aria-hidden="true"></i>'+btcsum);


    // usdsum += parseFloat(convertSatsToUSD(result));
    usdtotal += parseFloat(convertSumToUSD(result).replace(',', '.'));
    // console.log('convertSatsToUSD = '+usdsum);
    // console.log('convertSumToUSD = '+usdtotal);

    $('.usdtotal').html('<i class="fa fa-usd" aria-hidden="true"></i><span class="usdval">'+usdtotal.toLocaleString('en'));



}

function doBalanceUpdate(addr, cb)
{
  $.ajax(
    {
      type: 'GET',
      dataType: 'json',
      url: balanceBaseURL + addr + '?cors=true',
      success: cb
    }
  );
}

function doExchangeRateUpdate()
{
  $.ajax(
    {
      type: 'GET',
      dataType: 'json',
      url: exchangeRateURL + '?cors=true',
      success: onExchangeRateUpdated
    }
  );
}

function init()
{
  doExchangeRateUpdate();


}

$(document).ready(init);


