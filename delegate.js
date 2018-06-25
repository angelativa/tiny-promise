function delegate(element, selector, type, fn) {
    var func = function (event) {
        event = event || window.event;
        var target = event.target || event.srcElement;

        if (matchSelector(target, selector)) {
            fn && fn.call(target, event);
        }
    };
    if (element.addEventListener) {
        element.addEventListener(type, func);
    }
    else {
        element.attachEvent('on' + type, func);
    }
}

function matchSelector(target, selector) {
    // by id
    if (selector.charAt(0) === '#') {
        return target.id === selector.slice(1);
    }
    // by.class
    else if (selector.charAt(0) === '.') {
        return target.className.indexOf(selector.slice(1)) != -1;
    }
    else {
        return target.tagName.toLocaleLowerCase() === selector;
    }
}

