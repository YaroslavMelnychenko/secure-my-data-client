var smartgrid = require('smart-grid');
 
/* It's principal settings in smart grid project */
var settings = {
    outputStyle: 'sass', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '30px', /* gutter width px || % || rem */
    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
    container: {
        maxWidth: '1280px', /* max-width оn very large screen */
        fields: '30px' /* side fields */
    },
    breakPoints: {

    }
};

for(let i = 1280; i >= (1280 - 20 * 48); i -= 20) {
    let obj = { width: i + 'px' };
    settings.breakPoints['s' + i] = obj;
}
 
smartgrid('./src/renderer', settings);