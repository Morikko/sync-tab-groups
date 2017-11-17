/**
 * Settings of the extension
 */

var OptionManager = OptionManager || {};

OptionManager.options = OptionManager.TEMPLATE();


OptionManager.updateOption = function ( optionName, optionValue){
  optionName.split('-').reduce((a,b, index, array)=>{
    if ( index === array.length-1 )
      a[b] = optionValue;
    return a[b];
  }, OptionManager.options);
}
